#!/usr/bin/env node

// Copyright 2018 The Distill Drafts Authors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


const fs = require('fs-extra')
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const execSync = util.promisify(require('child_process').execSync);
const GitHubAPI = require('github-api');

const publicDir = './public';
const buildDir = './build';
const render = './node_modules/.bin/distill-render';
const concurrency = 10;

TEMPLATE_V1_URL = "distill.pub/template.v1.js";


function registerWebhooks(repo) {
  const hookURL = 'https://us-central1-distill-wrp.cloudfunctions.net/githubDraftsWebhook';
  const repository = githubClient.getRepo(repo.owner.login, repo.name);
  return repository.listHooks()
  .then(({data: hooks}) => {
    const alreadyHasHook = hooks.some((hook) => hook.config.url === hookURL);
    if (alreadyHasHook) {
      console.log(`${repo.name} already has hook installed, skipping.`);
    } else {
      const hookOptions = {
        name: 'web',
        events: [ 'push' ],
        config: {
          url: hookURL, 
          content_type: 'json',
          secret: process.env.GITHUB_HOOK_SECRET
        }
      };
      return repository.createHook(hookOptions)
      .then(() => console.log(`Successfully registered hook for ${repo.name}.`));
    }
  })
  .catch(() => {
    console.log(`Drafts has no admin/hooks access to ${repo.name}, skipping hooks.`);
  })
}

function getRepoFromURL(name, authorizedURL, targetDir) {
  console.log('Cloning ' + name + ' ...');
  const repoFolder = `${targetDir}/${name}`;
  const publicFolderName = name
    .replace("post--", "")
    .replace(/[-_]?distill[-_]?/g, "")
    .replace(/_/g, '-')
    .toLowerCase();
  const targetPublicDir = `${publicDir}/${publicFolderName}`;
  const indexFile = `${targetPublicDir}/index.html`;
  const indexFileRaw = `${targetPublicDir}/index_raw.html`;
  
  return fs.pathExists(repoFolder)
  .then(exists => {
    let command;
    if (exists) {
      console.log(`${repoFolder} already exists, cleaning & pulling.`)
      return exec(`git -C ${repoFolder} clean -xdf && git -C ${repoFolder} pull`);
    } else {
      console.log(`${repoFolder} is new, cloning.`)
      return exec(`git clone --depth 1 ${authorizedURL} ${repoFolder}`);
    }
  })
  .then(_ => fs.readdir(repoFolder))
  .then(files => {
    let sourceDir;
    // if there's a public dir with index.html we use that dir
    const repoPublicSubfolder = `${repoFolder}/public`;
    if (files.includes('public')) {
      const publicFiles = fs.readdirSync(repoPublicSubfolder);
      if (publicFiles.includes('index.html')) {
        sourceDir = repoPublicSubfolder
      } else {
        throw "Found public folder but no index.html in it!";
      }
    } else {
      // some people just have the html in the root folder
      if (files.includes('index.html')) {
        sourceDir = repoFolder;
      } else {
        // try npm
        if (files.includes('package.json')) {
          execSync(`cd ${repoFolder} && npm install && npm run build`);
          // TODO: better separate potential build processes and folder conventions!
          sourceDir = repoPublicSubfolder;
        } else {
          throw "Found no public folder and no index.html in root folder!";
        }
      }
    }
    //TODO: should we support any of these? [make files, npm run build, ...] ?
    console.log(name, sourceDir, targetPublicDir);
    return fs.copy(sourceDir, targetPublicDir);
  })
  .then(() => fs.readFile(indexFile, {encoding: 'utf-8'}))
  .then((html_string) => {
    if (html_string.includes(TEMPLATE_V1_URL)) {
      console.log(`Found template v1, temporarily (2018-02-07) skipping pre-rendering for ${name}.`);
    } else {
      console.log(`No template v1 found, trying to pre-render ${name} from ${indexFile}.`);
      return fs.move(indexFile, indexFileRaw, {overwrite: true})
        .then(() => exec(`${render} -i ${indexFileRaw} -o ${indexFile}`))
        .then(() => fs.pathExists(targetPublicDir + '/index.html'))
        .then(exists => {
          if (!exists) {
            console.warn(`Could not prerender ${name}. Falling back to deploying raw index.html.`)
            return fs.move(indexFileRaw, indexFile);
          } else {
            console.log(`Prerendered ${name}.`);
          }
        });
    }
  })
  .catch(error => {
    console.error(`cloning threw error: ${error}`);
  });
}

const githubClient = new GitHubAPI({
  username: process.env.GITHUB_USERNAME,
  token: process.env.GITHUB_TOKEN
});

const user = githubClient.getUser();

// which repositories do we want to deploy?
// -only proviate: 
//  once public we assume it is published
// -only collaborator: 
//  so adding distillpub-reviewers is an explicit act. Otherwise we'd get all
//  distillpub organisation repos, including non-post ones.
// -all names:
//  we can't filter by 'post--' prefix as drafts may not follow naming scheme yet.
const options = {
  affiliation: 'collaborator'
};

user.listRepos(options)
.then(({data: repos}) => {
  return Promise.all(repos.map(repo => {
    const [name, url] = [repo.name, repo.clone_url];
    const https = url.substring(0, 8);
    const auth = process.env.GITHUB_TOKEN + ':x-oauth-basic@';
    const authorizedURL = https + auth + url.substring(8, url.length);
    return registerWebhooks(repo).then(() => getRepoFromURL(name, authorizedURL, buildDir));
  }));
})
.then(() => {
  console.log("...all done!");
  // deployment will be done by travis
  process.exit(0);
})
.catch((error) => {
  console.error("Error during cloning process: ", error);
  process.exit(1);
});
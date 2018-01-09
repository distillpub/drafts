#!/usr/bin/env node
const fs = require('fs-extra')
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const execSync = util.promisify(require('child_process').execSync);
const GitHubAPI = require('github-api');

const publicDir = './public';
const buildDir = './build';
const render = './node_modules/.bin/distill-render';
const concurrency = 10;

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
      return exec(`git -C ${repoFolder} pull && git -C ${repoFolder} clean -xdf`);
    } else {
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
  .then(() => fs.move(indexFile, indexFileRaw, {overwrite: true}))
  .then(() => exec(`${render} -i ${indexFileRaw} -o ${indexFile}`))
  .then(() => fs.pathExists(targetPublicDir + '/index.html'))
  .then(exists => {
    if (!exists) {
      console.warn(`Could not prerender ${name}. Falling back to deploying raw index.html.`)
      return fs.move(indexFileRaw, indexFile);
    } else {
      console.log(`Prerendered ${name}.`)
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
  visibility: 'private',
  affiliation: 'collaborator'
};

user.listRepos(options)
.then(({data: reposJson}) => {
  const repos = reposJson.map(repo => [repo.name, repo.clone_url]);
  const promises = [];
  for (const [name, url] of repos) {
    const https = url.substring(0, 8);
    const auth = process.env.GITHUB_TOKEN + ':x-oauth-basic@';
    const authorizedURL = https + auth + url.substring(8, url.length);
    const promise = getRepoFromURL(name, authorizedURL, buildDir);
    promises.push(promise);
  }
  return Promise.all(promises);
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
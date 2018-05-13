# drafts
![Build status](https://travis-ci.org/distillpub/drafts.svg?branch=master)

Pipeline / glue code for drafts.distill.pub

## How to publish articles

_This is not final documentation. For now, please only follow the guide on the main Distill website._

### Add bot account `distillpub-reviewers` as a collaborator of your repo
If you give it admin access, it can register a webhook and redeploy your article whenever you push changes.
If you don't give it admin access, it will simply check once a day. Note that if your article gets accepted you will eventually have to transfer ownership of the repository to the `Distillpub` organization anyway, so we recommend adding `distillpub-reviewers` as a collaborator with admin rights.

### Bring article up-to-date
- This will be better documented in the future on the distillpub/template repository and its associated wiki.
- Ensure the project is linking to a current development version of template v2. You can use the version that we include as a dependency here (at `./node_modules/distill-template/dist/template.v2.js`) or build one from source.
- When upgrading from v1 you may need to manually rename tags and reorganize parts of the document.
  (For example, `<dt-` -> `<d-`, `</dt-` -> `</d-`, Bibliography and Front Matter need to be Bibtex and JSON tags, etc. Ludwig will write up a transition guide soon.)
  
## Troubleshooting

You should not have to interact with draft's build system during normal operation. If anything doesn't behave as you think it should, you can try these approaches:

1. Check [the Travis build status](https://travis-ci.org/distillpub/drafts/).
2. Empty the build cache (under `More Options` > `Caches`)
3. Request a new build (under `More Options` > `Trigger build`)

## Disclaimer & License

_This project is research code. It is not an official product of Google or any other institution supporting Distill._

Copyright 2018, The Distill Drafts Authors.

Licensed under the Apache License, Version 2.0

See the [full license](LICENSE).

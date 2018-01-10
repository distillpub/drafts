# drafts
Pipeline / glue code for drafts.distill.pub

## How to publish articles

### Add bot account `distillpub-reviewers` as a collaborator of your repo
If you give it admin access, it can register a webhook and redeploy your article whenever you push changes.
If you don't give it admin access, it will simply check once a day. Note that if your article gets accepted you will eventually have to transfer ownership of the repository to the `Distillpub` organization anyway, so we recommend adding `distillpub-reviewers` as a collaborator with admin rights.

### Bring article up-to-date
- This will be better documented in the future on the distillpub/template repository and its associated wiki.
- Ensure the project is linking to a current development version of template v2. You can use the version that we include as a dependency here (at `./node_modules/distill-template/dist/template.v2.js`) or build one from source.
- When upgrading from v1 you may need to manually rename tags and reorganize parts of the document.
  (For example, `<dt-` -> `<d-`, `</dt-` -> `</d-`, Bibliography and Front Matter need to be Bibtex and JSON tags, etc. Ludwig will write up a transition guide soon.)

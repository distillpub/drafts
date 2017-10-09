# drafts
Pipeline / glue code for drafts.distill.pub

## How to publish articles

### Setup
- Run `npm install` to get the firebase client and the distill pre-render script.
- Log in using `firebase login`.
  (Firebase uses private Gmail or your Google.com account, depending on whether you're Chris Olah or anyone else respectively.)

### Bring article up-to-date
- Ensure the project is linking to a current development version of template v2. You can use the version that we include as a dependency here (at `./node_modules/distill-template/dist/template.v2.js`) or build one from source.
- When upgrading from v1 you may need to manually rename tags and reorganize parts of the document.
  (For example, `<dt-` -> `<d-`, `</dt-` -> `</d-`, Bibliography and Front Matter need to be Bibtex and JSON tags, etc. Ludwig will write up a transition guide soon.)

### Pre-render article
- Copy article files into a subfolder of `public`.
- Build article.
  (Usually `(cd public/<project> && npm run build)`, but may depend on article dev setup.)
- Rename build `index.html` to `index_raw.html`.
  (Can use `mv public/<project>/index.html public/<project>/index_raw.html`).
- Use Pipeline to pre-render article:
  `./node_modules/bin/distill-render -i public/<project>/index_raw.html -o public/<project>/index.html`
  
### Deploy
- Deploy using `firebase deploy`.
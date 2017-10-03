# drafts
Pipeline / glue code for drafts.distill.pub

## how to publish sth.

- Run `npm install` to get teh firebase client.
- Log in using `firebase login`.
- Ensure the project is linking to a current version of template v2. 
  (Either by manually building and shipping it, or by linking https://distill.pub/template.v2.js)
- Build article.
- Rename build `index.html` to `index_raw.html`
- Use Pipeline to pre-render article:
  `../template/bin/render -i public/index_raw.html > public/index.html`
- Copy pre-rendered article build files into a subfolder of `public`.
- Deploy using `firebase deploy`.
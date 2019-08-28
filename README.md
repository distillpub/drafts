# drafts
![Build status](https://travis-ci.org/distillpub/drafts.svg?branch=master)

`drafts` allows you take an in-progress Distill article submission and host it on `drafts.distill.pub`. To use it, you just add the Github bot account `distillpub-reviewers` as a collaborator of your repository.

## Continuous integration with https://drafts.distill.pub

If your repository is hosted by an **organization account**, you can give the bot account admin access and it will automatically install webhooks that trigger a redeploy when you push changes. 

If repository is hosted by a **personal account** for your repository, drafts will attempt to rebuild your submission once a day. Alternatively you can contact Distill to ask for a repository under the `distillpub` Github organization.

## Password "protection"

We don't offer truly secure password protected hosting at the moment, but if you'd like to send a strong social cue not to share your WIP, you can add a `password` parameter in your articles `front-matter` metadata, like so:

```html
<d-front-matter>
  <script type="text/json">{
  "title": "Example Distill Submission",
  "password": "example-password",
  "authors": […]
  }</script>
</d-front-matter>
```

This will add a UI overlay with a password prompt:

<img width="446" alt="in-review" src="https://user-images.githubusercontent.com/1167977/45449505-a78b1780-b6d5-11e8-970f-a3f4dd5650e9.png">

You only need to enter this password once per browser that you use to access the article.

  
## Troubleshooting

You should not have to interact with draft's build system during normal operation. If anything doesn't behave as you think it should, you can try these approaches:

1. Check [the Travis build status](https://travis-ci.org/distillpub/drafts/).
   You can search for your repository name to potentially learn what's failing.
2. Empty the build cache (under `More Options` > `Caches`)
3. Request a new build (under `More Options` > `Trigger build`)

If you've tried these steps already, you may want to post in the _Distill Slack Community_ in the `#help` channel. If you aren't registered yet, [you can do so here](https://join.slack.com/t/distillpub/shared_invite/enQtMzg1NzU3MzEzMTg3LWJkNmQ4Y2JlNjJkNDlhYTU2ZmQxMGFkM2NiMTI2NGVjNzJkOTdjNTFiOGZmNDBjNTEzZGUwM2U0Mzg4NDAyN2E).

## Disclaimer & License

_This project is research code. It is not an official product of Google or any other institution supporting Distill._

Copyright 2018, The Distill Drafts Authors.

Licensed under the Apache License, Version 2.0

See the [full license](LICENSE).

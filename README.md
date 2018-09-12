# drafts
![Build status](https://travis-ci.org/distillpub/drafts.svg?branch=master)

`drafts` allows you take an in-progress Distill article submission and host it on `drafts.distill.pub`. To use it, you just add the Github bot account `distillpub-reviewers` as a collaborator of your repository.

## Continuous integration

If your repository is hosted by an organization account, you can give the bot account admin access and it will automatically install webhooks that trigger a redeploy when you push changes. If you don't have an organization account for your repository, it will rebuild once a day. Alternatively you can contact Distill to ask for a repository under the `distillpub` Github organization.

## Password "protection"

We can't offer truly secure password protected hosting at the moment, but if you'd like to send a strong social cue not to share your WIP, you can add a `password` parameter in your articles `front-matter` metadata, like so:

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
2. Empty the build cache (under `More Options` > `Caches`)
3. Request a new build (under `More Options` > `Trigger build`)

## Disclaimer & License

_This project is research code. It is not an official product of Google or any other institution supporting Distill._

Copyright 2018, The Distill Drafts Authors.

Licensed under the Apache License, Version 2.0

See the [full license](LICENSE).

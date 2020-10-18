---
title: Building a Portfolio/Resume Site with Gatsby, Part 4 - Automating deploys to Firebase with GitHub Actions
author: Gavin Johnson
date: 2020-08-17
hero: ./images/devcommunity-logo.png
excerpt: This is after your site is good to go and already and you want to eliminate some toil. This shows how to create GitHub Actions to build and deploy your Gastby site.
---
***This post is the fourth in a series and was originally published on [Dev.to](https://dev.to/thtmnisamnstr/building-a-portfolio-resume-site-with-gatsby-part-4-automating-deploys-to-firebase-with-github-actions-l41).***
<br />

Quick recap. My personal website sucks. I'm updating it using [Gatsby](https://www.gatsbyjs.org) and the [Novela theme](https://github.com/narative/gatsby-theme-novela) by narative, because it's popular, and I'm basic.

* **[GitHub Repo for this website](https://github.com/thtmnisamnstr/thtmnisamnstr-dotcom)**
* **[My personal website](https://thtmnisamnstr.com)**

*FYI, I'm using a Mac, so there may be some Mac-specific commands.*
<br/>
Alright, part 4, automating deploys with GitHub Actions. GitHub Actions seems to be all the rage right now. I've used a couple of different enterprise-grade CI/CD tools, primarily Jenkins. So I'm familiar with the benefits and may have implemented it once or twice years ago. I haven't used GitHub Actions though. So this was a learning process. There was a lot of experimentation and testing (and failing) while doing this. At the end though, this is really good, easy to implement, CI that is free for most GitHub non-enterprise users. GitHub Actions are awesome.
<br />
**Post-Publish Update:**  I ended up commenting out the Gatsby ‘clean’ and ‘build’ steps of my action. The Gatsby CLI action that I used worked fine, but it looks like Ubuntu is the only free choice for the containers the actions run in. While Ubuntu is great, some of the components of my Gatsby site look to be incompatible on Ubuntu and the site builds incorrectly vs. Mac. So I am building on my Mac, PR-ing my repo, and automating the deploy only with GitHub Actions.
<br />
## Automate deployments with GitHub Actions
### Add your Firebase token to your GitHub repo
* In Terminal, `firebase login:ci`
* This will open up a Google sign-in page
![Alt Text](./images/qev5to3cngk6gctajulo.png)
* Select your Google account that you use for Firebase
* You will be asked to authorize Firebase CLI to access your Google account. Click the Allow button.
![Alt Text](./images/7119wnbb52nnr170fo82.png)
* You should get a login successful screen *(you can close this window)*
![Alt Text](./images/6bfiacdj67lu9phomm5k.png)
* In Terminal, the output should be something like...

```
✔  Success! Use this token to login on a CI server:

[onebigassstringthatisyourtoken]

Example: firebase deploy --token "$FIREBASE_TOKEN"
```

* Copy your token and/or don't close your terminal so you can copy it later
* Login to GitHub and go to your site's repo and click on the Settings navigation tab
![Alt Text](./images/qf26ea3sqkmkb0fx18on.png)
* Click Secrets in the left navigation menu
![Alt Text](./images/i1tpejugaqcm03zrlvek.png)
* Click the New Secret button
![Alt Text](./images/ahn7c1xx6kprsdwc82im.png)
* For Name, enter 'FIREBASE_TOKEN'
* For Value, enter the Firebase token you copied earlier from Terminal
* Click the Add Secret button
![Alt Text](./images/2osv1el57qf0ifh324tw.png)

You should see the new secret in your GitHub repo. Here's mine.
![Alt Text](./images/y4na2bioqao76wln0b0o.png)

### Add GitHub Actions to automate deployment
* In your site's repo in GitHub, click on Actions navigation tab
![Alt Text](./images/gzaga031obxa67oao9le.png)
* Click the Setup this Workflow button under the Simple Workflow section
![Alt Text](./images/ijr64ycxemezibhnk7da.png)
* Change your Actions YAML name and click the Start Commit button *(I named mine `build-deploy.yml`)*
![Alt Text](./images/92tki6q1gjvzwvq7je4z.png)
* Add a commit subject and message and click the Commit New File button
* In Terminal, cd to site's root directory
* `git checkout main`
* `git pull` *(your `build-deploy.yml` file should pull down to your local machine)*
* Open './.github/workflows/build-deploy.yml'
* Go the the [GitHub Action for Gatsby CLA](https://github.com/marketplace/actions/github-action-for-gatsby-cli) and click the Use Latest Version button
![Alt Text](./images/1dsw9bdxil90ghhpyvg9.png)
* Copy the text and paste it at the top of your `build-deploy.yml` file
![Alt Text](./images/eikmpay183klaz508548.png)
* Go the the [GitHub Action for Firebase](https://github.com/marketplace/actions/github-action-for-firebase) and click the Use Latest Version button
![Alt Text](./images/wnenrpf5knae8ljcju8g.png)
* Copy the text and paste it at the top of your `build-deploy.yml` file below the Gatsby action you pasted earlier
![Alt Text](./images/uerbwftuzm5l3jrtze9b.png)
* In your `build-deploy.yml` file, add your build and deploy and save. Here's mine.

```
# This is a basic workflow to help you get started with Actions

name: Build and Deploy
# Controls when the action will run. Triggers the workflow on push or pull request
# events but only for the main branch
on:
  # Gavin, 20200802: Removing on-push, because I only want PRs to trigger this job
  push:
    branches: [ main ]

# A workflow run is made up of one or more jobs that can run sequentially or in parallel
jobs:
  # This workflow contains a two jobs, "build" and "deploy"
  build:
    name: Build and Deploy
    runs-on: ubuntu-latest
    steps:
    - name: Checkout Repo
      uses: actions/checkout@master
    - name: Clean Gatsby Site
      uses: jzweifel/gatsby-cli-github-action@master
      with:
        gatsby-arg: clean
    - name: Build Gatsby Site
      uses: jzweifel/gatsby-cli-github-action@master
      with:
        gatsby-arg: build
    # Gavin, 202008014: Moved this up from its own Deploy job into this job ()
    - name: Deploy to Firebase
      uses: w9jds/firebase-action@master
      with:
        args: deploy --only hosting
      env:
        FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

## Loosen your .gitignore restrictions and push your changes
* Open './.gitignore'
* In your `.gitignore` file, unignore `node_modules` and `public` (for building and deploying) and save. Here's mine.

```
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Directory for instrumented libs generated by jscoverage/JSCover
lib-cov

# Coverage directory used by tools like istanbul
coverage

# nyc test coverage
.nyc_output

# Grunt intermediate storage (http://gruntjs.com/creating-plugins#storing-task-files)
.grunt

# Bower dependency directory (https://bower.io/)
bower_components

# node-waf configuration
.lock-wscript

# Compiled binary addons (http://nodejs.org/api/addons.html)
build/Release

# Dependency directories
jspm_packages/
# Gavin, 20200719: Including the Novela theme directory under node_modules
# Gavin, 20200802: Including all under directory under node_modules
#node_modules/*
#!node_modules/@narative/
#node_modules/@narative/*
#!node_modules/@narative/gatsby-theme-novela/

# Typescript v1 declaration files
typings/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# dotenv environment variables file
.env

# gatsby files
.cache/

# Gavin, 20200802: Including public
#public

# Mac files
.DS_Store

# Yarn
yarn-error.log
.pnp/
.pnp.js
# Yarn Integrity file
.yarn-integrity

.netlify/
```

* In Terminal, `gatsby clean`
* `git add --all`
* `git commit -a -m "Added GitHub actions to automate build and deploy. Also added the 'node_modules' folder and the 'public' folder"`
* `git push -u origin main`

*So... Great. How can you tell if this works?*
When you pushed you your main repo to origin (GitHub), the action should have automatically run. Your Action will run when you push to your main branch, merge a PR into your main branch, or manually re-run your Action. I'll describe how to re-run an Action manually because everything for it will apply to the other automated runs.
* In your GitHub repo, click on Actions.
![Alt Text](./images/fq73mia7fcfivp5bnbax.png)
* You can see your Actions on the left and your Action running on the right, if it's running *(You can also see my failures on the right in the screenshot)*. Click on the Action you just created.
![Alt Text](./images/8dye812u7jt007l5njjw.png)
* Click on the most recent run of your Action. *It might be a failure. It doesn't matter, just click it.*
![Alt Text](./images/0a283rsedbwgausmzn7g.png)
* Click Re-run jobs > Re-run all jobs.
![Alt Text](./images/npn9ydkeav2alt2q4ilc.png)
* Your Action will queue, then run. Its status will change to In Progress and the spinners will start spinning.
![Alt Text](./images/glltnvb80dsykbibb1va.png)
* If you click on the Action in the left nav panel, you can see it run (or troubleshoot failures).
![Alt Text](./images/r9eibt6stszw7jct88kl.png)


**Boom!** Now your Gatsby site is automatically building and deploying when you merge a pull request to your `main` branch. Professional level CI on a personal site, easy, and free. Is it overkill? Maybe. Am I going to continue overkilling my personal site and doing write-ups like this? Probably.
VERSION 0.7
PROJECT thtmnisamnstr/thtmnisamnstr-dotcom

ci-deploy:
  PIPELINE
  TRIGGER push main
  BUILD +deploy

deps-build:
    FROM --platform=linux/amd64 node:latest
    WORKDIR /app
    # Install the Netlify CLI (global)
    RUN npm install netlify-cli -g
    # Copy package.json & package-lock.json for installing required packages
    COPY package.json package-lock.json ./
    # Install the Netlify CLI (local) and Netlify Next.js plugin and required packages
    RUN npm install netlify-cli --save-dev --force
    RUN npm install @netlify/plugin-nextjs --save-dev --force
    RUN npm install --force
    # Copy files and directories required for building
    COPY .eslintignore .eslintrc.js netlify.toml next-env.d.ts next.config.js postcss.config.js prettier.config.js tailwind.config.js tsconfig.json ./
    COPY --dir components constant css data icons layouts libs pages public scripts types utils ./

build:
    FROM +deps-build
    # Build site
    RUN --secret SPOTIFY_CLIENT_ID --secret SPOTIFY_CLIENT_SECRET --secret SPOTIFY_REFRESH_TOKEN --secret NEXT_PUBLIC_SEGMENT_WRITE_KEY_PROD --secret NETLIFY_AUTH_TOKEN --secret NETLIFY_SITE_ID netlify build --context production
    SAVE ARTIFACT ./.next .next/ AS LOCAL ./
    SAVE ARTIFACT ./.netlify .netlify/ AS LOCAL ./
    SAVE ARTIFACT ./node_modules node_modules/ AS LOCAL ./
    SAVE ARTIFACT ./public/tags public/tags/ AS LOCAL ./public/
    SAVE ARTIFACT ./public/feed.xml public/feed.xml AS LOCAL ./public/
    SAVE ARTIFACT ./public/sitemap.xml public/sitemap.xml AS LOCAL ./public/

deploy:
    FROM +deps-build
    # Build and deploy site (required because site uses `next/image` which requires `@netlify/plugin-nextjs` and build to happen as part of deploy)
    RUN --push --secret SPOTIFY_CLIENT_ID --secret SPOTIFY_CLIENT_SECRET --secret SPOTIFY_REFRESH_TOKEN --secret NEXT_PUBLIC_SEGMENT_WRITE_KEY_PROD --secret NETLIFY_AUTH_TOKEN --secret NETLIFY_SITE_ID netlify deploy --build --prod

deps-work:
  FROM node:latest
  WORKDIR /app
  # Copy package.json & package-lock.json for installing required packages
  COPY package.json package-lock.json ./
  RUN npm install --force
  # Copy files and directories required for building
  COPY .eslintignore .eslintrc.js netlify.toml next-env.d.ts next.config.js postcss.config.js prettier.config.js tailwind.config.js tsconfig.json ./
  COPY --dir components constant css data icons layouts libs pages public scripts types utils ./

upgrade:
  FROM +deps-work
  RUN npm run deps-npm-check
  RUN npm run deps-taze
  RUN npm install --force
  SAVE ARTIFACT ./package.json package.json AS LOCAL ./
  SAVE ARTIFACT ./package-lock.json package-lock.json AS LOCAL ./

# Build docker image for preview
docker-preview:
  FROM +deps-work
  CMD npm run dev
  SAVE IMAGE thtmnisamnstr-dotcom:preview

# Run site in docker
preview:
  LOCALLY
  WITH DOCKER --load thtmnisamnstr-dotcom:preview=+docker-preview
    RUN docker rm -f thtmnisamnstr-dotcom && \
        docker run -p 3000:3000 --rm --name thtmnisamnstr-dotcom thtmnisamnstr-dotcom:preview
  END

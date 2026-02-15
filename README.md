# thtmnisamnstr-dotcom
![image info](./public/images/thtmnisamnstr-dotcom-screenshot.png)
This is the source code for my personal website at https://thtmnisamnstr.com. It is a modified version of [Leo Huynh's personal website](https://www.leohuynh.dev/) \[[repo](https://github.com/hta218/leohuynh.dev)\].

## Tech Stack
* Node.js 22
* Next.js 14
* [Netlify](https://www.netlify.com/) for hosting
* [Segment](https://segment.com/) for analytics

## How to run, build, and upgrade dependencies
### Running locally
* Clone the repo.
* Run `npm install`.
* Run `npm run dev` and open http://localhost:3000.

### Building the site
* Clone the repo.
* Run `npm install`.
* Run `npm run build`.
* Optionally run `npm run serve` to serve the production build locally.

### Deploying the site
* Deploy via your Netlify site configuration connected to this repository.
* Ensure required environment variables are set in Netlify (for example Segment keys if used).

### Dependency management and package install/uninstall
* To update dependencies, run `npm update` and re-run lint/build checks.
* To install modules, run `npm install`.
* To uninstall modules, run `npm uninstall [module_name]`.

## License 🤝
[MIT](./LICENSE)

## Thanks
Thanks to [Leo Huynh's personal website](https://www.leohuynh.dev/) \[[repo](https://github.com/hta218/leohuynh.dev)\] for making his website open source.

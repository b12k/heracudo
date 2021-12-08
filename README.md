# Heracudo 123
### Heroku review applications custom domain hooks.

Special heroku review application hooks which make usage of fancy custom review application domain possible.

Heroku Review Apps + Cloudflare + Github Pull Requests

### Installation
1. `npm i heracudo --save` Must be installed in `dependencies`, not `devDependencies`, in order not to be pruned after Heroku installation process.
2. Edit your `app.json`:
    ```json
      {
        "scripts": {
          "postdeploy": "hrcd-postdeploy",
          "pr-predestroy": "hrcd-predestroy"
        }
      }
    ```
    2.1 **Optionally** edit your `package.json`. Used to mark links as _pending_ or _ready_ when Heroku review application is rebuilding after Github pull request receives new commits. Add this hooks in scripts which works best for you, when application started rebuilding, and before starting the application.
    ```json
      {
        "scripts": {
          "postinstall": "hrcd-markpending",
          "postbuild": "hrcd-markready"
        }
      }
    ```
3. Add environment variables for Heroku review applications. Either in pipeline settings, or `app.json`:

    Required:
    * `HOSTNAME | HRCD_HOSTNAME` Comma separated hostname list which are used as a base for review application domain variations.
      * Review application domain for `domain.tld` will be `{number}.domain.tld`
      * Review application domain for `subdomain.domain.tld` will be `{number}-subdomain.domain.tld`
    * `HEROKU_TOKEN | HRCD_HEROKU_TOKEN` Heroku API access token.
    * `CLOUDFLARE_ZONE_ID | HRCD_CLOUDFLARE_ZONE_ID` Cloudflare domain zone ID.
    * `CLOUDFLARE_TOKEN | HRCD_CLOUDFLARE_TOKEN` Cloudflare API access token.
    * `GITHUB_TOKEN | HRCD_GITHUB_TOKEN` Github API access token.
    * `GITHUB_REPOSITORY | HRCD_GITHUB_REPOSITORY` Github repository name in format `username/repository_name`.

    Optional:
    * `HRCD_GITHUB_LINK_MARKER`   A string which will be added before of review app link in Github pull request description. Defaults to `## Preview: `
    * `HRCD_GITHUB_LINK_PENDING` A string which will be added after of review app link in Github pull request description when application is building. Defaults to `⏳`
    * `HRCD_GITHUB_LINK_READY`    A string which is added in front of review app link in Github pull request description when application is ready. Defaults to `🚀`

### Hooks
* `hrcd-postdeploy` Triggered only once when review application is created. Adds domain to Heroku review application, creates respective CNAME in Cloudflare, adds newly created Review application link on top of Github pull request description.
* `hrcd-markpending` (Optional) Triggered every time (whenever defined in npm scripts) to mark Heroku review application link in Github pull request description as "pending"
* `hrcd-markready` (Optional) Triggered every time (whenever defined in npm scripts) to mark Heroku review application link in Github pull request description as "ready"
* `hrcd-predestroy` Triggered only once when review application is going to be destroyed. Removes domains from Heroku review application, deletes CNAMEs in Cloudflare, removes Review application link on top of Github pull request description.

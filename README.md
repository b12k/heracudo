# Heracudo
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
    2.1 **Optionally** edit your `package.json`. Used to mark links as _pending_ or _ready_ when Heroku review application is rebuilding after Github pull request receives new commits.
    ```json
      {
        "scripts": {
          "preinstall": "hrcd-markpending",
          "postinstall": "hrcd-markready"
        }
      }
    ```
3. Add environment variables for Heroku review applications. Either in pipeline settings, or `app.json`:

    Required:
    * `HRCD_DOMAINS` Comma separated list of domains which are used as a base for review application domain variations.
      * Review application domain for `domain.tld` will be `{number}.domain.tld`
      * Review application domain for `subdomain.domain.tld` will be `{number}-subdomain.domain.tld`
    * `HRCD_HEROKU_TOKEN_B64`     Base64 encoded Heroku API access token.
    * `HRCD_CLOUDFLARE_ZONE_ID`   Cloudflare domain zone ID.
    * `HRCD_CLOUDFLARE_TOKEN_B64` Base64 encoded Cloudflare API access token.
    * `HRCD_GITHUB_TOKEN_B64`     Base64 encoded Github API access token.
    * `HRCD_GITHUB_REPOSITORY`    Github repository name in format `username/repository_name`.
    * `HRCD_GITHUB_LINK_MARKER`   A string which is added in front of review app url in Github pull request description.

    Optional:
    * `HRCD_GITHUB_LINK_MARKER`   A string which will be added before of review app link in Github pull request description. Defaults to `## Preview: `
    * `HRCD_GITHUB_LINK_PENDING` A string which will be added after of review app link in Github pull request description when application is building. Defaults to `⏳`
    * `HRCD_GITHUB_LINK_READY`    A string which is added in front of review app link in Github pull request description when application is ready. Defaults to `🚀`

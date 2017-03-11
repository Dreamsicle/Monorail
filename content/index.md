# %websiteName%
----------

## Getting Started
Change the files in the `content` subdirectory from where Monorail is stored. Type in GitHub-flavored markdown.

You'll need to refresh ~2 times because of the ServiceWorker. It caches the majority of your site so that people can access it even when they're offline or your server is down.

## Configuration
All configuration lives in `config.js`, located wherever you downloaded Monorail.

### Site path and name

```javascript
const URL = '%URL%'
const name = '%websiteName%'
```
These are the things you'll want to change first for a production server. They are used for HTTPS redirects and page titles respectively.
Quick note on the `local.racklab.xyz` thing: this is here because it allows you to use a certificate that has already been signed by us, and the domain's pointed at `localhost`. Only use this if you're messing around or developing.

### Server port and type

```javascript
// Server type
// Should be any JS file under the servertypes directory, omit the .js
const servertype = 'basic'

// Port to listen on (If using SSL/HTTPS, set it to 443. Automatic redirects for port 80 will be set up.)
const web_port = 443
```
Server types are being phased out. Don't use them. Basically, they were intended to allow you to change into different 'loadouts' of code that the server would run on. With the Pivot project, this isn't required.

The web port should be self explanatory. No quotes needed when changing it.

### HTTPS and password protection

```javascript
// SSL
// Enter the full path.
const key = '/path/to/your/server.key'
const cert = '/path/to/your/server.crt'

// Password protection
const username = 'username'
const password = 'password'
```
Because HTTPS/TLS/SSL is used, you're going to need to provide a certificate and a key. It's okay to used self-signed keys and certificates for development or messing around. If you're using `local.racklab.xyz` for your site's URL, we'll have signed certs up soon.

In the future, you'll be able to force authentication to enter the site. Hence the username and password config options.

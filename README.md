# Configuration
## Environment
The Node SDK allows clients to specify environment specific configuration via 
[dotenv](https://www.npmjs.com/package/dotenv) files in the root directory of the running 
application. See expected folder structure below.
```sh
.
├── .env.development
├── .env.production
├── .env.sandbox
├── .gitignore
├── README.md
├── package.json
├── src
│   ├── eventsHandlers
│   │   ├── defaultHandler.js
```
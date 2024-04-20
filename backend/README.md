# backend

Required env variables; (the env variables can be given via an `.env` file, or from environment itself)

```
MONGODB_URL="mongodb://localhost:27017/ihtiyac_listesi"
DOMAIN="localhost" # or mysite.com
SECURE=false # If your app uses HTTPS or not
PORT=3002 # The port number the app will listen on
```

`npm install` to install node modules.

`npm run dev` to run in development.

`npm run build` to build the typescript files into the `dist` folder and then `npm run start` to serve the built files.

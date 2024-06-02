# backend

## Used Technologies/Frameworks

- Node.js
- Express
- TypeScript
- ws (WebSocket)
- busboy
- mongodb
- cookie

## Prerequisites

    - Node.js (20) with NPM

## Required Environment Variables

The environment variables can be given via an `.env` file, or from environment itself.

```
MONGODB_URL="mongodb://localhost:27017/ihtiyac_listesi"
DOMAIN="localhost" # or mysite.com
SECURE=false # If your app uses HTTPS or not
PORT=3002 # The port number the app will listen on
```

## Development

To install node modules

```sh
npm install
```

To run the project in development mode

```sh
npm run dev
```

## Deployment

To build the project

```sh
npm run build
```

To run the project in production mode

```sh
npm run start
```

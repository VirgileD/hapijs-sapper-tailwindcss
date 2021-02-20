# a hapijs backend

To serve api, hapijs with a bunch of selected plugins
Notably, routes can be protected by JWT

## Getting started

```bash
cd backend
npm i
npm run dev
```
This will start the development server on [localhost:3001](http://localhost:3001).

## Directory structure

### extra_types

contains just an index.d.ts which avoid vscode to complain about missing types for modules that dont have a xxx/@types package

### routes/XXX/yyyy-routes.js

defines thes endpoints. Thanks to Wurst plugin, the endpoint will be available at host/XXX/...
Notably, routes/auth/auth-routes.js defines login and logout endpoints. Once logged in, you can access the jwt protected endpoint
by sending the Authorization header filled with the token.
Protected routes must include the "auth" config sert to jwt:
```json
config: { 
    auth: 'jwt',
    ...
},
```

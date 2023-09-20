# vercenv

A simple command line program that will load environment variables pulled from
Vercel.

This is to help avoid errors during checks and tests where your code is
expecting certain variables to be defined.

```sh
$ vercel env pull
$ vercenv vite build
```

Additionally, this allows you to run `npm run dev` as normal instead of using
`vercel dev`. This can be useful, for example, when starting scripts from
VSCode's GUI.

```json
// package.json
{
  "scripts": {
    "dev": "vercenv vite dev"
  }
}
```

```sh
$ npm run dev
```

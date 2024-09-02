# Env Vars
```sh
# .env
```

# build run prod
```sh
./build_prod.sh 1
docker run \
    -e APP_DB_PATH="/data/" \
    -e PORT=5173 \
    -e ORIGIN=http://localhost:5173 \
    -p 5173 \
    -v /data:/data \
    --network host \
    teacher_app:1
```

# Run DB Migration

```sh
./migrations/scripts/execute_migration.sh migrations/scripts/addSuccessTeacherResponse.txt 
```

# TODO

- add secret code to give students when they answer question
- add summary metrics view: search by class then question and then can drilldown per student
- add concept of classes
- test questions where the answers have math notation in them

# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/main/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

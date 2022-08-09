## [Wrighter - A Powerful Markdown Blogger & A Writing Companion ⚡](https://wrighter.vercel.app/)

- Wrighter is originally made for the [hashnode x PlanetScale hackathon](https://townhall.hashnode.com/planetscale-hackathon)
- It has a powerful WYSIWYM markdown editor and a renderer
- It is optional signup, so you can use wrighter offline too! or you can fork this project and use wrighter standalone
- Wrighter has a feature called bites, that allow you to gather & organize _bite_ sized ideas and later use them in your blogs

### To read more about it, visit [here](https://wrighter.vercel.app/wright/introducing-wrighter-a-powerful-markdown-blogger-and-a-writing-companion-6J96hd6t0pyy8wDFlkZUI0) or [here](https://vishaltk.hashnode.dev/introducing-wrighter-a-powerful-markdown-blogger-a-writing-companion)

## Setup

- To run wrighter locally, you just need to clone the app
- ensure to install `prisma` and `tsnd` globally
- run `yarn` on root directory, it will install all the deps for both client and server
- create `.env.local` file in `wrighter-client` with

```
API_BASE_URL="<INSERT BACKEND URL HERE>"
```

Example of configuration file:

```
API_BASE_URL="http://localhost:8080/api"
```

- create `.env` file in `wrighter-server` with

```
DATABASE_URL="<INSERT DB URL HERE>"
SECRET_KEY="<SOME SECRET>"
COOKIE_SECRET="<COOKIE SECRET>"
```
Example of configuration file:

```
DATABASE_URL="mysql://wrighter_user:secrete_wrighter_pass@127.0.0.1:3306/wrighter_db"
SECRET_KEY="SECRETkeyforwrighterapplication"
COOKIE_SECRET="SECRETCookieforwrighterapplication"
```

- from the root directory, run `yarn dev`, it would concurrently run both the server and client
- goto `localhost:3000` to see wrighter ✨


## Docker Version

Modify the server `.env` file to use docker default network:

```
DATABASE_URL="mysql://wrighter_user:secrete_wrighter_pass@mariadb:3306/wrighter_db"
SECRET_KEY="SECRETkeyforwrighterapplication"
COOKIE_SECRET="SECRETCookieforwrighterapplication"
```

And then run inside main folder:

```
docker compose up
```

It start mysql docker, build and start server and client nodes and then all is ready to run at `localhost:3000`

## ❖ Contributing Guidelines

### ━ Code Formatting

-   We're using [Prettier](https://prettier.io) as our code formatter; as, such please abide by our defined options [here](.prettierrc).

### ━ Branches

-   All edits to the source code must be based in the [master](https://github.com/imperia-project/imperia) branch.

### ━ Commit Messages

-   It is encouraged to follow through this [article](https://conventionalcommits.org/en/) for writing commit messages.

### ━ File Namings

-   Except for files in libraries, structures, and locales folder. Please add a suffix according to their folder. e.g., HelloWorld**Command** for a file in the commands folder and HelloWorld**Listener** for a file in the listeners folder.

### ━ Code Quality & Analysis

-   We use [Codacy](https://www.codacy.com) to automate code reviews and monitor code quality on every commit and pull request reporting back the impact of every commit or pull request, issues concerning code style, best practices, security, and many others. View the dashboard [here](https://app.codacy.com/gh/imperia-project/imperia/dashboard)

---

## ❖ Project Setup

### ━ Prerequisites

-   [Node.js](https://nodejs.org) version must be v17.3.1 or above.
-   [Yarn](https://yarnpkg.com) version must be v3.1.1 or above.
-   **SERVER MEMBERS INTENT** enabled at your bot's Privileged Gateway Intents.

### ━ Initial Setup

> This is step-by-step how to install these dotfiles. Just [R.T.F.M](https://en.wikipedia.org/wiki/RTFM).

-   First of all, install [Git](https://git-scm.com/), and [Node.js](https://nodejs.org/en/).

-   Then, clone the repository. Make sure to initalize the submodules while cloning it.

```sh
$ git clone --recurse-submodules https://github.com/imperia-project/imperia.git
$ cd imperia && git submodule update --remote --merge
```

-   After that, install all dependencies by running `yarn install`.

### ━ Compiling & Running

-   Fill in the values of `.env` for a `DISCORD_TOKEN`, and optionally `DEFAULT_PREFIX` and `DEFAULT_LANGUAGE`. Refer to [.env.schema](.env.schema) for possible values or just rename it to `.env`.

-   Compile to `dist` folder.

```bash
$ yarn build
```

-   Running the bot.

```bash
# Development build
$ yarn start:development

# Production build
$ yarn start:production
```

### ━ Configuring Prisma

-   Fill in the values of `.env` for a [SQLite](https://www.sqlite.org/) database.

-   Create a Prisma migration.

```bash
# Create a development migration
$ yarn prisma:migrate:development

# Deploy to production
$ yarn prisma:migrate:production
```

-   Generate the Prisma client.

```bash
$ yarn prisma:generate
```

### ━ Generating Sapphire Components

-   Install `@sapphire/cli` globally.

-   Then, use this commands for generating a sapphire component.

```sh
# Generating a command component.
$ sapphire generate command HelloWorldCommand

# Generating a listener component.
$ sapphire generate listener HelloWorldListener
```

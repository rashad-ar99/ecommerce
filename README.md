# UniBlox Assignment

E-commerce application using Next.js and Node.js.

## Getting Started

### First time setup

Go into each directory and run the command shown below

```bash
npm install
# or
pnpm install
# or
yarn install
```

### Environment Variables

Can be set in `.env.local` at root of each of the frontend directories.
Can be set in `.env` at root of backend directory.

> 📝 **Note:** NEXT_PUBLIC\_ variables must be defined and available at build time.

Backend required .env

```
PORT=
BASE_URL=
ACCESS_TOKEN_SECRET=
DB_HOST=
REFRESH_TOKEN_SECRET=
ADMIN_CODE=

```

> 📝 **Note:** ADMIN_CODE is the code required during registration of an admin.

Frontend-User required .env.local

```
APP_URL=
API_URL=

```

Frontend-Admin required .env.local

```
APP_URL=
API_URL=

```

### Run the development server:

Run the below command for the backend from the backend directory. Add the argument "port (Provided Port Number) " with the respective port numbers and run the command in each of the front-end directories.

```bash
npm run dev
# or
pnpm dev
# or
yarn dev

#eg
port=3001 npm run dev
```

### Build:

```bash
npm run build
# or
pnpm build
# or
yarn build
```

### Start server:

```bash
npm run start
# or
pnpm start
# or
yarn start
```

## JSON-Server

To setup the json-server, run the command:

```bash
npm install -g json-server
```

Run the given command from the directory with db.json to start the json-server in a specific port number:

```bash
npx json-server db.json --port (Specified port number)

# eg
npx json-server db.json --port 3003
```

The servers should be running on the specified ports.

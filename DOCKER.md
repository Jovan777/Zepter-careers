# Zepter Careers Docker Setup

This Docker setup runs the application as three separate services:

- MongoDB database
- Node.js / Express backend
- React / Vite frontend served by nginx

It does not build MongoDB, backend, and frontend into one image.

## Start Everything

From the project root:

```bash
docker compose up --build
```

Start in the background:

```bash
docker compose up --build -d
```

If your Docker installation uses the legacy command, use `docker-compose` with
the same arguments.

## Which Env File Should Be Edited?

For Docker deployment, edit only the root `.env` file next to
`docker-compose.yml`.

Docker Compose automatically reads that root `.env` file. The system
administrator should not edit these files for Docker deployment:

- `client/.env`
- `server/.env`
- `client/.env.docker.example`
- `server/.env.docker.example`

Those files are for local development or folder-specific reference examples.

Do not commit real secrets.

## Deployment Env Steps

Step 1: copy the root Docker env example.

```bash
cp .env.docker.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.docker.example .env
```

Step 2: edit the root `.env`.

For root deployment:

```text
VITE_PUBLIC_BASE_PATH=
VITE_API_BASE_URL=
APP_BASE_URL=http://localhost:11001
```

For subfolder deployment, for example
`https://promo.zepter.rs/posao/`:

```text
VITE_PUBLIC_BASE_PATH=
VITE_API_BASE_URL=
APP_BASE_URL=https://promo.zepter.rs/posao
```

The recommended Docker mode leaves `VITE_PUBLIC_BASE_PATH` empty. This makes
Vite generate relative asset paths such as `assets/index.js` instead of
root-absolute paths such as `/assets/index.js`.

`VITE_API_BASE_URL` should normally stay empty for Docker, so the frontend
derives `/api` or `/posao/api` at runtime from the current browser URL.
`APP_BASE_URL` must match the external frontend URL, including the subfolder if
used.

After changing frontend build variables, the frontend must be rebuilt.

Step 3: start or rebuild Docker.

```bash
docker compose down
docker compose up --build -d
docker compose run --rm seed
```

If your Docker installation uses the legacy command, use `docker-compose` with
the same arguments.

Step 4: test the public and admin URLs.

Root deployment:

```text
http://localhost:11001
http://localhost:11001/secure-zc-panel-8f4k/login
```

Subfolder deployment:

```text
http://localhost:11001/posao/
http://localhost:11001/posao/secure-zc-panel-8f4k/login
```

## Default Local URLs

The frontend is intentionally bound to localhost only by default:

```text
http://localhost:11001
```

The backend debug port is also bound to localhost only:

```text
http://localhost:11002
```

MongoDB is internal to Docker Compose by default and is not exposed on the host.
This avoids conflicts with an existing local MongoDB service on port `27017`.

The hidden admin login route is:

```text
http://localhost:11001/secure-zc-panel-8f4k/login
```

Local Docker/test admin credentials:

```text
Email: admin@local
Password: admin123!
```

These credentials are only for local Docker/testing. Do not use them in
production.

## System Administrator Proxy

Recommended deployment shape:

```text
external web traffic -> 127.0.0.1:11001
```

The system administrator can forward the public domain or external server port
to the local frontend bind address. The app itself does not need to publish the
frontend on `0.0.0.0:80` or `0.0.0.0:8080`.

If the frontend port needs to change, set this in `.env`:

```text
FRONTEND_BIND_HOST=127.0.0.1
FRONTEND_PORT=11001
```

## Same-Origin API

For Docker builds, leave `VITE_API_BASE_URL` empty unless you intentionally need
a custom API endpoint. In the recommended relative asset mode, the frontend
derives the API path at runtime:

```text
http://localhost:11001/              -> /api
https://promo.zepter.rs/posao/       -> /posao/api
```

This is important because frontend JavaScript runs in the user's browser.
Hardcoding `http://localhost:5000/api` would make the user's browser call port
5000 on the user's own machine, not necessarily the server.

The nginx container proxies backend traffic internally:

```text
/api     -> http://backend:5000/api
/uploads -> http://backend:5000/uploads
```

Uploaded CV/document URLs therefore work through the frontend host, for example:

```text
http://localhost:11001/uploads/applications/<filename>
```

## Deploying Under A Subfolder

Example external URL:

```text
https://promo.zepter.rs/posao/
```

Use the trailing slash on the external subfolder URL. Relative asset paths such
as `assets/index.js` resolve correctly from `/posao/`.

Use these values in root `.env`:

```text
VITE_PUBLIC_BASE_PATH=
APP_BASE_URL=https://promo.zepter.rs/posao
VITE_API_BASE_URL=
```

Leave `VITE_PUBLIC_BASE_PATH` empty for the recommended Docker deployment. The
generated `index.html` will use relative paths like `assets/index.js` and
`Zepter-Careers images/ZepterJobLogo.png`, so the same image can be served from
any external subfolder without rebuilding for that folder name.

`APP_BASE_URL` should include the full external URL, including the subfolder.

Recommended reverse proxy rule:

```text
https://promo.zepter.rs/posao/ -> http://127.0.0.1:11001/
```

The frontend nginx tolerates prefixed `/api`, `/uploads`, `/assets`, and public
asset-folder paths. Stripping `/posao` at the external proxy is still fine, but
the Docker build no longer depends on the concrete subfolder name.

After changing Docker frontend build variables, rebuild the frontend image:

```bash
docker compose down
docker compose up --build -d
```

## Docker Networking

This project intentionally uses Docker Compose default networking. It does not
use fixed container IP addresses.

Docker Compose creates a project network automatically, and services communicate
inside that network by service name:

- backend talks to MongoDB using `mongo`
- nginx talks to the backend using `backend`

MongoDB is not published to the host by default. The backend still reaches it
inside Docker through the `mongo` service name.

The backend MongoDB connection remains:

```text
MONGO_URI=mongodb://mongo:27017/zepter-careers
```

Do not replace this with `127.0.0.1` inside Docker. Inside the backend
container, `127.0.0.1` means the backend container itself, not MongoDB.

Do not access containers directly by Docker-internal IPs such as `172.x.x.x`.
External access should use the server IP/domain plus the published frontend
port, or the system administrator's reverse proxy.

The previously attempted custom subnet `172.17.0.0/24` was removed because it
can conflict with Docker's existing bridge networks and cause this error:

```text
Pool overlaps with other one on this address space
```

Use Docker Compose default networking unless the system administrator explicitly
provides a free custom subnet.

If local MongoDB debugging is needed, expose Mongo manually on a free host port,
for example `127.0.0.1:27018 -> mongo:27017`. Do not expose MongoDB by default
in production.

## Seed Docker MongoDB

The first Docker MongoDB database starts empty. Run the seed command once after
MongoDB is started:

```bash
docker compose run --rm seed
```

The seed service uses the official `mongo:7` image and runs `mongosh` against:

```text
mongodb://mongo:27017/zepter-careers
```

It inserts/updates the local test admin user, companies, regions, jobs and job
translations.

Seeded data persists because MongoDB uses the `mongo_data` named volume.

## Stop Containers

```bash
docker compose down
```

This stops and removes containers, but keeps Docker named volumes.

## Dangerous Command

```bash
docker compose down -v
```

Do not use this in production unless you intentionally want to delete persistent
data. This deletes named volumes, including MongoDB data and uploaded candidate
files.

## Persistent Data

MongoDB data is stored in:

```text
mongo_data
```

Backend uploaded files, including candidate CVs and extra documents, are stored
in:

```text
backend_uploads
```

Inside the backend container the upload directory is:

```text
/app/uploads
```

The existing backend file URLs continue to use paths such as:

```text
/uploads/applications/<filename>
```

nginx proxies `/uploads` to the backend, so those links work through the
frontend host.

## Important Defaults

These are the important Docker Compose defaults:

```text
FRONTEND_BIND_HOST=127.0.0.1
FRONTEND_PORT=11001
BACKEND_BIND_HOST=127.0.0.1
BACKEND_PORT=11002
VITE_PUBLIC_BASE_PATH=
VITE_API_BASE_URL=
VITE_ADMIN_LOGIN_PATH=/secure-zc-panel-8f4k/login
APP_BASE_URL=http://localhost:11001
MONGO_URI=mongodb://mongo:27017/zepter-careers
```

For production, set real secrets in the deployment environment or root `.env`:

```text
JWT_SECRET=replace-with-a-strong-secret
CONTACT_SECURITY_SECRET=replace-with-a-strong-contact-security-secret
MAILTRAP_API_TOKEN=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_SECURE=false
SMTP_IGNORE_TLS=false
SMTP_REQUIRE_TLS=false
SMTP_AUTH=true
SMTP_TLS_MIN_VERSION=
```

## React Router Refresh Support

The nginx config keeps the SPA fallback:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

This prevents nginx 404 responses when refreshing frontend routes such as:

- `/secure-zc-panel-8f4k/login`
- `/posao/secure-zc-panel-8f4k/login`
- `/admin/dashboard`
- `/posao/admin/dashboard`
- `/jobs/...`
- `/posao/jobs/...`
- any other client-side route

## Files

- `docker-compose.yml` defines `mongo`, `backend`, `frontend`, and `seed`.
- `server/Dockerfile` builds the backend image.
- `client/Dockerfile` builds and serves the frontend image.
- `client/nginx.conf` serves the React app and proxies `/api` and `/uploads`.
- `.env.docker.example` contains root Docker deployment defaults.
- `.dockerignore` files keep dependencies, real `.env` files, build output, and uploads out of images.

## Notes

This setup keeps uploaded documents locally in a Docker volume as a first-phase
production approach. Box.com integration is intentionally not included here.

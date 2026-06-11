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

The first Docker MongoDB database starts empty. Run the seed command once if
you need the initial Zepter Careers admin user and job data.

## Start In Background

```bash
docker compose up --build -d
```

## Seed Docker MongoDB

The seed service uses the official `mongo:7` image and runs `mongosh` against
the Docker Mongo service.

Run this once after MongoDB is started:

```bash
docker compose run --rm seed
```

This imports/upserts the existing seed data from:

```text
server/seed/zepter-careers-seed.mongosh.js
```

The seed script inserts/updates the local test admin user, companies, regions,
jobs and job translations in the Docker MongoDB database at:

```text
mongodb://mongo:27017/zepter-careers
```

Seeded data persists because MongoDB uses the `mongo_data` named volume.

Local Docker/test admin credentials:

```text
URL: http://localhost:8080/secure-zc-panel-8f4k/login
Email: admin@local
Password: admin123!
```

These credentials are only for local Docker/testing. Do not use them in
production.

If you already ran an older incomplete seed, the script now uses upsert for the
missing referenced companies and regions, so this is usually enough:

```bash
docker compose run --rm seed
```

For a full local development reset only, you can delete all Docker volumes and
seed from scratch:

```bash
docker compose down -v
docker compose up --build
docker compose run --rm seed
```

This reset deletes MongoDB data and uploaded CV files. Do not use it in
production.

## Stop Containers

```bash
docker compose down
```

This stops and removes the containers, but keeps Docker named volumes.

## Dangerous Command

```bash
docker compose down -v
```

Do not use this in production unless you intentionally want to delete persistent data.
This deletes named volumes, including MongoDB data and uploaded candidate files.

## Local URLs

- Frontend: `http://localhost:8080`
- Backend API: `http://localhost:5000`
- MongoDB: `localhost:27017`

On a server, replace `localhost` with the server IP or domain:

- Frontend: `http://SERVER_IP:8080`
- Backend API: `http://SERVER_IP:5000`

## Docker Networking

This project intentionally uses Docker Compose default networking. It does not
use fixed container IP addresses.

Docker Compose creates a project network automatically, and services communicate
inside that network by service name. The backend connects to MongoDB through:

```text
mongodb://mongo:27017/zepter-careers
```

`mongo` is the Compose service name, so no container IP is needed.

External access should use the host/server IP plus the published port:

- Frontend: `http://SERVER_IP:8080`
- Backend API: `http://SERVER_IP:5000`

Do not access containers directly by Docker-internal IPs such as `172.x.x.x`.

The previously attempted custom subnet `172.17.0.0/24` was removed because it
can conflict with Docker's existing bridge networks and cause this error:

```text
Pool overlaps with other one on this address space
```

Use Docker Compose default networking unless the system administrator explicitly
provides a free custom subnet.

The frontend Docker image is built with:

```text
VITE_API_BASE_URL=http://localhost:5000/api
VITE_ADMIN_LOGIN_PATH=/secure-zc-panel-8f4k/login
```

You can override it when building through Compose:

```bash
VITE_API_BASE_URL=https://your-api.example.com/api VITE_ADMIN_LOGIN_PATH=/your-hidden-login docker compose up --build
```

On Windows PowerShell:

```powershell
$env:VITE_API_BASE_URL="https://your-api.example.com/api"
$env:VITE_ADMIN_LOGIN_PATH="/your-hidden-login"
docker compose up --build
```

For local Docker testing, open the hidden admin login route at:

```text
http://localhost:8080/secure-zc-panel-8f4k/login
```

The old `/admin/login` route is intentionally not the admin login page.

## Persistent Data

MongoDB data is stored in the named Docker volume:

```text
mongo_data
```

Backend uploaded files, including candidate CVs and extra documents, are stored in:

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

The backend serves those files through Express static hosting.

## What Happens After A Candidate Uploads A CV

1. The MongoDB application/candidate record is stored in `mongo_data`.
2. The uploaded CV file is stored in `backend_uploads`.
3. Both survive container restart.
4. Both survive image rebuild.

For example:

```bash
docker compose down
docker compose up
```

The database records and uploaded files remain available.

Seeded jobs and translations also remain available after restart/rebuild because
they live in `mongo_data`.

## Environment Variables

The backend receives these important Docker Compose defaults:

```text
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb://mongo:27017/zepter-careers
APP_BASE_URL=http://localhost:8080
MAIL_FROM_EMAIL=karijera@zepter.rs
MAIL_FROM_NAME=Zepter Careers
```

For production, set real secrets in the deployment environment or a local `.env` file
used by Docker Compose:

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

Do not bake real secrets into Docker images.

## Files

- `docker-compose.yml` defines `mongo`, `backend`, and `frontend`.
- `server/Dockerfile` builds the backend image.
- `client/Dockerfile` builds and serves the frontend image.
- `client/nginx.conf` makes React Router routes fall back to `index.html`.
- `.dockerignore` files keep dependencies, real `.env` files, build output, and uploads out of images.

## React Router Refresh Support

The nginx config uses:

```nginx
try_files $uri $uri/ /index.html;
```

This prevents nginx 404 responses when refreshing frontend routes such as:

- `/secure-zc-panel-8f4k/login`
- `/admin/dashboard`
- `/jobs/...`
- any other client-side route

## Notes

This setup keeps uploaded documents locally in a Docker volume as a first-phase
production approach. Box.com integration is intentionally not included here.

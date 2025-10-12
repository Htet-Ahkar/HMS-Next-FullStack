### Overview

This project includes a multi-stage `Dockerfile` to build an optimized Next.js production image (App Router). The image builds the app in a builder stage and then copies only the production output into a slim runtime image.

### Quick start (Docker CLI)

Build the image:

```
docker build -t hms-app .
```

Run the container:

```
docker run --rm -p 3000:3000 hms-app
```

The application will be available at http://localhost:3000.

### Using Docker Compose

Start the app (rebuild as needed):

```
docker compose up --build
```

Teardown:

```
docker compose down
```

### Apple Silicon (M1/M2) and cross-platform builds

If you're on Apple Silicon and need an amd64 image for deployment, build for that platform explicitly:

```
docker build --platform=linux/amd64 -t hms-app:amd64 .
```

### Common issues & troubleshooting

- Build fails with "cannot find module" or missing types: ensure all files are copied and `npm run build` completes locally before building the image.
- Port collisions: change host port in `docker run -p HOST_PORT:3000` or `compose.yaml`.
- Large image size: ensure `.dockerignore` excludes dev artifacts like `node_modules` and `.next` (this repo includes a `.dockerignore`).

### Pushing to a registry

Tag and push:

```
docker tag hms-app myregistry.com/myorg/hms-app:latest
docker push myregistry.com/myorg/hms-app:latest
```

If your registry requires a specific platform, build with `--platform` and push that image.

### Notes

- The local `compose.yaml` defines a `server` service exposing port 3000. Modify it to add a database or other services.
- The Dockerfile expects `npm run build` to produce a `.next` folder. If you change the build output or use custom server setups, update the Dockerfile accordingly.

### References

- Docker's Node.js guide: https://docs.docker.com/language/nodejs/

# k8s-demo-app

A tiny Node.js web app packaged in Docker and deployed to Kubernetes, with CI/CD via GitHub Actions + GitHub Container Registry (GHCR).

## What it does
- Serves `Hello Metal World!` at `/` on port 3000.
- Builds and pushes an image to GHCR on every push to `main`.
- (Optional) Deploys automatically to your Kubernetes cluster if you add a `KUBE_CONFIG` secret.

---

## Quick start

1. **Create a new GitHub repo**, then upload this folder.

2. **Enable GHCR permissions**
   - In your repo, go to **Settings → Actions → General → Workflow permissions** and ensure the default is fine (it usually is).
   - No extra token is needed for GHCR with the default `GITHUB_TOKEN`.

3. **Update image reference in manifests (optional)**
   - Manifests already use a placeholder `ghcr.io/YOUR_GITHUB_USERNAME/k8s-demo-app:latest`.
   - Replace `YOUR_GITHUB_USERNAME` with your GitHub username (or org).

4. **Push to `main`**
   - The workflow builds and pushes two tags to GHCR:
     - `latest`
     - `sha-<git-sha>`

5. **Manual deploy (good for practicing kubectl)**
   ```bash
   # create namespace (one-time)
   kubectl apply -f k8s/namespace.yaml

   # deploy/update
   kubectl apply -f k8s/deployment.yaml
   kubectl apply -f k8s/service.yaml
   ```
   If you want to use the exact image built by CI for a commit:
   ```bash
   IMAGE="ghcr.io/<your-username>/k8s-demo-app:sha-$(git rev-parse HEAD)"
   kubectl set image -n metal k8s-demo-app k8s-demo-app=$IMAGE
   ```

6. **Automatic deploy (optional CI/CD)**
   - Add a repo secret **`KUBE_CONFIG`** with the **contents** of your kubeconfig file (base64 not required).
   - Optionally add a secret **`K8S_NAMESPACE`** (defaults to `metal`).
   - On next push to `main`, the pipeline will build + push the image and **deploy** to your cluster.
     The deploy job will set the image to the **commit SHA tag** (immutable).

---

## Local run (without Kubernetes)
```bash
cd app
npm install
npm start
# http://localhost:3000
```

## Files
```
app/
  Dockerfile
  index.js
  package.json
  .dockerignore
k8s/
  namespace.yaml
  deployment.yaml
  service.yaml
.github/workflows/
  ci-cd.yaml
```

## Notes
- Service type is `LoadBalancer` for convenience. On Minikube, use `minikube service k8s-demo-service -n metal`.
- Images are published to: `ghcr.io/<your-username>/k8s-demo-app`.
- Feel free to switch to Helm later; this repo keeps it simple with raw YAML.

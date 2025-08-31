# Docker Setup for Jacko

This document explains the Docker setup and workflows for the Jacko application.

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose installed
- GitHub CLI (gh) for managing secrets
- DockerHub account

### GitHub Secrets Setup

The following secrets are required for the CI/CD pipeline:

| Secret | Description | Example |
|--------|-------------|---------|
| `DOCKER_USERNAME` | Your DockerHub username | `lincolngibson7832` |
| `DOCKER_TOKEN` | DockerHub access token | `dckr_pat_...` |
| `RAILS_MASTER_KEY` | Rails encryption key | `abc123...` |

These have been configured via:
```bash
gh secret set DOCKER_USERNAME --body "lincolngibson7832"
gh secret set DOCKER_TOKEN --body "your-docker-token"
gh secret set RAILS_MASTER_KEY --body "$(cat config/master.key)"
```

## 🐳 Docker Workflows

### 1. Main CI/CD Pipeline (`.github/workflows/ci.yml`)

**Triggers:**
- Push to `main` branch
- Push to `development` branch  
- Pull requests

**Features:**
- Runs full test suite before building
- Builds and pushes Docker images with smart tagging
- Deploys to production (main branch only)
- Advanced caching for faster builds

### 2. Docker-specific Pipeline (`.github/workflows/docker.yml`)

**Triggers:**
- Manual dispatch (workflow_dispatch)
- Push to `main` or `development` with Docker-related changes
- Can be triggered manually with custom tags

**Features:**
- Dedicated Docker build and push
- Security scanning with Trivy
- Image testing and validation
- Detailed build summaries

## 🛠️ Local Development

### Using the Docker Helper Script

A convenient script is provided for local Docker operations:

```bash
# Build image locally
./scripts/docker-helper.sh build dev

# Test the built image
./scripts/docker-helper.sh test dev

# Run image locally on port 3000
./scripts/docker-helper.sh run dev

# Run on custom port
./scripts/docker-helper.sh run dev 8080

# Push to DockerHub
./scripts/docker-helper.sh push dev

# Show image info
./scripts/docker-helper.sh info dev

# Clean up resources
./scripts/docker-helper.sh cleanup

# Show help
./scripts/docker-helper.sh help
```

### Manual Docker Commands

```bash
# Build image
docker build -t lincolngibson7832/jacko:local .

# Run locally
docker run -p 3000:80 \
  -e RAILS_ENV=production \
  -e RAILS_MASTER_KEY=$(cat config/master.key) \
  lincolngibson7832/jacko:local

# Push to registry
docker push lincolngibson7832/jacko:local
```

## 🏗️ Docker Image Details

### Base Image
- **Ruby**: 3.3.8-slim
- **OS**: Debian-based
- **Architecture**: linux/amd64

### Build Stages
1. **Base**: Runtime environment setup
2. **Build**: Install dependencies, build assets
3. **Final**: Production-ready image with non-root user

### Key Features
- **Multi-stage build** for smaller final image
- **Security**: Non-root user (rails:rails)
- **Performance**: Bootsnap precompilation
- **Assets**: Vite-built frontend assets
- **Health checks**: Built-in health endpoint

### Environment Variables
- `RAILS_ENV=production`
- `RAILS_MASTER_KEY` (required)
- `BUNDLE_DEPLOYMENT=1`
- `BUNDLE_WITHOUT=development`

## 🔄 CI/CD Flow

### Development Workflow
1. Create feature branch
2. Make changes
3. Push to GitHub
4. CI runs tests and builds image
5. Create PR to `development`
6. Merge triggers development build

### Production Workflow
1. Merge `development` → `main`
2. CI builds and tags production image
3. Automatic deployment via Kamal

### Image Tagging Strategy
- `latest`: Latest main branch build
- `development`: Latest development branch build
- `{branch}-{sha}`: Branch-specific builds
- `buildcache`: Build cache optimization

## 🔒 Security

### Image Scanning
- **Trivy**: Vulnerability scanner in CI/CD
- **SARIF**: Results uploaded to GitHub Security tab
- **Base image**: Regularly updated slim images

### Security Best Practices
- Non-root container user
- Minimal base image (slim)
- No secrets in image layers
- Build-time secret handling

## 📊 Monitoring & Debugging

### Health Checks
```bash
# Check if container is healthy
curl http://localhost:3000/up

# View container logs
docker logs <container-id>

# Execute into running container
docker exec -it <container-id> bash
```

### Performance Monitoring
- Image sizes tracked in CI
- Build time optimization
- Cache hit rates monitored

## 🚨 Troubleshooting

### Common Issues

**Build Failures:**
- Check Docker daemon is running
- Verify all secrets are set
- Check Dockerfile syntax

**Push Failures:**
- Verify DockerHub login: `docker login`
- Check DOCKER_TOKEN is valid
- Ensure repository exists

**Runtime Issues:**
- Verify RAILS_MASTER_KEY is correct
- Check port mappings
- Review container logs

### Debug Commands
```bash
# Build without cache
docker build --no-cache -t jacko:debug .

# Run with debug output
docker run --rm -e RAILS_LOG_LEVEL=debug jacko:debug

# Inspect image layers
docker history lincolngibson7832/jacko:latest

# Check image vulnerabilities locally
docker run --rm -v $(pwd):/src aquasec/trivy fs /src
```

## 📚 Additional Resources

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [GitHub Actions Docker](https://docs.github.com/en/actions/publishing-packages/publishing-docker-images)
- [Kamal Deployment](https://kamal-deploy.org/)
- [Rails Docker Guide](https://guides.rubyonrails.org/getting_started_with_devcontainer.html)

## 🔗 Related Files

- `Dockerfile` - Main Docker image definition
- `config/deploy.yml` - Kamal deployment configuration
- `.github/workflows/ci.yml` - Main CI/CD pipeline
- `.github/workflows/docker.yml` - Docker-specific workflow
- `scripts/docker-helper.sh` - Local Docker helper script

# Deployment and CI/CD Guide

This guide covers the deployment and CI/CD setup for the Jacko Rails 8.0 application.

## Overview

The application uses:
- **RuboCop** for code linting and style enforcement
- **GitHub Actions** for automated CI/CD pipeline
- **Docker** for containerization
- **Kamal** for deployment orchestration
- **PostgreSQL** as the production database

## CI/CD Pipeline

The CI/CD pipeline is defined in `.github/workflows/ci.yml` and includes:

### 1. Test Stage
- Sets up PostgreSQL database
- Runs Rails test suite
- Ensures all tests pass before proceeding

### 2. Security Scan (Brakeman)
- Scans for common Rails security vulnerabilities
- Uses static analysis to identify potential issues

### 3. Code Linting (RuboCop)
- Enforces consistent Ruby code style
- Uses rubocop-rails-omakase as base configuration
- Custom rules defined in `.rubocop.yml`

### 4. Build and Push (Main branch only)
- Builds production Docker image
- Pushes to Docker registry
- Uses build caching for efficiency

### 5. Deploy (Main branch only)
- Deploys using Kamal to production servers
- Only runs after all previous stages pass

## Required GitHub Secrets

Set up the following secrets in your GitHub repository:

```bash
DOCKER_USERNAME          # Docker Hub username
DOCKER_TOKEN             # Docker Hub access token
RAILS_MASTER_KEY         # Rails master key for credentials
DEPLOY_SSH_KEY           # SSH private key for deployment servers
DEPLOY_KNOWN_HOSTS       # Known hosts for deployment servers
```

## Local Development with Docker

### Setup
```bash
# Run initial setup
./bin/setup-dev

# Start development server
docker-compose up app

# Run in background
docker-compose up -d app
```

### Common Commands
```bash
# Run tests
docker-compose run --rm test bin/rails test

# Run RuboCop
docker-compose run --rm app bundle exec rubocop

# Auto-fix RuboCop issues
docker-compose run --rm app bundle exec rubocop -A

# Rails console
docker-compose run --rm app bin/rails console

# Database migrations
docker-compose run --rm app bin/rails db:migrate

# Stop all services
docker-compose down

# Rebuild containers
docker-compose build
```

## Production Deployment

### Prerequisites
1. Set up production server(s)
2. Configure environment variables
3. Set up Docker registry access
4. Configure DNS and SSL (if using proxy)

### Environment Variables
Set these on your production servers or in Kamal secrets:

```bash
RAILS_MASTER_KEY         # Rails master key
DATABASE_URL             # PostgreSQL connection string
KAMAL_REGISTRY_PASSWORD  # Docker registry password
```

### Deployment Commands
```bash
# Initial deployment setup
bin/kamal setup

# Deploy application
bin/kamal deploy

# View deployment logs
bin/kamal logs

# Access production console
bin/kamal console

# Remote shell access
bin/kamal shell
```

### Kamal Configuration

Update `config/deploy.yml` with your production settings:

1. **Servers**: Update the IP addresses for your production servers
2. **Registry**: Configure your Docker registry credentials
3. **Domain**: Set your production domain for SSL
4. **Environment**: Configure production environment variables

Example production configuration:
```yaml
# config/deploy.yml
servers:
  web:
    - your-production-server-ip

registry:
  username: your-docker-username

proxy:
  ssl: true
  host: your-domain.com
```

## RuboCop Configuration

The application uses a comprehensive RuboCop configuration:

### Base Configuration
- Inherits from `rubocop-rails-omakase`
- Includes `rubocop-rails` and `rubocop-rspec`

### Key Rules
- **Line Length**: 120 characters
- **Method Length**: 15 lines maximum
- **Documentation**: Disabled for faster development
- **String Literals**: Enforces double quotes
- **Frozen String Literals**: Required

### Running RuboCop
```bash
# Local development
bundle exec rubocop

# Auto-fix issues
bundle exec rubocop -A

# Docker environment
docker-compose run --rm app bundle exec rubocop
```

## Security Considerations

### Brakeman Security Scanning
- Runs automatically in CI/CD pipeline
- Scans for common Rails vulnerabilities
- Fails the build if critical issues are found

### Docker Security
- Production images run as non-root user
- Multi-stage builds minimize attack surface
- Secrets managed via environment variables

### SSL/TLS
- Automatic SSL certificates via Let's Encrypt
- Configured in Kamal proxy settings
- Enforces HTTPS in production

## Monitoring and Logging

### Health Checks
- Configured at `/up` endpoint
- Used by Kamal for deployment verification
- Monitors application and database connectivity

### Logging
- Rails logs available via `bin/kamal logs`
- Structured logging in production
- Log rotation configured automatically

## Troubleshooting

### Common Issues

**CI/CD Pipeline Fails**
- Check GitHub Actions logs
- Verify all required secrets are set
- Ensure tests pass locally

**Deployment Fails**
- Verify server connectivity: `bin/kamal audit`
- Check Docker registry credentials
- Review Kamal logs: `bin/kamal logs`

**RuboCop Failures**
- Run locally: `bundle exec rubocop`
- Auto-fix: `bundle exec rubocop -A`
- Check `.rubocop.yml` for custom rules

**Docker Build Issues**
- Clear build cache: `docker-compose build --no-cache`
- Check `.dockerignore` for excluded files
- Verify base image availability

### Getting Help
- Check the Rails 8.0 documentation
- Review Kamal deployment guide
- Consult RuboCop configuration docs
- Check GitHub Actions documentation

## Best Practices

1. **Always run tests locally** before pushing
2. **Use feature branches** and pull requests
3. **Keep dependencies updated** via Dependabot
4. **Monitor security** with Brakeman scans
5. **Follow code style** enforced by RuboCop
6. **Use semantic versioning** for releases
7. **Test deployments** in staging first
8. **Monitor application** health and performance

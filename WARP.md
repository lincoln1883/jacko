# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a Ruby on Rails 8.0 application named "Jacko" that uses:
- PostgreSQL as the database
- Kamal for deployment
- Solid Queue for background job processing
- Solid Cache and Solid Cable for modern Rails features
- Docker containerization

## Development Commands

### Setup
```bash
# Install dependencies
bundle install

# Setup database
bin/rails db:create
bin/rails db:migrate
bin/rails db:seed

# Generate credentials
bin/rails credentials:edit
```

### Development Server
```bash
# Start the development server
bin/rails server
# or
bin/rails s

# Access at http://localhost:3000
```

### Database Operations
```bash
# Create migration
bin/rails generate migration CreateModelName field:type

# Run migrations
bin/rails db:migrate

# Rollback migration
bin/rails db:rollback

# Reset database
bin/rails db:reset

# Database console
bin/rails dbconsole
```

### Code Quality
```bash
# Run RuboCop linter
bundle exec rubocop

# Auto-fix RuboCop issues
bundle exec rubocop -A

# Security scan
bundle exec brakeman
```

### Rails Console
```bash
# Development console
bin/rails console
# or
bin/rails c

# Production console (via Kamal)
bin/kamal console
```

### Generators
```bash
# Generate controller
bin/rails generate controller ControllerName action1 action2

# Generate model
bin/rails generate model ModelName field:type

# Generate scaffold
bin/rails generate scaffold ModelName field:type
```

### Background Jobs (Solid Queue)
```bash
# Check job queue status
bin/rails solid_queue:info

# Clear failed jobs
bin/rails solid_queue:clear_all
```

### Deployment (Kamal)
```bash
# Deploy application
bin/kamal deploy

# Setup initial deployment
bin/kamal setup

# View deployment logs
bin/kamal logs
# or
bin/kamal app logs -f

# Remote shell access
bin/kamal shell

# Remote database console
bin/kamal dbc
```

## Architecture

### Application Structure
- **Rails 8.0** application using modern Rails conventions
- **Module name**: `Jacko` (defined in `config/application.rb`)
- **Database**: PostgreSQL with multiple database configuration for production (primary, cache, queue, cable)
- **Background Jobs**: Solid Queue integrated with Puma for job processing
- **Deployment**: Dockerized with Kamal deployment configuration

### Key Configuration Files
- `config/application.rb` - Main application configuration with module `Jacko`
- `config/database.yml` - PostgreSQL configuration with multi-database setup for production
- `config/deploy.yml` - Kamal deployment configuration
- `config/routes.rb` - Currently minimal with health check endpoint
- `.rubocop.yml` - Uses rubocop-rails-omakase for code styling

### Database Design
- Uses PostgreSQL adapter
- Production environment configured with separate databases for:
  - Primary application data
  - Cache storage (Solid Cache)
  - Job queue (Solid Queue) 
  - Cable connections (Solid Cable)
- No custom migrations yet - appears to be a fresh Rails application

### Deployment Architecture
- Containerized with Docker
- Kamal deployment to servers defined in `config/deploy.yml`
- SSL/TLS enabled with Let's Encrypt
- Background job processing runs within Puma process via `SOLID_QUEUE_IN_PUMA=true`
- Persistent storage volume for Active Storage files

### Development Patterns
- Uses Omakase Ruby styling (rubocop-rails-omakase)
- Modern browser requirement with `allow_browser versions: :modern`
- Test framework disabled (`config.generators.system_tests = nil`)
- Auto-loading enabled for `lib` directory (excluding `assets` and `tasks`)

### Security Features
- Brakeman for security vulnerability scanning
- Encrypted credentials with `config/credentials.yml.enc`
- Database password management via environment variables
- Master key for credential decryption

## Important Notes
- This appears to be a fresh Rails 8.0 application with minimal custom code
- No custom routes, controllers, or models have been implemented yet
- Uses latest Rails features like Solid Queue, Solid Cache, and Solid Cable
- Deployment is pre-configured for production use with Kamal

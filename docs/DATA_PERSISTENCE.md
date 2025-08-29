# Data Persistence Guide for Jacko Rails Application

This document explains how data persistence is configured for both development and production environments in the Jacko Rails application.

## Overview

The Jacko application uses different database strategies for different environments:
- **Development**: PostgreSQL via Docker Compose with persistent volumes
- **Production**: SQLite databases stored in persistent Kamal volumes

## Development Environment (PostgreSQL + Docker Compose)

### ✅ Current Setup

Your development environment **already has data persistence configured**:

```yaml
# docker-compose.yml
services:
  db:
    image: postgres:15
    volumes:
      - postgres_data:/var/lib/postgresql/data  # 👈 Data persists here

volumes:
  postgres_data:  # 👈 Named volume for persistence
```

### How It Works

1. **Named Volume**: `postgres_data` volume stores all PostgreSQL data
2. **Container Independence**: Data survives container rebuilds, stops, and starts
3. **Volume Location**: Managed by Docker in `/var/lib/docker/volumes/jacko_postgres_data/`

### Testing Data Persistence

```bash
# 1. Create some test data
docker-compose up -d
bin/rails db:create db:migrate
bin/rails c
# > User.create(name: "Test User")

# 2. Rebuild containers
docker-compose down
docker-compose up --build

# 3. Data should still be there!
bin/rails c
# > User.all  # Should show your test data
```

### Manual Backup & Restore

Use the provided PostgreSQL scripts:

```bash
# Create backup
./bin/db_backup [backup_name]

# Restore backup
./bin/db_restore <backup_file>

# List available backups
ls -la backups/db/
```

## Production Environment (SQLite + Kamal)

### ✅ Current Setup

Your production environment uses SQLite with Kamal persistent volumes:

```yaml
# config/deploy.yml
volumes:
  - "jacko_storage:/rails/storage"  # 👈 SQLite files persist here
```

```yaml
# config/database.yml (production)
production:
  primary:
    adapter: sqlite3
    database: storage/production.sqlite3      # 👈 Stored in persistent volume
  cache:
    database: storage/production_cache.sqlite3   # 👈 Cache database
  queue:
    database: storage/production_queue.sqlite3   # 👈 Job queue database
  cable:
    database: storage/production_cable.sqlite3   # 👈 ActionCable database
```

### How It Works

1. **Kamal Volume**: `jacko_storage:/rails/storage` persists across deployments
2. **Multi-Database**: Rails 8.0 uses separate SQLite files for different purposes
3. **Container Independence**: Data survives container rebuilds and deployments

### SQLite Backup & Restore

Use the provided SQLite scripts:

```bash
# Production backup
./bin/sqlite_backup production [backup_name]

# Development backup (if you have SQLite locally)
./bin/sqlite_backup development [backup_name]

# Restore production
./bin/sqlite_restore <backup_file> production

# Restore development
./bin/sqlite_restore <backup_file> development

# List available backups
ls -la backups/sqlite/
```

## Best Practices

### 1. Regular Backups

Create automated backups before deployments:

```bash
# Before deploying
./bin/sqlite_backup production "pre_deploy_$(date +%Y%m%d)"
bin/kamal deploy
```

### 2. Volume Monitoring

Monitor your Docker volumes:

```bash
# Development volumes
docker volume ls | grep jacko
docker volume inspect jacko_postgres_data

# Production volume (via Kamal)
bin/kamal shell "df -h /rails/storage"
```

### 3. Backup Strategy

- **Development**: Regular PostgreSQL dumps before major changes
- **Production**: SQLite backups before deployments and weekly scheduled backups
- **Retention**: Keep at least 7 days of backups

### 4. Data Recovery

If you lose data:

1. **Development**: Use `./bin/db_restore` with your latest backup
2. **Production**: Use `./bin/sqlite_restore` with your latest backup
3. **Emergency**: Contact your server provider for volume recovery

## Troubleshooting

### Development Issues

```bash
# Check if volume exists
docker volume ls | grep postgres

# Check container logs
docker-compose logs db

# Reset development data (DESTRUCTIVE!)
docker-compose down -v  # ⚠️ This deletes all data!
docker-compose up -d
bin/rails db:create db:migrate db:seed
```

### Production Issues

```bash
# Check Kamal volume
bin/kamal shell "ls -la /rails/storage/"

# Check SQLite database integrity
bin/kamal shell "sqlite3 /rails/storage/production.sqlite3 'PRAGMA integrity_check;'"

# Access production console
bin/kamal console
```

## File Structure

```
jacko/
├── backups/
│   ├── db/          # PostgreSQL backups (.sql files)
│   └── sqlite/      # SQLite backups (.tar.gz files)
├── bin/
│   ├── db_backup    # PostgreSQL backup script
│   ├── db_restore   # PostgreSQL restore script
│   ├── sqlite_backup   # SQLite backup script
│   └── sqlite_restore  # SQLite restore script
├── config/
│   ├── database.yml    # Database configuration
│   └── deploy.yml      # Kamal deployment configuration
└── storage/            # SQLite databases (production)
```

## Volume Locations

### Development (Docker Compose)
- **PostgreSQL Data**: Docker volume `jacko_postgres_data`
- **Redis Data**: Docker volume `jacko_redis_data`
- **Bundled Gems**: Docker volume `jacko_bundle`
- **Node Modules**: Docker volume `jacko_node_modules`

### Production (Kamal)
- **Application Storage**: Persistent volume `jacko_storage:/rails/storage`
- **Contains**: SQLite databases, uploaded files, cache, etc.

## Security Notes

- SQLite databases contain sensitive data - ensure proper server security
- Backup files should be encrypted for long-term storage
- Limit access to production backup files
- Regular security audits of persistent volumes

## Performance Considerations

- SQLite performs well for single-server deployments
- For high-traffic applications, consider migrating to PostgreSQL in production
- Monitor storage volume disk space and I/O performance
- Regular VACUUM operations for SQLite databases to maintain performance

---

**Need help?** Run any of the backup scripts with no arguments to see usage information.

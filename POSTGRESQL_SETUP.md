# PostgreSQL Production Setup (Alternative Option)

If you prefer to use PostgreSQL in production instead of SQLite, here's how to set it up:

## Option A: Add PostgreSQL as a Kamal Accessory

Add this to your `config/deploy.yml`:

```yaml
accessories:
  db:
    image: postgres:15-alpine
    host: <%= ENV['DEPLOY_SERVER'] || '192.168.0.1' %>
    port: "127.0.0.1:5432:5432"
    env:
      clear:
        POSTGRES_DB: jacko_production
        POSTGRES_USER: jacko
      secret:
        - POSTGRES_PASSWORD
    directories:
      - /var/lib/postgresql/data:/var/lib/postgresql/data
```

## Option B: Use External PostgreSQL Service

If using an external PostgreSQL service (like AWS RDS, Google Cloud SQL, etc.):

1. Update `config/database.yml` production section:
```yaml
production:
  primary: &primary_production
    adapter: postgresql
    encoding: unicode
    database: <%= ENV['DATABASE_NAME'] || 'jacko_production' %>
    username: <%= ENV['DATABASE_USERNAME'] %>
    password: <%= ENV['DATABASE_PASSWORD'] %>
    host: <%= ENV['DATABASE_HOST'] %>
    port: <%= ENV['DATABASE_PORT'] || 5432 %>
    pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
  # ... rest of cache, queue, cable configs
```

2. Add environment variables to `config/deploy.yml`:
```yaml
env:
  secret:
    - RAILS_MASTER_KEY
    - DATABASE_PASSWORD
    - POSTGRES_PASSWORD  # If using Kamal accessory
  clear:
    DATABASE_NAME: jacko_production
    DATABASE_USERNAME: jacko
    DATABASE_HOST: your-db-host.com  # Or jacko-db for local accessory
    DATABASE_PORT: 5432
```

3. Create `.kamal/secrets` file with:
```
RAILS_MASTER_KEY=your_master_key
DATABASE_PASSWORD=your_database_password
POSTGRES_PASSWORD=your_postgres_password  # If using Kamal accessory
```

## Benefits of PostgreSQL vs SQLite in Production:

**PostgreSQL:**
- Better for multiple concurrent users
- More advanced features (JSON, full-text search, etc.)
- Better backup and replication options
- Can handle larger datasets

**SQLite (Current Setup):**
- Simpler deployment
- No separate database server needed
- Perfect for single-server deployments
- Lower resource usage
- Zero configuration

# 🇯🇲 Jamaica Skills & Trades Platform (Jacko)

> **Connecting Jamaica's skilled tradespeople with clients through a trusted, modern digital marketplace.**

Jacko is Jamaica's premier digital platform for skilled trades, bridging the gap between traditional apprenticeship systems and modern construction demands while supporting both experienced craftsmen and newly graduated technicians.

## 🌟 Vision

To democratize access to skilled trades opportunities across Jamaica by providing a trusted, data-driven platform that validates expertise, facilitates connections, and elevates the professional standards of the construction and trades industry.

## 🚀 Features

### MVP (Current Phase)
- **👥 User Profiles**: Comprehensive profiles for tradespeople and clients
- **🔍 Search & Discovery**: Location and skill-based search with advanced filtering
- **✅ Verification System**: Identity and credential verification for trust
- **💬 Communication**: Secure in-platform messaging and project inquiries
- **⭐ Reviews & Ratings**: Transparent feedback system for quality assurance

### Planned Features
- **💳 Payment Processing**: Secure payment handling with escrow services
- **📊 Analytics Dashboard**: Earnings tracking and market insights
- **🎓 Training Integration**: HEART/NSTA certification programs
- **🤖 AI Matching**: Smart project-tradesperson matching algorithms

## 🛠 Technology Stack

### Backend
- **Ruby on Rails 8.0** - Full-stack framework with modern features
- **PostgreSQL 15+** - Primary database with full-text search
- **Redis** - Caching and session management
- **Solid Queue** - Background job processing
- **Solid Cache** - Performance optimization
- **Action Cable** - Real-time features

### Frontend
- **Inertia.js** - Modern SPA-like experience
- **React 18** - Component-based UI
- **TypeScript** - Type safety and better DX
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - High-quality component library

### Development & Deployment
- **Docker** - Containerization for development and production
- **Kamal** - Deployment and server management
- **RSpec** - Testing framework
- **ESLint & Prettier** - Code linting and formatting

## 📋 Prerequisites

- **Ruby** 3.3.8+
- **Node.js** 18+
- **PostgreSQL** 15+
- **Redis** 7+
- **Docker & Docker Compose** (for containerized development)

## 🚀 Quick Start

### Using Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/yourusername/jacko.git
cd jacko

# Start development environment
docker-compose up -d

# Setup database
docker-compose exec app bin/rails db:create db:migrate db:seed

# Access the application
open http://localhost:3000
```

### Local Development

```bash
# Install dependencies
bundle install
npm install

# Setup database
bin/rails db:create db:migrate db:seed

# Start development servers
bin/dev  # Runs Rails server + Vite dev server
```

## 🧪 Testing

```bash
# Run all tests
bundle exec rspec

# Run frontend tests
npm run test

# Run linting
bundle exec rubocop
npm run lint

# Run security scan
bundle exec brakeman
```

## 📊 Development Workflow

### Git Workflow
1. Create feature branch: `git checkout -b feature/your-feature-name`
2. Make changes and commit: `git commit -m "feat: add user profile component"`
3. Push branch: `git push origin feature/your-feature-name`
4. Create Pull Request using the provided template
5. Code review and merge to `main`

### Commit Convention
We follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` new features
- `fix:` bug fixes
- `docs:` documentation changes
- `style:` formatting, missing semi colons, etc.
- `refactor:` code changes that neither fix bugs nor add features
- `test:` adding or updating tests
- `chore:` maintenance tasks

## 🗂 Project Structure

```
jacko/
├── app/
│   ├── controllers/          # Rails controllers
│   ├── models/              # ActiveRecord models
│   ├── views/               # Rails views (Inertia pages)
│   └── javascript/          # React components and TypeScript
├── config/
│   ├── database.yml         # Database configuration
│   └── deploy.yml           # Kamal deployment config
├── db/
│   ├── migrate/             # Database migrations
│   └── seeds.rb             # Development data
├── spec/                    # RSpec tests
├── docs/                    # Project documentation
├── project-overview.md      # Complete PRD
└── docker-compose.yml       # Development environment
```

## 🌐 Deployment

### Staging/Production with Kamal

```bash
# Setup deployment
bin/kamal setup

# Deploy application
bin/kamal deploy

# View logs
bin/kamal logs

# Access production console
bin/kamal console
```

## 🔒 Environment Variables

Copy `.env.example` to `.env.local` and configure:

```env
# Database
DATABASE_URL=postgres://user:pass@localhost:5432/jacko_development

# Rails
RAILS_MASTER_KEY=your_master_key
SECRET_KEY_BASE=your_secret_key

# External Services
STRIPE_SECRET_KEY=sk_test_...
GOOGLE_MAPS_API_KEY=your_key
```

## 📈 Development Phases

### Phase 1: MVP (Months 1-4) ✅ In Progress
- [x] Project setup and basic infrastructure
- [ ] User registration and authentication
- [ ] Basic profile creation for tradespeople
- [ ] Simple search and discovery
- [ ] Basic messaging system

### Phase 2: Enhanced Features (Months 5-8)
- [ ] Advanced search and filtering
- [ ] Verification system implementation
- [ ] Review and rating system
- [ ] Mobile optimization

### Phase 3: Scale & Optimize (Months 9-12)
- [ ] Payment processing integration
- [ ] Analytics and insights dashboard
- [ ] AI-powered matching
- [ ] Geographic expansion

## 🤝 Contributing

1. Read our [Contributing Guidelines](docs/CONTRIBUTING.md)
2. Check the [Project Overview](project-overview.md) for detailed requirements
3. Look at open [Issues](https://github.com/yourusername/jacko/issues)
4. Follow our coding standards and submit PRs

## 📋 Scripts

### Database Management
```bash
# PostgreSQL backup (development)
./bin/db_backup

# Restore PostgreSQL backup
./bin/db_restore backup_file.sql

# SQLite backup (production)
./bin/sqlite_backup production
```

### Development Helpers
```bash
# Setup development environment
bin/setup

# Run development servers
bin/dev

# Run console
bin/rails console

# Run tests with coverage
bin/test
```

## 📚 Documentation

- **[Project Overview](project-overview.md)** - Complete PRD with all requirements
- **[Data Persistence Guide](docs/DATA_PERSISTENCE.md)** - Database backup and persistence
- **[API Documentation](docs/API.md)** - API endpoints and integration
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment instructions

## 🎯 Success Metrics

### Year 1 Targets
- **10,000+** verified tradesperson profiles
- **1,000+** successful project matches
- **85%+** client satisfaction rate
- **70%+** repeat usage rate

## 🔗 Links

- **Production**: [Coming Soon]
- **Staging**: [Coming Soon]
- **Design System**: [Coming Soon]
- **API Docs**: [Coming Soon]

## 📄 License

This project is proprietary software. All rights reserved.

## 📞 Support

For support and questions:
- Create an [Issue](https://github.com/yourusername/jacko/issues)
- Email: dev@jacko-platform.com
- Slack: [Development Channel]

---

**Made with ❤️ for Jamaica's skilled trades community**

# Git Workflow & Development Guidelines

This document outlines our Git workflow, branching strategy, and development practices for the Jamaica Skills & Trades Platform.

## 🌳 Branching Strategy

We follow a **Git Flow** inspired branching model optimized for continuous deployment:

### Branch Types

#### 1. `main` Branch
- **Purpose**: Production-ready code
- **Protection**: Protected branch, requires PR reviews
- **Deployment**: Auto-deploys to production
- **Rules**: Only accepts merges from `develop` or `hotfix/*` branches

#### 2. `develop` Branch  
- **Purpose**: Integration branch for features
- **Protection**: Protected branch, requires PR reviews
- **Deployment**: Auto-deploys to staging environment
- **Rules**: Only accepts merges from `feature/*` branches

#### 3. Feature Branches (`feature/*`)
- **Purpose**: Individual feature development
- **Naming**: `feature/issue-number-short-description`
- **Examples**: 
  - `feature/123-user-profile-creation`
  - `feature/456-search-and-filtering`
- **Source**: Branch from `develop`
- **Destination**: Merge back to `develop`

#### 4. Hotfix Branches (`hotfix/*`)
- **Purpose**: Critical production fixes
- **Naming**: `hotfix/issue-number-description`
- **Examples**: `hotfix/789-login-security-fix`
- **Source**: Branch from `main`
- **Destination**: Merge to both `main` and `develop`

#### 5. Release Branches (`release/*`)
- **Purpose**: Prepare releases and final testing
- **Naming**: `release/version-number`
- **Examples**: `release/v1.2.0`
- **Source**: Branch from `develop`
- **Destination**: Merge to both `main` and `develop`

## 📝 Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types
- **feat**: New features
- **fix**: Bug fixes
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks
- **perf**: Performance improvements
- **ci**: CI/CD changes

### Examples
```bash
feat(auth): add user profile creation form

Add comprehensive profile creation form with validation for 
tradespeople including skills selection and portfolio upload.

Closes #123

fix(search): resolve location-based filtering bug

The parish filter was not properly filtering results when 
combined with skill-based search.

Fixes #456

docs: update README with deployment instructions

test(user): add integration tests for profile workflow
```

### Scope Guidelines
- `auth`: Authentication and authorization
- `profile`: User profile management
- `search`: Search and filtering functionality  
- `messaging`: Communication features
- `payment`: Payment processing
- `admin`: Admin panel features
- `api`: API changes
- `ui`: UI/UX changes

## 🔄 Development Workflow

### Starting a New Feature

1. **Sync with develop**
   ```bash
   git checkout develop
   git pull origin develop
   ```

2. **Create feature branch**
   ```bash
   git checkout -b feature/123-user-profile-creation
   ```

3. **Work on feature**
   ```bash
   # Make changes
   git add .
   git commit -m "feat(profile): add basic profile form structure"
   ```

4. **Keep branch updated**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout feature/123-user-profile-creation
   git rebase develop
   ```

5. **Push branch**
   ```bash
   git push origin feature/123-user-profile-creation
   ```

6. **Create Pull Request** using GitHub PR template

### Code Review Process

#### Pull Request Requirements
- [ ] Feature branch is up to date with `develop`
- [ ] All tests are passing
- [ ] Code follows project style guidelines
- [ ] Documentation is updated
- [ ] No merge conflicts
- [ ] Proper commit messages
- [ ] Related issue is linked

#### Review Criteria
- **Code Quality**: Readable, maintainable, follows conventions
- **Testing**: Adequate test coverage for new functionality
- **Security**: No security vulnerabilities introduced
- **Performance**: No unnecessary performance regressions
- **Documentation**: Code is properly documented

#### Approval Process
- Requires **1 approval** for feature branches
- Requires **2 approvals** for releases to main
- All CI checks must pass
- No merge conflicts allowed

## 🚀 Release Process

### 1. Create Release Branch
```bash
git checkout develop
git pull origin develop
git checkout -b release/v1.2.0
```

### 2. Version Bump
```bash
# Update version in relevant files
# package.json, VERSION, etc.
git commit -m "chore: bump version to v1.2.0"
```

### 3. Final Testing
- Run full test suite
- Manual QA testing
- Performance testing
- Security scan

### 4. Create Release PR
- PR from `release/v1.2.0` to `main`
- Include changelog
- Tag reviewers

### 5. Deploy to Production
```bash
# After PR approval and merge
git checkout main
git pull origin main
git tag v1.2.0
git push origin v1.2.0
```

### 6. Merge Back to Develop
```bash
git checkout develop
git merge main
git push origin develop
```

## 🔧 Git Configuration

### Recommended Git Config
```bash
# User setup
git config user.name "Your Name"
git config user.email "your.email@company.com"

# Helpful aliases
git config alias.co checkout
git config alias.br branch
git config alias.ci commit
git config alias.st status
git config alias.unstage 'reset HEAD --'
git config alias.last 'log -1 HEAD'
git config alias.visual '!gitk'

# Better diffs
git config diff.tool vscode
git config merge.tool vscode

# Auto-setup remote tracking
git config push.autoSetupRemote true

# Rebase by default on pull
git config pull.rebase true
```

### Git Hooks

We use pre-commit hooks to ensure code quality:

```bash
# Install pre-commit hook
#!/bin/sh
# .git/hooks/pre-commit

echo "Running pre-commit checks..."

# Run linting
echo "🔍 Running RuboCop..."
bundle exec rubocop --fail-level error

# Run tests
echo "🧪 Running tests..."
bundle exec rspec

# Check for TODO/FIXME
echo "📝 Checking for TODO/FIXME..."
git diff --cached | grep -E "TODO|FIXME" && {
  echo "❌ Found TODO/FIXME in staged changes"
  exit 1
}

echo "✅ All checks passed!"
```

## 🤝 Code Review Guidelines

### As a Reviewer
- **Be constructive**: Offer solutions, not just criticism
- **Be specific**: Point out exact files and lines
- **Be timely**: Review within 24 hours
- **Check everything**: Logic, style, tests, documentation
- **Ask questions**: If something is unclear, ask for clarification

### As an Author
- **Self-review**: Review your own PR before requesting review
- **Small PRs**: Keep changes focused and reviewable
- **Clear description**: Explain what and why
- **Respond promptly**: Address feedback quickly
- **Test thoroughly**: Ensure all edge cases are covered

### Review Checklist
- [ ] Code follows project conventions
- [ ] Tests cover new functionality
- [ ] No obvious security issues
- [ ] Performance considerations addressed
- [ ] Documentation updated
- [ ] Backward compatibility maintained
- [ ] Error handling is appropriate

## 🚨 Emergency Procedures

### Hotfix Process
1. **Create hotfix branch from main**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b hotfix/critical-security-fix
   ```

2. **Make minimal fix**
   ```bash
   git commit -m "fix(security): patch authentication vulnerability"
   ```

3. **Test thoroughly**
   ```bash
   bundle exec rspec
   ```

4. **Create emergency PR to main**
   - Fast-track review process
   - Deploy immediately after merge

5. **Merge back to develop**
   ```bash
   git checkout develop
   git merge hotfix/critical-security-fix
   ```

### Rollback Procedures
```bash
# Revert last commit
git revert HEAD

# Revert specific commit
git revert <commit-hash>

# Emergency rollback
git checkout main
git reset --hard <previous-good-commit>
git push --force-with-lease origin main
```

## 📊 Metrics & Monitoring

### Git Metrics to Track
- Average PR size (lines changed)
- Time from PR creation to merge
- Number of commits per PR
- Review turnaround time
- Hotfix frequency
- Test coverage changes

### Tools Integration
- **GitHub Actions**: CI/CD pipeline
- **CodeClimate**: Code quality analysis  
- **Dependabot**: Dependency updates
- **Sentry**: Error monitoring integration

## 🎯 Best Practices

### Commit Messages
- Use imperative mood: "Add feature" not "Added feature"
- Keep first line under 50 characters
- Reference issues: "Closes #123"
- Explain the "why" in the body

### Branch Management
- Delete merged branches regularly
- Keep branch names descriptive
- Avoid long-running feature branches
- Rebase feature branches regularly

### Code Quality
- Write tests before pushing
- Run linters locally
- Keep functions small and focused
- Document complex logic

### Security
- Never commit secrets
- Use environment variables
- Review dependencies regularly
- Sign commits for critical changes

---

## 📚 Additional Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Code Review Best Practices](https://github.com/thoughtbot/guides/tree/main/code-review)

**Questions?** Ask in the development channel or create an issue!

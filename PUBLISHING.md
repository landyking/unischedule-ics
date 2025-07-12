# Publishing Guide for unischedule-ics

This guide covers how to publish new versions of the unischedule-ics package to npm using GitHub Actions.

## Prerequisites

Before you can publish, make sure you have:

1. **npm account**: Create an account at [npmjs.com](https://www.npmjs.com) if you don't have one
2. **npm access token**: Generate an automation token for CI/CD
3. **GitHub repository secrets**: Add your npm token to repository secrets

## Initial Setup

### 1. Create npm Access Token

1. Go to [npmjs.com](https://www.npmjs.com) and log in
2. Click on your profile → "Access Tokens"
3. Click "Generate New Token" → "Automation" (for CI/CD)
4. Copy the generated token (you won't see it again!)

### 2. Add Token to GitHub Repository Secrets

1. Go to your GitHub repository: `https://github.com/landyking/unischedule-ics`
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `NPM_TOKEN`
5. Value: Paste your npm access token
6. Click "Add secret"

## Publishing Workflow

The project uses GitHub Actions to automatically publish to npm when you create a GitHub release. Here's the complete workflow:

### Automated Publishing Process

1. **Tests run automatically** on every push to main branch
2. **Publishing happens automatically** when you create a GitHub release
3. **Version management** is handled through npm version commands

### Step-by-Step Publishing

#### 1. Update Version

Use npm's built-in versioning commands:

```bash
# For bug fixes (0.1.0 → 0.1.1)
npm version patch

# For new features (0.1.0 → 0.2.0)
npm version minor

# For breaking changes (0.1.0 → 1.0.0)
npm version major
```

This will:
- Update the version in `package.json`
- Create a git tag
- Run the build process
- Commit and push changes to GitHub

#### 2. Create GitHub Release

1. Go to your repository on GitHub
2. Click "Releases" → "Create a new release"
3. Choose the tag that was just created (e.g., `v0.1.1`)
4. Fill in the release details:
   - **Release title**: Version number (e.g., `v0.1.1`)
   - **Description**: What's new in this version
5. Click "Publish release"

#### 3. Automatic Publishing

Once you publish the release:
- GitHub Actions will automatically trigger
- Tests will run first
- If tests pass, the package will be built and published to npm
- You'll receive notifications about the success/failure

## Version Types

### Patch Version (x.x.X)
- Bug fixes
- Documentation updates
- Minor improvements that don't affect the API

```bash
npm version patch
```

### Minor Version (x.X.x)
- New features
- API additions (backward compatible)
- Significant improvements

```bash
npm version minor
```

### Major Version (X.x.x)
- Breaking changes
- API removals or modifications
- Major refactoring

```bash
npm version major
```

## Release Notes Template

When creating a GitHub release, use this template:

```markdown
## What's Changed

### 🚀 New Features
- Added feature X
- Improved Y functionality

### 🐛 Bug Fixes
- Fixed issue with Z
- Resolved problem in A

### 📚 Documentation
- Updated README
- Added examples

### 🔧 Technical Changes
- Updated dependencies
- Improved build process

**Full Changelog**: https://github.com/landyking/unischedule-ics/compare/v0.1.0...v0.1.1
```

## Manual Publishing (Emergency)

If you need to publish manually for any reason:

```bash
# Make sure you're logged in to npm
npm login

# Build the project
npm run build

# Publish to npm
npm publish
```

## Troubleshooting

### Common Issues

1. **"Package already exists"**
   - Version number wasn't updated
   - Run `npm version patch` first

2. **"Authentication failed"**
   - Check if NPM_TOKEN is correctly set in GitHub secrets
   - Verify the token hasn't expired

3. **"Tests failed"**
   - Check the Actions tab for detailed error logs
   - Fix tests locally and push changes

4. **"Build failed"**
   - TypeScript compilation errors
   - Check `npm run build` locally

### Checking Publication Status

- **npm**: Check https://www.npmjs.com/package/unischedule-ics
- **GitHub Actions**: Check the Actions tab in your repository
- **Local verification**: Run `npm info unischedule-ics` to see published versions

## Best Practices

1. **Always test locally** before publishing
2. **Write meaningful release notes** to help users understand changes
3. **Follow semantic versioning** strictly
4. **Keep the changelog updated** in your releases
5. **Test the package** after publishing by installing it in a separate project

## Monitoring

After publishing:
- Check npm download statistics
- Monitor for issues reported by users
- Keep dependencies updated
- Regularly review and update documentation

## Support

If you encounter issues:
1. Check the GitHub Actions logs
2. Review npm publish documentation
3. Verify your token permissions
4. Check for any npm service status issues

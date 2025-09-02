# GitHub Issues from Drafts

This directory contains tools to convert draft issues (markdown files) into GitHub issues.

## Overview

The repository contains draft issues in the `/issues` directory that need to be converted to actual GitHub issues.

### Current Drafts

1. **kleine-timeline-unter-der-automation.md** - Feature request for adding a timeline under automation for better control

## Usage

### Option 1: Automated Script (Recommended)

Run the Node.js script to process all drafts and generate creation tools:

```bash
node create-issues-from-drafts.js
```

This will:
- Parse all markdown files in the `/issues` directory
- Extract titles, content, labels, and assignees from frontmatter
- Generate a shell script (`create-github-issues.sh`) that uses GitHub CLI
- Create a JSON file (`draft-issues.json`) with structured data

### Option 2: Manual Creation

Use the generated JSON file or shell script to create issues manually:

```bash
# Run the generated script (requires gh CLI authentication)
./create-github-issues.sh

# Or create manually using gh CLI
gh issue create \
  --title "Kleine Timeline unter der Automation zur besseren Kontrolle" \
  --body "$(cat issues/kleine-timeline-unter-der-automation.md | sed '1,3d')"
```

### Option 3: Web Interface

Use the processed content from `draft-issues.json` to create issues through the GitHub web interface.

## Draft Format

Draft issues should be markdown files with optional frontmatter:

```markdown
---
title: Issue Title
labels: bug, enhancement
assignees: username1, username2
---

## Description

Issue content in markdown format...
```

## Generated Files

- `create-github-issues.sh` - Executable script to create all issues
- `draft-issues.json` - Structured JSON data for programmatic use
- `create-issues-from-drafts.js` - The processing script

## Processing Logic

The script:
1. Scans the `/issues` directory for `.md` files
2. Parses frontmatter (YAML between `---` delimiters)
3. Extracts title from frontmatter or filename
4. Processes the markdown content as the issue body
5. Handles labels and assignees from frontmatter
6. Generates creation commands

## Next Steps

After running the script, you can:
1. Execute the generated shell script if you have GitHub CLI access
2. Use the JSON data to create issues programmatically
3. Copy the content to create issues manually through the web interface
4. Integrate with CI/CD workflows for automated issue creation
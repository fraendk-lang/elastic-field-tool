#!/usr/bin/env node

/**
 * Script to process draft issues and create GitHub issues
 * Processes markdown files in the /issues directory and converts them to GitHub issue format
 */

const fs = require('fs');
const path = require('path');

function parseFrontmatter(content) {
    const frontmatterRegex = /^---\s*\n(.*?)\n---\s*\n(.*)/s;
    const match = content.match(frontmatterRegex);
    
    if (!match) {
        return { frontmatter: {}, content: content };
    }
    
    const frontmatterText = match[1];
    const bodyContent = match[2];
    
    const frontmatter = {};
    frontmatterText.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) {
            frontmatter[key.trim()] = valueParts.join(':').trim();
        }
    });
    
    return { frontmatter, content: bodyContent };
}

function processMarkdownFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const { frontmatter, content: body } = parseFrontmatter(content);
    
    const title = frontmatter.title || path.basename(filePath, '.md').replace(/-/g, ' ');
    
    return {
        title,
        body: body.trim(),
        labels: frontmatter.labels ? frontmatter.labels.split(',').map(l => l.trim()) : [],
        assignees: frontmatter.assignees ? frontmatter.assignees.split(',').map(a => a.trim()) : []
    };
}

function generateIssueCreationScript(issues) {
    let script = `#!/bin/bash
# Script to create GitHub issues from drafts
# Run this script to create all issues at once

set -e

echo "Creating GitHub issues from drafts..."
echo "Make sure you have gh CLI installed and authenticated"
echo ""

`;

    issues.forEach((issue, index) => {
        const escapedTitle = issue.title.replace(/"/g, '\\"');
        const escapedBody = issue.body.replace(/"/g, '\\"').replace(/\n/g, '\\n');
        
        script += `echo "Creating issue ${index + 1}: ${escapedTitle}"
gh issue create \\
  --title "${escapedTitle}" \\
  --body "${escapedBody}"`;

        if (issue.labels.length > 0) {
            script += ` \\
  --label "${issue.labels.join(',')}"`;
        }

        if (issue.assignees.length > 0) {
            script += ` \\
  --assignee "${issue.assignees.join(',')}"`;
        }

        script += `\n\n`;
    });

    script += `echo "All issues created successfully!"`;
    return script;
}

function main() {
    const issuesDir = path.join(__dirname, 'issues');
    
    if (!fs.existsSync(issuesDir)) {
        console.error('Issues directory not found:', issuesDir);
        process.exit(1);
    }
    
    const markdownFiles = fs.readdirSync(issuesDir)
        .filter(file => file.endsWith('.md'))
        .map(file => path.join(issuesDir, file));
    
    if (markdownFiles.length === 0) {
        console.log('No markdown files found in issues directory');
        return;
    }
    
    console.log(`Found ${markdownFiles.length} draft issue(s):`);
    
    const issues = [];
    
    markdownFiles.forEach(filePath => {
        const fileName = path.basename(filePath);
        console.log(`- ${fileName}`);
        
        try {
            const issue = processMarkdownFile(filePath);
            issues.push(issue);
            
            console.log(`  Title: ${issue.title}`);
            console.log(`  Body length: ${issue.body.length} characters`);
            if (issue.labels.length > 0) {
                console.log(`  Labels: ${issue.labels.join(', ')}`);
            }
            if (issue.assignees.length > 0) {
                console.log(`  Assignees: ${issue.assignees.join(', ')}`);
            }
            console.log('');
        } catch (error) {
            console.error(`Error processing ${fileName}:`, error.message);
        }
    });
    
    // Generate shell script for creating issues
    const script = generateIssueCreationScript(issues);
    const scriptPath = path.join(__dirname, 'create-github-issues.sh');
    fs.writeFileSync(scriptPath, script);
    fs.chmodSync(scriptPath, '755');
    
    console.log(`Generated issue creation script: ${scriptPath}`);
    console.log('\nTo create the GitHub issues, run:');
    console.log(`  ./create-github-issues.sh`);
    console.log('\nOr create them manually using the information above.');
    
    // Also output JSON format for programmatic use
    const jsonPath = path.join(__dirname, 'draft-issues.json');
    fs.writeFileSync(jsonPath, JSON.stringify(issues, null, 2));
    console.log(`\nDraft issues also saved as JSON: ${jsonPath}`);
}

if (require.main === module) {
    main();
}

module.exports = { parseFrontmatter, processMarkdownFile, generateIssueCreationScript };
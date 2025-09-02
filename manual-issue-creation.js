#!/usr/bin/env node

/**
 * Manual issue creation script using GitHub API
 * Since we can't use direct issue creation APIs, this script outputs 
 * the exact commands and data needed for manual creation
 */

const fs = require('fs');
const path = require('path');

function main() {
    const draftFile = path.join(__dirname, 'draft-issues.json');
    
    if (!fs.existsSync(draftFile)) {
        console.error('Please run create-issues-from-drafts.js first to generate draft-issues.json');
        process.exit(1);
    }
    
    const issues = JSON.parse(fs.readFileSync(draftFile, 'utf8'));
    
    console.log('='.repeat(80));
    console.log('MANUAL ISSUE CREATION GUIDE');
    console.log('='.repeat(80));
    console.log('');
    
    issues.forEach((issue, index) => {
        console.log(`ISSUE ${index + 1}:`);
        console.log('-'.repeat(40));
        console.log(`Title: ${issue.title}`);
        console.log('');
        console.log('Body:');
        console.log(issue.body);
        console.log('');
        
        if (issue.labels.length > 0) {
            console.log(`Labels: ${issue.labels.join(', ')}`);
        }
        
        if (issue.assignees.length > 0) {
            console.log(`Assignees: ${issue.assignees.join(', ')}`);
        }
        
        console.log('');
        console.log('GitHub Web Interface Steps:');
        console.log('1. Go to: https://github.com/fraendk-lang/elastic-field-tool/issues/new');
        console.log('2. Copy the title above into the title field');
        console.log('3. Copy the body above into the description field');
        if (issue.labels.length > 0) {
            console.log('4. Add labels:', issue.labels.join(', '));
        }
        if (issue.assignees.length > 0) {
            console.log('5. Assign to:', issue.assignees.join(', '));
        }
        console.log('6. Click "Submit new issue"');
        console.log('');
        console.log('='.repeat(80));
        console.log('');
    });
    
    console.log('SUMMARY:');
    console.log(`Found ${issues.length} draft issue(s) ready for creation.`);
    console.log('');
    console.log('Alternative methods:');
    console.log('- Use the GitHub CLI script: ./create-github-issues.sh');
    console.log('- Use the GitHub Actions workflow (manual trigger)');
    console.log('- Use the manual steps above');
}

if (require.main === module) {
    main();
}
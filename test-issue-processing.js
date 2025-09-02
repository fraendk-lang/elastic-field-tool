#!/usr/bin/env node

/**
 * Test suite for the draft issues processing system
 */

const fs = require('fs');
const path = require('path');
const { parseFrontmatter, processMarkdownFile, generateIssueCreationScript } = require('./create-issues-from-drafts.js');

function runTests() {
    console.log('Running tests for draft issues processing...\n');
    
    let passed = 0;
    let failed = 0;
    
    function test(name, fn) {
        try {
            fn();
            console.log(`✓ ${name}`);
            passed++;
        } catch (error) {
            console.log(`✗ ${name}: ${error.message}`);
            failed++;
        }
    }
    
    // Test frontmatter parsing
    test('Parse frontmatter with title', () => {
        const content = `---
title: Test Issue
labels: bug, feature
---

This is the body content.`;
        
        const result = parseFrontmatter(content);
        if (result.frontmatter.title !== 'Test Issue') {
            throw new Error('Title not parsed correctly');
        }
        if (result.content.trim() !== 'This is the body content.') {
            throw new Error('Body content not parsed correctly');
        }
    });
    
    test('Parse content without frontmatter', () => {
        const content = 'This is just body content without frontmatter.';
        const result = parseFrontmatter(content);
        if (Object.keys(result.frontmatter).length !== 0) {
            throw new Error('Should not find frontmatter');
        }
        if (result.content !== content) {
            throw new Error('Content should remain unchanged');
        }
    });
    
    // Test the actual draft file
    test('Process existing draft file', () => {
        const draftPath = path.join(__dirname, 'issues', 'kleine-timeline-unter-der-automation.md');
        if (!fs.existsSync(draftPath)) {
            throw new Error('Draft file not found');
        }
        
        const issue = processMarkdownFile(draftPath);
        if (!issue.title) {
            throw new Error('Title should be extracted');
        }
        if (!issue.body || issue.body.length === 0) {
            throw new Error('Body should not be empty');
        }
        if (issue.title !== 'Kleine Timeline unter der Automation zur besseren Kontrolle') {
            throw new Error('Title does not match expected value');
        }
    });
    
    // Test script generation
    test('Generate issue creation script', () => {
        const testIssues = [{
            title: 'Test Issue',
            body: 'Test body content',
            labels: ['bug'],
            assignees: ['testuser']
        }];
        
        const script = generateIssueCreationScript(testIssues);
        if (!script.includes('gh issue create')) {
            throw new Error('Script should contain gh issue create command');
        }
        if (!script.includes('Test Issue')) {
            throw new Error('Script should contain issue title');
        }
        if (!script.includes('--label "bug"')) {
            throw new Error('Script should contain labels');
        }
        if (!script.includes('--assignee "testuser"')) {
            throw new Error('Script should contain assignees');
        }
    });
    
    // Test generated files exist
    test('Generated files exist', () => {
        const requiredFiles = [
            'create-github-issues.sh',
            'draft-issues.json'
        ];
        
        for (const file of requiredFiles) {
            const filePath = path.join(__dirname, file);
            if (!fs.existsSync(filePath)) {
                throw new Error(`Required file ${file} does not exist`);
            }
        }
    });
    
    // Test JSON output format
    test('JSON output format is valid', () => {
        const jsonPath = path.join(__dirname, 'draft-issues.json');
        const content = fs.readFileSync(jsonPath, 'utf8');
        const issues = JSON.parse(content);
        
        if (!Array.isArray(issues)) {
            throw new Error('JSON should contain an array');
        }
        
        if (issues.length === 0) {
            throw new Error('Should have at least one issue');
        }
        
        const issue = issues[0];
        const requiredFields = ['title', 'body', 'labels', 'assignees'];
        for (const field of requiredFields) {
            if (!(field in issue)) {
                throw new Error(`Issue should have ${field} field`);
            }
        }
    });
    
    console.log(`\nTest Results: ${passed} passed, ${failed} failed`);
    
    if (failed > 0) {
        process.exit(1);
    } else {
        console.log('All tests passed! ✓');
    }
}

if (require.main === module) {
    runTests();
}
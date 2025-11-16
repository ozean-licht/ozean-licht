#!/usr/bin/env node
/**
 * Test script to query Context7 MCP directly
 */

const axios = require('axios');

const context7BaseUrl = 'https://mcp.context7.com/mcp';

async function testContext7() {
  console.log('🔍 Testing Context7 MCP Integration\n');

  try {
    // Step 1: Resolve Storybook library ID
    console.log('Step 1: Resolving Storybook library ID...');
    const resolveResponse = await axios.post(context7BaseUrl, {
      jsonrpc: '2.0',
      method: 'tools/call',
      params: {
        name: 'resolve-library-id',
        arguments: {
          libraryName: 'storybook'
        }
      },
      id: 1
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream'
      },
      timeout: 15000
    });

    console.log('✅ Library ID resolved');
    // Extract the best match - /storybookjs/storybook with version
    const libraryId = '/storybookjs/storybook/v9.0.15';
    console.log(`\n📚 Using library ID: ${libraryId}\n`);

    // Step 2: Get documentation about addons
    console.log('Step 2: Getting Storybook addon documentation...');
    const docsResponse = await axios.post(context7BaseUrl, {
      jsonrpc: '2.0',
      method: 'tools/call',
      params: {
        name: 'get-library-docs',
        arguments: {
          context7CompatibleLibraryID: libraryId,
          topic: 'addons',
          tokens: 8000
        }
      },
      id: 2
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream'
      },
      timeout: 30000
    });

    console.log('✅ Documentation retrieved');
    const docs = docsResponse.data.result?.content?.[0]?.text || docsResponse.data.result;
    console.log('\n📖 Storybook Addons Documentation:\n');
    console.log(docs);

    // Step 3: Get visual testing specific documentation
    console.log('\n\nStep 3: Getting visual testing documentation...');
    const visualTestingResponse = await axios.post(context7BaseUrl, {
      jsonrpc: '2.0',
      method: 'tools/call',
      params: {
        name: 'get-library-docs',
        arguments: {
          context7CompatibleLibraryID: libraryId,
          topic: 'visual testing',
          tokens: 5000
        }
      },
      id: 3
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream'
      },
      timeout: 30000
    });

    console.log('✅ Visual testing documentation retrieved');
    const visualDocs = visualTestingResponse.data.result?.content?.[0]?.text || visualTestingResponse.data.result;
    console.log('\n🎨 Visual Testing Documentation:\n');
    console.log(visualDocs);

    // Save results
    const fs = require('fs');
    const results = {
      timestamp: new Date().toISOString(),
      libraryId,
      addonsDocs: docs,
      visualTestingDocs: visualDocs
    };

    fs.writeFileSync(
      '/opt/ozean-licht-ecosystem/specs/context7-storybook-results.json',
      JSON.stringify(results, null, 2)
    );
    console.log('\n💾 Results saved to specs/context7-storybook-results.json');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

testContext7();

#!/usr/bin/env node
/**
 * Query Context7 for Storybook documentation on specific topics:
 * 1. Authentication System
 * 2. Commenting on Components
 * 3. AI Addon / Chat integration with Claude Agent SDK
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const context7BaseUrl = 'https://mcp.context7.com/mcp';

async function queryContext7(libraryId, topic, tokens = 8000, page = 1, id = 1) {
  console.log(`\n🔍 Querying topic: "${topic}"...`);

  try {
    const response = await axios.post(context7BaseUrl, {
      jsonrpc: '2.0',
      method: 'tools/call',
      params: {
        name: 'get-library-docs',
        arguments: {
          context7CompatibleLibraryID: libraryId,
          topic: topic,
          tokens: tokens,
          page: page
        }
      },
      id: id
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream'
      },
      timeout: 30000
    });

    const docs = response.data.result?.content?.[0]?.text || response.data.result;
    console.log(`✅ Retrieved ${topic} documentation`);
    return docs;
  } catch (error) {
    console.error(`❌ Error querying ${topic}:`, error.message);
    if (error.response) {
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    }
    return null;
  }
}

async function main() {
  console.log('📚 Querying Context7 for Storybook Documentation\n');
  console.log('Topics:');
  console.log('  1. Storybook Auth System');
  console.log('  2. Storybook Commenting on Components');
  console.log('  3. Storybook AI Addon / Chat with Claude Agent SDK\n');

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
      id: 'resolve'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream'
      },
      timeout: 15000
    });

    console.log('✅ Library ID resolved');

    // Use the latest Storybook version
    const libraryId = '/storybookjs/storybook/v9.0.15';
    console.log(`📚 Using library ID: ${libraryId}\n`);

    // Step 2: Query all 3 topics
    const results = {
      timestamp: new Date().toISOString(),
      libraryId: libraryId,
      topics: {}
    };

    // Topic 1: Authentication System
    console.log('\n--- Topic 1: Authentication System ---');
    const authDocs = await queryContext7(libraryId, 'authentication', 8000, 1, 1);
    results.topics.authentication = {
      topic: 'Storybook Auth System',
      query: 'authentication',
      docs: authDocs
    };

    // Topic 2: Commenting on Components
    console.log('\n--- Topic 2: Commenting on Components ---');
    const commentingDocs = await queryContext7(libraryId, 'commenting', 8000, 1, 2);
    results.topics.commenting = {
      topic: 'Storybook Commenting on Components',
      query: 'commenting',
      docs: commentingDocs
    };

    // Topic 3: AI Addon / Chat integration
    console.log('\n--- Topic 3: AI Addon / Chat Integration ---');
    const aiAddonDocs = await queryContext7(libraryId, 'AI addon chat integration', 8000, 1, 3);
    results.topics.aiAddon = {
      topic: 'Storybook AI Addon / Chat with Claude Agent SDK',
      query: 'AI addon chat integration',
      docs: aiAddonDocs
    };

    // Topic 4: Version history and changelog
    console.log('\n--- Topic 4: Version History and Changelog ---');
    const versionHistoryDocs = await queryContext7(libraryId, 'version history changelog', 8000, 1, 4);
    results.topics.versionHistory = {
      topic: 'Storybook Version History and Changelog',
      query: 'version history changelog',
      docs: versionHistoryDocs
    };

    // Also try addons in general
    console.log('\n--- Topic 5: Addons General ---');
    const addonsDocs = await queryContext7(libraryId, 'addons', 8000, 1, 5);
    results.topics.addons = {
      topic: 'Storybook Addons General',
      query: 'addons',
      docs: addonsDocs
    };

    // Save results
    const outputDir = '/opt/ozean-licht-ecosystem/ai_docs';
    const outputFile = path.join(outputDir, 'context7-storybook-auth-commenting-ai.json');

    fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
    console.log(`\n💾 Results saved to ${outputFile}`);

    // Also save individual markdown files
    const mdDir = path.join(outputDir, 'storybook');
    if (!fs.existsSync(mdDir)) {
      fs.mkdirSync(mdDir, { recursive: true });
    }

    // Save each topic as markdown
    for (const [key, value] of Object.entries(results.topics)) {
      if (value.docs) {
        const mdFile = path.join(mdDir, `${key}.md`);
        const content = `# ${value.topic}\n\n**Query:** ${value.query}\n**Timestamp:** ${results.timestamp}\n**Library:** ${results.libraryId}\n\n---\n\n${value.docs}`;
        fs.writeFileSync(mdFile, content);
        console.log(`📄 Saved ${key}.md`);
      }
    }

    console.log('\n✅ All documentation extracted successfully!');

    // Print summary
    console.log('\n📊 Summary:');
    for (const [key, value] of Object.entries(results.topics)) {
      const hasData = value.docs && value.docs.length > 0;
      const status = hasData ? '✅' : '❌';
      const length = hasData ? `(${value.docs.length} chars)` : '(no data)';
      console.log(`${status} ${value.topic} ${length}`);
    }

  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    if (error.response) {
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

main();

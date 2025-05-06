// Example of a simple Node.js MCP STDIO client for the Google Drive MCP server
const { spawnSync, spawn } = require('child_process');
const readline = require('readline');
const path = require('path');
const { MCPClient } = require('@modelcontextprotocol/client');

// Create a readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to prompt user for input
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Path to the MCP server executable
const MCP_SERVER_PATH = path.resolve(__dirname, '../dist/apps/mcp-server/main.js');

// Main function to run the example
async function main() {
  try {
    console.log('Starting Google Drive MCP server...');
    
    // Create a new STDIO-based MCP client with the server process
    const client = new MCPClient({
      command: 'node',
      args: [MCP_SERVER_PATH],
    });
    
    // Connect to the server
    await client.connect();
    console.log('Connected to the MCP server');
    
    // List available tools
    const tools = await client.listTools();
    console.log('Available tools:', tools.map(t => t.name).join(', '));
    
    // Authentication flow
    console.log('\n--- Authentication Flow ---');
    
    // Step 1: Get the auth URL
    console.log('Getting authentication URL...');
    const authUrlResponse = await client.executeTool('get-auth-url', {});
    // Display the authentication URL
    for (const content of authUrlResponse.content) {
      if (content.type === 'text') {
        console.log(content.text);
      }
    }
    
    // Step 2: Wait for user to authenticate and input tokens
    const tokensInput = await prompt('\nAfter authenticating, enter the tokens JSON string: ');
    
    // Step 3: Set the tokens
    console.log('Setting tokens...');
    const setTokensResponse = await client.executeTool('set-tokens', {
      tokens: tokensInput
    });
    console.log(setTokensResponse.content[0].text);
    
    // Step 4: Check auth status
    console.log('\nChecking authentication status...');
    const statusResponse = await client.executeTool('check-auth-status', {});
    console.log(statusResponse.content[0].text);
    
    // If authenticated, proceed with Drive operations
    if (statusResponse.content[0].text.includes('Authenticated successfully')) {
      console.log('\n--- Google Drive Operations ---');
      
      while (true) {
        console.log('\nSelect an operation:');
        console.log('1. List files');
        console.log('2. Get file details');
        console.log('3. Create a text file');
        console.log('4. Update a file');
        console.log('5. Delete a file');
        console.log('6. Exit');
        
        const choice = await prompt('Enter your choice (1-6): ');
        
        switch (choice) {
          case '1':
            // List files
            const listResponse = await client.executeTool('list-files', {
              pageSize: 10
            });
            console.log(listResponse.content[0].text);
            if (listResponse.content[1] && listResponse.content[1].json) {
              console.log(JSON.stringify(listResponse.content[1].json, null, 2));
            }
            break;
            
          case '2':
            // Get file details
            const fileId = await prompt('Enter file ID: ');
            const fileResponse = await client.executeTool('get-file', {
              fileId
            });
            console.log(fileResponse.content[0].text);
            if (fileResponse.content[1] && fileResponse.content[1].json) {
              console.log(JSON.stringify(fileResponse.content[1].json, null, 2));
            }
            break;
            
          case '3':
            // Create a file
            const fileName = await prompt('Enter file name: ');
            const fileContent = await prompt('Enter file content: ');
            const createResponse = await client.executeTool('create-file', {
              fileName,
              mimeType: 'text/plain',
              content: fileContent,
              isBase64: false
            });
            console.log(createResponse.content[0].text);
            if (createResponse.content[1] && createResponse.content[1].json) {
              console.log(JSON.stringify(createResponse.content[1].json, null, 2));
            }
            break;
            
          case '4':
            // Update a file
            const updateFileId = await prompt('Enter file ID to update: ');
            const updateFileName = await prompt('Enter new file name: ');
            const updateContent = await prompt('Enter new content: ');
            const updateResponse = await client.executeTool('update-file', {
              fileId: updateFileId,
              fileName: updateFileName,
              mimeType: 'text/plain',
              content: updateContent,
              isBase64: false
            });
            console.log(updateResponse.content[0].text);
            if (updateResponse.content[1] && updateResponse.content[1].json) {
              console.log(JSON.stringify(updateResponse.content[1].json, null, 2));
            }
            break;
            
          case '5':
            // Delete a file
            const deleteFileId = await prompt('Enter file ID to delete: ');
            const deleteResponse = await client.executeTool('delete-file', {
              fileId: deleteFileId
            });
            console.log(deleteResponse.content[0].text);
            if (deleteResponse.content[1] && deleteResponse.content[1].json) {
              console.log(JSON.stringify(deleteResponse.content[1].json, null, 2));
            }
            break;
            
          case '6':
            // Exit
            console.log('Exiting...');
            await client.disconnect();
            rl.close();
            return;
            
          default:
            console.log('Invalid choice. Please try again.');
        }
      }
    } else {
      console.log('Authentication failed. Exiting...');
      await client.disconnect();
      rl.close();
    }
  } catch (error) {
    console.error('Error:', error.message);
    if (client) {
      await client.disconnect();
    }
    rl.close();
  }
}

// Run the example
main();
# Google Drive MCP Server

This is a Model Context Protocol (MCP) server that provides integration with Google Drive. It works alongside the Auth server and Drive server to provide a complete solution.

## Overview

The MCP server provides tools for:

1. Authentication with Google OAuth
2. Listing files from Google Drive
3. Retrieving file information
4. Creating new files
5. Updating existing files
6. Deleting files

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   - Copy `.env.example` to `.env` (if it doesn't exist already)
   - Update the environment variables as needed

3. Build the application:
   ```bash
   npm run build:mcp
   ```

4. Start the server:
   ```bash
   npm run start:mcp
   ```

## Usage with MCP Clients

This server implements the Model Context Protocol, which means it can be used with any MCP-compatible client.

### Authentication Flow

1. Call the `get-auth-url` tool to receive a Google OAuth URL
2. Navigate to the URL in a browser and authenticate with Google
3. After authentication, you will receive a token response
4. Use the `set-tokens` tool with the tokens from the callback response
5. Once authenticated, you can use any of the Drive tools

### Available Tools

#### Auth Tools
- `get-auth-url`: Get the Google OAuth URL for authentication
- `set-tokens`: Set the authentication tokens for the current session
- `check-auth-status`: Check if the current session is authenticated

#### Drive Tools
- `list-files`: List files from Google Drive
- `get-file`: Get information about a specific file
- `create-file`: Create a new file
- `update-file`: Update an existing file
- `delete-file`: Delete a file

## Development

Start the server in development mode:

```bash
npm run dev:mcp
```

## Running with Auth and Drive Servers

To run the complete system, start all three servers:

```bash
npm run start:all
```

This will start:
- Auth server on port 3000
- Drive server on port 3001
- MCP server on port 3002

## MCP Endpoints

- `POST /mcp`: Main endpoint for MCP operations
- `GET /mcp`: SSE endpoint for event streaming (used in stateful mode)
- `DELETE /mcp`: Session termination endpoint (used in stateful mode)

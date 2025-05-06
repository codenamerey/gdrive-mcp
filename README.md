# Google Drive MCP (Model Context Protocol)

This project consists of two separate NestJS servers:

1. Auth Server - Handles Google OAuth2 authentication
2. Drive Server - Handles Google Drive CRUD operations

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Cloud Platform account with Google Drive API enabled
- OAuth 2.0 credentials from Google Cloud Console

## Setup

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:

   ```
   # OAuth Server Configuration
   AUTH_SERVER_PORT=3000
   AUTH_SERVER_URL=http://localhost:3000

   # Drive Server Configuration
   DRIVE_SERVER_PORT=3001
   DRIVE_SERVER_URL=http://localhost:3001

   # Google OAuth Configuration
   GOOGLE_CLIENT_ID=your_client_id_here
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback

   # Session Configuration
   SESSION_SECRET=your_session_secret_here
   ```

## Running the Servers

1. Start the Auth Server:

   ```bash
   npm run start:auth
   ```

2. Start the Drive Server:
   ```bash
   npm run start:drive
   ```

## API Endpoints

### Auth Server (Port 3000)

- `GET /auth/google` - Get Google OAuth URL
- `GET /auth/google/callback` - OAuth callback endpoint
- `GET /auth/tokens` - Get current user's tokens
- `POST /auth/logout` - Logout endpoint

### Drive Server (Port 3001)

- `GET /drive/files` - List files
  - Query params: `pageSize`, `pageToken`
- `GET /drive/files/:fileId` - Get file details
- `POST /drive/files` - Create new file
  - Body: `file` (multipart/form-data), `metadata` (JSON)
- `PUT /drive/files/:fileId` - Update file
  - Body: `file` (multipart/form-data), `metadata` (JSON)
- `DELETE /drive/files/:fileId` - Delete file

## Development

For development with hot-reload:

```bash
# Auth Server
npm run dev:auth

# Drive Server
npm run dev:drive
```

## Security Considerations

1. Always use HTTPS in production
2. Implement proper session management
3. Store tokens securely
4. Implement rate limiting
5. Add proper error handling
6. Add request validation
7. Implement proper logging

## Using with Claude

This MCP server allows Claude to access and interact with your Google Drive files. When properly configured, Claude can search, list, and read your files directly.

First, build the MCP server

```
npm run build:mcp
```

### Configuration for Claude Desktop

Add the following configuration to your Claude Desktop configuration file:

```json
{
  "mcpServers": {
    "google-drive-mcp": {
      "command": "node",
      "args": ["/path/to/google-drive-mcp/dist/index.js"],
      "env": {
        "GDRIVE_CREDS_DIR": "/path/to/config/directory",
        "CLIENT_ID": "your-google-client-id",
        "CLIENT_SECRET": "your-google-client-secret"
      },
      "description": "This server connects Claude to Google Drive, allowing it to search, list, and read your files. You can ask Claude to find specific documents, read file contents, or work with data from your Google Drive."
    }
  }
}
```

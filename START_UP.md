# K. Wah Interior AI - Startup Guide

## Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js**: v14.0.0 or higher
- **npm**: v6.0.0 or higher (comes with Node.js)

## Installation Steps

### 1. Install Dependencies

Navigate to the project directory and install all required packages:

```bash
cd /Users/sunnychan/Desktop/kwah
npm install
```

This will install:
- React and React DOM
- React Scripts (Create React App tooling)
- Tailwind CSS and its dependencies
- Lucide React (icon library)
- Testing libraries

### 2. Configure API Keys

#### NanoBanana API Setup (Required for AI Generation)

The application integrates with [NanoBanana API](https://docs.nanobananaapi.ai/) for:
- Account credit balance display
- AI-powered interior design generation from uploaded images

1. **Get your API key**:
   - Visit the [NanoBanana API Dashboard](https://docs.nanobananaapi.ai/) to obtain your API key
   - Sign up or log in to access your API Key Management Page

2. **The `.env.local` file is already created** with all necessary variables

3. **Configure your settings**:
   Open `.env.local` and update:
   ```bash
   # Required: Your API Bearer token
   REACT_APP_NANOBANANA_API_KEY=your_api_key_here
   
   # Required: Callback URL (use webhook.site for testing)
   REACT_APP_CALLBACK_URL=https://webhook.site/your-unique-url
   
   # Optional: Customize the generation prompt
   REACT_APP_DEFAULT_PROMPT=Your custom interior design prompt
   
   # Optional: Image settings
   REACT_APP_IMAGE_SIZE=16:9
   REACT_APP_NUM_IMAGES=1
   REACT_APP_WATERMARK=K.WAH
   ```

4. **Get a callback URL** (for testing):
   - Visit https://webhook.site
   - Copy your unique URL
   - Paste it as `REACT_APP_CALLBACK_URL`

5. **Restart the development server** after configuration

**Note**: The application will run without the API key, but AI generation features will not work. The app uses polling to check task status automatically.

**Security Warning**: Frontend environment variables are exposed in the browser bundle. For production deployments, consider using a backend proxy to secure API keys.

### 3. Start Development Server

Run the development server:

```bash
npm start
```

The application will automatically open in your default browser at:
- **URL**: http://localhost:3000
- **Default Port**: 3000

If port 3000 is already in use, React will prompt you to use another port.

### 4. Build for Production

To create an optimized production build:

```bash
npm run build
```

This creates a `build` folder with optimized static files ready for deployment.

## Development Workflow

### Hot Reload
The development server supports hot reload. Any changes to source files will automatically refresh the browser.

### Available Scripts

- `npm start` - Start development server
- `npm test` - Run test suite
- `npm run build` - Create production build
- `npm run eject` - Eject from Create React App (⚠️ irreversible)

## Project Structure

```
kwah/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   ├── services/        # API services
│   │   └── api.js      # NanoBanana API integration
│   ├── index.js        # Entry point
│   └── index.css       # Global styles (Tailwind)
├── .env.local          # Environment variables (create this)
├── package.json        # Dependencies
└── tailwind.config.js  # Tailwind configuration
```

## Environment Variables

### Required Environment Variables

Create a `.env.local` file with the following:

```bash
# NanoBanana API Key (Required for credit balance display)
REACT_APP_NANOBANANA_API_KEY=your_api_key_here
```

### How to Get API Keys

**NanoBanana API**:
- Documentation: https://docs.nanobananaapi.ai/
- Used for:
  - Account credit balance display
  - AI interior design generation (Image-to-Image)
- Endpoints:
  - `GET /api/v1/common/credit` - Check balance
  - `POST /api/v1/nanobanana/generate` - Generate images
  - `GET /api/v1/nanobanana/task/{taskId}` - Check task status

**Webhook.site** (for callback testing):
- URL: https://webhook.site
- Used for: Receiving generation completion callbacks
- Free temporary URLs for testing

## Troubleshooting

### Port Already in Use
If port 3000 is busy, you can specify a different port:
```bash
PORT=3001 npm start
```

### Dependencies Installation Failed
Try clearing npm cache:
```bash
npm cache clean --force
npm install
```

### Build Errors
Remove node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### API Key Not Working
1. Verify your API key is correct in `.env.local`
2. Ensure the file is named exactly `.env.local` (not `.env.local.txt`)
3. Restart the development server after adding/changing the API key
4. Check the browser console for specific error messages
5. Verify your account has sufficient credits at the NanoBanana dashboard

### Credit Balance Shows Error
- **401 Unauthorized**: API key is invalid or missing
- **402 Insufficient Credits**: Account has no credits
- **429 Rate Limited**: Too many API requests, wait and retry
- **500 Server Error**: NanoBanana API is temporarily unavailable
- Click the refresh icon to retry fetching the balance

### Image Generation Fails
- **"API key not configured"**: Add API key to `.env.local`
- **"Callback URL is required"**: Add webhook.site URL to `.env.local`
- **"Parameter error"**: Check image format and prompt settings
- **"Task polling timeout"**: Generation is taking longer than expected, task may still be processing
- **Content policy violation**: Adjust the generation prompt
- Check browser console for detailed error messages

### Generated Image Not Showing
- Wait for generation to complete (can take 30-60 seconds)
- Check that you have sufficient credits
- Verify callback URL is accessible (webhook.site should show the callback)
- Task ID will be displayed - you can check status later if needed

## Tech Stack

- **React**: 18.2.0
- **React Scripts**: 5.0.1
- **Tailwind CSS**: 3.3.6
- **Lucide React**: 0.294.0

---

Last Updated: January 7, 2026


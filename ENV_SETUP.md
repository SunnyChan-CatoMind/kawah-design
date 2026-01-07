# Environment Variables Setup Guide

## Demo Application Configuration

This is a **DEMO application** with pre-configured environment variables for AI-powered interior design generation.

## Quick Setup

### 1. Locate the `.env.local` file
The file is located in the project root:
```
/Users/sunnychan/Desktop/kwah/.env.local
```

### 2. Add Your API Key

Open `.env.local` and replace the placeholder:

```bash
# Change this line:
REACT_APP_NANOBANANA_API_KEY=your_demo_api_key_here

# To your actual API key:
REACT_APP_NANOBANANA_API_KEY=sk_your_actual_api_key_here
```

### 3. Configure Image Generation Settings

The `.env.local` file includes several configurable options:

#### A. Default Prompt (Customizable)
```bash
REACT_APP_DEFAULT_PROMPT=Your custom interior design prompt here
```
This prompt determines the style and characteristics of the generated interior designs. The default is pre-configured for K. Wah luxury aesthetics.

#### B. Callback URL (Required for API)
```bash
REACT_APP_CALLBACK_URL=https://webhook.site/your-unique-url-here
```
**Options:**
- **Testing**: Visit [webhook.site](https://webhook.site) to get a free temporary callback URL
- **Production**: Set up your own backend server
- **Demo Mode**: The app uses polling instead of callbacks, so you can use a placeholder

#### C. Image Settings
```bash
REACT_APP_IMAGE_SIZE=16:9          # Aspect ratio
REACT_APP_NUM_IMAGES=1             # Number of images (1-4)
REACT_APP_WATERMARK=K.WAH          # Optional watermark
```

### 4. Get Your NanoBanana API Key

1. Visit: https://docs.nanobananaapi.ai/
2. Sign up or log in to your account
3. Navigate to **API Key Management Page**
4. Copy your Bearer token/API key
5. Paste it in the `.env.local` file

### 5. Get Your ImgBB API Key (NEW - Required!)

**Why needed?** Images must be uploaded to public URLs before sending to AI API.

1. Visit: **https://api.imgbb.com/**
2. Click "Get API Key" (top right)
3. Sign up with email (FREE - no credit card needed)
4. Go to "API" section after signup
5. Copy your API key
6. Paste it as `REACT_APP_IMGBB_API_KEY` in `.env.local`

**Free Tier**: 5000 uploads/month - plenty for testing!

### 6. Set Up Callback URL (for Testing)

For testing purposes, use [webhook.site](https://webhook.site):
1. Visit https://webhook.site
2. Copy your unique URL (e.g., `https://webhook.site/xxxxxx-xxxx-xxxx`)
3. Paste it as `REACT_APP_CALLBACK_URL` in `.env.local`
4. You can monitor callbacks in real-time on webhook.site

**Note**: The app uses polling to check task status, so callbacks are optional for testing.

### 7. Restart Development Server

After updating the configuration:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm start
```

## File Location & Security

- **File**: `.env.local` (in project root)
- **Status**: Automatically ignored by Git (in `.gitignore`)
- **Security**: This is a DEMO - API keys are visible in browser
- **Production**: Use backend proxy to secure API keys

## Verification

After setup, the application will:
- ✅ Display credit balance in the header (top-right)
- ✅ Show formatted credit numbers with commas
- ✅ Provide refresh button to update balance
- ✅ Generate AI interior designs from uploaded images
- ✅ Show real-time generation progress
- ✅ Poll task status automatically
- ❌ Show error if API key is invalid

## How It Works

1. **Upload Images**: Upload 1-5 photos of your property
2. **Click Generate**: The app uploads images to ImgBB first
3. **Get Public URLs**: ImgBB returns accessible URLs
4. **Send to AI**: App sends public URLs to NanoBanana AI
5. **Task Submission**: Receives a task ID and starts polling
6. **Progress Updates**: Shows real-time status (every 5 seconds)
7. **Result Display**: Generated design appears when complete
8. **Credits Update**: Balance updates after generation

## Troubleshooting

### Credits Not Showing?

1. **Check the file name**: Must be exactly `.env.local`
2. **Verify API key**: No extra spaces or quotes
3. **Restart server**: Environment variables load at startup
4. **Check console**: Look for error messages in browser DevTools

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "401 Unauthorized" | Invalid API key | Double-check your API key |
| "402 Insufficient Credits" | No credits in account | Add credits to your NanoBanana account |
| "429 Rate Limited" | Too many requests | Wait a few moments and retry |
| "Error" | API key not configured | Add API key to `.env.local` |
| "Callback URL is required" | Missing callback URL | Add webhook.site URL or placeholder |
| "Parameter error" | Invalid configuration | Check image format and settings |
| "Task polling timeout" | Generation taking too long | Task may still be processing, check later |

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `REACT_APP_NANOBANANA_API_KEY` | ✅ Yes | - | Your NanoBanana API Bearer token |
| `REACT_APP_IMGBB_API_KEY` | ✅ Yes | - | Your ImgBB API key for image uploads |
| `REACT_APP_DEFAULT_PROMPT` | ⚠️ Recommended | K.Wah luxury prompt | Prompt for image generation |
| `REACT_APP_CALLBACK_URL` | ✅ Yes | - | Callback URL (webhook.site for testing) |
| `REACT_APP_IMAGE_SIZE` | ❌ No | `16:9` | Aspect ratio (1:1, 16:9, etc.) |
| `REACT_APP_NUM_IMAGES` | ❌ No | `1` | Number of images to generate (1-4) |
| `REACT_APP_WATERMARK` | ❌ No | `K.WAH` | Watermark text (optional) |

## Demo Mode

If you don't have an API key yet:
- The app will still work
- Credit balance will show "Loading..." or "Error"
- You can click the refresh icon to retry
- All other features work normally

---

**Last Updated**: January 7, 2026  
**Demo Application** - For testing purposes only


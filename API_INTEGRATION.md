# NanoBanana API Integration Guide

## Overview

This document explains how the K. Wah Interior AI application integrates with the NanoBanana API for AI-powered interior design generation.

**API Documentation**: https://docs.nanobananaapi.ai/

## Integrated Features

### 1. Credit Balance Display
- **Endpoint**: `GET /api/v1/common/credit`
- **Purpose**: Display user's available credits in real-time
- **Location**: Header (top-right corner)
- **Update**: Manual refresh button + auto-refresh after generation

### 2. AI Image Generation
- **Endpoint**: `POST /api/v1/nanobanana/generate`
- **Mode**: `IMAGETOIAMGE` (Image-to-Image transformation)
- **Purpose**: Transform uploaded property photos into luxury interior designs
- **Process**: Submit task → Receive taskId → Poll for completion

### 3. Task Status Polling
- **Endpoint**: `GET /api/v1/nanobanana/task/{taskId}`
- **Purpose**: Check generation progress and get result
- **Frequency**: Every 5 seconds
- **Max Attempts**: 60 (5 minutes total timeout)

## Architecture

### Frontend-Only Limitations

This is a **frontend-only React application**, which has some architectural constraints:

#### Challenges:
1. **No Backend**: Can't securely store API keys
2. **No File Upload**: Can't host images on public URLs
3. **No Callback Receiver**: Can't receive webhook callbacks

#### Solutions Implemented:
1. **API Keys**: Stored in `.env.local` (for demo purposes)
   - ⚠️ Keys are visible in browser bundle
   - 💡 Production should use backend proxy
   
2. **Image URLs**: Uses blob URLs from FileReader
   - ⚠️ May not work with external API (needs testing)
   - 💡 Alternative: Upload to imgbb.com, cloudinary, etc.
   
3. **Callbacks**: Uses polling instead
   - ✅ Polls every 5 seconds automatically
   - ✅ Shows real-time progress
   - 💡 Backend would enable true push notifications

## API Flow

### Complete Generation Flow

```
User Action                 Frontend                    NanoBanana API
-----------                 --------                    --------------
1. Upload images       →    Store Files
2. Click "Generate"    →    Prepare request
                       →    Submit generation      →    POST /generate
                       ←    Receive taskId         ←    { taskId: "..." }
                       
                            Start Polling (every 5s)
                       →    Check status           →    GET /task/{id}
                       ←    Status: processing     ←    { status: "..." }
                       →    Check status (again)   →    GET /task/{id}
                       ←    Status: processing     ←    { status: "..." }
                            ... (continues) ...
                       →    Check status           →    GET /task/{id}
                       ←    Result ready!          ←    { resultImageUrl }
                       
3. Display result      ←    Show generated image
4. Refresh credits     →    Update balance         →    GET /credit
```

## Configuration

### Environment Variables

All settings are in `.env.local`:

```bash
# Authentication
REACT_APP_NANOBANANA_API_KEY=sk_your_api_key_here

# Generation Settings
REACT_APP_DEFAULT_PROMPT=Transform this space into a luxurious K. Wah signature interior design...
REACT_APP_CALLBACK_URL=https://webhook.site/your-unique-url
REACT_APP_IMAGE_SIZE=16:9
REACT_APP_NUM_IMAGES=1
REACT_APP_WATERMARK=K.WAH
```

### Customizing the Prompt

The `REACT_APP_DEFAULT_PROMPT` variable controls the AI generation style. Customize it to change the output aesthetic:

**Default (K. Wah Luxury)**:
```
Transform this space into a luxurious K. Wah signature interior design. 
Create a modern minimalist aesthetic with champagne and oak color palette, 
natural ambient lighting, Italian marble materials, elegant furniture, and 
sophisticated architectural details. Maintain the spatial structure while 
adding luxury residential elements.
```

**Other Examples**:
- Industrial: `"Industrial loft style with exposed brick, metal fixtures, concrete floors"`
- Scandinavian: `"Scandinavian minimalist design with light wood, white walls, natural textures"`
- Modern: `"Ultra-modern design with clean lines, neutral colors, smart home features"`

## Code Implementation

### API Service (`src/services/api.js`)

```javascript
// Main functions:
1. getAccountCredits()         - Fetch credit balance
2. generateImage(params)        - Submit generation task
3. getTaskDetails(taskId)       - Check task status
4. pollTaskStatus(taskId, ...)  - Auto-poll until complete
```

### Component Integration (`src/components/KwahAIApp.jsx`)

```javascript
// Key features:
1. File upload with preview
2. Generate button with progress
3. Real-time status updates
4. Error handling and display
5. Result image display
6. Credit balance refresh
```

## Error Handling

### Common Errors and Solutions

| Error Code | Error Message | Cause | Solution |
|------------|---------------|-------|----------|
| 401 | Unauthorized | Invalid/missing API key | Check `REACT_APP_NANOBANANA_API_KEY` |
| 402 | Insufficient Credits | No credits available | Add credits to account |
| 400 | Parameter error | Invalid request params | Check image format, prompt |
| 429 | Rate Limited | Too many requests | Wait and retry |
| 500 | Server error | API service issue | Retry later |
| 501 | Generation failed | Task processing failed | Adjust params, retry |

### Content Policy Violations

The API may reject prompts that violate content policies. If you receive a 400 error with content policy violation:

1. Review your `REACT_APP_DEFAULT_PROMPT`
2. Remove any sensitive/inappropriate content
3. Ensure prompt describes design elements only
4. Retry generation

## Testing

### Testing with webhook.site

1. Visit https://webhook.site
2. Copy your unique URL (e.g., `https://webhook.site/abc123...`)
3. Set as `REACT_APP_CALLBACK_URL` in `.env.local`
4. Run a generation
5. View callbacks in real-time on webhook.site

**Note**: The app uses polling, so callbacks are informational only.

### Testing the Flow

1. **Setup**: Configure `.env.local` with API key
2. **Upload**: Add 1-5 property images
3. **Generate**: Click "Generate AI Concept"
4. **Observe**: Watch progress updates
5. **Verify**: Check generated image appears
6. **Credits**: Confirm balance decreased

## Production Considerations

### Security Improvements

For production deployment:

1. **Backend Proxy**:
   ```
   Frontend → Backend API → NanoBanana API
   ```
   - Keeps API keys secure
   - Prevents rate limit bypass attempts
   - Adds usage tracking

2. **Image Hosting**:
   - Upload images to S3/Cloudinary
   - Get public URLs for API
   - Implement proper access control

3. **Webhook Handler**:
   - Backend endpoint for callbacks
   - Push notifications to frontend via WebSocket
   - Store results in database

### Performance Optimization

1. **Caching**: Cache generated images
2. **Batch Processing**: Queue multiple requests
3. **CDN**: Serve results via CDN
4. **Progressive Loading**: Show thumbnails first

## API Limits & Costs

- **Rate Limiting**: Subject to API provider limits
- **Credit Cost**: Varies per generation (check NanoBanana pricing)
- **Image Size**: Affects credit consumption
- **Number of Images**: 1-4 per request

Check your account dashboard for detailed usage and costs.

## Troubleshooting

### Generation Not Starting

1. Check browser console for errors
2. Verify API key is set in `.env.local`
3. Restart development server after config changes
4. Ensure callback URL is set

### Generation Timeout

1. Task may still be processing on server
2. Check task ID on NanoBanana dashboard
3. Increase polling attempts if needed
4. API may be experiencing high load

### Image Not Displaying

1. Check browser network tab for API responses
2. Verify `resultImageUrl` in response
3. Check image URL accessibility
4. Look for CORS errors in console

## Support Resources

- **NanoBanana Docs**: https://docs.nanobananaapi.ai/
- **webhook.site**: https://webhook.site (for testing)
- **Project README**: [README.md](README.md)
- **Environment Setup**: [ENV_SETUP.md](ENV_SETUP.md)
- **Startup Guide**: [START_UP.md](START_UP.md)

---

**Last Updated**: January 7, 2026  
**API Version**: v1  
**Application**: K. Wah Interior AI Concept Designer


# K. Wah Interior AI - Requirements Document

## Project Overview

**Project Name**: K. Wah Interior AI Concept Designer  
**Type**: Multi-Page React Application with Client-Side Routing  
**Framework**: React (Create React App)  
**Version**: 0.2.0  
**Last Updated**: February 3, 2026

## Purpose

An AI-powered interior design concept generator that provides two modes:
1. **Template-Based Design**: Upload photos of raw properties and receive luxury interior design concepts inspired by K. Wah's signature aesthetic with predefined room types, styles, and budget ranges
2. **Custom Adjustment**: Upload a single image and describe custom adjustments with complete creative control using free-form prompts

## Functional Requirements

### 1. Image Upload System

#### FR-1.1: Multiple Image Upload
- **Description**: Users can upload up to 5 images of their property
- **Acceptance Criteria**:
  - Support multiple file selection
  - Accept only image file formats (JPEG, PNG, etc.)
  - Display error message if limit exceeds 5 images
  - Show image counter (X/5)

#### FR-1.2: Image Preview & Management
- **Description**: Display uploaded images as thumbnails with remove functionality
- **Acceptance Criteria**:
  - Show 5 thumbnail slots in a grid layout
  - Display remove (X) button on hover
  - Update counter when images are removed
  - Free up slots for new uploads after removal

### 2. AI Concept Generation

#### FR-2.0: Design Options Selection
- **Description**: Allow users to select room type and design style before generation
- **Configuration**: Options defined in `src/config/designOptions.json`
- **Acceptance Criteria**:
  - Display dropdown for Room Type selection (Living Room, Bedroom, Kitchen, etc.)
  - Display dropdown for Style selection (K. Wah Luxury, Modern Minimalist, etc.)
  - Default selections pre-populated
  - Selections persist during session
  - Options integrated into AI prompt generation
  - Support for 8 room types and 8 style options

#### FR-2.1: Budget Range Input
- **Description**: Allow users to specify budget range for interior design
- **Acceptance Criteria**:
  - Two input fields: "Budget From" and "Budget To"
  - Currency: HKD (Hong Kong Dollars)
  - Minimum budget: HKD 100,000
  - Default range: HKD 100,000 - 500,000
  - Auto-format with thousand separators (commas)
  - Validate "To" is greater than or equal to "From"
  - Budget values integrated into AI prompt
  - Show error if values are invalid

#### FR-2.2: Generate Design Concept
- **Description**: Process uploaded images and generate design concept using NanoBanana API
- **API Integration**: Image-to-Image generation (IMAGETOIAMGE mode)
- **Pre-processing**: Upload images to ImgBB for public URL hosting
- **Acceptance Criteria**:
  - Button disabled when no images uploaded
  - Upload images to ImgBB first (get public URLs)
  - Build dynamic prompt with room type, style, and budget
  - Submit public image URLs to NanoBanana API with prompt
  - Log final prompt and request body to console
  - Receive task ID from API
  - Show real-time progress updates
  - Automatically poll task status every 5 seconds
  - Display generated image when complete
  - Handle API errors gracefully
  - Update credit balance after generation
  - Maximum 60 polling attempts (5 minutes total)

#### FR-2.3: Result Display
- **Description**: Show generated concept with metadata
- **Acceptance Criteria**:
  - Display full-size generated image from API
  - Show design metadata (Palette, Lighting, Materials)
  - Clean image display without overlays
  - Include style description below image
  - Show task ID for reference
  - Handle image loading states

#### FR-2.4: Generation Progress Tracking
- **Description**: Real-time feedback during generation process
- **Acceptance Criteria**:
  - Show "Preparing images..." status
  - Display "Submitting to NanoBanana AI..." message
  - Show task ID after submission
  - Update with "Generating your luxury interior concept..." status
  - Display polling progress
  - Show completion message
  - Handle timeout scenarios gracefully

### 3. Custom Image Adjustment Page

#### FR-3.0: Custom Prompt Image Adjustment
- **Description**: Separate page allowing users to upload a single image and provide custom prompt for adjustments
- **Route**: `/custom`
- **Acceptance Criteria**:
  - Single image upload (replaces previous when new image selected)
  - Custom text prompt input (no template restrictions)
  - No predefined room type, style, or budget selections
  - User has complete creative control over the prompt
  - Same AI generation workflow using NanoBanana API
  - Share same credit balance system
  - Back navigation to main page
  - Display task ID and generation progress
  - Show generated result in preview area
  - Handle all API errors gracefully

#### FR-3.0.1: Navigation Between Pages
- **Description**: Easy navigation between template-based and custom adjustment pages
- **Acceptance Criteria**:
  - "Custom Adjustment" button in main page header
  - Back arrow button in custom page header
  - React Router for client-side routing
  - Maintains credit balance across pages
  - No page reload on navigation

### 4. User Interface

#### FR-4.1: Responsive Design
- **Description**: Application works on all device sizes
- **Acceptance Criteria**:
  - Desktop layout (1200px+): Side-by-side panels
  - Tablet layout (768px-1199px): Stacked layout
  - Mobile layout (<768px): Single column

#### FR-4.2: Brand Styling
- **Description**: Consistent K. Wah brand identity
- **Acceptance Criteria**:
  - Navy (#002147) primary color
  - Gold (#b59a5d) accent color
  - Serif typography for headings
  - Sans-serif for body text
  - Gold accent bar at top

### 5. API Integration

#### FR-5.1: Credit Balance Display
- **Description**: Display user's NanoBanana API account credit balance in real-time
- **API**: [NanoBanana API - Get Account Credits](https://docs.nanobananaapi.ai/common-api/get-account-credits)
- **Acceptance Criteria**:
  - Fetch credit balance on component mount
  - Display credit balance in header (top-right corner)
  - Show loading state while fetching
  - Display error state with retry option if fetch fails
  - Include refresh button to manually update balance
  - Format credits with thousand separators
  - Handle API error codes (401, 402, 429, 500, etc.)
  - Gracefully handle missing API key (show unavailable state)

#### FR-5.2: API Error Handling
- **Description**: Robust error handling for API requests
- **Acceptance Criteria**:
  - 401 Unauthorized: Show "Invalid API Key" error
  - 402 Insufficient Credits: Show "No Credits" warning
  - 429 Rate Limited: Show "Rate Limited" with retry
  - 500 Server Error: Show "Service Unavailable"
  - Network errors: Show generic error with retry option
  - Log errors to console for debugging

### 6. Navigation

#### FR-6.1: Header Navigation
- **Description**: Top navigation with brand logo and credit display
- **Acceptance Criteria**:
  - Display K. WAH GROUP logo
  - Show "Interior AI Concept" tagline
  - Display credit balance on right side
  - Sticky header on scroll

#### FR-6.2: Footer
- **Description**: Footer with copyright and links
- **Acceptance Criteria**:
  - Display copyright notice
  - Include Privacy, Terms, Contact links
  - Match brand styling

## Non-Functional Requirements

### NFR-1: Performance
- Page load time < 2 seconds
- Smooth animations and transitions
- Optimized image loading

### NFR-2: Accessibility
- Semantic HTML structure
- Alt text for images
- Keyboard navigation support
- ARIA labels where appropriate

### NFR-3: Browser Compatibility
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

### NFR-4: Code Quality
- ESLint configuration
- Consistent code formatting
- Component-based architecture
- Reusable components

### NFR-5: Maintainability
- Clear folder structure
- Documented code where necessary
- Separation of concerns
- Configuration files for styling (Tailwind)

## Technical Requirements

### TR-1: Dependencies
- React 18.2.0+
- React DOM 18.2.0+
- React Router DOM 6.x (for client-side routing)
- React Scripts 5.0.1
- Tailwind CSS 3.3.6+
- Lucide React 0.294.0+
- PostCSS & Autoprefixer

### TR-2: External APIs

#### NanoBanana API (AI Image Generation & Credit Management)
- **Base URL**: `https://api.nanobananaapi.ai/api/v1`
- **Authentication**: Bearer Token (in Authorization header)
- **Documentation**: https://docs.nanobananaapi.ai/
- **Rate Limiting**: Subject to API provider limits
- **Global availability**: Worldwide access
  
**Endpoints Used**:
1. `GET /api/v1/common/credit`
   - Purpose: Check account credit balance
   - Response: Credit amount (integer)

2. `POST /api/v1/nanobanana/generate`
   - Purpose: Submit image generation task
   - Mode: IMAGETOIAMGE (Image-to-Image editing)
   - Parameters: prompt, imageUrls, type, numImages, image_size, callBackUrl, watermark
   - Response: taskId (string)

3. `GET /api/v1/nanobanana/record-info?taskId={taskId}`
   - Purpose: Check task status and get results
   - Polling: Every 5 seconds
   - Response: Task details, successFlag (0=generating, 1=success), images array with `imagePath`

#### ImgBB API (Image Hosting)
- **Base URL**: `https://api.imgbb.com/1/upload`
- **Authentication**: API key as query parameter
- **Documentation**: https://api.imgbb.com/
- **Free Tier**: Yes (no credit card required)
- **Purpose**: Convert local images to publicly accessible URLs
  
**Why ImgBB?**
- Frontend apps can't send blob:// URLs to external APIs
- NanoBanana API requires public URLs for image inputs
- ImgBB provides free, instant image hosting
- No backend infrastructure needed

**Usage Flow**:
1. User uploads local image file
2. App uploads to ImgBB via API
3. ImgBB returns public URL
4. Public URL sent to NanoBanana API for generation

### TR-3: Build System
- Create React App configuration
- Webpack bundling
- Hot module replacement in development
- Production optimization

### TR-4: Styling
- Tailwind CSS utility classes
- PostCSS processing
- Custom color scheme
- Responsive breakpoints

### TR-5: Environment Variables
Required variables (stored in `.env.local`, not committed to version control):

- `REACT_APP_NANOBANANA_API_KEY` (Required)
  - Your NanoBanana API Bearer token
  - Used for authentication with NanoBanana API
  
- `REACT_APP_IMGBB_API_KEY` (Required)
  - Your ImgBB API key for image uploads
  - Get free key from: https://api.imgbb.com/
  - Used to convert local images to public URLs
  
- `REACT_APP_CALLBACK_URL` (Required for API, but not used in app)
  - URL to receive generation completion callbacks
  - Can use webhook.site for testing
  - App uses polling instead of callbacks (frontend limitation)

- `REACT_APP_DEFAULT_PROMPT` (Optional - Deprecated)
  - **Note**: Prompts now managed in `src/config/promptTemplates.js`
  - This env variable serves as fallback only
  - See TR-6 for new prompt system

- `REACT_APP_IMAGE_SIZE` (Optional, default: "16:9")
  - Aspect ratio for generated images
  - Options: 1:1, 9:16, 16:9, 3:4, 4:3, 3:2, 2:3, 5:4, 4:5, 21:9

- `REACT_APP_NUM_IMAGES` (Optional, default: 1)
  - Number of images to generate per request
  - Range: 1-4

- `REACT_APP_WATERMARK` (Optional, default: "K.WAH")
  - Watermark text for generated images

### TR-6: Prompt Template System
**File**: `src/config/promptTemplates.js`

- **Purpose**: Centralized management of AI generation prompts
- **Format**: JavaScript module exporting template objects
- **Advantages**:
  - Better formatting and readability
  - Multiple template options
  - No server restart needed for changes
  - Version control friendly
  - Supports comments and documentation

- **Available Templates**:
  1. `softDecoration` (Default) - Detailed soft decoration styling prompt (~2,500 chars)
  2. `fullRenovation` - Complete renovation prompt (~600 chars)
  3. `compact` - Quick generation prompt (~150 chars)

- **Placeholders**:
  - `{ROOM_TYPE}` - Replaced with selected room type (e.g., "Living Room")
  - `{STYLE}` - Replaced with selected style (e.g., "K. Wah Luxury")
  - `{BUDGET_FROM}` - Replaced with budget lower bound (e.g., "100,000")
  - `{BUDGET_TO}` - Replaced with budget upper bound (e.g., "500,000")

- **Usage**:
  ```javascript
  import { promptTemplates, DEFAULT_TEMPLATE } from '../config/promptTemplates';
  const template = promptTemplates[DEFAULT_TEMPLATE];
  const finalPrompt = buildPrompt(template, roomType, style, budgetFrom, budgetTo);
  ```

- **To Add New Templates**:
  1. Edit `src/config/promptTemplates.js`
  2. Add new template to `promptTemplates` object
  3. (Optional) Change `DEFAULT_TEMPLATE` export
  4. Refresh browser (no rebuild needed)

### TR-7: Design Configuration
**File**: `src/config/designOptions.json`

- **Purpose**: Define available room types and design styles
- **Format**: JSON configuration file
- **Structure**:
  ```json
  {
    "roomTypes": [
      { "label": "Living Room", "value": "living_room", "description": "..." }
    ],
    "styles": [
      { "label": "K. Wah Luxury", "value": "kwah_luxury", "description": "..." }
    ]
  }
  ```

- **Current Options**:
  - 8 Room Types: Living Room, Bedroom, Kitchen, Bathroom, Dining Room, Home Office, Foyer, Balcony
  - 8 Styles: K. Wah Luxury, Modern Minimalist, Contemporary, Scandinavian, Industrial, Classic Elegant, Modern Luxury, Zen Minimalist

- **Usage**: Imported in `KwahAIApp.jsx` to populate dropdowns and build prompts

## Future Enhancements

### Phase 2 (Future)
- [ ] Real AI API integration
- [ ] User authentication system
- [ ] Save/favorite designs
- [ ] Multiple style options
- [ ] 3D room visualization
- [ ] Export to PDF/PNG
- [ ] Share concepts via link
- [ ] Design history tracking

### Phase 3 (Future)
- [ ] Multi-language support
- [ ] Mobile app version
- [ ] VR/AR preview
- [ ] Collaborative features
- [ ] Professional designer consultation
- [ ] E-commerce integration

## Constraints & Limitations

### Current Limitations
1. ~~**Mock AI**: Currently uses placeholder image, no real AI processing~~ ✅ **Resolved** - Now uses real NanoBanana API
2. **No Backend**: Frontend-only application (API keys exposed in frontend)
3. **No Persistence**: No data storage, state lost on refresh
4. ~~**Limited Customization**: Style controlled via environment variable prompt only~~ ✅ **Resolved** - Now has room type, style dropdowns, budget inputs, and template system
5. ~~**Image URL Limitation**: Frontend apps can't easily upload images to get public URLs~~ ✅ **Resolved** - Now uses ImgBB for image hosting
6. **Polling Only**: Uses polling instead of real-time callbacks (frontend limitation)
7. **Single Generation**: Can only generate one concept at a time (no batch processing)

### Technical Constraints
1. Browser-based only (no mobile apps)
2. Requires modern browser with ES6+ support
3. Client-side processing only
4. No offline functionality
5. API keys visible in browser (consider backend proxy for production)
6. Dependent on third-party API availability (NanoBanana)

### Security Considerations
1. **API Key Exposure**: Frontend environment variables are exposed in browser
   - Recommendation: Implement backend proxy for production
   - Current: Direct API calls from frontend
2. **Rate Limiting**: Subject to NanoBanana API rate limits
3. **CORS**: Dependent on API provider's CORS configuration

## Success Metrics

### User Experience
- Intuitive upload process (< 3 clicks)
- Fast loading times (< 2s)
- Clear visual feedback at each step
- Professional, luxury aesthetic

### Technical
- Zero console errors
- Lighthouse score > 90
- Mobile responsiveness 100%
- Clean code (linter passing)

---

**Document Version**: 1.0  
**Status**: Active Development  
**Next Review**: Upon Phase 2 planning


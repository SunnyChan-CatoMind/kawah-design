# K. Wah Interior AI Concept Designer

A modern React application that allows users to upload property photos and generate AI-inspired luxury interior design concepts in the K. Wah signature style.

## Features

- 📸 Upload up to 5 reference images of your property
- 🎨 **AI-powered interior design generation** using NanoBanana API
- 🖼️ **Image-to-Image transformation** - Turn raw spaces into luxury designs
- 🏛️ Luxury K. Wah inspired aesthetic with customizable prompts
- 📱 Responsive design for all devices
- ⚡ Built with React and Tailwind CSS
- 💳 Real-time credit balance display
- 🔄 Automatic task polling for generation status
- 🌍 Global API integration for worldwide access
- ⏱️ Real-time progress updates during generation

## Tech Stack

- **React** 18.2.0
- **Tailwind CSS** 3.3.6
- **Lucide React** (for icons)
- **Create React App** 5.0.1

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository or navigate to the project folder:
```bash
cd kwah
```

2. Install dependencies:
```bash
npm install
```

3. Configure API keys:

The `.env.local` file is already created. Update it with your credentials:

```bash
# Required: Your API key
REACT_APP_NANOBANANA_API_KEY=your_api_key_here

# Required: Callback URL (use webhook.site for testing)
REACT_APP_CALLBACK_URL=https://webhook.site/your-unique-url

# Optional: Customize generation settings
REACT_APP_DEFAULT_PROMPT=Your custom prompt here
REACT_APP_IMAGE_SIZE=16:9
REACT_APP_NUM_IMAGES=1
REACT_APP_WATERMARK=K.WAH
```

- Get your API key from [NanoBanana API Dashboard](https://docs.nanobananaapi.ai/)
- Get a free callback URL from [webhook.site](https://webhook.site)

4. Start the development server:
```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

The page will automatically reload when you make changes.

**Note**: The app will run without the API key, but credit balance will not be displayed.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time.

## Project Structure

```
kwah/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── components/
│   │   └── KwahAIApp.jsx       # Main application component
│   ├── services/
│   │   └── api.js              # NanoBanana API integration
│   ├── App.js
│   ├── App.css
│   ├── App.test.js
│   ├── index.js
│   ├── index.css
│   ├── reportWebVitals.js
│   └── setupTests.js
├── .env.local                   # Environment variables (create this)
├── .gitignore
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── README.md
├── START_UP.md                  # Detailed startup guide
└── REQUIREMENT.md               # Requirements documentation
```

## API Integration

This application integrates with the [NanoBanana API](https://docs.nanobananaapi.ai/) for AI-powered interior design generation.

### Integrated Features:

#### 1. Credit Balance Display
- 💰 Real-time credit balance in header
- 🔄 Manual refresh capability
- ⚠️ Comprehensive error handling

#### 2. AI Image Generation
- 🖼️ **Image-to-Image mode** - Transform uploaded property photos
- 📝 Customizable prompts via environment variables
- 🎯 K. Wah luxury design aesthetic
- ⏱️ Real-time progress tracking
- 🔄 Automatic task status polling (every 5 seconds)
- 🌐 Worldwide API access

### API Endpoints Used:
- `GET /api/v1/common/credit` - Check account balance
- `POST /api/v1/nanobanana/generate` - Submit generation task
- `GET /api/v1/nanobanana/task/{taskId}` - Poll task status

### How It Works:
1. **Upload**: User uploads 1-5 property images
2. **Submit**: App sends images + prompt to NanoBanana API
3. **Poll**: Automatically checks status every 5 seconds
4. **Display**: Shows generated interior design when complete
5. **Update**: Refreshes credit balance after generation

### Environment Variables:
```bash
# Required
REACT_APP_NANOBANANA_API_KEY=your_api_key_here
REACT_APP_CALLBACK_URL=https://webhook.site/your-url

# Optional (with defaults)
REACT_APP_DEFAULT_PROMPT=<K.Wah luxury interior prompt>
REACT_APP_IMAGE_SIZE=16:9
REACT_APP_NUM_IMAGES=1
REACT_APP_WATERMARK=K.WAH
```

See [ENV_SETUP.md](ENV_SETUP.md) for detailed configuration guide.

## Brand Colors

- **Navy**: #002147
- **Gold**: #b59a5d
- **Light Gold**: #d4c29d
- **Gray**: #f4f4f4

## Future Enhancements

- [x] ~~Integrate with actual AI image generation API~~ ✅ **Completed**
- [ ] Add user authentication
- [ ] Save and manage design concepts
- [ ] Export designs in various formats
- [ ] Add more customization options (multiple style presets)
- [ ] Multi-language support
- [ ] Backend proxy for secure API key management
- [ ] Batch processing for multiple rooms
- [ ] Before/After comparison view
- [ ] Download generated images directly

## License

This project is private and proprietary to K. Wah International.

---

© 2026 K. Wah International AI Lab


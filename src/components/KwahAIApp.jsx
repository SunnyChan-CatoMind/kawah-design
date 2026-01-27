import React, { useState, useEffect } from 'react';
import { Upload, X, Sparkles, Image as ImageIcon, Loader2, Coins, RefreshCw, AlertCircle } from 'lucide-react';
import { getAccountCredits, formatCredits, generateImage, pollTaskStatus, uploadImageToImgBB } from '../services/api';
import designOptions from '../config/designOptions.json';
import { promptTemplates, DEFAULT_TEMPLATE } from '../config/promptTemplates';

const KwahAIApp = () => {
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]); // Store actual File objects
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState(null);
  const [generationProgress, setGenerationProgress] = useState('');
  const [generationError, setGenerationError] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const [credits, setCredits] = useState(null);
  const [creditsLoading, setCreditsLoading] = useState(true);
  const [creditsError, setCreditsError] = useState(null);
  
  // Design options
  const [selectedRoomType, setSelectedRoomType] = useState('living_room');
  const [selectedStyle, setSelectedStyle] = useState('kwah_luxury');
  
  // Budget range (in HKD)
  const [budgetFrom, setBudgetFrom] = useState(100000);
  const [budgetTo, setBudgetTo] = useState(500000);

  // K.Wah Colors
  const colors = {
    navy: '#002147',
    gold: '#b59a5d',
    lightGold: '#d4c29d',
    gray: '#f4f4f4'
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      alert("Maximum 5 images allowed for the design analysis.");
      return;
    }

    const newImages = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      file: file // Store the actual File object
    }));

    setImages(prev => [...prev, ...newImages]);
    setImageFiles(prev => [...prev, ...files]);
  };

  const removeImage = (id) => {
    const imageToRemove = images.find(img => img.id === id);
    setImages(prev => prev.filter(img => img.id !== id));
    if (imageToRemove?.file) {
      setImageFiles(prev => prev.filter(f => f !== imageToRemove.file));
    }
  };

  // Fetch account credits on component mount
  useEffect(() => {
    fetchCredits();
  }, []);

  const fetchCredits = async () => {
    setCreditsLoading(true);
    setCreditsError(null);
    try {
      const balance = await getAccountCredits();
      setCredits(balance);
    } catch (error) {
      setCreditsError(error.message);
    } finally {
      setCreditsLoading(false);
    }
  };

  // Format number with commas
  const formatBudget = (value) => {
    return new Intl.NumberFormat('en-HK').format(value);
  };

  // Function to replace placeholders in prompt template
  const buildPrompt = (template, roomType, style, budgetFrom, budgetTo) => {
    // Get the display labels
    const roomTypeLabel = designOptions.roomTypes.find(r => r.value === roomType)?.label || roomType;
    const styleLabel = designOptions.styles.find(s => s.value === style)?.label || style;
    
    // Format budget values
    const budgetFromFormatted = formatBudget(budgetFrom);
    const budgetToFormatted = formatBudget(budgetTo);
    
    // Replace placeholders
    let finalPrompt = template
      .replace(/{ROOM_TYPE}/g, roomTypeLabel)
      .replace(/{STYLE}/g, styleLabel)
      .replace(/{BUDGET_FROM}/g, budgetFromFormatted)
      .replace(/{BUDGET_TO}/g, budgetToFormatted);
    
    return finalPrompt;
  };

  const generateConcept = async () => {
    if (images.length === 0) {
      alert("Please upload at least one image first.");
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);
    setGenerationProgress('Preparing images...');
    setResultImage(null);

    try {
      // Get prompt template from config file (fallback to env variable if needed)
      const promptTemplate = promptTemplates[DEFAULT_TEMPLATE] || 
        process.env.REACT_APP_DEFAULT_PROMPT || 
        'Transform this {ROOM_TYPE} into a luxurious {STYLE} interior design with premium materials and elegant furniture.';
      
      // Build final prompt with selected room type, style, and budget
      const prompt = buildPrompt(promptTemplate, selectedRoomType, selectedStyle, budgetFrom, budgetTo);
      
      // Log the final prompt for debugging
      console.log('=== GENERATION REQUEST ===');
      console.log('Room Type:', selectedRoomType);
      console.log('Style:', selectedStyle);
      console.log('Budget Range: HKD', formatBudget(budgetFrom), '-', formatBudget(budgetTo));
      console.log('Final Prompt:', prompt);
      console.log('=========================');
      
      const callBackUrl = process.env.REACT_APP_CALLBACK_URL || 'https://webhook.site/placeholder';
      const imageSize = process.env.REACT_APP_IMAGE_SIZE || '16:9';
      const numImages = parseInt(process.env.REACT_APP_NUM_IMAGES || '1');
      const watermark = process.env.REACT_APP_WATERMARK || '';

      // Upload images to get public URLs
      setGenerationProgress(`Uploading ${images.length} image(s) to cloud storage...`);
      const imageUrls = [];
      
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        setGenerationProgress(`Uploading image ${i + 1} of ${images.length}...`);
        
        try {
          const publicUrl = await uploadImageToImgBB(img.file);
          imageUrls.push(publicUrl);
          console.log(`Image ${i + 1} uploaded:`, publicUrl);
        } catch (uploadError) {
          console.error(`Failed to upload image ${i + 1}:`, uploadError);
          throw new Error(`Failed to upload image ${i + 1}: ${uploadError.message}`);
        }
      }

      console.log('All images uploaded successfully:', imageUrls);
      setGenerationProgress('All images uploaded! Submitting to NanoBanana AI...');

      // Submit generation task
      const newTaskId = await generateImage({
        prompt,
        imageUrls,
        type: 'IMAGETOIAMGE',
        numImages,
        image_size: imageSize,
        callBackUrl,
        watermark
      });

      setTaskId(newTaskId);
      setGenerationProgress(`Task submitted! ID: ${newTaskId}`);

      // Start polling for results
      setGenerationProgress('Generating your luxury interior concept...');
      
      const result = await pollTaskStatus(
        newTaskId,
        (taskDetails) => {
          // Update progress during polling
          if (taskDetails.status) {
            setGenerationProgress(`Status: ${taskDetails.status}...`);
          }
        },
        60, // Max 60 attempts
        5000 // Poll every 5 seconds
      );

      // Task completed successfully
      if (result.info && result.info.resultImageUrl) {
        setResultImage(result.info.resultImageUrl);
        setGenerationProgress('Generation complete!');
        
        // Refresh credits after successful generation
        fetchCredits();
      } else {
        throw new Error('No result image received');
      }

    } catch (error) {
      console.error('Image generation error:', error);
      setGenerationError(error.message);
      setGenerationProgress('');
      
      // Show user-friendly error message
      if (error.message.includes('API key not configured')) {
        alert('Please configure your NanoBanana API key in the .env.local file');
      } else if (error.message.includes('Callback URL is required')) {
        alert('Please configure a callback URL in the .env.local file or use webhook.site');
      } else if (error.message.includes('Failed to get task details') || 
                 error.message.includes('polling timeout')) {
        // Task might be processing but polling not supported
        const message = `Task submitted (ID: ${taskId}).\n\n` +
          `The generation is processing on NanoBanana servers.\n\n` +
          `Check your callback URL (webhook.site) for results, or ` +
          `check the NanoBanana dashboard with this task ID.`;
        alert(message);
      } else {
        alert(`Generation failed: ${error.message}`);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-serif text-slate-900">
      {/* Top Accent Bar */}
      <div style={{ backgroundColor: colors.gold }} className="h-1 w-full" />

      {/* Header */}
      <header className="border-b border-gray-100 py-6 px-8 bg-white sticky top-0 z-50 flex justify-between items-center">
        <div className="flex flex-col">
          <span style={{ color: colors.navy }} className="text-2xl font-bold tracking-tighter uppercase">K. WAH GROUP</span>
          <span style={{ color: colors.gold }} className="text-[10px] tracking-[0.3em] font-sans -mt-1 uppercase">Interior AI Concept</span>
        </div>
        
        {/* Credit Balance Display */}
        <div className="flex items-center gap-3">
          {creditsLoading ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-sm">
              <Loader2 className="animate-spin text-slate-400" size={16} />
              <span className="font-sans text-xs text-slate-500 uppercase tracking-wider">Loading...</span>
            </div>
          ) : creditsError ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-red-50 rounded-sm">
              <span className="font-sans text-xs text-red-600 uppercase tracking-wider">Error</span>
              <button 
                onClick={fetchCredits}
                className="text-red-600 hover:text-red-700 transition"
                title="Retry"
              >
                <RefreshCw size={14} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-sm border border-gray-200">
              <Coins style={{ color: colors.gold }} size={18} />
              <div className="flex flex-col">
                <span className="font-sans text-[9px] uppercase tracking-widest text-slate-400">Credits</span>
                <span style={{ color: colors.navy }} className="font-bold text-sm font-sans tracking-tight">
                  {formatCredits(credits)}
                </span>
              </div>
              <button 
                onClick={fetchCredits}
                className="text-slate-400 hover:text-slate-600 transition ml-1"
                title="Refresh balance"
              >
                <RefreshCw size={14} />
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:items-stretch">
          
          {/* Left Side: Upload Controls */}
          <div className="lg:col-span-5 space-y-8 flex flex-col">
            <section>
              <h1 style={{ color: colors.navy }} className="text-4xl font-light mb-4 tracking-tight">
                Design Your <span className="italic">Future Living</span>
              </h1>
              <p className="text-slate-500 font-sans text-sm leading-relaxed mb-8">
                Upload up to 5 reference photos of your raw property. Our AI will analyze the spatial structure and lighting to generate a K. Wah inspired luxury concept.
              </p>

              {/* Design Options */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Room Type Selector */}
                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-widest text-slate-500 mb-2">
                    Room Type
                  </label>
                  <select
                    value={selectedRoomType}
                    onChange={(e) => setSelectedRoomType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm font-sans text-sm bg-white hover:border-gray-400 focus:border-[#b59a5d] focus:outline-none transition"
                    style={{ color: colors.navy }}
                  >
                    {designOptions.roomTypes.map((room) => (
                      <option key={room.value} value={room.value}>
                        {room.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Style Selector */}
                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-widest text-slate-500 mb-2">
                    Design Style
                  </label>
                  <select
                    value={selectedStyle}
                    onChange={(e) => setSelectedStyle(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm font-sans text-sm bg-white hover:border-gray-400 focus:border-[#b59a5d] focus:outline-none transition"
                    style={{ color: colors.navy }}
                  >
                    {designOptions.styles.map((style) => (
                      <option key={style.value} value={style.value}>
                        {style.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Budget Range Selector */}
              <div className="mb-6">
                <label className="block font-sans text-[10px] uppercase tracking-widest text-slate-500 mb-3">
                  Renovation Budget (HKD)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {/* Budget From */}
                  <div>
                    <label className="block text-[9px] font-sans uppercase tracking-wider text-slate-400 mb-1">
                      From
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">HKD</span>
                      <input
                        type="number"
                        min="100000"
                        step="50000"
                        value={budgetFrom}
                        onChange={(e) => {
                          const value = Math.max(100000, parseInt(e.target.value) || 100000);
                          setBudgetFrom(value);
                          if (value > budgetTo) {
                            setBudgetTo(value);
                          }
                        }}
                        className="w-full pl-14 pr-4 py-3 border border-gray-300 rounded-sm font-sans text-sm bg-white hover:border-gray-400 focus:border-[#b59a5d] focus:outline-none transition"
                        style={{ color: colors.navy }}
                      />
                    </div>
                  </div>

                  {/* Budget To */}
                  <div>
                    <label className="block text-[9px] font-sans uppercase tracking-wider text-slate-400 mb-1">
                      To
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">HKD</span>
                      <input
                        type="number"
                        min="100000"
                        step="50000"
                        value={budgetTo}
                        onChange={(e) => {
                          const value = Math.max(budgetFrom, parseInt(e.target.value) || budgetFrom);
                          setBudgetTo(value);
                        }}
                        className="w-full pl-14 pr-4 py-3 border border-gray-300 rounded-sm font-sans text-sm bg-white hover:border-gray-400 focus:border-[#b59a5d] focus:outline-none transition"
                        style={{ color: colors.navy }}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Budget Display */}
                <div className="mt-2 text-center">
                  <p className="text-xs font-sans text-slate-500">
                    Budget Range: <span style={{ color: colors.gold }} className="font-bold">HKD {formatBudget(budgetFrom)} - {formatBudget(budgetTo)}</span>
                  </p>
                </div>
              </div>

              {/* Selected Options Display */}
              <div className="mb-6 p-3 bg-gray-50 border border-gray-200 rounded-sm">
                <p className="text-[9px] font-sans uppercase tracking-widest text-slate-400 mb-1">
                  Selected Configuration
                </p>
                <p className="text-xs font-sans text-slate-700">
                  <span style={{ color: colors.gold }} className="font-bold">
                    {designOptions.roomTypes.find(r => r.value === selectedRoomType)?.label}
                  </span>
                  {' '} in {' '}
                  <span style={{ color: colors.gold }} className="font-bold">
                    {designOptions.styles.find(s => s.value === selectedStyle)?.label}
                  </span>
                  {' '} style
                </p>
                <p className="text-xs font-sans text-slate-700 mt-1">
                  Budget: <span style={{ color: colors.gold }} className="font-bold">HKD {formatBudget(budgetFrom)} - {formatBudget(budgetTo)}</span>
                </p>
              </div>

              {/* Upload Zone */}
              <div 
                className={`border-2 border-dashed transition-all p-8 text-center rounded-sm
                  ${images.length >= 5 ? 'bg-gray-50 border-gray-200' : 'hover:border-[#b59a5d] border-gray-300'}`}
              >
                <input 
                  type="file" 
                  id="file-upload" 
                  className="hidden" 
                  multiple 
                  onChange={handleFileChange} 
                  disabled={images.length >= 5}
                  accept="image/*"
                />
                <label htmlFor="file-upload" className="cursor-pointer group">
                  <Upload className="mx-auto mb-4 text-slate-400 group-hover:text-[#b59a5d] transition-colors" size={32} />
                  <span className="block font-sans text-xs uppercase tracking-widest text-slate-600">
                    {images.length >= 5 ? "Limit Reached" : "Upload Base Images"}
                  </span>
                  <span className="text-[10px] text-slate-400 font-sans uppercase tracking-tighter mt-1 block">
                    {images.length}/5 Images Selected
                  </span>
                </label>
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-5 gap-2 mt-4">
                {images.map((img) => (
                  <div key={img.id} className="relative aspect-square border border-gray-100 group">
                    <img src={img.url} alt="raw" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => removeImage(img.id)}
                      className="absolute -top-1 -right-1 bg-white text-navy rounded-full shadow-md p-1 opacity-0 group-hover:opacity-100 transition"
                      aria-label="Remove image"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <button 
              onClick={generateConcept}
              disabled={images.length === 0 || isGenerating}
              style={{ backgroundColor: images.length > 0 && !isGenerating ? colors.navy : '#ccc' }}
              className="w-full py-5 text-white font-sans text-xs uppercase tracking-[0.3em] transition-all hover:bg-opacity-90 disabled:cursor-not-allowed flex justify-center items-center gap-3"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  {generationProgress || 'Generating...'}
                </>
              ) : (
                <>
                  <Sparkles size={16} className="text-[#b59a5d]" />
                  Generate AI Concept
                </>
              )}
            </button>
            
            {/* Generation Error Display */}
            {generationError && !isGenerating && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-sm flex items-start gap-3">
                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="text-xs font-bold text-red-800 uppercase tracking-wide mb-1">Generation Failed</p>
                  <p className="text-xs text-red-700 font-sans">{generationError}</p>
                  <button 
                    onClick={() => setGenerationError(null)}
                    className="mt-2 text-xs text-red-600 underline hover:text-red-800"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}
            
            {/* Task ID Display (for debugging) */}
            {taskId && (
              <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-sm">
                <p className="text-[9px] font-sans uppercase tracking-widest text-slate-400 mb-1">Task ID</p>
                <p className="text-xs font-mono text-slate-600">{taskId}</p>
              </div>
            )}
          </div>

          {/* Right Side: Preview Area */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="relative aspect-[16/10] bg-[#f9f9f9] overflow-hidden border border-gray-100 shadow-sm flex items-center justify-center flex-shrink-0">
              {resultImage ? (
                <div className="relative w-full h-full animate-in fade-in zoom-in duration-1000">
                  <img src={resultImage} alt="AI Generated Interior Design" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="text-center px-10">
                  <div className="relative inline-block mb-4">
                    <ImageIcon size={48} className="text-slate-200" />
                    {isGenerating && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="animate-spin text-[#b59a5d]" size={24} />
                      </div>
                    )}
                  </div>
                  <h3 className="font-sans text-[10px] uppercase tracking-[0.4em] text-slate-400 mb-2">
                    {isGenerating ? "AI is rendering your vision" : "The preview will appear here"}
                  </h3>
                  {isGenerating && generationProgress && (
                    <p className="font-sans text-[9px] text-slate-500 mt-2">
                      {generationProgress}
                    </p>
                  )}
                </div>
              )}
            </div>
            
            {/* Design Metadata (K. Wah style details) */}
            <div className="mt-8 grid grid-cols-3 gap-6">
              {[
                { label: 'Palette', val: 'Champagne & Oak' },
                { label: 'Lighting', val: 'Natural Ambient' },
                { label: 'Materials', val: 'Italian Marble' }
              ].map((item, i) => (
                <div key={i} className="border-t border-gray-100 pt-4">
                  <p className="font-sans text-[9px] uppercase tracking-widest text-[#b59a5d] mb-1">{item.label}</p>
                  <p className="text-xs font-semibold uppercase">{item.val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-gray-100 py-12 px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center opacity-60">
          <p className="text-[10px] font-sans tracking-[0.2em] uppercase">© 2026 K. Wah International AI Lab</p>
          <div className="flex space-x-6 mt-4 md:mt-0 font-sans text-[10px] tracking-widest uppercase">
            <a href="#" className="hover:text-[#b59a5d]">Privacy</a>
            <a href="#" className="hover:text-[#b59a5d]">Terms</a>
            <a href="#" className="hover:text-[#b59a5d]">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default KwahAIApp;


import React, { useState, useEffect } from 'react';
import { Upload, X, Sparkles, Image as ImageIcon, Loader2, Coins, RefreshCw, AlertCircle, ArrowLeft } from 'lucide-react';
import { getAccountCredits, formatCredits, generateImage, pollTaskStatus, uploadImageToImgBB } from '../services/api';
import { Link } from 'react-router-dom';

const CustomImageAdjustment = () => {
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState(null);
  const [generationProgress, setGenerationProgress] = useState('');
  const [generationError, setGenerationError] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const [credits, setCredits] = useState(null);
  const [creditsLoading, setCreditsLoading] = useState(true);
  const [creditsError, setCreditsError] = useState(null);

  // K.Wah Colors
  const colors = {
    navy: '#002147',
    gold: '#b59a5d',
    lightGold: '#d4c29d',
    gray: '#f4f4f4'
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      file: file
    });
    setImageFile(file);
  };

  const removeImage = () => {
    setImage(null);
    setImageFile(null);
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

  const generateAdjustedImage = async () => {
    if (!imageFile) {
      alert("Please upload an image first.");
      return;
    }

    if (!customPrompt.trim()) {
      alert("Please enter a prompt to describe your desired adjustments.");
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);
    setGenerationProgress('Preparing image...');
    setResultImage(null);

    try {
      const callBackUrl = process.env.REACT_APP_CALLBACK_URL || 'https://webhook.site/placeholder';
      const imageSize = process.env.REACT_APP_IMAGE_SIZE || '16:9';
      const numImages = parseInt(process.env.REACT_APP_NUM_IMAGES || '1');
      const watermark = process.env.REACT_APP_WATERMARK || '';

      // Upload image to get public URL
      setGenerationProgress('Uploading image to cloud storage...');
      
      let publicUrl;
      try {
        publicUrl = await uploadImageToImgBB(imageFile);
        console.log('Image uploaded:', publicUrl);
      } catch (uploadError) {
        console.error('Failed to upload image:', uploadError);
        throw new Error(`Failed to upload image: ${uploadError.message}`);
      }

      console.log('Image uploaded successfully:', publicUrl);
      setGenerationProgress('Image uploaded! Submitting to NanoBanana AI...');

      // Submit generation task with custom prompt
      const newTaskId = await generateImage({
        prompt: customPrompt.trim(),
        imageUrls: [publicUrl],
        type: 'IMAGETOIAMGE',
        numImages,
        image_size: imageSize,
        callBackUrl,
        watermark
      });

      setTaskId(newTaskId);
      setGenerationProgress(`Task submitted! ID: ${newTaskId}`);

      // Start polling for results
      setGenerationProgress('Processing your image adjustment...');
      
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
        <div className="flex items-center gap-4">
          <Link to="/" className="text-slate-400 hover:text-slate-600 transition">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex flex-col">
            <span style={{ color: colors.navy }} className="text-2xl font-bold tracking-tighter uppercase">K. WAH GROUP</span>
            <span style={{ color: colors.gold }} className="text-[10px] tracking-[0.3em] font-sans -mt-1 uppercase">Custom Image Adjustment</span>
          </div>
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
                Custom <span className="italic">Image Adjustment</span>
              </h1>
              <p className="text-slate-500 font-sans text-sm leading-relaxed mb-8">
                Upload an image and describe your desired adjustments using your own custom prompt. No templates - complete creative control.
              </p>

              {/* Upload Zone */}
              <div 
                className={`border-2 border-dashed transition-all p-8 text-center rounded-sm mb-6
                  ${image ? 'bg-gray-50 border-gray-200' : 'hover:border-[#b59a5d] border-gray-300'}`}
              >
                <input 
                  type="file" 
                  id="file-upload" 
                  className="hidden" 
                  onChange={handleFileChange} 
                  disabled={!!image}
                  accept="image/*"
                />
                <label htmlFor="file-upload" className="cursor-pointer group">
                  <Upload className="mx-auto mb-4 text-slate-400 group-hover:text-[#b59a5d] transition-colors" size={32} />
                  <span className="block font-sans text-xs uppercase tracking-widest text-slate-600">
                    {image ? "Image Uploaded" : "Upload Image"}
                  </span>
                  <span className="text-[10px] text-slate-400 font-sans uppercase tracking-tighter mt-1 block">
                    {image ? "1/1 Image Selected" : "Select an image to adjust"}
                  </span>
                </label>
              </div>

              {/* Image Preview */}
              {image && (
                <div className="relative aspect-video border border-gray-100 group mb-6">
                  <img src={image.url} alt="uploaded" className="w-full h-full object-cover" />
                  <button 
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-white text-navy rounded-full shadow-md p-2 opacity-0 group-hover:opacity-100 transition"
                    aria-label="Remove image"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              {/* Custom Prompt Input */}
              <div className="mb-6">
                <label className="block font-sans text-[10px] uppercase tracking-widest text-slate-500 mb-3">
                  Your Custom Prompt
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Describe the adjustments you want to make to the image. For example: 'Make the room brighter with warm lighting and add modern furniture' or 'Transform this into a minimalist Japanese-inspired space with natural materials'"
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-sm font-sans text-sm bg-white hover:border-gray-400 focus:border-[#b59a5d] focus:outline-none transition resize-none"
                  style={{ color: colors.navy }}
                />
                <p className="mt-2 text-[10px] font-sans text-slate-400">
                  {customPrompt.length} characters
                </p>
              </div>
            </section>

            <button 
              onClick={generateAdjustedImage}
              disabled={!image || !customPrompt.trim() || isGenerating}
              style={{ backgroundColor: image && customPrompt.trim() && !isGenerating ? colors.navy : '#ccc' }}
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
                  Generate Adjusted Image
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
                  <img src={resultImage} alt="AI Adjusted Image" className="w-full h-full object-cover" />
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
                    {isGenerating ? "AI is processing your adjustment" : "The adjusted image will appear here"}
                  </h3>
                  {isGenerating && generationProgress && (
                    <p className="font-sans text-[9px] text-slate-500 mt-2">
                      {generationProgress}
                    </p>
                  )}
                </div>
              )}
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

export default CustomImageAdjustment;

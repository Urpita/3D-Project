import React, { useState } from 'react';
import { Image as ImageIcon, Sparkles, RefreshCw, Download, Check, AlertCircle, Maximize2 } from 'lucide-react';

interface HeroImageGeneratorProps {
  initialPrompt: string;
  currentImageUrl?: string;
  currentImageSize?: '1K' | '2K' | '4K';
  onImageGenerated: (imageUrl: string, size: '1K' | '2K' | '4K') => void;
}

export const HeroImageGenerator: React.FC<HeroImageGeneratorProps> = ({
  initialPrompt,
  currentImageUrl,
  currentImageSize = '2K',
  onImageGenerated,
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>(currentImageSize);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '1:1' | '4:3'>('16:9');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  // Sync if email sequence changes
  React.useEffect(() => {
    setPrompt(initialPrompt);
  }, [initialPrompt]);

  const handleGenerateImage = async () => {
    if (!prompt.trim() || isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/image/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          imageSize, // Affordance: '1K', '2K', '4K'
          aspectRatio,
        }),
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to generate visual');
      }

      if (data.imageUrl) {
        onImageGenerated(data.imageUrl, imageSize);
      }
    } catch (err: any) {
      console.error('Image generation error:', err);
      setError(err.message || 'Image generation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!currentImageUrl) return;
    const a = document.createElement('a');
    a.href = currentImageUrl;
    a.download = `campaign-hero-${imageSize.toLowerCase()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm text-slate-100">
      
      {/* Header with Model Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <ImageIcon className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Email Hero Visual Creator</h3>
            <p className="text-xs text-slate-400">Generate studio-quality banner art directly for this email</p>
          </div>
        </div>

        {/* Model Indicator Badge */}
        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[11px] font-semibold">
          <Sparkles className="h-3 w-3" />
          <span>Model: gemini-3-pro-image-preview</span>
        </div>
      </div>

      {/* Visual Preview Container */}
      <div className="relative group rounded-xl overflow-hidden bg-slate-950 border border-slate-800 mb-4 aspect-[16/9] max-h-64 flex items-center justify-center">
        {currentImageUrl ? (
          <>
            <img
              src={currentImageUrl}
              alt="Email Hero Visual"
              className="w-full h-full object-cover"
            />
            
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3 backdrop-blur-[2px]">
              <button
                type="button"
                onClick={() => setPreviewModalOpen(true)}
                className="p-2 rounded-lg bg-slate-800/90 text-white hover:bg-slate-700 transition cursor-pointer"
                title="Full Screen Preview"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="p-2 rounded-lg bg-slate-800/90 text-white hover:bg-slate-700 transition cursor-pointer"
                title="Download Image"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>

            {/* Resolution Tag */}
            <div className="absolute top-2.5 right-2.5 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-slate-200 border border-slate-700/60 shadow-sm">
              {currentImageSize} HD
            </div>
          </>
        ) : (
          <div className="text-center p-6 text-slate-500">
            <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p className="text-xs">No visual generated yet for this email</p>
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center space-y-3 z-10">
            <div className="relative h-10 w-10">
              <div className="absolute inset-0 rounded-full border-2 border-purple-500/20 animate-ping" />
              <div className="h-10 w-10 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-purple-300">Rendering {imageSize} Visual with Gemini 3 Pro...</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Synthesizing lighting, composition & details</p>
            </div>
          </div>
        )}
      </div>

      {/* Image Size Affordance (1K, 2K, 4K) Required Feature */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
          <span>Image Resolution Size (Affordance)</span>
          <span className="text-[11px] text-purple-400 font-medium">{imageSize} Active</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['1K', '2K', '4K'] as const).map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setImageSize(size)}
              className={`py-2 px-3 rounded-xl border text-left transition cursor-pointer ${
                imageSize === size
                  ? 'bg-purple-600/20 border-purple-500 text-purple-200 shadow-sm'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-100">{size}</span>
                {imageSize === size && <Check className="h-3 w-3 text-purple-400" />}
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {size === '1K' ? '1024px (Standard)' : size === '2K' ? '2048px (Retina)' : '4096px (Ultra Crisp)'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Aspect Ratio Selector */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
          Aspect Ratio
        </label>
        <div className="flex space-x-2">
          {[
            { id: '16:9', label: '16:9 Banner (Recommended for Emails)' },
            { id: '1:1', label: '1:1 Square' },
            { id: '4:3', label: '4:3 Header' },
          ].map((aspect) => (
            <button
              key={aspect.id}
              type="button"
              onClick={() => setAspectRatio(aspect.id as any)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition cursor-pointer ${
                aspectRatio === aspect.id
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              {aspect.label}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Prompt Input */}
      <div className="mb-4">
        <label htmlFor="visual-prompt-input" className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
          <span>AI Visual Prompt</span>
          <span className="text-[11px] text-slate-500 font-normal">Auto-optimized for email header impact</span>
        </label>
        <textarea
          id="visual-prompt-input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-xs text-slate-200 outline-none resize-none transition"
          placeholder="Describe the desired visual aesthetic, lighting, and product focus..."
        />
      </div>

      {/* Error notification if any */}
      {error && (
        <div className="mb-3 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Action Button */}
      <button
        type="button"
        onClick={handleGenerateImage}
        disabled={isLoading || !prompt.trim()}
        className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-purple-600/25 transition active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {isLoading ? (
          <>
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            <span>Generating {imageSize} Visual...</span>
          </>
        ) : (
          <>
            <Sparkles className="h-3.5 w-3.5" />
            <span>Generate Visual ({imageSize} with gemini-3-pro-image-preview)</span>
          </>
        )}
      </button>

      {/* Full Preview Modal */}
      {previewModalOpen && currentImageUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative max-w-4xl max-h-[90vh] bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 p-2 shadow-2xl">
            <button
              onClick={() => setPreviewModalOpen(false)}
              className="absolute top-4 right-4 z-10 px-3 py-1 bg-slate-900/80 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer border border-slate-700"
            >
              Close
            </button>
            <img src={currentImageUrl} alt="Full view" className="max-w-full max-h-[80vh] object-contain rounded-xl" />
            <div className="p-3 text-xs text-slate-400 flex justify-between items-center">
              <span>Resolution: {imageSize} HD ({aspectRatio})</span>
              <button
                onClick={handleDownload}
                className="flex items-center space-x-1.5 text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Save to Disk</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

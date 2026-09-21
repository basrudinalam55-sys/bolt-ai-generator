'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { generateImageUrl, generateVariations, ASPECT_RATIOS, MODELS, PROMPT_TEMPLATES } from '@/lib/pollinations'
import { Download, Copy, RefreshCw, Zap, Sparkles, Image, Settings, X, ChevronDown, Loader2, GalleryVerticalEnd } from 'lucide-react'

export function ImageGenerator() {
  const [prompt, setPrompt] = useState('')
  const [aspectRatio, setAspectRatio] = useState<'square' | 'portrait' | 'landscape' | 'story' | 'video' | 'ultrawide'>('square')
  const [model, setModel] = useState<'flux' | 'gptimage' | 'sdxl' | 'midjourney' | 'dalle3'>('flux')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [history, setHistory] = useState<Array<{ prompt: string; images: string[]; timestamp: number }>>([])
  const [showTemplates, setShowTemplates] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [enhancePrompt, setEnhancePrompt] = useState(true)
  const [safeMode, setSafeMode] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('bolt-ai-history')
    if (saved) {
      try {
        setHistory(JSON.parse(saved))
      } catch {
        localStorage.removeItem('bolt-ai-history')
      }
    }
  }, [])

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('bolt-ai-history', JSON.stringify(history.slice(0, 50)))
  }, [history])

  const handleGenerate = useCallback(async (customPrompt?: string) => {
    const finalPrompt = customPrompt || prompt
    if (!finalPrompt.trim()) return

    setIsGenerating(true)
    const { width, height } = ASPECT_RATIOS[aspectRatio]
    const urls = generateVariations(finalPrompt, 4, { width, height, model, enhance: enhancePrompt, safe: safeMode })
    
    // Small delay for UX
    await new Promise(r => setTimeout(r, 300))
    
    setGeneratedImages(urls)
    setHistory(prev => [{
      prompt: finalPrompt,
      images: urls,
      timestamp: Date.now(),
    }, ...prev].slice(0, 50))
    setIsGenerating(false)
  }, [prompt, aspectRatio, model, enhancePrompt, safeMode])

  const handleDownload = async (url: string, index: number) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `bolt-ai-${Date.now()}-${index}.png`
      link.click()
      URL.revokeObjectURL(link.href)
    } catch {
      alert('Download failed. Try right-click → Save image.')
    }
  }

  const handleCopy = async (url: string) => {
    await navigator.clipboard.writeText(url)
    alert('Image URL copied!')
  }

  const handleTemplateClick = (templatePrompt: string) => {
    setPrompt(templatePrompt)
    setShowTemplates(false)
    handleGenerate(templatePrompt)
  }

  const handleRetry = () => {
    handleGenerate()
  }

  const clearHistory = () => {
    if (confirm('Clear all history?')) {
      setHistory([])
      localStorage.removeItem('bolt-ai-history')
    }
  }

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 glass border-b border-white/10 backdrop-blur-2xl">
        <div className="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative p-2 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 glow-orange">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl gradient-text">Bolt AI</h1>
              <p className="text-xs text-dark-400">Free Unlimited Image Generator</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="p-2 rounded-xl bg-dark-800/50 hover:bg-dark-700/50 transition-colors"
              aria-label="Prompt templates"
            >
              <GalleryVerticalEnd className="h-5 w-5 text-dark-300" />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-xl bg-dark-800/50 hover:bg-dark-700/50 transition-colors"
              aria-label="Settings"
            >
              <Settings className="h-5 w-5 text-dark-300" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-20 pb-24 px-4 mx-auto max-w-4xl">
        {/* Prompt Input */}
        <section className="mb-8 animate-slide-up">
          <div className="glass rounded-2xl p-4 md:p-6">
            <label htmlFor="prompt" className="block text-sm font-medium text-dark-300 mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-orange-400" />
              What do you want to create?
            </label>
            
            <div className="relative">
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleGenerate()
                  }
                }}
                placeholder="A cyberpunk city at night, neon lights, rain, photorealistic, 8k..."
                rows={3}
                className="w-full bg-dark-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-dark-500 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 focus:outline-none resize-none transition-all"
                disabled={isGenerating}
              />
              
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="absolute right-3 bottom-3 flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed glow-orange"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="h-5 w-5" />
                    Generate
                  </>
                )}
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 mt-3">
              <button
                onClick={() => handleGenerate(prompt + ', photorealistic, 8k, cinematic lighting')}
                className="px-3 py-1.5 text-xs rounded-full bg-dark-800 hover:bg-dark-700 border border-white/10 transition-colors"
              >
                <Sparkles className="h-3 w-3 inline mr-1" /> Enhance
              </button>
              <button
                onClick={() => {
                  const random = PROMPT_TEMPLATES.flatMap(c => c.prompts)[Math.floor(Math.random() * PROMPT_TEMPLATES.flatMap(c => c.prompts).length)]
                  handleGenerate(random)
                }}
                className="px-3 py-1.5 text-xs rounded-full bg-dark-800 hover:bg-dark-700 border border-white/10 transition-colors"
              >
                <Zap className="h-3 w-3 inline mr-1" /> Surprise Me
              </button>
              <button
                onClick={() => { setPrompt(''); setGeneratedImages([]); }}
                className="px-3 py-1.5 text-xs rounded-full bg-dark-800 hover:bg-dark-700 border border-white/10 transition-colors"
              >
                <X className="h-3 w-3 inline mr-1" /> Clear
              </button>
            </div>
          </div>
        </section>

        {/* Settings Panel */}
        {showSettings && (
          <section className="mb-6 animate-slide-up">
            <div className="glass rounded-2xl p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Generation Settings
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-dark-300 mb-2">Aspect Ratio</label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(ASPECT_RATIOS).map(([key, value]) => (
                      <button
                        key={key}
                        onClick={() => setAspectRatio(key as any)}
                        className={`p-3 rounded-xl text-center text-xs transition-all ${
                          aspectRatio === key
                            ? 'bg-orange-500/20 border border-orange-400'
                            : 'bg-dark-800/50 border border-white/10 hover:border-orange-400/50'
                        }`}
                      >
                        <div className="font-medium">{value.label}</div>
                        <div className="text-xs text-dark-400">{value.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-dark-300 mb-2">Model</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(MODELS).map(([key, value]) => (
                      <button
                        key={key}
                        onClick={() => setModel(key as any)}
                        className={`p-3 rounded-xl text-center text-xs transition-all ${
                          model === key
                            ? 'bg-orange-500/20 border border-orange-400'
                            : 'bg-dark-800/50 border border-white/10 hover:border-orange-400/50'
                        }`}
                      >
                        <div className="font-medium">{value.name}</div>
                        <div className="text-xs text-dark-400">{value.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enhancePrompt}
                    onChange={(e) => setEnhancePrompt(e.target.checked)}
                    className="w-4 h-4 rounded border-dark-600 bg-dark-800 text-orange-500 focus:ring-orange-400"
                  />
                  <span className="text-sm">Enhance prompt automatically</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={safeMode}
                    onChange={(e) => setSafeMode(e.target.checked)}
                    className="w-4 h-4 rounded border-dark-600 bg-dark-800 text-orange-500 focus:ring-orange-400"
                  />
                  <span className="text-sm">Safe mode (SFW)</span>
                </label>
              </div>
            </div>
          </section>
        )}

        {/* Templates Panel */}
        {showTemplates && (
          <section className="mb-6 animate-slide-up">
            <div className="glass rounded-2xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <GalleryVerticalEnd className="h-5 w-5" />
                  Prompt Templates
                </h3>
                <button
                  onClick={() => setShowTemplates(false)}
                  className="p-1 rounded-lg hover:bg-dark-800"
                >
                  <X className="h-5 w-5 text-dark-400" />
                </button>
              </div>
              <div className="space-y-4">
                {PROMPT_TEMPLATES.map((category) => (
                  <div key={category.category}>
                    <h4 className="text-sm font-medium text-dark-300 mb-2">{category.category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {category.prompts.map((templatePrompt) => (
                        <button
                          key={templatePrompt}
                          onClick={() => handleTemplateClick(templatePrompt)}
                          className="px-3 py-1.5 text-xs rounded-full bg-dark-800 hover:bg-dark-700 border border-white/10 text-left whitespace-nowrap transition-colors"
                        >
                          {templatePrompt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Generated Images */}
        <section className="mb-8 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-lg">Generated Images</h2>
            {generatedImages.length > 0 && (
              <button
                onClick={() => generatedImages.forEach((url, i) => handleDownload(url, i))}
                className="px-3 py-1.5 text-xs rounded-full bg-orange-500/20 border border-orange-400 text-orange-300 hover:bg-orange-500/30 transition-colors flex items-center gap-1"
              >
                <Download className="h-3.5 w-3.5" />
                Download All
              </button>
            )}
          </div>

          {isGenerating && (
            <div className="glass rounded-2xl p-8 text-center animate-pulse-glow">
              <div className="relative w-32 h-32 mx-auto mb-4 animate-bolt-strike">
                <div className="w-full h-full bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-2xl flex items-center justify-center">
                  <Zap className="h-16 w-16 text-orange-400 animate-pulse" />
                </div>
              </div>
              <p className="text-dark-300">Bolt is striking... ⚡</p>
              <p className="text-xs text-dark-500 mt-1">Generating 4 variations via Pollinations AI</p>
            </div>
          )}

          {!isGenerating && generatedImages.length > 0 && (
            <div className="grid grid-cols-2 gap-3" role="list">
              {generatedImages.map((url, index) => (
                <article
                  key={index}
                  className="relative group glass rounded-xl overflow-hidden aspect-square"
                  role="listitem"
                >
                  <img
                    src={url}
                    alt={`Generated image ${index + 1}: ${prompt}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownload(url, index)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 backdrop-blur rounded-lg text-white text-xs font-medium transition-colors"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Save
                      </button>
                      <button
                        onClick={() => handleCopy(url)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 backdrop-blur rounded-lg text-white text-xs font-medium transition-colors"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        Copy
                      </button>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-2 left-2 right-2 flex justify-between">
                    <span className="text-xs bg-black/50 backdrop-blur px-2 py-1 rounded">
                      {ASPECT_RATIOS[aspectRatio].label}
                    </span>
                    <span className="text-xs bg-black/50 backdrop-blur px-2 py-1 rounded">
                      {MODELS[model].name}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}

          {!isGenerating && generatedImages.length === 0 && history.length === 0 && (
            <div className="glass rounded-2xl p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center">
                <Zap className="h-10 w-10 text-orange-400" />
              </div>
              <h3 className="font-display font-semibold text-xl mb-2">Ready to Generate</h3>
              <p className="text-dark-400 mb-6 max-w-xs mx-auto">
                Describe anything. Bolt creates it instantly. Free, unlimited, no signup.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {PROMPT_TEMPLATES.flatMap(c => c.prompts).slice(0, 6).map((templatePrompt) => (
                  <button
                    key={templatePrompt}
                    onClick={() => handleTemplateClick(templatePrompt)}
                    className="px-4 py-2 text-sm rounded-full bg-dark-800 hover:bg-dark-700 border border-white/10 transition-colors"
                  >
                    {templatePrompt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* History */}
        {history.length > 0 && (
          <section className="animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-lg">Recent Generations</h2>
              <button
                onClick={clearHistory}
                className="text-xs text-dark-400 hover:text-orange-400 transition-colors"
              >
                Clear history
              </button>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {history.slice(0, 10).map((item, index) => (
                <div
                  key={index}
                  className="glass rounded-xl p-3 flex items-center gap-3"
                  onClick={() => {
                    setPrompt(item.prompt)
                    setGeneratedImages(item.images)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 relative">
                    <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-1 text-xs bg-black/70 backdrop-blur px-1.5 py-0.5 rounded">
                      {item.images.length} imgs
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.prompt}</p>
                    <p className="text-xs text-dark-400">
                      {new Date(item.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <Image className="h-5 w-5 text-dark-400" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-dark-500">
          <p className="mb-2">Powered by <a href="https://pollinations.ai" target="_blank" rel="noopener" className="text-orange-400 hover:underline">Pollinations AI</a> — Free, Unlimited, No API Key</p>
          <p>Models: Flux • SDXL • GPT-Image • Midjourney Style • DALL-E 3 Style</p>
          <p className="mt-2">Built with Next.js • PWA Ready • Mobile First</p>
        </footer>
      </main>

      {/* PWA Install Prompt */}
      <div className="fixed bottom-4 left-4 right-4 md:bottom-6 md:left-auto md:right-6 md:w-96 glass rounded-xl p-4 shadow-2xl border border-white/10 animate-slide-up z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-sm">Install Bolt AI</p>
              <p className="text-xs text-dark-400">Add to home screen for instant access</p>
            </div>
          </div>
          <button
            onClick={() => {
              localStorage.setItem('bolt-ai-install-dismissed', 'true')
              document.querySelector('.pwa-prompt')?.remove()
            }}
            className="p-1 rounded-lg hover:bg-dark-800"
          >
            <X className="h-5 w-5 text-dark-400" />
          </button>
        </div>
      </div>
    </div>
  )
}
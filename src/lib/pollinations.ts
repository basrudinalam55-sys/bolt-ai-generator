// Pollinations AI - Free Unlimited Image Generation
// No API key required, no rate limits

export interface GenerationOptions {
  prompt: string
  width?: number
  height?: number
  model?: 'flux' | 'gptimage' | 'sdxl' | 'midjourney' | 'dalle3'
  seed?: number
  nologo?: boolean
  private?: boolean
  enhance?: boolean
  safe?: boolean
}

export interface GenerationResult {
  imageUrl: string
  prompt: string
  options: GenerationOptions
  timestamp: number
}

const POLLINATIONS_BASE = 'https://image.pollinations.ai/prompt/'

// Generate image URL (direct link, no proxy needed)
export function generateImageUrl(options: GenerationOptions): string {
  const {
    prompt,
    width = 1024,
    height = 1024,
    model = 'flux',
    seed,
    nologo = true,
    private: isPrivate = true,
    enhance = true,
    safe = true,
  } = options

  const params = new URLSearchParams({
    prompt: prompt.trim(),
    width: width.toString(),
    height: height.toString(),
    model,
    ...(seed && { seed: seed.toString() }),
    ...(nologo && { nologo: 'true' }),
    ...(isPrivate && { private: 'true' }),
    ...(enhance && { enhance: 'true' }),
    ...(safe && { safe: 'true' }),
  })

  return `${POLLINATIONS_BASE}${encodeURIComponent(prompt.trim())}?${params.toString()}`
}

// Generate multiple variations
export function generateVariations(
  prompt: string,
  count: number = 4,
  options: Omit<GenerationOptions, 'prompt'> = {}
): string[] {
  return Array.from({ length: count }, (_, i) => 
    generateImageUrl({
      ...options,
      prompt,
      seed: options.seed ? options.seed + i : Date.now() + i,
    })
  )
}

// Pre-defined aspect ratios
export const ASPECT_RATIOS = {
  square: { width: 1024, height: 1024, label: 'Square (1:1)', description: 'Posts, avatars' },
  portrait: { width: 768, height: 1024, label: 'Portrait (3:4)', description: 'Mobile wallpapers' },
  landscape: { width: 1024, height: 768, label: 'Landscape (4:3)', description: 'Thumbnails, covers' },
  story: { width: 768, height: 1344, label: 'Story (9:16)', description: 'Instagram Stories, Reels' },
  video: { width: 1280, height: 720, label: 'Video (16:9)', description: 'YouTube thumbnails' },
  ultrawide: { width: 1536, height: 640, label: 'Ultrawide (12:5)', description: 'Banners, headers' },
} as const

// Model options
export const MODELS = {
  flux: { name: 'Flux', description: 'Best quality, fastest', recommended: true },
  gptimage: { name: 'GPT-Image', description: 'OpenAI\'s latest', recommended: false },
  sdxl: { name: 'SDXL', description: 'Stable Diffusion XL', recommended: false },
  midjourney: { name: 'Midjourney Style', description: 'Artistic, stylized', recommended: false },
  dalle3: { name: 'DALL-E 3 Style', description: 'Detailed, accurate', recommended: false },
} as const

// Prompt enhancement suggestions
export const PROMPT_ENHANCERS = {
  style: [
    'photorealistic', 'cinematic', 'anime', 'oil painting', 'watercolor',
    'pixel art', '3d render', 'isometric', 'low poly', 'vector art'
  ],
  lighting: [
    'golden hour', 'neon lights', 'studio lighting', 'volumetric lighting',
    'dramatic shadows', 'rim light', 'softbox', 'natural light', 'bioluminescence'
  ],
  camera: [
    '8k', '4k', 'ultra detailed', 'macro', 'wide angle', 'telephoto',
    'shallow depth of field', 'bokeh', 'sharp focus', 'hyperrealistic'
  ],
  mood: [
    'ethereal', 'dark', 'vibrant', 'moody', 'serene', 'epic',
    'whimsical', 'gritty', 'dreamy', 'cyberpunk', 'minimalist'
  ],
} as const

// Popular prompt templates
export const PROMPT_TEMPLATES = [
  { category: 'Portraits', prompts: [
    'professional headshot, studio lighting, 8k',
    'cyberpunk portrait, neon lights, rain',
    'fantasy character, ethereal, magical',
    'vintage portrait, film grain, nostalgic',
  ]},
  { category: 'Landscapes', prompts: [
    'mountain sunrise, golden hour, photorealistic',
    'alien planet, twin suns, surreal',
    'enchanted forest, bioluminescent, magical',
    'post-apocalyptic city, overgrown, cinematic',
  ]},
  { category: 'Architecture', prompts: [
    'futuristic skyscraper, glass, reflections',
    'ancient temple, overgrown, mystical',
    'modern house, minimalist, sunset',
    'cyberpunk city, neon, rain, night',
  ]},
  { category: 'Products', prompts: [
    'luxury watch, macro, studio lighting',
    'smartphone, floating, neon background',
    'sneakers, product photography, 8k',
    'perfume bottle, elegant, reflections',
  ]},
  { category: 'Art & Design', prompts: [
    'abstract art, fluid, vibrant colors',
    'geometric patterns, sacred geometry',
    'typography design, bold, modern',
    'logo design, minimalist, vector',
  ]},
] as const
'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Play,
  Pause,
  Upload,
  Scissors,
  Wand2,
  Download,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Film,
  Type,
  Music,
  Zap
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface VideoClip {
  id: string
  file: File | null
  url: string
  startTime: number
  endTime: number
  duration: number
  effects: string[]
}

interface TextOverlay {
  id: string
  text: string
  x: number
  y: number
  fontSize: number
  color: string
}

export default function Home() {
  const [clips, setClips] = useState<VideoClip[]>([])
  const [currentClip, setCurrentClip] = useState<VideoClip | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [totalDuration, setTotalDuration] = useState(0)
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([])
  const [selectedEffect, setSelectedEffect] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const effects = [
    { name: 'None', icon: Film, value: '' },
    { name: 'B&W', icon: Sparkles, value: 'grayscale(100%)' },
    { name: 'Vintage', icon: Wand2, value: 'sepia(80%) contrast(110%)' },
    { name: 'Bright', icon: Zap, value: 'brightness(120%) contrast(110%)' },
    { name: 'Cool', icon: Sparkles, value: 'hue-rotate(180deg)' },
    { name: 'Warm', icon: Sparkles, value: 'hue-rotate(-30deg) saturate(130%)' }
  ]

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => setCurrentTime(video.currentTime)
    const updateDuration = () => setTotalDuration(video.duration)
    const handleEnded = () => setIsPlaying(false)

    video.addEventListener('timeupdate', updateTime)
    video.addEventListener('loadedmetadata', updateDuration)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('timeupdate', updateTime)
      video.removeEventListener('loadedmetadata', updateDuration)
      video.removeEventListener('ended', handleEnded)
    }
  }, [])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('video/')) {
        const url = URL.createObjectURL(file)
        const video = document.createElement('video')
        video.src = url
        video.onloadedmetadata = () => {
          const newClip: VideoClip = {
            id: Math.random().toString(36).substr(2, 9),
            file,
            url,
            startTime: 0,
            endTime: Math.min(video.duration, 60),
            duration: video.duration,
            effects: []
          }
          setClips(prev => [...prev, newClip])
          if (!currentClip) {
            setCurrentClip(newClip)
          }
        }
      }
    })
  }

  const togglePlayPause = () => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return
    const time = parseFloat(e.target.value)
    videoRef.current.currentTime = time
    setCurrentTime(time)
  }

  const resetVideo = () => {
    if (!videoRef.current) return
    videoRef.current.currentTime = 0
    setCurrentTime(0)
    setIsPlaying(false)
  }

  const applyEffect = (effect: string) => {
    setSelectedEffect(effect)
  }

  const aiAutoEdit = () => {
    setIsProcessing(true)

    // Simulate AI processing
    setTimeout(() => {
      // Auto-trim to 60 seconds
      if (currentClip && currentClip.duration > 60) {
        const updatedClip = {
          ...currentClip,
          endTime: 60
        }
        setCurrentClip(updatedClip)
        setClips(clips.map(c => c.id === currentClip.id ? updatedClip : c))
      }

      // Apply auto effects
      setSelectedEffect('brightness(110%) contrast(105%) saturate(110%)')

      // Add sample text overlay
      const newText: TextOverlay = {
        id: Math.random().toString(36).substr(2, 9),
        text: 'AI Enhanced',
        x: 50,
        y: 10,
        fontSize: 32,
        color: '#ffffff'
      }
      setTextOverlays([newText])

      setIsProcessing(false)
    }, 2000)
  }

  const addTextOverlay = () => {
    const newText: TextOverlay = {
      id: Math.random().toString(36).substr(2, 9),
      text: 'Edit Me',
      x: 50,
      y: 50,
      fontSize: 24,
      color: '#ffffff'
    }
    setTextOverlays([...textOverlays, newText])
  }

  const exportVideo = async () => {
    setIsProcessing(true)

    // Simulate export process
    setTimeout(() => {
      alert('Video export feature would render the final video with all effects and overlays. In a production app, this would use server-side processing or client-side canvas rendering.')
      setIsProcessing(false)
    }, 2000)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const maxDuration = Math.min(totalDuration, 60)

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Film className="w-12 h-12 text-purple-400" />
            AI Video Editor
          </h1>
          <p className="text-purple-300 text-lg">Create professional 1-minute videos with AI assistance</p>
        </motion.div>

        {/* Main Editor */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Video Preview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-purple-500/30"
          >
            <div className="aspect-video bg-black relative">
              {currentClip ? (
                <>
                  <video
                    ref={videoRef}
                    src={currentClip.url}
                    className="w-full h-full object-contain"
                    style={{ filter: selectedEffect }}
                  />
                  {textOverlays.map((overlay) => (
                    <div
                      key={overlay.id}
                      className="absolute pointer-events-none"
                      style={{
                        left: `${overlay.x}%`,
                        top: `${overlay.y}%`,
                        transform: 'translate(-50%, -50%)',
                        fontSize: `${overlay.fontSize}px`,
                        color: overlay.color,
                        fontWeight: 'bold',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                        fontFamily: 'sans-serif'
                      }}
                    >
                      {overlay.text}
                    </div>
                  ))}
                  {isProcessing && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mb-4"></div>
                        <p className="text-white text-lg">AI Processing...</p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                  <Upload className="w-20 h-20 mb-4" />
                  <p className="text-xl">Upload a video to start editing</p>
                </div>
              )}
            </div>

            {/* Video Controls */}
            <div className="bg-slate-800 p-6 border-t border-slate-700">
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={togglePlayPause}
                  disabled={!currentClip}
                  className="control-btn bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-3 rounded-full"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>

                <button
                  onClick={resetVideo}
                  disabled={!currentClip}
                  className="control-btn bg-slate-700 hover:bg-slate-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white p-3 rounded-full"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>

                <button
                  onClick={toggleMute}
                  disabled={!currentClip}
                  className="control-btn bg-slate-700 hover:bg-slate-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white p-3 rounded-full"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>

                <div className="flex-1">
                  <input
                    type="range"
                    min="0"
                    max={maxDuration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    disabled={!currentClip}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                  <div className="flex justify-between text-sm text-gray-400 mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(maxDuration)}</span>
                  </div>
                </div>
              </div>

              {currentClip && totalDuration > 60 && (
                <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3 text-yellow-200 text-sm">
                  ⚠️ Video exceeds 60 seconds. Use AI Auto-Edit to trim automatically.
                </div>
              )}
            </div>
          </motion.div>

          {/* Tools Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Upload */}
            <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-purple-500/30">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-purple-400" />
                Upload Video
              </h3>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileUpload}
                multiple
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Choose Video Files
              </button>
            </div>

            {/* AI Tools */}
            <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-purple-500/30">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-purple-400" />
                AI Tools
              </h3>
              <button
                onClick={aiAutoEdit}
                disabled={!currentClip || isProcessing}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-all mb-3 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                AI Auto-Edit
              </button>
              <p className="text-gray-400 text-sm">
                Automatically trim, enhance, and optimize your video
              </p>
            </div>

            {/* Effects */}
            <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-purple-500/30">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Effects
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {effects.map((effect) => (
                  <button
                    key={effect.value}
                    onClick={() => applyEffect(effect.value)}
                    disabled={!currentClip}
                    className={`p-3 rounded-lg transition-all flex flex-col items-center gap-1 ${
                      selectedEffect === effect.value
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <effect.icon className="w-5 h-5" />
                    <span className="text-xs">{effect.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Text Overlay */}
            <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-purple-500/30">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Type className="w-5 h-5 text-purple-400" />
                Text Overlay
              </h3>
              <button
                onClick={addTextOverlay}
                disabled={!currentClip}
                className="w-full bg-slate-700 hover:bg-slate-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
              >
                Add Text
              </button>
            </div>

            {/* Export */}
            <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-purple-500/30">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Download className="w-5 h-5 text-purple-400" />
                Export
              </h3>
              <button
                onClick={exportVideo}
                disabled={!currentClip || isProcessing}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Export Video
              </button>
            </div>
          </motion.div>
        </div>

        {/* Timeline */}
        {clips.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 bg-slate-800 rounded-xl p-6 shadow-xl border border-purple-500/30"
          >
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Scissors className="w-5 h-5 text-purple-400" />
              Timeline ({clips.length} clip{clips.length !== 1 ? 's' : ''})
            </h3>
            <div className="timeline-track rounded-lg p-4 flex gap-2 overflow-x-auto">
              {clips.map((clip) => (
                <motion.div
                  key={clip.id}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setCurrentClip(clip)}
                  className={`clip-item rounded-lg p-4 min-w-[150px] cursor-pointer ${
                    currentClip?.id === clip.id ? 'ring-2 ring-white' : ''
                  }`}
                >
                  <p className="text-white font-medium text-sm mb-1 truncate">
                    {clip.file?.name || 'Video Clip'}
                  </p>
                  <p className="text-purple-200 text-xs">
                    {formatTime(clip.endTime - clip.startTime)}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </main>
  )
}

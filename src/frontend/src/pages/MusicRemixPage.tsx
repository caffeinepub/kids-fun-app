import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCreateMusicRemix, useGetApprovedRemixes } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Music, Play, Pause, Download, Volume2, Plus, X, Sparkles, Loader2 } from 'lucide-react';

interface AudioLoop {
  id: string;
  name: string;
  category: string;
  color: string;
  emoji: string;
  audioUrl: string;
}

interface SelectedTrack {
  id: string;
  loop: AudioLoop;
  volume: number;
  audioBuffer?: AudioBuffer;
  gainNode?: GainNode;
  sourceNode?: AudioBufferSourceNode;
}

export default function MusicRemixPage() {
  const [remixTitle, setRemixTitle] = useState('');
  const [selectedTracks, setSelectedTracks] = useState<SelectedTrack[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(60);
  const [isExporting, setIsExporting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const startTimeRef = useRef<number>(0);

  const createRemixMutation = useCreateMusicRemix();
  const { data: approvedRemixes = [], isLoading: remixesLoading } = useGetApprovedRemixes();

  // Initialize audio context
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    analyserRef.current = audioContextRef.current.createAnalyser();
    analyserRef.current.fftSize = 256;
    analyserRef.current.connect(audioContextRef.current.destination);

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const audioLoops: AudioLoop[] = [
    { id: 'drums_1', name: 'Hip Hop Beat', category: 'Drums', color: 'from-red-400 to-red-600', emoji: '🥁', audioUrl: '/assets/audio/drums_1.mp3' },
    { id: 'drums_2', name: 'Rock Drums', category: 'Drums', color: 'from-red-500 to-red-700', emoji: '🥁', audioUrl: '/assets/audio/drums_2.mp3' },
    { id: 'drums_3', name: 'Electronic Beat', category: 'Drums', color: 'from-red-300 to-red-500', emoji: '🥁', audioUrl: '/assets/audio/drums_3.mp3' },
    { id: 'melody_1', name: 'Piano Melody', category: 'Melody', color: 'from-purple-400 to-purple-600', emoji: '🎹', audioUrl: '/assets/audio/melody_1.mp3' },
    { id: 'melody_2', name: 'Synth Lead', category: 'Melody', color: 'from-purple-500 to-purple-700', emoji: '🎹', audioUrl: '/assets/audio/melody_2.mp3' },
    { id: 'melody_3', name: 'Guitar Riff', category: 'Melody', color: 'from-purple-300 to-purple-500', emoji: '🎸', audioUrl: '/assets/audio/melody_3.mp3' },
    { id: 'bass_1', name: 'Deep Bass', category: 'Bass', color: 'from-blue-400 to-blue-600', emoji: '🎸', audioUrl: '/assets/audio/bass_1.mp3' },
    { id: 'bass_2', name: 'Funky Bass', category: 'Bass', color: 'from-blue-500 to-blue-700', emoji: '🎸', audioUrl: '/assets/audio/bass_2.mp3' },
    { id: 'vocals_1', name: 'Kids Choir', category: 'Vocals', color: 'from-pink-400 to-pink-600', emoji: '🎤', audioUrl: '/assets/audio/vocals_1.mp3' },
    { id: 'vocals_2', name: 'Happy Vocals', category: 'Vocals', color: 'from-pink-500 to-pink-700', emoji: '🎤', audioUrl: '/assets/audio/vocals_2.mp3' },
    { id: 'effects_1', name: 'Sparkle FX', category: 'Effects', color: 'from-yellow-400 to-yellow-600', emoji: '✨', audioUrl: '/assets/audio/effects_1.mp3' },
    { id: 'effects_2', name: 'Whoosh FX', category: 'Effects', color: 'from-yellow-500 to-yellow-700', emoji: '✨', audioUrl: '/assets/audio/effects_2.mp3' },
  ];

  const categories = ['Drums', 'Melody', 'Bass', 'Vocals', 'Effects'];

  // Waveform animation
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      if (isPlaying && analyserRef.current) {
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);

        const bars = 60;
        const barWidth = width / bars;

        for (let i = 0; i < bars; i++) {
          const dataIndex = Math.floor((i / bars) * bufferLength);
          const amplitude = dataArray[dataIndex] / 255;
          const barHeight = amplitude * height * 0.8;
          const x = i * barWidth;
          const y = (height - barHeight) / 2;

          ctx.shadowBlur = 15;
          ctx.shadowColor = '#ff00ff';
          
          const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
          gradient.addColorStop(0, '#ff00ff');
          gradient.addColorStop(0.5, '#00ffff');
          gradient.addColorStop(1, '#ffff00');
          
          ctx.fillStyle = gradient;
          ctx.fillRect(x, y, barWidth - 2, barHeight);
        }
      } else {
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current !== undefined) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  // Playback timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            stopPlayback();
            return 0;
          }
          return prev + 0.1;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const loadAudioBuffer = async (url: string): Promise<AudioBuffer> => {
    if (!audioContextRef.current) {
      throw new Error('Audio context not initialized');
    }

    // Generate a simple tone as a placeholder since we don't have actual audio files
    const sampleRate = audioContextRef.current.sampleRate;
    const durationSeconds = 4;
    const buffer = audioContextRef.current.createBuffer(2, sampleRate * durationSeconds, sampleRate);
    
    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      const frequency = 220 + Math.random() * 440;
      
      for (let i = 0; i < channelData.length; i++) {
        const t = i / sampleRate;
        channelData[i] = Math.sin(2 * Math.PI * frequency * t) * 0.3 * Math.exp(-t);
      }
    }
    
    return buffer;
  };

  const addTrack = async (loop: AudioLoop) => {
    try {
      const trackId = `track_${Date.now()}`;
      const audioBuffer = await loadAudioBuffer(loop.audioUrl);
      
      setSelectedTracks((prev) => [
        ...prev,
        { id: trackId, loop, volume: 70, audioBuffer },
      ]);
      toast.success(`Added ${loop.name} to your remix!`);
    } catch (error) {
      console.error('Error loading audio:', error);
      toast.error('Failed to load audio track');
    }
  };

  const removeTrack = (trackId: string) => {
    setSelectedTracks((prev) => prev.filter((t) => t.id !== trackId));
  };

  const updateVolume = (trackId: string, volume: number) => {
    setSelectedTracks((prev) =>
      prev.map((t) => {
        if (t.id === trackId) {
          if (t.gainNode) {
            t.gainNode.gain.value = volume / 100;
          }
          return { ...t, volume };
        }
        return t;
      })
    );
  };

  const stopPlayback = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    
    selectedTracks.forEach(track => {
      if (track.sourceNode) {
        try {
          track.sourceNode.stop();
        } catch (e) {
          // Ignore if already stopped
        }
      }
    });
    
    setSelectedTracks(prev => prev.map(t => ({
      ...t,
      sourceNode: undefined,
      gainNode: undefined,
    })));
  };

  const togglePlayback = async () => {
    if (selectedTracks.length === 0) {
      toast.error('Add some tracks first!');
      return;
    }

    if (!audioContextRef.current || !analyserRef.current) {
      toast.error('Audio system not ready');
      return;
    }

    if (isPlaying) {
      stopPlayback();
      return;
    }

    try {
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      const startTime = audioContextRef.current.currentTime;
      startTimeRef.current = startTime;

      const updatedTracks = selectedTracks.map(track => {
        if (!track.audioBuffer || !audioContextRef.current || !analyserRef.current) {
          return track;
        }

        const sourceNode = audioContextRef.current.createBufferSource();
        sourceNode.buffer = track.audioBuffer;
        sourceNode.loop = true;

        const gainNode = audioContextRef.current.createGain();
        gainNode.gain.value = track.volume / 100;

        sourceNode.connect(gainNode);
        gainNode.connect(analyserRef.current);

        sourceNode.start(startTime);

        return {
          ...track,
          sourceNode,
          gainNode,
        };
      });

      setSelectedTracks(updatedTracks);
      setIsPlaying(true);
      setCurrentTime(0);
      
      toast.success('🎵 Playing your remix!');
    } catch (error) {
      console.error('Error starting playback:', error);
      toast.error('Failed to start playback');
    }
  };

  const handleExport = async () => {
    if (!remixTitle.trim()) {
      toast.error('Please enter a title for your remix!');
      return;
    }

    if (selectedTracks.length === 0) {
      toast.error('Please add at least one track!');
      return;
    }

    if (!audioContextRef.current) {
      toast.error('Audio system not ready');
      return;
    }

    setIsExporting(true);

    try {
      const offlineContext = new OfflineAudioContext(
        2,
        audioContextRef.current.sampleRate * duration,
        audioContextRef.current.sampleRate
      );

      selectedTracks.forEach(track => {
        if (!track.audioBuffer) return;

        const sourceNode = offlineContext.createBufferSource();
        sourceNode.buffer = track.audioBuffer;
        sourceNode.loop = true;

        const gainNode = offlineContext.createGain();
        gainNode.gain.value = track.volume / 100;

        sourceNode.connect(gainNode);
        gainNode.connect(offlineContext.destination);

        sourceNode.start(0);
      });

      const renderedBuffer = await offlineContext.startRendering();

      const wavBlob = audioBufferToWav(renderedBuffer);
      const arrayBuffer = await wavBlob.arrayBuffer();
      const audioData = new Uint8Array(arrayBuffer);

      await createRemixMutation.mutateAsync({
        title: remixTitle,
        audio: audioData,
        duration: duration,
        isPublic: false,
      });

      const url = URL.createObjectURL(wavBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${remixTitle.replace(/[^a-z0-9]/gi, '_')}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('🎵 Remix exported successfully!', {
        description: 'Your remix has been saved and downloaded!',
      });

      setRemixTitle('');
      setSelectedTracks([]);
      setIsPlaying(false);
      setCurrentTime(0);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export remix. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const audioBufferToWav = (buffer: AudioBuffer): Blob => {
    const numberOfChannels = buffer.numberOfChannels;
    const length = buffer.length * numberOfChannels * 2;
    const arrayBuffer = new ArrayBuffer(44 + length);
    const view = new DataView(arrayBuffer);

    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, buffer.sampleRate, true);
    view.setUint32(28, buffer.sampleRate * numberOfChannels * 2, true);
    view.setUint16(32, numberOfChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length, true);

    let offset = 44;
    for (let i = 0; i < buffer.length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
        offset += 2;
      }
    }

    return new Blob([arrayBuffer], { type: 'audio/wav' });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-purple-400 to-pink-400 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
            🎵 Music Remix Studio
          </h1>
          <p className="text-xl text-white/90 drop-shadow-lg">
            Create amazing music by mixing loops and sounds!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Audio Library */}
          <Card className="lg:col-span-1 border-4 border-white/30 bg-white/95 backdrop-blur-sm shadow-[0_0_30px_rgba(255,0,255,0.3)]">
            <CardHeader className="border-b-4 border-purple-200">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Music className="w-7 h-7 text-purple-600" />
                Sound Library
              </CardTitle>
              <CardDescription className="text-base">
                Click to add loops to your mix
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {categories.map((category) => (
                    <div key={category} className="space-y-2">
                      <h3 className="font-bold text-lg text-gray-700 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-yellow-500" />
                        {category}
                      </h3>
                      <div className="space-y-2">
                        {audioLoops
                          .filter((loop) => loop.category === category)
                          .map((loop) => (
                            <Button
                              key={loop.id}
                              onClick={() => addTrack(loop)}
                              className={`w-full justify-start text-left h-auto py-3 px-4 bg-gradient-to-r ${loop.color} hover:scale-105 transition-transform shadow-neon-md`}
                              variant="default"
                            >
                              <span className="text-2xl mr-3">{loop.emoji}</span>
                              <span className="font-semibold text-white">
                                {loop.name}
                              </span>
                              <Plus className="w-5 h-5 ml-auto" />
                            </Button>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Mixing Studio */}
          <Card className="lg:col-span-2 border-4 border-white/30 bg-white/95 backdrop-blur-sm shadow-[0_0_30px_rgba(0,255,255,0.3)]">
            <CardHeader className="border-b-4 border-cyan-200">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Music className="w-7 h-7 text-cyan-600" />
                Mixing Studio
              </CardTitle>
              <CardDescription className="text-base">
                Adjust volumes and create your masterpiece
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Waveform Visualizer */}
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={150}
                  className="w-full h-[150px] bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg border-4 border-purple-300 shadow-neon-lg"
                />
                <div className="absolute bottom-2 left-2 right-2 flex justify-between text-white text-sm font-bold drop-shadow-lg">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Playback Controls */}
              <div className="flex gap-3">
                <Button
                  onClick={togglePlayback}
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-lg shadow-neon-lg"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-6 h-6 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-6 h-6 mr-2" />
                      Play
                    </>
                  )}
                </Button>
              </div>

              {/* Track List */}
              <div className="space-y-3">
                <Label className="text-lg font-bold text-gray-700">Your Tracks</Label>
                {selectedTracks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                    <Music className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No tracks added yet. Select loops from the library!</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-3 pr-4">
                      {selectedTracks.map((track) => (
                        <Card key={track.id} className="border-2 border-gray-200">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl">{track.loop.emoji}</span>
                                <span className="font-semibold">{track.loop.name}</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeTrack(track.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <X className="w-5 h-5" />
                              </Button>
                            </div>
                            <div className="flex items-center gap-3">
                              <Volume2 className="w-5 h-5 text-gray-600" />
                              <Slider
                                value={[track.volume]}
                                onValueChange={(value) => updateVolume(track.id, value[0])}
                                max={100}
                                step={1}
                                className="flex-1"
                              />
                              <span className="text-sm font-semibold w-12 text-right">
                                {track.volume}%
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </div>

              {/* Export Section */}
              <div className="space-y-3 pt-4 border-t-2 border-gray-200">
                <Label htmlFor="remixTitle" className="text-lg font-bold text-gray-700">
                  Remix Title
                </Label>
                <Input
                  id="remixTitle"
                  placeholder="My Awesome Remix"
                  value={remixTitle}
                  onChange={(e) => setRemixTitle(e.target.value)}
                  className="text-lg border-2 border-gray-300"
                />
                <Button
                  onClick={handleExport}
                  disabled={isExporting || selectedTracks.length === 0 || !remixTitle.trim()}
                  size="lg"
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold text-lg shadow-neon-lg"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="w-6 h-6 mr-2" />
                      Export & Download
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Approved Remixes Gallery */}
        {approvedRemixes.length > 0 && (
          <Card className="border-4 border-white/30 bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Sparkles className="w-7 h-7 text-yellow-500" />
                Community Remixes
              </CardTitle>
              <CardDescription className="text-base">
                Check out remixes from other creators!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {approvedRemixes.map((remix) => (
                  <Card key={remix.id} className="border-2 hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-lg truncate">{remix.title}</h3>
                        <Badge className="bg-green-500 text-white">Approved</Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Duration: {Math.floor(Number(remix.duration) / 60)}:{(Number(remix.duration) % 60).toString().padStart(2, '0')}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

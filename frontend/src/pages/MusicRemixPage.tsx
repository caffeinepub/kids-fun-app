import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Music, Play, Pause, Save, Radio } from 'lucide-react';
import { useSaveRemixStudio, useGetSavedRemixStudios } from '../hooks/useQueries';
import { toast } from 'sonner';

export default function MusicRemixPage() {
  const [remixTitle, setRemixTitle] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(120);
  const [pitch, setPitch] = useState(0);
  const [volume, setVolume] = useState(70);
  const [reverb, setReverb] = useState(0);
  const [delay, setDelay] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const saveRemixMutation = useSaveRemixStudio();
  const { data: savedRemixes = [], isLoading: remixesLoading } = useGetSavedRemixStudios();

  useEffect(() => {
    return () => {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  };

  const playPreview = () => {
    const audioContext = initAudio();
    
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440 + pitch * 10, audioContext.currentTime);
    gainNode.gain.setValueAtTime(volume / 100, audioContext.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillatorRef.current = oscillator;
    gainNodeRef.current = gainNode;

    setIsPlaying(true);

    setTimeout(() => {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        setIsPlaying(false);
      }
    }, 2000);
  };

  const stopPreview = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
      setIsPlaying(false);
    }
  };

  const handleSaveRemix = async () => {
    if (!remixTitle.trim()) {
      toast.error('Please enter a title for your remix');
      return;
    }

    try {
      await saveRemixMutation.mutateAsync({
        title: remixTitle,
        tempo: BigInt(tempo),
        pitch: BigInt(pitch),
        volume: BigInt(volume),
        reverb: BigInt(reverb),
        delay: BigInt(delay),
      });

      toast.success('Remix saved successfully!');
      
      // Also save to localStorage for immediate display
      const remixes = JSON.parse(localStorage.getItem('remixStudios') || '[]');
      remixes.push({
        id: `remix_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: remixTitle,
        tempo,
        pitch,
        volume,
        reverb,
        delay,
        timestamp: Date.now(),
      });
      localStorage.setItem('remixStudios', JSON.stringify(remixes));
      
      setRemixTitle('');
      setTempo(120);
      setPitch(0);
      setVolume(70);
      setReverb(0);
      setDelay(0);
    } catch (error: any) {
      console.error('Save remix error:', error);
      toast.error(error?.message || 'Failed to save remix');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Luckiest Guy, cursive' }}>
              Music Remix Studio
            </h1>
            <p className="text-white/90">Create and mix your own music tracks!</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle>Remix Controls</CardTitle>
              <CardDescription>Adjust the settings to create your unique sound</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Remix Title</Label>
                <Input
                  type="text"
                  value={remixTitle}
                  onChange={(e) => setRemixTitle(e.target.value)}
                  placeholder="Enter remix title"
                />
              </div>

              <div className="space-y-2">
                <Label>Tempo: {tempo} BPM</Label>
                <Slider
                  value={[tempo]}
                  onValueChange={([value]) => setTempo(value)}
                  min={60}
                  max={180}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <Label>Pitch: {pitch > 0 ? '+' : ''}{pitch}</Label>
                <Slider
                  value={[pitch]}
                  onValueChange={([value]) => setPitch(value)}
                  min={-12}
                  max={12}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <Label>Volume: {volume}%</Label>
                <Slider
                  value={[volume]}
                  onValueChange={([value]) => setVolume(value)}
                  min={0}
                  max={100}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <Label>Reverb: {reverb}%</Label>
                <Slider
                  value={[reverb]}
                  onValueChange={([value]) => setReverb(value)}
                  min={0}
                  max={100}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <Label>Delay: {delay}ms</Label>
                <Slider
                  value={[delay]}
                  onValueChange={([value]) => setDelay(value)}
                  min={0}
                  max={1000}
                  step={10}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={isPlaying ? stopPreview : playPreview}
                  variant="outline"
                  className="flex-1"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Stop Preview
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Play Preview
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleSaveRemix}
                  disabled={saveRemixMutation.isPending || !remixTitle.trim()}
                  className="flex-1"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saveRemixMutation.isPending ? 'Saving...' : 'Save Remix'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle>Browse Remixes</CardTitle>
              <CardDescription>Your saved music remixes</CardDescription>
            </CardHeader>
            <CardContent>
              {remixesLoading ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">Loading remixes...</p>
                </div>
              ) : savedRemixes.length === 0 ? (
                <div className="text-center py-8">
                  <Music className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No remixes yet</p>
                  <p className="text-sm text-gray-500 mt-2">Create your first remix!</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {savedRemixes.map((remix) => (
                    <div
                      key={remix.id}
                      className="p-4 bg-white rounded-lg border-2 border-purple-200 hover:border-purple-400 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Radio className="w-8 h-8 text-purple-600" />
                          <div>
                            <p className="font-semibold">{remix.title}</p>
                            <p className="text-sm text-gray-500">
                              Tempo: {Number(remix.tempo)} BPM • Pitch: {remix.pitch > 0 ? '+' : ''}{Number(remix.pitch)}
                            </p>
                            <p className="text-xs text-gray-400">
                              Volume: {Number(remix.volume)}% • Reverb: {Number(remix.reverb)}% • Delay: {Number(remix.delay)}ms
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

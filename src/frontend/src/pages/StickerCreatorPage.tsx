import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useCreateSticker, useGetApprovedStickers } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Palette, Eraser, Download, Sparkles } from 'lucide-react';

export default function StickerCreatorPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#FF6B9D');
  const [brushSize, setBrushSize] = useState(5);
  const [stickerName, setStickerName] = useState('');
  const [canvasReady, setCanvasReady] = useState(false);

  const createStickerMutation = useCreateSticker();
  const { data: approvedStickers = [] } = useGetApprovedStickers();

  const colors = [
    '#FF6B9D', '#C44569', '#FFA502', '#FFD32A', '#05C46B',
    '#0ABDE3', '#4834DF', '#8854D0', '#000000', '#FFFFFF',
  ];

  // Initialize canvas with white background immediately
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Set white background immediately
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Mark canvas as ready
    setCanvasReady(true);
  }, []);

  // Get accurate canvas coordinates accounting for scaling
  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX: number;
    let clientY: number;

    if ('touches' in e) {
      // Touch event
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    return { x, y };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const { x, y } = getCanvasCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoordinates(e);

    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear and reset to white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleSave = async () => {
    if (!stickerName.trim()) {
      toast.error('Please enter a name for your sticker!');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      toast.error('Canvas not available');
      return;
    }

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          toast.error('Failed to create image from canvas');
          return;
        }
        
        const arrayBuffer = await blob.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        try {
          await createStickerMutation.mutateAsync({
            name: stickerName,
            image: uint8Array,
          });
          toast.success('🎨 Sticker created successfully!', {
            description: 'Your sticker is ready to use!',
          });
          setStickerName('');
          clearCanvas();
        } catch (error) {
          console.error('Sticker creation error:', error);
          toast.error('Failed to create sticker. Please try again.');
        }
      }, 'image/png');
    } catch (error) {
      console.error('Canvas conversion error:', error);
      toast.error('Failed to process canvas image');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          Sticker & Emoji Creator 🎨
        </h1>
        <p className="text-lg text-gray-700">Design your own custom stickers and emojis!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-4 bg-gradient-to-br from-pink-50 to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-6 h-6 text-pink-600" />
              Drawing Canvas
            </CardTitle>
            <CardDescription>Draw your sticker design below</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={400}
                height={400}
                className="border-4 border-gray-300 rounded-lg bg-white cursor-crosshair w-full max-w-md mx-auto touch-none"
                style={{ 
                  display: 'block',
                  imageRendering: 'auto'
                }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
              {!canvasReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-white rounded-lg">
                  <div className="text-gray-400">Loading canvas...</div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <Label>Color Palette</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {colors.map((c) => (
                    <button
                      key={c}
                      className={`w-10 h-10 rounded-full border-4 transition-all ${color === c ? 'border-black scale-110' : 'border-gray-300'}`}
                      style={{ backgroundColor: c }}
                      onClick={() => setColor(c)}
                      aria-label={`Select color ${c}`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <Label>Brush Size: {brushSize}px</Label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={brushSize}
                  onChange={(e) => setBrushSize(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={clearCanvas} className="flex-1">
                  <Eraser className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stickerName">Sticker Name</Label>
                <Input
                  id="stickerName"
                  placeholder="My Awesome Sticker"
                  value={stickerName}
                  onChange={(e) => setStickerName(e.target.value)}
                />
              </div>

              <Button
                onClick={handleSave}
                disabled={createStickerMutation.isPending || !stickerName.trim()}
                className="w-full"
                size="lg"
              >
                <Download className="w-4 h-4 mr-2" />
                {createStickerMutation.isPending ? 'Saving...' : 'Save Sticker'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-600" />
              Your Sticker Collection
            </CardTitle>
            <CardDescription>Approved stickers ready to use</CardDescription>
          </CardHeader>
          <CardContent>
            {approvedStickers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Palette className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No stickers yet. Create your first one!</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {approvedStickers.map((sticker) => (
                  <Card key={sticker.id} className="border-2 hover:shadow-lg transition-shadow">
                    <CardContent className="p-4 text-center">
                      <div className="w-full aspect-square bg-gray-100 rounded-lg mb-2 flex items-center justify-center overflow-hidden">
                        <img
                          src={sticker.image.getDirectURL()}
                          alt={sticker.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <p className="text-sm font-semibold truncate">{sticker.name}</p>
                      <Badge className="mt-1 bg-green-500 text-xs">Approved</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

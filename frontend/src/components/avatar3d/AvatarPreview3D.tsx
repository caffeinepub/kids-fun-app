import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { getAvatarVariants } from './avatarVariants';
import type { AvatarConfig } from '../../hooks/useQueries';

interface AvatarPreview3DProps {
  avatarConfig: AvatarConfig;
}

export default function AvatarPreview3D({ avatarConfig }: AvatarPreview3DProps) {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const variants = getAvatarVariants(avatarConfig);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const delta = e.clientX - startX;
      setRotation((prev) => prev + delta * 0.5);
      setStartX(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      const delta = e.touches[0].clientX - startX;
      setRotation((prev) => prev + delta * 0.5);
      setStartX(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setRotation(0);
  };

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="avatar-3d-container bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg border-4 border-primary overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="w-full h-full flex items-center justify-center perspective-container">
          <div
            className="avatar-3d-figure"
            style={{
              transform: `rotateY(${rotation}deg)`,
            }}
          >
            {/* Headwear */}
            {variants.headwear.type !== 'none' && (
              <div
                className="avatar-part headwear"
                style={{
                  backgroundColor: variants.headwear.color,
                  width: variants.headwear.type === 'crown' ? '70px' : variants.headwear.type === 'beanie' ? '65px' : '60px',
                  height: variants.headwear.type === 'tophat' ? '50px' : variants.headwear.type === 'beanie' ? '35px' : '30px',
                  top: variants.headwear.type === 'tophat' ? '-50px' : variants.headwear.type === 'beanie' ? '-10px' : '-25px',
                }}
              >
                {variants.headwear.type === 'crown' && (
                  <div className="crown-spikes">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div key={i} className="crown-spike" />
                    ))}
                  </div>
                )}
                {variants.headwear.type === 'cap' && (
                  <div
                    className="cap-visor"
                    style={{ backgroundColor: variants.headwear.color }}
                  />
                )}
              </div>
            )}

            {/* Hair */}
            <div
              className={`avatar-part hair hair-${variants.hair.type}`}
              style={{ backgroundColor: variants.hair.color }}
            />

            {/* Head */}
            <div
              className="avatar-part head"
              style={{
                backgroundColor: variants.head.color,
                width: `${variants.head.size[0] * 100}px`,
                height: `${variants.head.size[1] * 100}px`,
              }}
            >
              <div className="face">
                <div className="eyes">
                  <div className="eye" />
                  <div className="eye" />
                </div>
                <div className="mouth" />
              </div>
            </div>

            {/* Body/Torso */}
            <div
              className="avatar-part body"
              style={{ backgroundColor: variants.body.color }}
            />

            {/* Arms */}
            <div
              className="avatar-part arm arm-left"
              style={{ backgroundColor: variants.body.color }}
            />
            <div
              className="avatar-part arm arm-right"
              style={{ backgroundColor: variants.body.color }}
            />

            {/* Pants/Legs */}
            <div
              className="avatar-part leg leg-left"
              style={{ backgroundColor: variants.pants.color }}
            />
            <div
              className="avatar-part leg leg-right"
              style={{ backgroundColor: variants.pants.color }}
            />

            {/* Shoes */}
            <div
              className="avatar-part shoe shoe-left"
              style={{ backgroundColor: variants.shoes.color }}
            />
            <div
              className="avatar-part shoe shoe-right"
              style={{ backgroundColor: variants.shoes.color }}
            />
          </div>
        </div>
      </div>

      <Button
        onClick={resetView}
        variant="outline"
        size="sm"
        className="absolute top-2 right-2 z-10"
      >
        <RotateCcw className="w-4 h-4 mr-1" />
        Reset View
      </Button>

      <p className="text-xs text-center text-gray-500 mt-2">
        Drag to rotate • Click Reset to center
      </p>
    </div>
  );
}

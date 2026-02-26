import type { AvatarConfig } from '../../hooks/useQueries';

interface VariantStyle {
  color: string;
  size: [number, number, number];
  type?: string;
}

interface AvatarVariants {
  body: VariantStyle;
  head: VariantStyle;
  hair: VariantStyle;
  pants: VariantStyle;
  headwear: VariantStyle;
  shoes: VariantStyle;
}

export function getAvatarVariants(config: AvatarConfig): AvatarVariants {
  return {
    body: getBodyVariant(config.body),
    head: getHeadVariant(config.head),
    hair: getHairVariant(config.hair),
    pants: getPantsVariant(config.pants),
    headwear: getHeadwearVariant(config.headwear),
    shoes: getShoesVariant(config.shoes),
  };
}

function getBodyVariant(body: string): VariantStyle {
  const variants: Record<string, VariantStyle> = {
    body1: { color: '#FF6B6B', size: [0.7, 0.8, 0.4] },
    body2: { color: '#4ECDC4', size: [0.7, 0.8, 0.4] },
    body3: { color: '#FFE66D', size: [0.7, 0.8, 0.4] },
    body4: { color: '#95E1D3', size: [0.7, 0.8, 0.4] },
    body5: { color: '#A8E6CF', size: [0.7, 0.8, 0.4] },
    body6: { color: '#FF8B94', size: [0.7, 0.8, 0.4] },
    body7: { color: '#C7CEEA', size: [0.7, 0.8, 0.4] },
    body8: { color: '#FFDAC1', size: [0.7, 0.8, 0.4] },
  };
  return variants[body] || variants.body1;
}

function getHeadVariant(head: string): VariantStyle {
  const variants: Record<string, VariantStyle> = {
    head1: { color: '#FFD1A4', size: [0.6, 0.6, 0.5] },
    head2: { color: '#F4C2A0', size: [0.65, 0.65, 0.55] },
    head3: { color: '#D4A574', size: [0.6, 0.6, 0.5] },
    head4: { color: '#8D5524', size: [0.6, 0.6, 0.5] },
    head5: { color: '#FFDBAC', size: [0.6, 0.6, 0.5] },
    head6: { color: '#E0AC69', size: [0.6, 0.6, 0.5] },
    head7: { color: '#C68642', size: [0.6, 0.6, 0.5] },
    head8: { color: '#A67C52', size: [0.6, 0.6, 0.5] },
  };
  return variants[head] || variants.head1;
}

function getHairVariant(hair: string): VariantStyle {
  const variants: Record<string, VariantStyle> = {
    hair1: { color: '#3D2817', size: [0.65, 0.3, 0.55], type: 'top' },
    hair2: { color: '#8B4513', size: [0.7, 0.3, 0.6], type: 'full' },
    hair3: { color: '#2C1810', size: [0.4, 0.4, 0.4], type: 'curly' },
    hair4: { color: '#D2691E', size: [0.35, 0.5, 0.35], type: 'spiky' },
    hair5: { color: '#C0C0C0', size: [0.65, 0.25, 0.55], type: 'long' },
    hair6: { color: '#F5DEB3', size: [0, 0, 0], type: 'none' },
    hair7: { color: '#FFD700', size: [0.65, 0.3, 0.55], type: 'top' },
    hair8: { color: '#FF6347', size: [0.3, 0.6, 0.3], type: 'mohawk' },
    hair9: { color: '#4B0082', size: [0.65, 0.45, 0.55], type: 'ponytail' },
    hair10: { color: '#FF1493', size: [0.7, 0.3, 0.6], type: 'full' },
  };
  return variants[hair] || variants.hair1;
}

function getPantsVariant(pants: string): VariantStyle {
  const variants: Record<string, VariantStyle> = {
    pants1: { color: '#4A90E2', size: [0.25, 0.8, 0.25] },
    pants2: { color: '#87CEEB', size: [0.25, 0.8, 0.25] },
    pants3: { color: '#FF69B4', size: [0.25, 0.8, 0.25] },
    pants4: { color: '#32CD32', size: [0.25, 0.8, 0.25] },
    pants5: { color: '#9370DB', size: [0.25, 0.8, 0.25] },
    pants6: { color: '#FF8C00', size: [0.25, 0.8, 0.25] },
    pants7: { color: '#20B2AA', size: [0.25, 0.8, 0.25] },
    pants8: { color: '#DC143C', size: [0.25, 0.8, 0.25] },
  };
  return variants[pants] || variants.pants1;
}

function getHeadwearVariant(headwear: string): VariantStyle {
  const variants: Record<string, VariantStyle> = {
    none: { color: 'transparent', size: [0, 0, 0], type: 'none' },
    hat1: { color: '#2C3E50', size: [0.25, 0.4, 0.25], type: 'tophat' },
    hat2: { color: '#F4A460', size: [0.5, 0.3, 0.5], type: 'sunhat' },
    crown: { color: '#FFD700', size: [0.35, 0.25, 0.35], type: 'crown' },
    cap: { color: '#E74C3C', size: [0.35, 0.3, 0.35], type: 'cap' },
    beanie: { color: '#3498DB', size: [0.35, 0.35, 0.35], type: 'beanie' },
    hat3: { color: '#8E44AD', size: [0.25, 0.4, 0.25], type: 'tophat' },
    hat4: { color: '#E67E22', size: [0.5, 0.3, 0.5], type: 'sunhat' },
  };
  return variants[headwear] || variants.none;
}

function getShoesVariant(shoes: string): VariantStyle {
  const variants: Record<string, VariantStyle> = {
    shoes1: { color: '#FFFFFF', size: [0.28, 0.1, 0.35] },
    shoes2: { color: '#654321', size: [0.28, 0.1, 0.35] },
    shoes3: { color: '#FF1493', size: [0.28, 0.1, 0.35] },
    shoes4: { color: '#8B4513', size: [0.28, 0.1, 0.35] },
    shoes5: { color: '#000000', size: [0.28, 0.1, 0.35] },
    shoes6: { color: '#00CED1', size: [0.28, 0.1, 0.35] },
    shoes7: { color: '#FFD700', size: [0.28, 0.1, 0.35] },
    shoes8: { color: '#32CD32', size: [0.28, 0.1, 0.35] },
  };
  return variants[shoes] || variants.shoes1;
}

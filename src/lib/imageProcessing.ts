import { pipeline, env } from '@huggingface/transformers';

env.allowLocalModels = false;
env.useBrowserCache = true;

export const transferImageColors = async (
  sourceImage: HTMLImageElement,
  targetImage: HTMLImageElement,
  intensity: number = 1.0
): Promise<Blob> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  canvas.width = targetImage.naturalWidth;
  canvas.height = targetImage.naturalHeight;

  // Draw target image
  ctx.drawImage(targetImage, 0, 0);
  const targetData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // Get source colors
  const sourceCanvas = document.createElement('canvas');
  const sourceCtx = sourceCanvas.getContext('2d');
  if (!sourceCtx) throw new Error('Could not get source canvas context');
  
  sourceCanvas.width = sourceImage.naturalWidth;
  sourceCanvas.height = sourceImage.naturalHeight;
  sourceCtx.drawImage(sourceImage, 0, 0);
  const sourceData = sourceCtx.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);

  // Calculate average color from source
  let r = 0, g = 0, b = 0;
  const pixels = sourceData.data.length / 4;
  for (let i = 0; i < sourceData.data.length; i += 4) {
    r += sourceData.data[i];
    g += sourceData.data[i + 1];
    b += sourceData.data[i + 2];
  }
  r = Math.round(r / pixels);
  g = Math.round(g / pixels);
  b = Math.round(b / pixels);

  // Apply color transfer with intensity control
  for (let i = 0; i < targetData.data.length; i += 4) {
    const gray = (targetData.data[i] + targetData.data[i + 1] + targetData.data[i + 2]) / 3;
    const factor = gray / 128;
    
    const originalR = targetData.data[i];
    const originalG = targetData.data[i + 1];
    const originalB = targetData.data[i + 2];
    
    const newR = Math.min(255, Math.round(r * factor));
    const newG = Math.min(255, Math.round(g * factor));
    const newB = Math.min(255, Math.round(b * factor));
    
    // Blend between original and new colors based on intensity
    targetData.data[i] = Math.round(originalR * (1 - intensity) + newR * intensity);
    targetData.data[i + 1] = Math.round(originalG * (1 - intensity) + newG * intensity);
    targetData.data[i + 2] = Math.round(originalB * (1 - intensity) + newB * intensity);
  }

  ctx.putImageData(targetData, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to create blob'));
      },
      'image/png'
    );
  });
};

export const upscaleImage = async (image: HTMLImageElement): Promise<Blob> => {
  // Create a higher resolution canvas
  const scale = 2;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  canvas.width = image.naturalWidth * scale;
  canvas.height = image.naturalHeight * scale;

  // Enable image smoothing for better quality
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Draw scaled image
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  // Apply sharpening filter
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const width = canvas.width;
  const height = canvas.height;

  // Sharpening kernel
  const sharpenKernel = [
    0, -1, 0,
    -1, 5, -1,
    0, -1, 0
  ];

  const tempData = new Uint8ClampedArray(data);

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      for (let c = 0; c < 3; c++) {
        let sum = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4 + c;
            const kernelIdx = (ky + 1) * 3 + (kx + 1);
            sum += tempData[idx] * sharpenKernel[kernelIdx];
          }
        }
        data[(y * width + x) * 4 + c] = Math.max(0, Math.min(255, sum));
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to create blob'));
      },
      'image/png',
      1.0
    );
  });
};

export const loadImage = (file: Blob | string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    if (typeof file === 'string') {
      img.src = file;
    } else {
      img.src = URL.createObjectURL(file);
    }
  });
};


import { pipeline } from '@huggingface/transformers';

let faceDetector: any = null;

export const initializeFaceDetector = async () => {
  if (!faceDetector) {
    try {
      faceDetector = await pipeline('object-detection', 'Xenova/detr-resnet-50', {
        device: 'webgpu'
      });
    } catch (error) {
      console.warn('WebGPU not available, falling back to CPU');
      faceDetector = await pipeline('object-detection', 'Xenova/detr-resnet-50');
    }
  }
  return faceDetector;
};

export const detectFaceInImage = async (imageElement: HTMLImageElement): Promise<boolean> => {
  try {
    const detector = await initializeFaceDetector();
    
    // Convert image to canvas for processing
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return false;
    
    canvas.width = imageElement.naturalWidth;
    canvas.height = imageElement.naturalHeight;
    ctx.drawImage(imageElement, 0, 0);
    
    // Get image data
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    
    // Detect objects in the image
    const results = await detector(imageData);
    
    // Check if any detected object is a person (which typically includes face)
    const hasPerson = results.some((result: any) => 
      result.label === 'person' && result.score > 0.5
    );
    
    return hasPerson;
  } catch (error) {
    console.error('Face detection error:', error);
    return false;
  }
};

export const loadImageFromDataUrl = (dataUrl: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });
};

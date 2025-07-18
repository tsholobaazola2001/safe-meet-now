
import { pipeline } from '@huggingface/transformers';

let faceDetector: any = null;

export const initializeFaceDetector = async () => {
  if (!faceDetector) {
    try {
      faceDetector = await pipeline('object-detection', 'Xenova/yolos-tiny', {
        device: 'webgpu'
      });
    } catch (error) {
      console.warn('WebGPU not available, falling back to CPU');
      faceDetector = await pipeline('object-detection', 'Xenova/yolos-tiny');
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
    
    console.log('Detection results:', results);
    
    // Check if any detected object is a person with high confidence
    // YOLOS can detect faces more accurately than DETR
    const hasFace = results.some((result: any) => {
      const label = result.label.toLowerCase();
      // Look for person detection with high confidence - person detection usually means face is visible
      return label === 'person' && result.score > 0.7;
    });
    
    console.log('Face detection result:', hasFace);
    return hasFace;
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

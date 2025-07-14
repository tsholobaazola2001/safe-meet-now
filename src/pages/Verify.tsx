
import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Shield, CheckCircle, AlertTriangle, User, FileText, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { VerificationReceipt } from "@/components/VerificationReceipt";
import { detectFaceInImage, loadImageFromDataUrl } from "@/utils/faceDetection";

const Verify = () => {
  const { linkId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [step, setStep] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [currentAngle, setCurrentAngle] = useState(0); // 0: front, 1: left, 2: right
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    additionalInfo: "",
    consent: false
  });
  const [isComplete, setIsComplete] = useState(false);

  const angles = ["front view", "left profile", "right profile"];

  useEffect(() => {
    if (step === 2) {
      startCamera();
    }
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [step]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' },
        audio: false 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const capturePhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      setIsProcessing(true);
      
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context) {
        context.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        
        try {
          // Load the captured image
          const imageElement = await loadImageFromDataUrl(imageData);
          
          // Detect if there's a face in the image
          const hasFace = await detectFaceInImage(imageElement);
          
          if (!hasFace) {
            toast({
              title: "No Face Detected",
              description: "Please ensure your face is clearly visible in the camera and try again.",
              variant: "destructive"
            });
            setIsProcessing(false);
            return;
          }
          
          // Face detected successfully
          setCapturedImages(prev => [...prev, imageData]);
          
          if (currentAngle < 2) {
            setCurrentAngle(currentAngle + 1);
            toast({
              title: "Face verified!",
              description: `Now please turn to show your ${angles[currentAngle + 1]}`,
            });
          } else {
            // All photos captured and verified
            setStep(3);
            toast({
              title: "All faces verified!",
              description: "Please review and submit your information.",
            });
          }
        } catch (error) {
          console.error('Face detection failed:', error);
          toast({
            title: "Verification Failed",
            description: "Face detection failed. Please ensure good lighting and try again.",
            variant: "destructive"
          });
        }
      }
      
      setIsProcessing(false);
    }
  };

  const handleSubmit = () => {
    // Simulate verification completion
    setIsComplete(true);
    
    // Send notification to the person who generated the link
    // In a real app, this would be an API call
    console.log("Sending notification to link generator that verification is complete");
    
    toast({
      title: "Verification Complete!",
      description: "Your information has been securely submitted and a receipt has been generated.",
    });
  };

  const retakePhotos = () => {
    setCapturedImages([]);
    setCurrentAngle(0);
    setStep(2);
  };

  if (!linkId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-red-700 mb-2">Invalid Link</h2>
              <p className="text-red-600">This verification link is invalid or has expired.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isComplete) {
    return <VerificationReceipt formData={formData} images={capturedImages} linkId={linkId} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">SafeMeet Verification</h1>
          </div>
          <p className="text-gray-600">Complete your identity verification for the meetup</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-12 h-1 ${
                    step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-blue-600" />
                <span>Personal Information</span>
              </CardTitle>
              <CardDescription>
                Please provide your basic information for verification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Legal Name *</Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name as it appears on ID"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
                <Textarea
                  id="additionalInfo"
                  placeholder="Any additional information you'd like to share..."
                  value={formData.additionalInfo}
                  onChange={(e) => setFormData({...formData, additionalInfo: e.target.value})}
                  className="h-20"
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Privacy & Security</h4>
                <p className="text-sm text-blue-700 mb-3">
                  Your information will be encrypted and only shared with the person who sent you this link 
                  and their designated trusted contact. Data is automatically deleted after 30 days unless 
                  extended for safety reasons.
                </p>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.consent}
                    onChange={(e) => setFormData({...formData, consent: e.target.checked})}
                    className="rounded"
                  />
                  <span className="text-sm text-blue-700">
                    I consent to the secure storage and sharing of this information as described
                  </span>
                </label>
              </div>

              <Button 
                onClick={() => setStep(2)} 
                className="w-full"
                disabled={!formData.fullName || !formData.consent}
              >
                Next: Face Verification
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Camera className="h-5 w-5 text-green-600" />
                <span>Live Face Verification</span>
              </CardTitle>
              <CardDescription>
                Please capture your face from three angles: {angles[currentAngle]} ({currentAngle + 1}/3)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 border-2 border-dashed border-white/50 m-4 rounded-lg flex items-center justify-center">
                  <div className="text-white text-center">
                    <p className="text-lg font-medium">Show your {angles[currentAngle]}</p>
                    <p className="text-sm opacity-75">Position your face in the center</p>
                  </div>
                </div>
              </div>

              <canvas ref={canvasRef} className="hidden" />

              <div className="flex space-x-2">
                {capturedImages.map((_, index) => (
                  <div key={index} className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                ))}
                {Array.from({ length: 3 - capturedImages.length }).map((_, index) => (
                  <div key={index} className="w-8 h-8 bg-gray-200 rounded-full" />
                ))}
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-700">
                  <strong>AI Face Detection:</strong> Our system verifies that a real face is present in each photo. 
                  Ensure good lighting and keep your face clearly visible in the camera frame.
                </p>
              </div>

              <Button 
                onClick={capturePhoto} 
                className="w-full" 
                size="lg"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Verifying Face...
                  </>
                ) : (
                  <>
                    <Camera className="h-5 w-5 mr-2" />
                    Capture {angles[currentAngle]}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-purple-600" />
                <span>Review & Submit</span>
              </CardTitle>
              <CardDescription>
                Please review your information before submitting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Full Name</Label>
                <p className="text-lg font-medium">{formData.fullName}</p>
              </div>

              {formData.additionalInfo && (
                <div>
                  <Label>Additional Information</Label>
                  <p className="text-gray-700">{formData.additionalInfo}</p>
                </div>
              )}

              <div>
                <Label>Captured Photos</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {capturedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={image} 
                        alt={`${angles[index]} view`}
                        className="w-full h-24 object-cover rounded border"
                      />
                      <p className="text-xs text-center mt-1 text-gray-600">{angles[index]}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-700">
                  <CheckCircle className="h-4 w-4 inline mr-1" />
                  All photos have been verified to contain real faces. By submitting, you confirm that all 
                  information provided is accurate and that the photos were taken live during this verification session.
                </p>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" onClick={retakePhotos} className="flex-1">
                  Retake Photos
                </Button>
                <Button onClick={handleSubmit} className="flex-1">
                  Submit Verification
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Verify;

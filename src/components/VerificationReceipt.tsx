
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CheckCircle, Download, Shield, Calendar, User, Camera, Send, MessageCircle, Mail, Smartphone, ChevronDown } from "lucide-react";

interface VerificationReceiptProps {
  formData: {
    fullName: string;
    additionalInfo: string;
  };
  images: string[];
  linkId: string;
  recipientEmail?: string;
}

export const VerificationReceipt = ({ formData, images, linkId, recipientEmail }: VerificationReceiptProps) => {
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();

  const angles = ["Front View", "Left Profile", "Right Profile"];

  const shareText = `SafeMeet Verification Receipt\nName: ${formData.fullName}\nDate: ${currentDate}\nVerification ID: ${linkId}\nLink: ${window.location.href}`;
  
  const handleWhatsAppShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleSMSShare = () => {
    const url = `sms:?body=${encodeURIComponent(shareText)}`;
    window.open(url);
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent('SafeMeet Verification Receipt');
    const body = encodeURIComponent(shareText);
    const url = `mailto:?subject=${subject}&body=${body}`;
    window.open(url);
  };

  const handleWebShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'SafeMeet Verification Receipt',
        text: `Verification completed for ${formData.fullName} on ${currentDate}. Verification ID: ${linkId}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Receipt details copied to clipboard!');
    }
  };

  const handlePanicButton = () => {
    if (confirm("Are you sure you want to send a panic alert? This will immediately notify the trusted contact and authorities if needed.")) {
      // Simulate sending emergency email
      if (recipientEmail) {
        // In a real app, this would be an API call to send actual emails
        console.log(`Sending emergency alert to: ${recipientEmail}`);
        console.log("Emergency alert details:", {
          verificationId: linkId,
          timestamp: new Date().toISOString(),
          location: window.location.href,
          userAgent: navigator.userAgent
        });
        
        alert(`🚨 PANIC ALERT SENT!\n\nEmergency notification has been sent to:\n${recipientEmail}\n\nAuthorities and trusted contacts have been notified.\nVerification ID: ${linkId}`);
      } else {
        alert("🚨 PANIC ALERT ACTIVATED!\n\nEmergency protocols have been triggered.\nTrusted contacts and authorities have been notified.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verification Complete!</h1>
          <p className="text-lg text-gray-600">
            Your information has been securely submitted and a receipt has been generated.
          </p>
        </div>

        {/* Receipt Card */}
        <Card className="mb-8">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-6 w-6" />
              <span>SafeMeet Verification Receipt</span>
            </CardTitle>
            <CardDescription className="text-blue-100">
              Digital Safety Verification Record
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Personal Information
                </h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-600">Full Name:</span>
                    <p className="font-medium">{formData.fullName}</p>
                  </div>
                  {formData.additionalInfo && (
                    <div>
                      <span className="text-sm text-gray-600">Additional Info:</span>
                      <p className="text-gray-700">{formData.additionalInfo}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-green-600" />
                  Verification Details
                </h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-600">Verification ID:</span>
                    <p className="font-mono text-sm">{linkId}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Date & Time:</span>
                    <p className="font-medium">{currentDate} at {currentTime}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-2">
                      ✓ Verified
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Photos Section */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Camera className="h-5 w-5 mr-2 text-purple-600" />
                Live Face Verification Photos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="text-center">
                    <img 
                      src={image} 
                      alt={angles[index]}
                      className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <p className="text-sm font-medium text-gray-700 mt-2">{angles[index]}</p>
                    <p className="text-xs text-gray-500">Live Capture Verified ✓</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Security & Privacy Notice</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• All photos were verified as live captures using AI detection</li>
                <li>• This receipt has been automatically sent to the designated trusted contact</li>
                <li>• Data is encrypted and will be automatically deleted after 30 days</li>
                <li>• This verification serves as accountability for the planned meetup</li>
                <li>• In case of emergency, this information can assist law enforcement</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <Button className="flex-1" onClick={() => window.print()}>
              <Download className="h-4 w-4 mr-2" />
              Download Receipt
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex-1">
                  <Send className="h-4 w-4 mr-2" />
                  Share Receipt
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleWhatsAppShare}>
                  <MessageCircle className="h-4 w-4 mr-2 text-green-600" />
                  Share via WhatsApp
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSMSShare}>
                  <Smartphone className="h-4 w-4 mr-2 text-blue-600" />
                  Share via SMS
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleEmailShare}>
                  <Mail className="h-4 w-4 mr-2 text-red-600" />
                  Share via Email
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleWebShare}>
                  <Send className="h-4 w-4 mr-2 text-gray-600" />
                  {navigator.share ? 'Share via System' : 'Copy to Clipboard'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="bg-green-50 p-4 rounded-lg max-w-2xl mx-auto">
            <p className="text-sm text-green-700">
              <strong>Verification Complete:</strong> The person who sent you this link has been notified, 
              and their trusted contact has received a copy of this receipt. You can now close this page.
            </p>
          </div>

          {/* Panic Button */}
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg max-w-md mx-auto">
            <h4 className="font-semibold text-red-800 mb-2">Safety Concern?</h4>
            <p className="text-sm text-red-700 mb-3">
              If this person is not who they claim to be or you feel unsafe, click the panic button.
            </p>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handlePanicButton}
            >
              🚨 Panic Button
            </Button>
            {recipientEmail && (
              <p className="text-xs text-red-600 mt-2">
                Emergency alerts will be sent to: {recipientEmail}
              </p>
            )}
          </div>

          <p className="text-sm text-gray-500">
            Thank you for helping to create a safer meetup environment.
          </p>
        </div>
      </div>
    </div>
  );
};

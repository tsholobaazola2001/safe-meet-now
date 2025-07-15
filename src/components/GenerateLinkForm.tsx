
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Send, X, Calendar, MapPin, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GenerateLinkFormProps {
  onClose: () => void;
}

export const GenerateLinkForm = ({ onClose }: GenerateLinkFormProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    meetingDate: "",
    meetingTime: "",
    meetingLocation: "",
    meetingType: "",
    trustedContactName: "",
    trustedContactPhone: "",
    trustedContactEmail: "",
    additionalNotes: ""
  });
  const [generatedLink, setGeneratedLink] = useState("");
  const { toast } = useToast();

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const generateLink = () => {
    const linkId = Math.random().toString(36).substring(2, 15);
    const link = `${window.location.origin}/recipient-details?id=${linkId}`;
    setGeneratedLink(link);
    setStep(3);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    toast({
      title: "Link copied!",
      description: "The safety verification link has been copied to your clipboard.",
    });
  };

  const sendLink = () => {
    toast({
      title: "Link ready to send!",
      description: "You can now share this link via WhatsApp, SMS, or email.",
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Generate Safety Link</h2>
              <p className="text-gray-600">Step {step} of 3</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span>Meeting Details</span>
                </CardTitle>
                <CardDescription>
                  Tell us about your planned meetup
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="meetingDate">Meeting Date</Label>
                    <Input
                      id="meetingDate"
                      type="date"
                      value={formData.meetingDate}
                      onChange={(e) => setFormData({...formData, meetingDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="meetingTime">Meeting Time</Label>
                    <Input
                      id="meetingTime"
                      type="time"
                      value={formData.meetingTime}
                      onChange={(e) => setFormData({...formData, meetingTime: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="meetingLocation">Meeting Location</Label>
                  <Input
                    id="meetingLocation"
                    placeholder="e.g., Coffee shop on Main Street"
                    value={formData.meetingLocation}
                    onChange={(e) => setFormData({...formData, meetingLocation: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="meetingType">Meeting Type</Label>
                  <Select value={formData.meetingType} onValueChange={(value) => setFormData({...formData, meetingType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select meeting type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="first-date">First Date</SelectItem>
                      <SelectItem value="casual-meetup">Casual Meetup</SelectItem>
                      <SelectItem value="business-meeting">Business Meeting</SelectItem>
                      <SelectItem value="social-gathering">Social Gathering</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="additionalNotes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="additionalNotes"
                    placeholder="Any additional context about the meeting..."
                    value={formData.additionalNotes}
                    onChange={(e) => setFormData({...formData, additionalNotes: e.target.value})}
                    className="h-20"
                  />
                </div>

                <Button onClick={handleNext} className="w-full" disabled={!formData.meetingDate || !formData.meetingTime || !formData.meetingLocation}>
                  Next: Trusted Contact
                </Button>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-green-600" />
                  <span>Trusted Contact</span>
                </CardTitle>
                <CardDescription>
                  Who should receive the safety verification receipt?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="trustedContactName">Trusted Contact Name</Label>
                  <Input
                    id="trustedContactName"
                    placeholder="e.g., Sarah Johnson (Sister)"
                    value={formData.trustedContactName}
                    onChange={(e) => setFormData({...formData, trustedContactName: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="trustedContactPhone">Phone Number</Label>
                  <Input
                    id="trustedContactPhone"
                    placeholder="+1 (555) 123-4567"
                    value={formData.trustedContactPhone}
                    onChange={(e) => setFormData({...formData, trustedContactPhone: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="trustedContactEmail">Email Address</Label>
                  <Input
                    id="trustedContactEmail"
                    type="email"
                    placeholder="sarah.johnson@email.com"
                    value={formData.trustedContactEmail}
                    onChange={(e) => setFormData({...formData, trustedContactEmail: e.target.value})}
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Privacy Note:</strong> Your trusted contact will only receive the verification receipt 
                    after your meeting partner completes their identity verification. They will not have access 
                    to any information until then.
                  </p>
                </div>

                <div className="flex space-x-3">
                  <Button variant="outline" onClick={handleBack} className="flex-1">
                    Back
                  </Button>
                  <Button 
                    onClick={generateLink} 
                    className="flex-1"
                    disabled={!formData.trustedContactName || !formData.trustedContactPhone || !formData.trustedContactEmail}
                  >
                    Generate Link
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Send className="h-5 w-5 text-green-600" />
                  <span>Your Safety Link is Ready!</span>
                </CardTitle>
                <CardDescription>
                  Share this secure link with your meeting partner
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Label className="text-sm font-medium text-gray-700">Generated Link:</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <Input value={generatedLink} readOnly className="bg-white" />
                    <Button size="sm" onClick={copyLink}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">What happens next?</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Share this link with your meeting partner via WhatsApp, SMS, or email</li>
                    <li>• They'll provide their full name and complete a live face verification</li>
                    <li>• A digital receipt will be automatically sent to {formData.trustedContactName}</li>
                    <li>• The verification expires in 24 hours for security</li>
                  </ul>
                </div>

                <div className="flex space-x-3">
                  <Button variant="outline" onClick={copyLink} className="flex-1">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                  </Button>
                  <Button onClick={sendLink} className="flex-1">
                    <Send className="h-4 w-4 mr-2" />
                    Share Link
                  </Button>
                </div>

                <Button variant="ghost" onClick={onClose} className="w-full">
                  Close
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

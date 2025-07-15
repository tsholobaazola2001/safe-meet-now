import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, UserCheck, FileText, Heart, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { GenerateLinkForm } from "@/components/GenerateLinkForm";
import { FeatureCard } from "@/components/FeatureCard";
import { SafetyStats } from "@/components/SafetyStats";

const Index = () => {
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [isVerificationComplete, setIsVerificationComplete] = useState(false);

  // Check for verification completion
  useEffect(() => {
    const checkVerificationStatus = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const verified = urlParams.get('verified');
      if (verified === 'true') {
        setIsVerificationComplete(true);
      }
    };
    
    checkVerificationStatus();
    
    // Listen for storage events to detect verification completion from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'verificationComplete' && e.newValue === 'true') {
        setIsVerificationComplete(true);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handlePanicButton = () => {
    if (confirm("🚨 EMERGENCY ALERT\n\nAre you sure you want to activate the panic button? This will immediately notify trusted contacts and authorities.")) {
      // In a real app, this would trigger emergency protocols
      alert("🚨 PANIC ALERT ACTIVATED!\n\nEmergency notifications have been sent to:\n• Your trusted contacts\n• Local authorities\n• SafeMeet emergency response team\n\nHelp is on the way. Stay in a safe location.");
      
      // Log the emergency event
      console.log("EMERGENCY ALERT TRIGGERED:", {
        timestamp: new Date().toISOString(),
        location: window.location.href,
        userAgent: navigator.userAgent
      });
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    {
      icon: Shield,
      title: "Secure Identity Verification",
      description: "Live 3D facial scanning ensures real-time verification without storing government documents"
    },
    {
      icon: UserCheck,
      title: "Trusted Contact Protection",
      description: "Automatically notify your chosen family member or friend with verification details"
    },
    {
      icon: FileText,
      title: "Digital Safety Receipt",
      description: "Generate encrypted records that can assist authorities if needed"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">SafeMeet</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                className="hidden md:flex"
                onClick={() => scrollToSection('how-it-works')}
              >
                How It Works
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-full text-blue-700 text-sm font-medium mb-6">
            <Heart className="h-4 w-4" />
            <span>Empowering Safe Connections</span>
          </div>
          
          <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Meet New People with
            <span className="text-blue-600"> Confidence</span>
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Our cloud-based safety verification app helps you verify the identity of people you're meeting for the first time. 
            Generate secure links, collect verified information, and keep your trusted contacts informed.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
              onClick={() => setShowLinkForm(true)}
            >
              Generate Safety Link
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg"
              onClick={() => scrollToSection('features')}
            >
              Learn More
            </Button>
          </div>

          {/* Emergency Panic Button - Only visible after verification */}
          {isVerificationComplete && (
            <div className="mt-8 bg-red-50 border-2 border-red-200 p-6 rounded-lg max-w-md mx-auto">
              <h3 className="font-semibold text-red-800 mb-3 text-lg">🚨 Emergency Safety</h3>
              <p className="text-sm text-red-700 mb-4">
                If you feel unsafe or the person is not who they claim to be, activate the panic button immediately.
              </p>
              <Button 
                variant="destructive" 
                size="lg"
                className="w-full bg-red-600 hover:bg-red-700"
                onClick={handlePanicButton}
              >
                🚨 PANIC BUTTON - EMERGENCY ALERT
              </Button>
              <p className="text-xs text-red-600 mt-2 text-center">
                This will immediately notify your trusted contacts and authorities
              </p>
            </div>
          )}
        </div>

        {/* Safety Stats */}
        <SafetyStats />
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">How SafeMeet Protects You</h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our comprehensive safety features work together to create a protective layer for your meetups
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Simple. Secure. Effective.</h3>
            <p className="text-lg text-gray-600">Four easy steps to enhanced safety</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Generate Link", desc: "Create a secure verification link" },
              { step: "2", title: "Share Safely", desc: "Send link via WhatsApp, SMS, or email" },
              { step: "3", title: "They Verify", desc: "Partner submits name and live face scan" },
              { step: "4", title: "Stay Protected", desc: "Receipt sent to your trusted contact" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Notice */}
      <section className="bg-yellow-50 border-t border-yellow-200 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-start space-x-3 max-w-4xl mx-auto">
            <AlertTriangle className="h-6 w-6 text-yellow-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">Important Safety Reminder</h4>
              <p className="text-yellow-700 text-sm leading-relaxed">
                SafeMeet is a safety tool that adds an important layer of protection, but it should not replace your personal safety judgment. 
                Always meet in public places, inform others of your plans, and trust your instincts. This app helps create accountability 
                and assists authorities if needed, but your safety awareness remains your best protection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Generate Link Modal */}
      {showLinkForm && (
        <GenerateLinkForm onClose={() => setShowLinkForm(false)} />
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-6 w-6" />
            <span className="text-xl font-semibold">SafeMeet</span>
          </div>
          <p className="text-gray-400 text-sm">
            Empowering safer connections through technology. Your safety is our priority.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

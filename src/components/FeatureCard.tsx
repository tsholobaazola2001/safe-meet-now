
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => {
  return (
    <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
      <CardContent className="pt-8 pb-6">
        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon className="h-8 w-8 text-blue-600" />
        </div>
        <h4 className="text-xl font-semibold text-gray-900 mb-3">{title}</h4>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
};

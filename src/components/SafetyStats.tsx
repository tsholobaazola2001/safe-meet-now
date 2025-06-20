
import { Card, CardContent } from "@/components/ui/card";

export const SafetyStats = () => {
  const stats = [
    { number: "1 in 4", label: "Women experience dating violence", color: "text-red-600" },
    { number: "84%", label: "Of victims know their attacker", color: "text-orange-600" },
    { number: "90%", label: "Safer with identity verification", color: "text-green-600" }
  ];

  return (
    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
      {stats.map((stat, index) => (
        <Card key={index} className="text-center border-0 bg-white/70 backdrop-blur-sm">
          <CardContent className="py-6">
            <div className={`text-3xl font-bold mb-2 ${stat.color}`}>
              {stat.number}
            </div>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

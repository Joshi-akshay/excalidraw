interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  bgColor: string;
}

export default function FeatureCard({ icon, title, description, bgColor }: FeatureCardProps) {
  return (
    <div className="text-center group">
      <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
        <span className="text-xl">{icon}</span>
      </div>
      <h4 className="text-lg font-semibold mb-2 text-white group-hover:text-gray-100 transition-colors duration-200">{title}</h4>
      <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-200">{description}</p>
    </div>
  );
} 
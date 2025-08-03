interface ActionCardProps {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
  gradientFrom: string;
  gradientTo: string;
}

export default function ActionCard({ icon, title, description, onClick, gradientFrom, gradientTo }: ActionCardProps) {
  return (
    <div className="group relative">
      <div className={`absolute inset-0 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-2xl blur-lg opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
      <div 
        className="relative bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:bg-gray-700/60 transition-all duration-300 cursor-pointer group hover:border-gray-600/50"
        onClick={onClick}
      >
        <div className="text-center">
          <div className={`w-16 h-16 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
            <span className="text-3xl">{icon}</span>
          </div>
          <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-gray-100 transition-colors duration-200">{title}</h3>
          <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-200">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
} 
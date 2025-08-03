"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ActionCard from "./components/ActionCard";
import FeatureCard from "./components/FeatureCard";
import RoomModal from "./components/RoomModal";

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
  });

  // Modal states
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [roomModalMode, setRoomModalMode] = useState<"create" | "join">("create");

  const handleStartDrawing = () => {
    const username = prompt("Enter your username:");
    if (username) {
      router.push(`/canvas/${username}`);
    }
  };

  const handleCreateRoom = () => {
    setRoomModalMode("create");
    setShowRoomModal(true);
  };

  const handleJoinRoom = () => {
    setRoomModalMode("join");
    setShowRoomModal(true);
  };

  const handleSignUp = () => {
    router.push("/signup");
  };

  const handleSignIn = () => {
    router.push("/signin");
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    // Add actual sign out logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      {/* Header with Account Details */}
      <header className="bg-gray-900/40 backdrop-blur-md border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center border border-gray-600">
                <span className="text-xl font-bold text-gray-300">E</span>
              </div>
              <h1 className="text-2xl font-bold text-white">
                Excalidraw
              </h1>
            </div>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* <div className="flex items-center space-x-3 bg-gray-800/40 rounded-lg px-4 py-2 border border-gray-700/50">
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-8 h-8 rounded-full border-2 border-gray-600"
                  />
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-white">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </div> */}
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 font-medium border border-gray-700"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleSignIn}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 font-medium border border-gray-700"
                >
                  Sign In
                </button>
                <button
                  onClick={handleSignUp}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 font-medium border border-gray-600"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Visualize Together
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Create, collaborate, and share your ideas with our powerful drawing platform. 
            Whether you're sketching alone or brainstorming with a team, Excalidraw makes it simple and fun.
          </p>
        </div>

        {/* Main Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <ActionCard
            icon="🎨"
            title="Start Drawing"
            description="Begin a new drawing session. Perfect for quick sketches, diagrams, or personal brainstorming."
            onClick={handleStartDrawing}
            gradientFrom="from-gray-600"
            gradientTo="to-gray-500"
          />
          <ActionCard
            icon="🏠"
            title="Create Room"
            description="Start a collaborative session and invite others to join. Great for team meetings and group projects."
            onClick={handleCreateRoom}
            gradientFrom="from-gray-600"
            gradientTo="to-gray-500"
          />
          <ActionCard
            icon="🚪"
            title="Join Room"
            description="Enter an existing room with a room ID. Connect with your team and start collaborating instantly."
            onClick={handleJoinRoom}
            gradientFrom="from-gray-600"
            gradientTo="to-gray-500"
          />
        </div>

        {/* Features Section */}
        <div className="bg-gray-800/30 backdrop-blur-md rounded-3xl p-8 border border-gray-700/50">
          <h3 className="text-3xl font-bold text-center mb-12 text-white">
            Why Choose Excalidraw?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon="⚡"
              title="Lightning Fast"
              description="Instant loading and real-time collaboration"
              bgColor="bg-gray-700"
            />
            <FeatureCard
              icon="🔒"
              title="Secure"
              description="End-to-end encryption and privacy protection"
              bgColor="bg-gray-700"
            />
            <FeatureCard
              icon="🌐"
              title="Cross-platform"
              description="Works on any device, anywhere, anytime"
              bgColor="bg-gray-700"
            />
            <FeatureCard
              icon="🎯"
              title="Intuitive"
              description="Easy to use with powerful features"
              bgColor="bg-gray-700"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900/40 backdrop-blur-md border-t border-gray-800/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Excalidraw. All rights reserved.</p>
            <p className="text-sm mt-2">Built with ❤️ for visual thinkers everywhere</p>
          </div>
        </div>
      </footer>

      {/* Room Modal */}
      <RoomModal
        isOpen={showRoomModal}
        onClose={() => setShowRoomModal(false)}
        mode={roomModalMode}
      />
    </div>
  );
}

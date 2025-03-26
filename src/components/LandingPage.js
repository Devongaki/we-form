import React from "react";

function LandingPage({ onStart }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome to WE Fitness
        </h1>
        <p className="text-xl text-white mb-8 max-w-md mx-auto">
          Ready to transform your life? Join our community of fitness
          enthusiasts and start your journey today.
        </p>
        <button
          onClick={onStart}
          className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
        >
          Start Your Journey
        </button>
      </div>
    </div>
  );
}

export default LandingPage;

import React from "react";

const LandingPage = ({ onStart }) => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-800/85 to-indigo-900/90"></div>
      </div>

      {/* Content */}
      <div className="relative min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 text-center border border-white/20">
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-blue-500/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-indigo-500/20 rounded-full blur-2xl"></div>

            {/* Logo/Icon */}
            <div className="mb-6">
              <span className="inline-block p-3 bg-blue-600 rounded-full text-white text-4xl">
                💪
              </span>
            </div>

            <h1 className="text-4xl font-bold text-white mb-4">
              Transform Your Life with WE Online Coaching
            </h1>
            <p className="text-blue-100 mb-8 text-lg">
              Join our community and achieve your fitness goals with
              personalized training programs
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <span className="text-2xl mb-2">🎯</span>
                <p className="text-white text-sm">Personalized Goals</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <span className="text-2xl mb-2">📊</span>
                <p className="text-white text-sm">Progress Tracking</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <span className="text-2xl mb-2">👥</span>
                <p className="text-white text-sm">Expert Trainers</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <span className="text-2xl mb-2">🌟</span>
                <p className="text-white text-sm">Premium Workouts</p>
              </div>
            </div>

            <button
              onClick={onStart}
              className="w-full px-6 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Start Your Journey Now
            </button>

            {/* Social proof */}
            <p className="mt-6 text-blue-100 text-sm">
              Join 10,000+ members who have transformed their lives
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

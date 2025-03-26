import React, { useState } from "react";
import InputMask from "react-input-mask";

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    fitnessGoal: "",
  });

  const totalSteps = 3;

  const fitnessGoals = [
    {
      id: "lose-weight",
      title: "Lose Weight",
      icon: "🏃‍♂️",
      description: "Shed pounds and feel confident",
    },
    {
      id: "build-muscle",
      title: "Build Muscle",
      icon: "💪",
      description: "Gain strength and definition",
    },
    {
      id: "increase-stamina",
      title: "Increase Stamina",
      icon: "⚡",
      description: "Boost your endurance",
    },
    {
      id: "improve-health",
      title: "Improve Overall Health",
      icon: "❤️",
      description: "Feel better every day",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleInstagramFill = () => {
    // In a real app, this would be replaced with actual Instagram OAuth
    // For demo purposes, we'll just set a placeholder name
    setFormData((prevState) => ({
      ...prevState,
      name: "Instagram User",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log("Form submitted:", formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateNorwegianPhone = (phone) => {
    // Norwegian phone number validation regex
    const norwegianPhoneRegex = /^\+47[0-9]{8}$/;
    return norwegianPhoneRegex.test(phone);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900">
                Welcome to WE Fitness
              </h3>
              <p className="mt-2 text-gray-600">Let's start with your name</p>
            </div>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Your Name
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="flex-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter your name"
                  required
                />
                <button
                  type="button"
                  onClick={handleInstagramFill}
                  className="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                  <span className="text-sm">Fill from Instagram</span>
                </button>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900">
                Contact Details
              </h3>
              <p className="mt-2 text-gray-600">How can we reach you?</p>
            </div>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Norwegian Phone Number
                </label>
                <InputMask
                  mask="+47 99999999"
                  maskChar={null}
                  value={formData.phone}
                  onChange={handleChange}
                  name="phone"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="+47 XXXXXXXX"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  Format: +47 XXXXXXXX
                </p>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900">
                Your Fitness Goal
              </h3>
              <p className="mt-2 text-gray-600">What do you want to achieve?</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {fitnessGoals.map((goal) => (
                <button
                  key={goal.id}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, fitnessGoal: goal.id }))
                  }
                  className={`p-4 rounded-lg border-2 text-center transition-all transform hover:scale-105 ${
                    formData.fitnessGoal === goal.id
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <span className="text-2xl mb-2 block">{goal.icon}</span>
                  <span className="font-medium block">{goal.title}</span>
                  <span className="text-sm text-gray-600 mt-1 block">
                    {goal.description}
                  </span>
                </button>
              ))}
            </div>
            <input
              type="hidden"
              name="fitnessGoal"
              value={formData.fitnessGoal}
              required
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {[...Array(totalSteps)].map((_, index) => (
                <div
                  key={index + 1}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= index + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {index + 1}
                </div>
              ))}
            </div>
            <div className="relative">
              <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full rounded-full"></div>
              <div
                className="absolute top-0 left-0 h-1 bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  currentStep === 1 ? "ml-auto" : ""
                }`}
              >
                {currentStep === totalSteps ? "Complete Sign Up" : "Next"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;

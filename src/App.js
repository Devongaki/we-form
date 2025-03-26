import React, { useState, useEffect } from "react";
import InputMask from "react-input-mask";
import LandingPage from "./components/LandingPage";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState("NO");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    fitnessGoal: "",
  });

  const [isNameValid, setIsNameValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const countries = [
    { code: "NO", name: "Norway", prefix: "+47" },
    { code: "SE", name: "Sweden", prefix: "+46" },
  ];

  // Instagram OAuth configuration
  const INSTAGRAM_CLIENT_ID = process.env.REACT_APP_INSTAGRAM_CLIENT_ID;
  const REDIRECT_URI = window.location.origin + "/instagram-callback";

  const handleInstagramLogin = () => {
    if (
      !INSTAGRAM_CLIENT_ID ||
      INSTAGRAM_CLIENT_ID === "your_actual_instagram_client_id_here"
    ) {
      setError(
        "Instagram integration is not properly configured. Please check your Instagram Client ID."
      );
      return;
    }
    setIsLoading(true);
    setError(null);
    const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${INSTAGRAM_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user_profile,user_media&response_type=code`;
    window.location.href = authUrl;
  };

  const handleInstagramCallback = async (code) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("https://api.instagram.com/v1/users/self", {
        headers: {
          Authorization: `Bearer ${code}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const instagramName = data.data.full_name || data.data.username;
        setFormData((prev) => ({
          ...prev,
          name: instagramName,
        }));
        setIsNameValid(instagramName.length >= 3);
      } else {
        throw new Error("Failed to fetch Instagram user data");
      }
    } catch (error) {
      console.error("Error fetching Instagram data:", error);
      setError(
        "Failed to fetch your Instagram name. Please try again or enter your name manually."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      handleInstagramCallback(code);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleNameChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      name: value,
    }));
    setIsNameValid(value.length >= 3);
  };

  const handleCountryChange = (e) => {
    const country = countries.find((c) => c.code === e.target.value);
    setSelectedCountry(country.code);
    // Update phone number with new prefix
    const currentNumber = formData.phone.replace(/^\+\d+\s*/, "");
    setFormData((prev) => ({
      ...prev,
      phone: `${country.prefix} ${currentNumber}`,
    }));
  };

  const handlePhoneChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      phone: value,
    }));
  };

  const validatePhone = (phone) => {
    const country = countries.find((c) => c.code === selectedCountry);
    const phoneRegex =
      country.code === "NO" ? /^\+47\s*[0-9]{8}$/ : /^\+46\s*[0-9]{9}$/;
    return phoneRegex.test(phone);
  };

  const isPhoneValid = validatePhone(formData.phone);

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
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Your Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleNameChange}
                  className={`block w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 text-gray-700 bg-white shadow-sm ${
                    formData.name && !isNameValid
                      ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={handleInstagramLogin}
                  disabled={isLoading}
                  className={`absolute right-3 top-3 text-sm text-blue-600 hover:text-blue-700 font-medium ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? "Loading..." : "Auto-fill"}
                </button>
              </div>
              {formData.name && !isNameValid && (
                <p className="mt-1 text-sm text-red-500">
                  Name must be at least 3 characters long
                </p>
              )}
              {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
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
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 placeholder-gray-400 text-gray-700 bg-white shadow-sm"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number
                </label>
                <div className="flex gap-2">
                  <select
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    className="w-24 px-2 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-700 bg-white shadow-sm"
                  >
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.prefix}
                      </option>
                    ))}
                  </select>
                  <InputMask
                    mask={selectedCountry === "NO" ? "99999999" : "999999999"}
                    value={formData.phone.replace(/^\+\d+\s*/, "")}
                    onChange={handlePhoneChange}
                    className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all duration-200 placeholder-gray-400 text-gray-700 bg-white shadow-sm ${
                      formData.phone && !isPhoneValid
                        ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                        : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    }`}
                    placeholder={
                      selectedCountry === "NO" ? "XXXXXXXX" : "XXXXXXXXX"
                    }
                    required
                  />
                </div>
                {formData.phone && !isPhoneValid && (
                  <p className="mt-1 text-sm text-red-500">
                    Please enter a valid phone number
                  </p>
                )}
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

  if (!showForm) {
    return <LandingPage onStart={() => setShowForm(true)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-xl p-6">
          {/* Progress Bar */}
          <div className="mb-6">
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
                  className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={
                  (currentStep === 1 && !isNameValid) ||
                  (currentStep === 2 && !isPhoneValid)
                }
                className={`px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${
                  currentStep === 1 ? "ml-auto" : ""
                } ${
                  (currentStep === 1 && !isNameValid) ||
                  (currentStep === 2 && !isPhoneValid)
                    ? "opacity-50 cursor-not-allowed"
                    : ""
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

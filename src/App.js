import React, { useState, useEffect } from "react";
import InputMask from "react-input-mask";
import LandingPage from "./components/LandingPage";
import Confetti from "react-confetti";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import "./App.css";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState("NO");
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    fitnessGoal: "",
  });

  const [isNameValid, setIsNameValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Enhanced URL parameter handling
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const nameFromUrl = urlParams.get("name");

      if (nameFromUrl) {
        // Properly decode the name from URL
        const decodedName = decodeURIComponent(nameFromUrl.replace(/\+/g, " "));

        // Clean the name - remove extra spaces and special characters
        const cleanedName = decodedName
          .trim()
          .replace(/\s+/g, " ") // Replace multiple spaces with single space
          .replace(/[^\w\s\-']/g, ""); // Allow only letters, numbers, spaces, hyphens, and apostrophes

        if (cleanedName) {
          setFormData((prev) => ({
            ...prev,
            name: cleanedName,
          }));
          setIsNameValid(cleanedName.length >= 3);
          setShowForm(true);
          setCurrentStep(1); // Ensure we start at the name step
        }
      }
    } catch (error) {
      console.error("Error processing URL parameters:", error);
    }
  }, []);

  const countries = [
    { code: "NO", name: "Norway", prefix: "+47" },
    { code: "SE", name: "Sweden", prefix: "+46" },
  ];

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
    // Remove any non-digit characters for validation
    const digitsOnly = value.replace(/\D/g, "");
    const selectedPrefix = countries.find(
      (c) => c.code === selectedCountry
    ).prefix;

    setFormData((prev) => ({
      ...prev,
      phone: digitsOnly ? `${selectedPrefix} ${digitsOnly}` : "",
    }));
  };

  const validatePhone = (phone) => {
    if (!phone) return false;
    // Remove any non-digit characters for validation
    const digitsOnly = phone.replace(/\D/g, "");
    const country = countries.find((c) => c.code === selectedCountry);
    // Check if the number has the correct length after removing the prefix
    const numberWithoutPrefix = digitsOnly.slice(
      country.prefix.replace("+", "").length
    );
    return country.code === "NO"
      ? numberWithoutPrefix.length === 8
      : numberWithoutPrefix.length === 9;
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If not on the last step, proceed to next step
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      return;
    }

    // If on the last step, submit the form
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Format phone number to remove any non-digit characters
      const formattedPhone = formData.phone.replace(/\D/g, "");

      const submissionData = {
        name: formData.name,
        email: formData.email,
        phone: formattedPhone,
        fitnessGoal: formData.fitnessGoal,
        fitnessGoalDetails: fitnessGoals.find(
          (goal) => goal.id === formData.fitnessGoal
        ),
        submittedAt: new Date(),
      };

      console.log("Submitting data:", submissionData);

      // Check if Firebase is initialized
      if (!db) {
        console.error("Firebase DB is not initialized. Current db value:", db);
        console.error("Current Firebase config:", {
          projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
          authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
        });
        throw new Error(
          "Unable to connect to the database. Please try again later."
        );
      }

      const docRef = await addDoc(
        collection(db, "submissions"),
        submissionData
      );
      console.log("Submission successful! Document ID:", docRef.id);

      setShowSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        fitnessGoal: "",
        fitnessGoalDetails: "",
      });
    } catch (err) {
      console.error("Error submitting form:", err);
      setSubmitError(
        "There was an error submitting your form. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStartJourney = async () => {
    try {
      // Try to get Instagram data if available
      const urlParams = new URLSearchParams(window.location.search);
      const nameFromUrl = urlParams.get("name");

      if (nameFromUrl) {
        // Properly decode the name from URL
        const decodedName = decodeURIComponent(nameFromUrl.replace(/\+/g, " "));
        // Clean the name
        const cleanedName = decodedName
          .trim()
          .replace(/\s+/g, " ")
          .replace(/[^\w\s\-']/g, "");

        if (cleanedName) {
          setFormData((prev) => ({
            ...prev,
            name: cleanedName,
          }));
          setIsNameValid(cleanedName.length >= 3);
        }
      }
      setShowForm(true);
    } catch (error) {
      console.error("Error processing URL parameters:", error);
      setShowForm(true); // Show form anyway even if there's an error
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">
                Welcome to WE Fitness
              </h3>
              <p className="text-blue-100">Let's start with your name</p>
            </div>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-white/90 mb-1"
              >
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleNameChange}
                className={`block w-full px-4 py-3 rounded-xl border transition-all duration-200 bg-white/5 text-white placeholder-white/50 ${
                  formData.name && !isNameValid
                    ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20"
                    : "border-white/10 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                }`}
                required
              />
              {formData.name && !isNameValid && (
                <p className="mt-1 text-sm text-red-400">
                  Name must be at least 3 characters long
                </p>
              )}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">
                Contact Details
              </h3>
              <p className="text-blue-100">How can we reach you?</p>
            </div>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-white/90 mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 rounded-xl border border-white/10 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200 bg-white/5 text-white placeholder-white/50"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-white/90 mb-1"
                >
                  Phone Number
                </label>
                <div className="relative flex gap-2">
                  <select
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    className="w-24 px-2 py-3 rounded-xl border border-white/10 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200 bg-white/5 text-white"
                  >
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.prefix}
                      </option>
                    ))}
                  </select>
                  <div className="relative flex-1">
                    <InputMask
                      mask={
                        selectedCountry === "NO"
                          ? "99 99 99 99"
                          : "99 999 99 99"
                      }
                      maskChar={null}
                      value={formData.phone.replace(/^\+\d+\s*/, "")}
                      onChange={handlePhoneChange}
                      inputMode="numeric"
                      type="tel"
                      className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 bg-white/5 text-white placeholder-white/50 ${
                        formData.phone && !isPhoneValid
                          ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20"
                          : "border-white/10 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                      }`}
                      placeholder={
                        selectedCountry === "NO"
                          ? "XX XX XX XX"
                          : "XX XXX XX XX"
                      }
                    />
                  </div>
                </div>
                {formData.phone && !isPhoneValid && (
                  <p className="mt-1 text-sm text-red-400">
                    Please enter a valid{" "}
                    {selectedCountry === "NO" ? "8-digit" : "9-digit"} phone
                    number
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
              <h3 className="text-2xl font-bold text-white mb-2">
                Your Fitness Goal
              </h3>
              <p className="text-blue-100">What do you want to achieve?</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {fitnessGoals.map((goal) => (
                <button
                  key={goal.id}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, fitnessGoal: goal.id }))
                  }
                  className={`p-4 rounded-xl border-2 text-center transition-all transform hover:scale-105 ${
                    formData.fitnessGoal === goal.id
                      ? "border-blue-400 bg-blue-600/20 text-white"
                      : "border-white/10 hover:border-blue-400/50 text-white"
                  }`}
                >
                  <span className="text-2xl mb-2 block">{goal.icon}</span>
                  <span className="font-medium block">{goal.title}</span>
                  <span className="text-sm text-blue-100 mt-1 block">
                    {goal.description}
                  </span>
                </button>
              ))}
            </div>
            {!formData.fitnessGoal && (
              <p className="text-sm text-red-400 text-center">
                Please select a fitness goal to continue
              </p>
            )}
            {submitError && (
              <p className="text-sm text-red-400 text-center mt-4">
                {submitError}
              </p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const renderSubmitButton = () => (
    <button
      type="submit"
      disabled={
        (currentStep === 1 && !isNameValid) ||
        (currentStep === 3 && !formData.fitnessGoal) ||
        isSubmitting
      }
      className={`px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 transform hover:scale-105 shadow-lg ${
        currentStep === 1 ? "ml-auto" : ""
      } ${
        (currentStep === 1 && !isNameValid) ||
        (currentStep === 3 && !formData.fitnessGoal) ||
        isSubmitting
          ? "opacity-50 cursor-not-allowed"
          : ""
      }`}
    >
      {isSubmitting ? (
        <span className="flex items-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Submitting...
        </span>
      ) : currentStep === totalSteps ? (
        "Complete Sign Up"
      ) : (
        "Next"
      )}
    </button>
  );

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden">
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={500}
          gravity={0.2}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-md w-full mx-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center transform animate-fade-in-up">
              <div className="mb-6">
                <span className="inline-block p-3 bg-green-100 rounded-full text-green-500 text-4xl">
                  ✓
                </span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to the WE Fitness Team!
              </h2>
              <p className="text-gray-600 mb-8">
                Congratulations {formData.name}! 🎉 We're excited to have you
                join our fitness community. Get ready to transform your life and
                achieve your fitness goals!
              </p>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 font-medium">
                    Your Selected Goal
                  </p>
                  <p className="text-blue-600">
                    {
                      fitnessGoals.find(
                        (goal) => goal.id === formData.fitnessGoal
                      )?.title
                    }
                  </p>
                </div>
                <p className="text-sm text-gray-500">
                  We'll be in touch shortly with your personalized fitness plan!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!showForm) {
    return <LandingPage onStart={handleStartJourney} />;
  }

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
      <div className="relative min-h-screen flex items-center justify-center px-4 py-6">
        <div className="max-w-md w-full">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-blue-500/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-indigo-500/20 rounded-full blur-2xl"></div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                {[...Array(totalSteps)].map((_, index) => (
                  <div
                    key={index + 1}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      currentStep >= index + 1
                        ? "bg-blue-600/90 border-blue-400 text-white"
                        : "bg-white/10 border-white/20 text-white/60"
                    }`}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
              <div className="relative">
                <div className="absolute top-0 left-0 h-1 bg-white/10 w-full rounded-full"></div>
                <div
                  className="absolute top-0 left-0 h-1 bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-6">{renderStep()}</div>

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={isSubmitting}
                    className="px-6 py-3 text-sm font-medium text-white/90 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200"
                  >
                    Back
                  </button>
                )}
                {renderSubmitButton()}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

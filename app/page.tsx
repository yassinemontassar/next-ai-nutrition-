"use client";
import NutritionDashboard from "@/components/NutritionDashboard";
import NutritionResponse from "@/components/NutritionPlanDisplay";
import { useCompletion } from "ai/react";
import { Loader2, Send } from "lucide-react";
import { useState } from "react";

export default function NutritionForm() {
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    weight: "",
    height: "",
    activityLevel: "",
    goal: "",
  });

  const { complete, completion, isLoading, error } = useCompletion({
    api: "/api/chat",
    body: {
      userData: formData, // This is included in every request
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const prompt = `I'm a ${formData.age}-year-old ${formData.gender}, ${formData.weight}kg, ${formData.height}cm, ${formData.activityLevel} activity level. My goal is ${formData.goal}. Can you provide me with a nutrition plan?`;

    // Pass both prompt and userData
    await complete(prompt);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-blue-100 to-blue-200">
    {/* Header */}
    <header className="sticky top-0 bg-white/30 backdrop-blur-lg py-4 px-6 flex justify-center items-center z-50 shadow-lg">
    <div className="flex flex-col text-center">
      <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
        Coach Yassine
      </h1>
      <p className="text-lg text-gray-600 font-medium italic mt-1">
        Your personal nutrition assistant
      </p>
    </div>
  </header>
  
    {/* Form Section */}
    <div className="flex-grow p-6 overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-200 transition-all transform hover:scale-105"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Age Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Age
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              min={18} // Set a minimum age of 18
              max={120} // Set a maximum age of 120
              className="w-full p-4 border-2 text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
              required
            />
          </div>
  
          {/* Gender Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full text-gray-700 p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
              required
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
  
          {/* Weight Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Weight (kg)
            </label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              className="w-full p-4 text-gray-700 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
              required
              min={30} // Set a minimum weight of 30kg
              max={500} // Set a maximum weight of 500kg
            />
          </div>
  
          {/* Height Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Height (cm)
            </label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleInputChange}
              className="w-full text-gray-700 p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
              required
            />
          </div>
  
          {/* Activity Level Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Activity Level
            </label>
            <select
              name="activityLevel"
              value={formData.activityLevel}
              onChange={handleInputChange}
              className="w-full p-4 text-gray-700 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
              required
            >
              <option value="">Select activity level</option>
              <option value="sedentary">Sedentary</option>
              <option value="lightly active">Lightly Active</option>
              <option value="moderately active">Moderately Active</option>
              <option value="very active">Very Active</option>
            </select>
          </div>
  
          {/* Goal Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Goal
            </label>
            <select
              name="goal"
              value={formData.goal}
              onChange={handleInputChange}
              className="w-full text-gray-700 p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
              required
            >
              <option value="">Select goal</option>
              <option value="weight loss">Weight Loss</option>
              <option value="muscle gain">Muscle Gain</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>
  
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none transition-all disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              <Send className="w-5 h-5 mr-3" />
              Get Nutrition Plan
            </>
          )}
        </button>
      </form>
  
      {/* Response Section */}
      {completion && !isLoading && (
        <div className="max-w-6xl mx-auto mt-10 px-4 py-6 bg-white rounded-lg shadow-lg">
          <NutritionDashboard
            completion={completion}
            userFormData={formData}
          />
          <div className="mt-8">
            <NutritionResponse completion={completion} />
          </div>
        </div>
      )}
  
      {/* Error Handling */}
      {error && (
        <div className="mt-6 text-red-600 p-4 bg-red-50 rounded-lg shadow-md">
          <p className="font-medium">An error occurred. Please try again.</p>
        </div>
      )}
    </div>
  </div>
  
  );
}

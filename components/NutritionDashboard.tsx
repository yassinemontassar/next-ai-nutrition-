import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Calculator,
  ChartPie,
  Scale,
  Target,
} from "lucide-react";
import React, { useEffect, useState } from "react";

interface NutritionDashboardProps {
  completion: string;
  userFormData: {
    weight: string;
    height: string;
    age: string;
    gender: string;
    activityLevel: string;
    goal: string;
  };
}

interface ParsedData {
  calories: {
    maintenance: number;
    target: number;
    deficit: number;
  };
  macros: {
    protein: { grams: number; percentage: number };
    carbs: { grams: number; percentage: number };
    fats: { grams: number; percentage: number };
  };
  weight: {
    current: number;
    target: number | null;
    weeklyChange: number;
    timeToGoal: number | null;
  };
}

const NutritionDashboard: React.FC<NutritionDashboardProps> = ({
  completion,
  userFormData,
}) => {
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);

  useEffect(() => {
    const parseNutritionData = (): ParsedData => {
      console.log("Completion String:", completion);

      // Parse maintenance calories
      const maintenanceMatch = completion.match(
        /\*\*Total Daily\s*calories:\*\*\s*([\d,]+\.?\d*)/i
      );
      const maintenanceCalories = maintenanceMatch
        ? parseFloat(maintenanceMatch[1].replace(/,/g, ""))
        : (() => {
            console.warn("Maintenance calories not found in the response");
            return 0;
          })();

      // Parse calorie adjustment (deficit/surplus)
      const adjustmentMatch = completion.match(
        /\*\*(?:Calorie Deficit|Calorie Surplus):\*\*\s*([\d,]+\.?\d*)/i
      );
      const adjustmentCalories = adjustmentMatch
        ? parseFloat(adjustmentMatch[1].replace(/,/g, ""))
        : 0;

      // Determine target calories based on surplus or deficit
      const isSurplus = completion.includes("Calorie Surplus");
      const targetCalories = isSurplus
        ? maintenanceCalories + adjustmentCalories
        : maintenanceCalories - adjustmentCalories;

      // Parse macros
      const proteinMatch = completion.match(
        /\*\*Protein:\*\* (\d+) grams \((\d+)%/
      );
      const carbsMatch = completion.match(
        /\*\*Carbohydrates:\*\* (\d+) grams \((\d+)%/
      );
      const fatsMatch = completion.match(/\*\*Fats:\*\* (\d+) grams \((\d+)%/);

      // Calculate weight goals based on user's goal
      const currentWeight = parseFloat(userFormData.weight);
      let targetWeight = null;
      let weeklyChange = 0;

      if (userFormData.goal === "weight loss") {
        targetWeight = currentWeight * 0.9; // Assume 10% weight loss goal
        weeklyChange = -0.5; // 0.5 kg loss per week
      } else if (userFormData.goal === "muscle gain") {
        targetWeight = currentWeight * 1.1; // Assume 10% weight gain goal
        weeklyChange = 0.25; // 0.25 kg gain per week
      }

      const timeToGoal = targetWeight
        ? Math.abs((targetWeight - currentWeight) / weeklyChange)
        : null;

      return {
        calories: {
          maintenance: maintenanceCalories,
          target: targetCalories,
          deficit: isSurplus
            ? adjustmentCalories
            : Math.abs(maintenanceCalories - targetCalories),
        },
        macros: {
          protein: {
            grams: proteinMatch ? parseInt(proteinMatch[1]) : 0,
            percentage: proteinMatch ? parseInt(proteinMatch[2]) : 0,
          },
          carbs: {
            grams: carbsMatch ? parseInt(carbsMatch[1]) : 0,
            percentage: carbsMatch ? parseInt(carbsMatch[2]) : 0,
          },
          fats: {
            grams: fatsMatch ? parseInt(fatsMatch[1]) : 0,
            percentage: fatsMatch ? parseInt(fatsMatch[2]) : 0,
          },
        },
        weight: {
          current: currentWeight,
          target: targetWeight,
          weeklyChange: weeklyChange,
          timeToGoal: timeToGoal,
        },
      };
    };

    setParsedData(parseNutritionData());
  }, [completion, userFormData]);

  if (!parsedData) return null;

  // Progress bar component
  const ProgressBar: React.FC<{ percentage: number; color: string }> = ({
    percentage,
    color,
  }) => (
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className={`h-full ${color}`}
        style={{ width: `${Math.min(100, percentage)}%` }}
      />
    </div>
  );

  // Macro Circle component
  const MacroCircle: React.FC<{
    value: number;
    label: string;
    color: string;
    percentage: number;
  }> = ({ value, label, color, percentage }) => (
    <div className="flex flex-col items-center">
      <div
        className={`w-24 h-24 rounded-full border-4 ${color} flex items-center justify-center mb-2`}
      >
        <div className="text-center">
          <div className="text-xl font-bold  text-black">{value}g</div>
          <div className="text-xs  text-black">{percentage}%</div>
        </div>
      </div>
      <span className="text-sm font-medium  text-black">{label}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Calorie Goal Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-black">Daily Calories</h3>
            <Calculator className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold mb-2 text-black">
            {parsedData.calories.target.toLocaleString()}
            <span className="text-sm text-black ml-2">kcal</span>
          </div>
          <ProgressBar
            percentage={
              (parsedData.calories.target / parsedData.calories.maintenance) *
              100
            }
            color="bg-blue-500"
          />
          <div className="mt-2 text-sm text-black">
            Maintenance: {parsedData.calories.maintenance.toLocaleString()} kcal
          </div>
        </div>

        {/* Weight Progress Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-black">
              Weight Progress
            </h3>
            <Scale className="w-5 h-5 text-green-500" />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-3xl font-bold text-black">
              {parsedData.weight.current}
              <span className="text-sm text-black ml-1">kg</span>
            </div>
            {parsedData.weight.target && (
              <>
                <ArrowRight className="w-5 h-5 text-gray-400" />
                <div className="text-3xl font-bold text-green-500">
                  {parsedData.weight.target.toFixed(1)}
                  <span className="text-sm text-black ml-1">kg</span>
                </div>
              </>
            )}
          </div>
          {parsedData.weight.timeToGoal && (
            <div className="text-sm text-gray-600">
              Estimated {Math.ceil(parsedData.weight.timeToGoal)} weeks to goal
              at {Math.abs(parsedData.weight.weeklyChange)}kg/week
            </div>
          )}
        </div>

        {/* Goal Timeline Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-black">Daily Target</h3>
            <Target className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-3xl font-bold mb-2 text-black">
            {parsedData.calories.deficit}
            <span className="text-sm text-black ml-1">kcal</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {userFormData.goal === "weight loss" ? (
              <ArrowDown className="w-4 h-4 text-green-500" />
            ) : (
              <ArrowUp className="w-4 h-4 text-red-500" />
            )}
            {userFormData.goal === "weight loss" ? "Deficit" : "Surplus"}
          </div>
        </div>
      </div>

      {/* Macronutrient Distribution */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-black">
            Macronutrient Goals
          </h3>
          <ChartPie className="w-5 h-5 text-blue-500" />
        </div>
        <div className="flex justify-around">
          <MacroCircle
            value={parsedData.macros.protein.grams}
            label="Protein"
            color="border-blue-500"
            percentage={parsedData.macros.protein.percentage}
          />
          <MacroCircle
            value={parsedData.macros.carbs.grams}
            label="Carbs"
            color="border-green-500"
            percentage={parsedData.macros.carbs.percentage}
          />
          <MacroCircle
            value={parsedData.macros.fats.grams}
            label="Fats"
            color="border-yellow-500"
            percentage={parsedData.macros.fats.percentage}
          />
        </div>
      </div>
    </div>
  );
};

export default NutritionDashboard;

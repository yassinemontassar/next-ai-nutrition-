import { Calculator, ChartPie, Info, Utensils } from "lucide-react";
import React from "react";

interface DailyCalculations {
  introduction: string[];
  calculations: string[];
  explanation: string[];
}

interface MacroSection {
  breakdown: string[];
  explanation: string[];
}

interface ParsedSections {
  dailyCalculations: DailyCalculations;
  macros: MacroSection;
  mealPlan: string[];
  recommendations: string[];
}

interface NutritionResponseProps {
  completion: string;
}

type SectionType =
  | "dailyCalculations"
  | "macros"
  | "mealPlan"
  | "recommendations";
type DailySubSectionType = "introduction" | "calculations" | "explanation";
type MacroSubSectionType = "breakdown" | "explanation";

const NutritionResponse: React.FC<NutritionResponseProps> = ({
  completion,
}) => {
  const parseResponse = (text: string): ParsedSections => {
    const sections: ParsedSections = {
      dailyCalculations: {
        introduction: [],
        calculations: [],
        explanation: [],
      },
      macros: {
        breakdown: [],
        explanation: [],
      },
      mealPlan: [],
      recommendations: [],
    };

    const lines: string[] = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    let currentMainSection: SectionType = "dailyCalculations";
    let currentSubSection: DailySubSectionType | MacroSubSectionType =
      "introduction";

    lines.forEach((line: string) => {
      const cleanLine: string = line.replace(/\*+/g, "").trim();

      if (cleanLine.toLowerCase().includes("macronutrient breakdown")) {
        currentMainSection = "macros";
        currentSubSection = "breakdown";
        return;
      } else if (cleanLine.toLowerCase().includes("meal plan")) {
        currentMainSection = "mealPlan";
        return;
      } else if (cleanLine.toLowerCase().includes("recommendations")) {
        currentMainSection = "recommendations";
        return;
      } else if (cleanLine.toLowerCase().includes("explanation:")) {
        currentSubSection = "explanation";
        return;
      } else if (cleanLine.toLowerCase().includes("daily calorie needs:")) {
        currentSubSection = "calculations";
        return;
      }

      if (cleanLine && !cleanLine.includes("**")) {
        if (currentMainSection === "dailyCalculations") {
          sections.dailyCalculations[
            currentSubSection as DailySubSectionType
          ].push(cleanLine);
        } else if (currentMainSection === "macros") {
          sections.macros[currentSubSection as MacroSubSectionType].push(
            cleanLine
          );
        } else if (currentMainSection === "mealPlan") {
          sections.mealPlan.push(cleanLine);
        } else if (currentMainSection === "recommendations") {
          sections.recommendations.push(cleanLine);
        }
      }
    });

    return sections;
  };

  const sections: ParsedSections = parseResponse(completion);

  interface SectionHeaderProps {
    icon: React.ReactNode;
    title: string;
    bgColor: string;
  }

  const SectionHeader: React.FC<SectionHeaderProps> = ({
    icon,
    title,
    bgColor,
  }) => (
    <div className={`${bgColor} p-4 flex items-center`}>
      {icon}
      <h3 className="text-lg font-semibold text-white ml-2">{title}</h3>
    </div>
  );

  interface ContentListProps {
    items: string[];
    className?: string;
  }

  const ContentList: React.FC<ContentListProps> = ({
    items,
    className = "",
  }) => (
    <ul className={`space-y-2 ${className}`}>
      {items.map((item, idx) => (
        <li key={idx} className="text-gray-700">
          {item}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="mt-8 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Your Personalized Nutrition Plan
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Calculations Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden col-span-1 md:col-span-2">
          <SectionHeader
            icon={<Calculator className="w-6 h-6 text-white" />}
            title="Daily Calorie Calculations"
            bgColor="bg-blue-500"
          />
          <div className="p-6 space-y-6">
            {sections.dailyCalculations.introduction.length > 0 && (
              <div className="text-gray-700">
                <ContentList
                  items={sections.dailyCalculations.introduction}
                  className="mb-2"
                />
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-3">
                Calculations:
              </h4>
              <ContentList items={sections.dailyCalculations.calculations} />
            </div>

            {sections.dailyCalculations.explanation.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">
                  Explanation:
                </h4>
                <ContentList items={sections.dailyCalculations.explanation} />
              </div>
            )}
          </div>
        </div>

        {/* Macronutrient Breakdown Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden col-span-1 md:col-span-2">
          <SectionHeader
            icon={<ChartPie className="w-6 h-6 text-white" />}
            title="Macronutrient Breakdown"
            bgColor="bg-green-500"
          />
          <div className="p-6 space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <ContentList items={sections.macros.breakdown} />
            </div>

            {sections.macros.explanation.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">
                  Explanation:
                </h4>
                <ContentList items={sections.macros.explanation} />
              </div>
            )}
          </div>
        </div>

        {/* Meal Plan Card */}
        {sections.mealPlan.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden col-span-1 md:col-span-2">
            <SectionHeader
              icon={<Utensils className="w-6 h-6 text-white" />}
              title="Suggested Meal Plan"
              bgColor="bg-purple-500"
            />
            <div className="p-6">
              <ContentList items={sections.mealPlan} className="space-y-3" />
            </div>
          </div>
        )}

        {/* Additional Recommendations Card */}
        {sections.recommendations.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden col-span-1 md:col-span-2">
            <SectionHeader
              icon={<Info className="w-6 h-6 text-white" />}
              title="Additional Recommendations"
              bgColor="bg-orange-500"
            />
            <div className="p-6">
              <ContentList
                items={sections.recommendations}
                className="space-y-3"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NutritionResponse;

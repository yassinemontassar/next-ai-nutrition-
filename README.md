# AI Nutrition Coach 🥗

An intelligent nutrition planning application that provides personalized meal plans and nutritional guidance powered by the Google Gemini AI model.

## Features

- **Personalized Nutrition Plans**: Get customized meal plans based on your:
  - Age, gender, weight, and height
  - Activity level
  - Fitness goals (weight loss, muscle gain, or maintenance)

- **Smart Dashboard**
  - Real-time calorie calculations
  - Interactive macronutrient distribution charts
  - Weight progress tracking
  - Timeline estimates for reaching your goals

- **Detailed Nutrition Breakdowns**
  - Daily calorie targets with deficit/surplus calculations
  - Precise macronutrient ratios (protein, carbs, fats)
  - Meal-by-meal calorie distribution
  - Portion-specific meal plans

- **User-Friendly Interface**
  - Clean, modern design
  - Responsive layout for all devices
  - Real-time form validation
  - Interactive data visualization

## Technology Stack

- **Frontend**
  - Next.js
  - React
  - Tailwind CSS
  - TypeScript

- **Backend**
  - Google Gemini 1.5 Flash
  - AI SDK
  - Stream Processing

## Getting Started

1. Clone the repository
```bash
git clone [your-repo-url]
```

2. Install dependencies
```bash
npm install
```

3. Set up your environment variables
```bash
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) to view the application

## Project Structure

```
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts    # API endpoint for AI interactions
│   └── page.tsx            # Main application page
├── components/
│   ├── NutritionDashboard.tsx    # Dashboard visualization
│   └── NutritionPlanDisplay.tsx  # Nutrition plan display
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Powered by Google Gemini AI
- Built with Next.js and React
- Styled with Tailwind CSS
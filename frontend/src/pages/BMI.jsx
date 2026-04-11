import { useState } from "react";
import Navbar from "../components/Navbar";

const BMI = () => {
  const [form, setForm] = useState({ weight: "", height: "", unit: "metric" });
  const [result, setResult] = useState(null);

  const calculate = () => {
    let bmi;
    if (form.unit === "metric") {
      const h = parseFloat(form.height) / 100;
      bmi = parseFloat(form.weight) / (h * h);
    } else {
      bmi = (703 * parseFloat(form.weight)) / (parseFloat(form.height) * parseFloat(form.height));
    }
    let category, color, advice;
    if (bmi < 18.5) { category = "Underweight"; color = "text-blue-600"; advice = "Consider consulting a nutritionist to gain healthy weight."; }
    else if (bmi < 25) { category = "Normal weight"; color = "text-green-600"; advice = "Great! Maintain your healthy lifestyle."; }
    else if (bmi < 30) { category = "Overweight"; color = "text-yellow-600"; advice = "Consider increasing physical activity and reducing caloric intake."; }
    else { category = "Obese"; color = "text-red-600"; advice = "Please consult a healthcare professional for guidance."; }
    setResult({ bmi: bmi.toFixed(1), category, color, advice });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">BMI Calculator ⚖️</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Calculate your Body Mass Index</p>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-100 dark:border-gray-700 p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Unit</label>
            <div className="flex gap-3">
              <button onClick={() => setForm({ ...form, unit: "metric" })}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${form.unit === "metric" ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"}`}>
                Metric (kg/cm)
              </button>
              <button onClick={() => setForm({ ...form, unit: "imperial" })}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${form.unit === "imperial" ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"}`}>
                Imperial (lbs/in)
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Weight ({form.unit === "metric" ? "kg" : "lbs"})</label>
            <input type="number" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })}
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={form.unit === "metric" ? "e.g. 70" : "e.g. 154"} />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Height ({form.unit === "metric" ? "cm" : "inches"})</label>
            <input type="number" value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })}
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={form.unit === "metric" ? "e.g. 175" : "e.g. 69"} />
          </div>
          <button onClick={calculate} disabled={!form.weight || !form.height}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50">
            Calculate BMI
          </button>
          {result && (
            <div className="mt-6 p-5 bg-gray-50 dark:bg-gray-700 rounded-xl text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Your BMI</p>
              <p className={`text-5xl font-bold ${result.color} mb-2`}>{result.bmi}</p>
              <p className={`text-lg font-semibold ${result.color} mb-3`}>{result.category}</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{result.advice}</p>
              <div className="mt-4 grid grid-cols-4 gap-1 text-xs">
                <div className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 p-2 rounded-lg"><p className="font-semibold">Underweight</p><p>&lt; 18.5</p></div>
                <div className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 p-2 rounded-lg"><p className="font-semibold">Normal</p><p>18.5-24.9</p></div>
                <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 p-2 rounded-lg"><p className="font-semibold">Overweight</p><p>25-29.9</p></div>
                <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 p-2 rounded-lg"><p className="font-semibold">Obese</p><p>&gt; 30</p></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BMI;
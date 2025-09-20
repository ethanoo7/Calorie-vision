
import React from 'react';
import { CalorieAnalysis } from '../types';

interface CalorieResultProps {
  result: CalorieAnalysis;
}

const MacroBar: React.FC<{ label: string; value: number; unit: string; color: string; total: number }> = ({ label, value, unit, color, total }) => {
    const percentage = total > 0 ? (value / total) * 100 : 0;
    return (
        <div>
            <div className="flex justify-between items-baseline mb-1">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">{value.toFixed(1)}{unit}</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                <div className={`${color} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
};


const CalorieResult: React.FC<CalorieResultProps> = ({ result }) => {
  const { foodName, totalCalories, macros, confidenceScore, disclaimer } = result;
  const totalMacros = macros.protein.value + macros.carbohydrates.value + macros.fat.value;

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-800/50 p-6 rounded-lg border border-slate-200 dark:border-slate-700 animate-fade-in">
        <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-primary-600 dark:text-primary-400 capitalize">{foodName}</h3>
            <div className="flex items-center justify-center gap-2 mt-2">
                <p className="text-5xl font-extrabold text-slate-800 dark:text-slate-100">{Math.round(totalCalories)}</p>
                <span className="text-lg text-slate-500 dark:text-slate-400 self-end mb-1">kcal</span>
            </div>
             <div className="mt-2 text-xs text-slate-400">
                Confidence: { (confidenceScore * 100).toFixed(0) }%
            </div>
        </div>

        <div className="space-y-4 mb-6">
            <h4 className="text-md font-semibold text-center text-slate-600 dark:text-slate-300 mb-2">Macronutrient Breakdown</h4>
            <MacroBar label="Protein" value={macros.protein.value} unit={macros.protein.unit} color="bg-sky-500" total={totalMacros} />
            <MacroBar label="Carbohydrates" value={macros.carbohydrates.value} unit={macros.carbohydrates.unit} color="bg-amber-500" total={totalMacros} />
            <MacroBar label="Fat" value={macros.fat.value} unit={macros.fat.unit} color="bg-rose-500" total={totalMacros} />
        </div>

        <div className="text-xs text-slate-400 dark:text-slate-500 text-center italic p-3 bg-slate-100 dark:bg-slate-900/50 rounded-md">
            <p>{disclaimer}</p>
        </div>
    </div>
  );
};

export default CalorieResult;


import { GoogleGenAI, Type } from "@google/genai";
import { CalorieAnalysis } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const calorieAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        foodName: {
            type: Type.STRING,
            description: "The name of the food item identified in the image."
        },
        totalCalories: {
            type: Type.INTEGER,
            description: "The estimated total number of calories for the food item."
        },
        macros: {
            type: Type.OBJECT,
            description: "The macronutrient breakdown.",
            properties: {
                protein: {
                    type: Type.OBJECT,
                    properties: {
                        value: { type: Type.NUMBER },
                        unit: { type: Type.STRING, description: "e.g., 'g' for grams" }
                    },
                    required: ["value", "unit"]
                },
                carbohydrates: {
                    type: Type.OBJECT,
                    properties: {
                        value: { type: Type.NUMBER },
                        unit: { type: Type.STRING, description: "e.g., 'g' for grams" }
                    },
                    required: ["value", "unit"]
                },
                fat: {
                    type: Type.OBJECT,
                    properties: {
                        value: { type: Type.NUMBER },
                        unit: { type: Type.STRING, description: "e.g., 'g' for grams" }
                    },
                    required: ["value", "unit"]
                },
            },
            required: ["protein", "carbohydrates", "fat"]
        },
        confidenceScore: {
            type: Type.NUMBER,
            description: "A score from 0.0 to 1.0 indicating the model's confidence in the analysis."
        },
        disclaimer: {
            type: Type.STRING,
            description: "A brief disclaimer stating that the analysis is an estimate and should not be used for medical purposes."
        }
    },
    required: ["foodName", "totalCalories", "macros", "confidenceScore", "disclaimer"]
};

export const analyzeImageForCalories = async (base64Image: string, mimeType: string): Promise<CalorieAnalysis> => {
    try {
        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType: mimeType,
            },
        };
        const textPart = {
            text: `Analyze the food item in this image. 
            Identify the food and estimate its total calories and macronutrient breakdown (protein, carbohydrates, and fat) in grams. 
            Consider a standard portion size unless otherwise obvious. 
            Provide a confidence score from 0.0 to 1.0 on your analysis.
            Include a disclaimer that this is an AI-generated estimate.
            Return the result strictly in the provided JSON format.`,
        };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: calorieAnalysisSchema,
            },
        });

        const jsonString = response.text.trim();
        const result: CalorieAnalysis = JSON.parse(jsonString);
        return result;

    } catch (error) {
        console.error("Error analyzing image with Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Gemini API Error: ${error.message}`);
        }
        throw new Error("An unknown error occurred during image analysis.");
    }
};

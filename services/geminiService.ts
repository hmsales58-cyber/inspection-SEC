import { GoogleGenerativeAI } from "@google/generative-ai";
import { InspectionItem } from "../types";

export const extractDataFromImage = async (base64Image: string): Promise<any> => {
  const apiKey = "AIzaSyC_LCzI8tHKRd0_YNIj8H_XwjZSWPR8OTw"; 
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const result = await model.generateContent([
      "Identify the device. Focus on Part Number (SPEC). Return JSON.",
      { inlineData: { mimeType: "image/jpeg", data: base64Image } }
    ]);
    return result.response.text();
  } catch (e) {
    console.error(e);
    return null;
  }
};

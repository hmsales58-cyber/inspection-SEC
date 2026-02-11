import { GoogleGenAI, Type, Schema } from "@google/genai";

// تم وضع المفتاح الخاص بك هنا ليعمل التطبيق مباشرة
const API_KEY = "AIzaSyCNx2gG1V5vq-2YALfvQJjYTkGER4LkjEc";

const SYSTEM_INSTRUCTION = `
Role: Senior Forensic Data Integrity Expert for "Secured Logistics Solution".
Protocol: 
1. Use Part Number (SPEC) as the primary key. 
   - Example: "SM-A366BZKPMEA" MUST return: Model: "Samsung Galaxy A36 5G", RAM/GB: "8/128GB", Color: "Awesome Black".
2. Format RAM/GB clearly (e.g., 8/128GB).
3. Accuracy is 100%. If the image is blurry, return empty strings. Do not invent data.
4. Manual entry is the fallback.`;

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    company: { type: Type.STRING },
    customerCode: { type: Type.STRING },
    items: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          model: { type: Type.STRING },
          gb: { type: Type.STRING },
          pcs: { type: Type.INTEGER },
          color: { type: Type.STRING },
          coo: { type: Type.STRING },
          spec: { type: Type.STRING },
          remarks: { type: Type.STRING },
        },
        required: ["model", "gb", "pcs", "color", "coo", "spec", "remarks"],
      },
    },
  },
  required: ["items"],
};

export const extractDataFromImage = async (base64Image: string) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const model = ai.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: SYSTEM_INSTRUCTION 
  });

  try {
    const result = await model.generateContent({
      contents: [{ 
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: base64Image } }, 
          { text: "Scan this label and extract details. Focus on SPEC for accuracy." }
        ] 
      }],
      generationConfig: { 
        responseMimeType: "application/json", 
        responseSchema: responseSchema, 
        temperature: 0.1 
      }
    });

    const responseText = result.response.text();
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};
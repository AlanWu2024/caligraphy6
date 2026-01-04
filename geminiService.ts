import { GoogleGenAI, Type } from "@google/genai";

/**
 * 识别图片中的书法字
 */
export const recognizeCalligraphy = async (base64Image: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite-latest",
      contents: [
        {
          role: 'user',
          parts: [
            { text: "Analyze this Chinese calligraphy image. Identify the characters. For each character, provide: 1. The character itself, 2. The likely calligrapher, 3. The era/dynasty, 4. A brief etymology. Return strictly in JSON format." },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Image.split(',')[1] || base64Image
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            results: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  char: { type: Type.STRING },
                  calligrapher: { type: Type.STRING },
                  dynasty: { type: Type.STRING },
                  etymology: { type: Type.STRING },
                  confidence: { type: Type.NUMBER },
                  source: { type: Type.STRING }
                },
                required: ["char", "calligrapher", "dynasty"]
              }
            }
          }
        }
      }
    });
    
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Recognition failed:", error);
    throw error;
  }
};

/**
 * 全球联网搜索书法学术资料
 */
export const searchCalligraphyWeb = async (query: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Search for historical calligraphy examples and academic details for the Chinese character "${query}" across major museum databases like The Met, National Palace Museum, Tokyo National Museum, and specialized sites like shufami.com. Focus on running (Xing) and cursive (Cao) styles.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    // 提取搜索来源
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return {
      text: response.text || "",
      sources: sources.map((chunk: any) => ({
        title: chunk.web?.title || "相关学术资源",
        uri: chunk.web?.uri || "#"
      }))
    };
  } catch (error) {
    console.error("Web search failed:", error);
    return { text: "联网搜索暂时不可用", sources: [] };
  }
};
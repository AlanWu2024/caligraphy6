import { GoogleGenAI, Type } from "@google/genai";

/**
 * 识别图片中的书法字 - 专家链条版本
 */
export const recognizeCalligraphy = async (base64Image: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [
        {
          role: 'user',
          parts: [
            { text: `你是一位专门研究“草法”的考古学家。草书识别的关键在于笔顺逻辑，请执行以下鉴定流程：

1. 笔迹模拟：在后台模拟此字的运笔轨迹，分析哪些是实笔，哪些是牵丝。
2. 规律检索：利用 Google Search 检索专业书法字典（如 910shufa.com, shufazidian.com, zidian.shufa.com），对比此字形的特征。
3. 风格锚定：判断此风格更接近“狂草”、“小草”还是“章草”。
4. 候选输出：给出 3 个最可能的汉字，并为每个候选字提供“草法依据”（例如：该字的撇捺简化符合怀素自叙帖的习惯）。

请严格按 JSON 格式返回，results 数组必须包含 3 个候选结果。` },
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
        thinkingConfig: { thinkingBudget: 32768 },
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            results: {
              type: Type.ARRAY,
              description: "包含3个候选字的识别结果列表",
              items: {
                type: Type.OBJECT,
                properties: {
                  char: { type: Type.STRING, description: "候选汉字" },
                  reasoning: { type: Type.STRING, description: "草法分析依据" },
                  confidence: { type: Type.NUMBER, description: "该结果的可能性 (0-1)" },
                  calligrapher: { type: Type.STRING, description: "风格最像的书法大家" },
                  era: { type: Type.STRING, description: "建议参考的朝代" }
                },
                required: ["char", "reasoning", "confidence"]
              }
            }
          }
        }
      }
    });
    
    const rawText = response.text || "{}";
    const parsed = JSON.parse(rawText);
    
    // 注入搜索到的学术证据
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    if (parsed.results && parsed.results.length > 0) {
      parsed.results.forEach((res: any) => {
        res.evidenceLinks = chunks
          .filter(c => c.web)
          .map((c: any) => ({
            title: c.web.title,
            uri: c.web.uri
          }));
      });
    }

    return parsed;
  } catch (error) {
    console.error("Expert recognition failed:", error);
    throw error;
  }
};

/**
 * 专业字库检索
 */
export const searchCalligraphyWeb = async (query: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `查阅专业书法典籍，给出汉字“${query}”在王羲之、智永、怀素、王铎四位名家中的典型草法写法，并描述其关键转折逻辑。请包含相关的学术参考链接。`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return {
      text: response.text || "",
      sources: sources
        .filter(c => c.web)
        .map((chunk: any) => ({
          title: chunk.web.title,
          uri: chunk.web.uri
        }))
    };
  } catch (error) {
    console.error("Web retrieval failed:", error);
    return { text: "由于网络限制，无法访问外部字库。", sources: [] };
  }
};
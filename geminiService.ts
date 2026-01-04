import { GoogleGenAI, Type } from "@google/genai";

/**
 * 识别图片中的书法字
 * 升级为 gemini-3-pro-preview 以获得最强的草书逻辑分析能力
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
            { text: "你是一位世界级的古文字学家和书法鉴定专家。请分析这张中国书法图片（行书或草书）。\n\n要求：\n1. 识别图中的汉字。\n2. 启动 Google Search 联网功能，检查此图是否出自著名的历史碑帖（如《兰亭序》、《自叙帖》等）。\n3. 如果是名家作品，请指出具体的碑帖名称、书法家及朝代。\n4. 简述该字的构形演变。\n\n请严格按 JSON 格式返回结果。" },
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
        thinkingConfig: { thinkingBudget: 16000 }, // 分配思考预算，让模型先推演笔画再给出结论
        tools: [{ googleSearch: {} }], // 开启联网校验功能
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            results: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  char: { type: Type.STRING, description: "识别出的汉字内容" },
                  calligrapher: { type: Type.STRING, description: "书法家姓名，未知则填'民间书家'" },
                  dynasty: { type: Type.STRING, description: "朝代" },
                  etymology: { type: Type.STRING, description: "字源解析或笔法特点" },
                  confidence: { type: Type.NUMBER, description: "0到1之间的置信度" },
                  source: { type: Type.STRING, description: "出自哪本碑帖或文献" }
                },
                required: ["char", "calligrapher", "dynasty"]
              }
            }
          }
        }
      }
    });
    
    // 提取结果并合并搜索到的参考资料
    const rawText = response.text || "{}";
    const parsed = JSON.parse(rawText);
    
    // 如果有联网搜索元数据，可以作为额外信息参考
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    if (chunks.length > 0 && parsed.results?.length > 0) {
      parsed.results[0].webReferences = chunks.map((c: any) => ({
        title: c.web?.title,
        uri: c.web?.uri
      }));
    }

    return parsed;
  } catch (error) {
    console.error("Recognition failed:", error);
    throw error;
  }
};

/**
 * 深度字典查询 - 联网搜索详细学术资料
 */
export const searchCalligraphyWeb = async (query: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `请搜索中国书法中“${query}”字的学术解析。重点查询：1. 在故宫博物院、台北故宫、大都会博物馆中的藏品；2. 该字在《说文解字》中的本义；3. 行草书中典型的名家写法。请给出简洁的学术总结和参考链接。`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return {
      text: response.text || "",
      sources: sources.map((chunk: any) => ({
        title: chunk.web?.title || "学术资料参考",
        uri: chunk.web?.uri || "#"
      }))
    };
  } catch (error) {
    console.error("Web search failed:", error);
    return { text: "联网搜索暂时不可用", sources: [] };
  }
};
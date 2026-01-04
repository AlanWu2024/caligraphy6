import { GoogleGenAI, Type } from "@google/genai";

/**
 * 识别图片中的书法字
 * 采用最高规格的 gemini-3-pro-preview 模型
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
            { text: `你是一位顶级书法考据专家。请对这张图片中的书法字进行“数字考古”级别的识别：

1. 视觉拆解：分析笔画的起承转合、连带关系（尤其是草书的省写逻辑）。
2. 联网比对：立即使用 Google Search 访问《书法大字典》、故宫博物院 (dpm.org.cn)、台北故宫 (npm.gov.tw) 等专业数据库。
3. 查找同款：寻找历史上哪位名家的笔法与此最接近，或者该字是否出自某部传世碑帖。
4. 给出结论：返回识别结果。如果字迹模糊或极度潦草，请给出最可能的2-3个候选字。

请以 JSON 格式返回结果。` },
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
        thinkingConfig: { thinkingBudget: 32768 }, // 给予最高级别的逻辑推演空间
        tools: [{ googleSearch: {} }], // 开启联网工具
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            results: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  char: { type: Type.STRING, description: "识别出的汉字" },
                  calligrapher: { type: Type.STRING, description: "书法家或派系" },
                  dynasty: { type: Type.STRING, description: "朝代背景" },
                  etymology: { type: Type.STRING, description: "笔法解析：如'圆转处有魏碑遗意'" },
                  confidence: { type: Type.NUMBER, description: "置信度 (0-1)" },
                  source: { type: Type.STRING, description: "可能的碑帖出处" },
                  reasoning: { type: Type.STRING, description: "AI 的识别逻辑推演过程" }
                },
                required: ["char", "confidence", "reasoning"]
              }
            }
          }
        }
      }
    });
    
    const rawText = response.text || "{}";
    const parsed = JSON.parse(rawText);
    
    // 关键步骤：提取联网搜索的原始依据链接
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    if (parsed.results && parsed.results.length > 0) {
      parsed.results[0].webReferences = chunks
        .filter(c => c.web)
        .map((c: any) => ({
          title: c.web.title,
          uri: c.web.uri
        }));
    }

    return parsed;
  } catch (error) {
    console.error("Advanced recognition failed:", error);
    throw error;
  }
};

/**
 * 联网深度查询字库
 */
export const searchCalligraphyWeb = async (query: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `检索中国书法中“${query}”字的所有典型写法。请查找并汇总：
1. 王羲之、怀素、张旭、毛泽东等各代草书大家对此字的写法差异。
2. 引用博物馆在线藏品的具体信息。
3. 给出该字从隶书到狂草的形态演变总结。`,
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
    return { text: "由于网络限制，无法访问外部数据库。", sources: [] };
  }
};
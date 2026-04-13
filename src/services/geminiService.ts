import { GoogleGenAI, Type } from "@google/genai";
import { Topic, InfographicSpec, ChecklistItem, GlossaryTerm } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function transformToMarkdown(text: string, model: string, prompt: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: model,
    contents: `${prompt}\n\nText:\n${text}`,
  });
  return response.text || "";
}

export async function extractTopics(text: string, language: string, model: string, prompt: string): Promise<Topic[]> {
  const response = await ai.models.generateContent({
    model: model,
    contents: `${prompt}\n\nArticle:\n${text}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            topic_id: { type: Type.STRING },
            title_en: { type: Type.STRING },
            title_zh: { type: Type.STRING },
            summary_en: { type: Type.STRING },
            summary_zh: { type: Type.STRING },
            why_it_matters: { type: Type.ARRAY, items: { type: Type.STRING } },
            source_anchors: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggested_infographic_type: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            confidence: { type: Type.STRING },
          },
          required: ["topic_id", "title_en", "title_zh", "summary_en", "summary_zh", "why_it_matters", "source_anchors", "suggested_infographic_type", "tags", "confidence"]
        }
      }
    }
  });
  
  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse topics", e);
    return [];
  }
}

export async function generateInfographicSpecs(topics: Topic[], text: string, model: string, prompt: string): Promise<InfographicSpec[]> {
  const topicsToProcess = topics.slice(0, 5);
  
  const response = await ai.models.generateContent({
    model: model,
    contents: `${prompt}\n\nTopics: ${JSON.stringify(topicsToProcess.map(t => ({ id: t.topic_id, title: t.title_en })))}\n`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            topic_id: { type: Type.STRING },
            narrative_goal: { type: Type.STRING },
            template: { type: Type.STRING },
            data_schema: { type: Type.OBJECT },
            copy_deck: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                subtitle: { type: Type.STRING },
                callouts: { type: Type.ARRAY, items: { type: Type.STRING } },
                footnotes: { type: Type.ARRAY, items: { type: Type.STRING } },
                key_takeaways: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            accessibility: {
              type: Type.OBJECT,
              properties: {
                alt_text: { type: Type.STRING },
                non_color_encoding_notes: { type: Type.STRING }
              }
            },
            evidence: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    }
  });
  
  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse infographic specs", e);
    return [];
  }
}

export async function generateChecklist(text: string, model: string, prompt: string): Promise<ChecklistItem[]> {
  const response = await ai.models.generateContent({
    model: model,
    contents: `${prompt}\n\nArticle:\n${text}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            description: { type: Type.STRING },
            status: { type: Type.STRING },
            anchors: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    }
  });
  
  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse checklist", e);
    return [];
  }
}

export async function generateAutoSummary(text: string, model: string, prompt: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: model,
    contents: `${prompt}\n\nText:\n${text}`,
  });
  return response.text || "";
}

export async function generateGlossary(text: string, model: string, prompt: string): Promise<GlossaryTerm[]> {
  const response = await ai.models.generateContent({
    model: model,
    contents: `${prompt}\n\nText:\n${text}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            term: { type: Type.STRING },
            definition: { type: Type.STRING }
          },
          required: ["term", "definition"]
        }
      }
    }
  });
  
  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse glossary", e);
    return [];
  }
}

export async function analyzeSentiment(text: string, model: string, prompt: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: model,
    contents: `${prompt}\n\nText:\n${text}`,
  });
  return response.text || "";
}

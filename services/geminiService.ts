
import { GoogleGenAI, Type } from "@google/genai";
import { AttendanceRecord } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async analyzeAttendance(records: AttendanceRecord[]) {
    const prompt = `
      Analyze the following attendance records and provide a professional, data-driven executive summary.
      Highlight trends, identify potential punctuality issues, and offer 3 actionable recommendations for management.
      
      Data:
      ${JSON.stringify(records.map(r => ({
        name: r.name,
        date: r.date,
        in: r.inTime,
        out: r.outTime,
        status: r.status,
        remarks: r.remarks
      })))}
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          thinkingConfig: { thinkingBudget: 0 },
          temperature: 0.7,
        },
      });

      return response.text || "Unable to generate analysis at this time.";
    } catch (error) {
      console.error("Gemini Analysis Error:", error);
      return "AI analysis is currently unavailable. Please check your configuration.";
    }
  }
}

export const geminiService = new GeminiService();

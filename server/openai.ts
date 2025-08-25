
import { GoogleGenerativeAI } from "@google/generative-ai";

// Using Google Gemini API
const genAI = new GoogleGenerativeAI("AIzaSyCNwy5x0_SJfpJbr0OJtoMxQ5GJGCdW4JM");

export interface SolutionStep {
  step: number;
  title: string;
  content: string;
  formula?: string;
}

export interface DoubtSolution {
  subject: string;
  steps: SolutionStep[];
  finalAnswer: string;
  alternativeMethods?: string[];
  relatedConcepts?: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export async function solveDoubt(question: string, subject: string): Promise<DoubtSolution> {
  const systemPrompt = `You are an expert IITian mentor specializing in JEE/NEET preparation. Your task is to solve ${subject} questions with crystal-clear, step-by-step explanations that help students understand concepts deeply.

For each solution, provide:
1. Clear step-by-step breakdown
2. Relevant formulas with explanations
3. Final answer highlighted
4. Alternative solution methods if applicable
5. Related concepts for deeper understanding

Keep explanations exam-oriented, structured, and easy to follow. Use mathematical notation where appropriate.

Respond with JSON in this exact format:
{
  "subject": "${subject}",
  "steps": [
    {
      "step": 1,
      "title": "Given Information/Understanding the Problem",
      "content": "Clear explanation of what is given and what we need to find",
      "formula": "Relevant formula if applicable"
    },
    {
      "step": 2,
      "title": "Apply Concept/Formula",
      "content": "Detailed explanation of the approach and calculations",
      "formula": "Formula used in this step"
    }
  ],
  "finalAnswer": "Clear final answer with units",
  "alternativeMethods": ["Alternative approach 1", "Alternative approach 2"],
  "relatedConcepts": ["Related concept 1", "Related concept 2"],
  "difficulty": "Easy/Medium/Hard"
}`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `${systemPrompt}\n\nSolve this ${subject} question step by step: ${question}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response (Gemini might return it with markdown formatting)
    let jsonText = text;
    if (text.includes('```json')) {
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        jsonText = jsonMatch[1];
      }
    } else if (text.includes('```')) {
      const jsonMatch = text.match(/```\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        jsonText = jsonMatch[1];
      }
    }
    
    // Clean up the JSON text to handle common issues
    jsonText = jsonText
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
      .replace(/\\/g, '\\\\') // Escape backslashes first
      .replace(/\\\\"/g, '\\"') // Fix quote escaping
      .replace(/\\\\n/g, '\\n') // Fix newline escaping
      .replace(/\\\\t/g, '\\t') // Fix tab escaping
      .replace(/\\\\r/g, '\\r') // Fix carriage return escaping
      .trim();
    
    let parsedResult;
    try {
      parsedResult = JSON.parse(jsonText);
    } catch (parseError) {
      console.error("JSON parsing failed, attempting to fix common issues:", parseError);
      
      // More aggressive cleaning for problematic responses
      let fixedJson = jsonText
        // Fix unescaped quotes in strings
        .replace(/(?<!\\)"/g, '\\"')
        .replace(/\\\\"/g, '\\"')
        // Fix unquoted keys
        .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')
        // Remove trailing commas
        .replace(/,(\s*[}\]])/g, '$1')
        // Fix malformed escape sequences
        .replace(/\\(?!["\\/bfnrt]|u[0-9a-fA-F]{4})/g, '\\\\');
      
      try {
        parsedResult = JSON.parse(fixedJson);
      } catch (secondError) {
        console.error("Second JSON parse attempt failed:", secondError);
        
        // Last resort: try to extract just the JSON object part
        try {
          const jsonMatch = fixedJson.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            parsedResult = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error("No valid JSON object found in response");
          }
        } catch (thirdError) {
          console.error("All JSON parsing attempts failed. Raw response:", jsonText.substring(0, 1000));
          throw new Error(`Failed to parse AI response as JSON. Please try again.`);
        }
      }
    }
    
    // Validate the response structure
    if (!parsedResult.steps || !Array.isArray(parsedResult.steps) || !parsedResult.finalAnswer) {
      throw new Error("Invalid response structure from Gemini");
    }

    return parsedResult as DoubtSolution;
  } catch (error) {
    console.error("Error solving doubt with Gemini:", error);
    throw new Error(`Failed to solve doubt: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function simplifyExplanation(originalSolution: string, subject: string): Promise<string> {
  const systemPrompt = `You are a patient tutor who excels at explaining complex ${subject} concepts in the simplest possible terms. Take the given solution and make it even easier to understand for a struggling student.

Use:
- Simple language and shorter sentences
- Real-world analogies where helpful
- Break down complex formulas into simpler parts
- Emphasize the "why" behind each step

Keep the mathematical accuracy but make it more accessible.`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `${systemPrompt}\n\nPlease simplify this solution for easier understanding: ${originalSolution}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text || "Unable to simplify explanation";
  } catch (error) {
    console.error("Error simplifying explanation:", error);
    throw new Error("Failed to simplify explanation");
  }
}

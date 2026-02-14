
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export async function askExpert(question: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: question,
      config: {
        systemInstruction: `Сен - нашақорлықтың алдын алу саласындағы білікті психолог және сарапшысың. 
        Сенің мақсатың - 9-10 сынып оқушыларына (14-16 жас) есірткінің зияны туралы түсіндіру, 
        оларға психологиялық қолдау көрсету және қауіпсіздік ережелерін үйрету. 
        Жауаптарың мейірімді, ғылыми негізделген, бірақ жасөспірімдерге түсінікті тілде болуы керек. 
        Қазақ тілінде жауап бер. Егер сұрақ зиянды әрекеттерге үгіттесе, бірден бас тартып, дұрыс бағыт сілте.`,
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Кешіріңіз, қазіргі уақытта жауап беру мүмкін емес. Кейінірек қайталап көріңіз.";
  }
}

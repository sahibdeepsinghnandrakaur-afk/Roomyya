
import { GoogleGenAI } from "@google/genai";
import { ChatMessage, Room } from "../types";

const ASSISTANT_SYSTEM_INSTRUCTION = `Eres el asistente oficial de "Roomy", una plataforma de alquiler de habitaciones. 
Tu objetivo es ayudar a los usuarios a publicar sus habitaciones de forma atractiva.
Puedes dar consejos sobre fotos, descripciones, precios y dudas de la app.
Mantén un tono profesional y amable en español.`;

export class HelpAssistant {
  private ai: any;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async sendMessage(message: string, history: ChatMessage[]) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          ...history.map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
          })),
          { role: 'user', parts: [{ text: message }] }
        ],
        config: {
          systemInstruction: ASSISTANT_SYSTEM_INSTRUCTION,
          temperature: 0.7,
        }
      });
      return response.text || "Lo siento, tuve un problema.";
    } catch (error) {
      return "Hubo un error al conectar con el asistente.";
    }
  }

  async sendHostMessage(message: string, history: ChatMessage[], room: Room) {
    const hostInstruction = `Actúa como ${room.ownerName}, el dueño de la habitación "${room.title}" ubicada en ${room.location}. 
    Detalles de la habitación: ${room.description}. Precio: ${room.price}. Servicios: ${room.amenities.join(', ')}.
    Tu objetivo es ser amable con el posible inquilino, responder sus dudas sobre el cuarto y tratar de cerrar el trato. 
    Sé natural, habla como una persona real y no como un robot. Responde siempre en español.`;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          ...history.map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
          })),
          { role: 'user', parts: [{ text: message }] }
        ],
        config: {
          systemInstruction: hostInstruction,
          temperature: 0.8,
        }
      });
      return response.text || "Hola, perdona, ¿puedes repetir?";
    } catch (error) {
      return "Lo siento, ahora mismo no puedo contestar. Inténtalo más tarde.";
    }
  }
}

export const assistant = new HelpAssistant();

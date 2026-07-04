export interface AiMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AiProvider {
  readonly name: string;
  isAvailable(): boolean;
  generateText(prompt: string, system?: string): Promise<string>;
  generateWithImage(prompt: string, imageBase64: string, mimeType: string, system?: string): Promise<string>;
}

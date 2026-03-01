import { GoogleGenAI, Modality } from "@google/genai";

type AudioStateListener = (isPlaying: boolean, currentText?: string, isLoading?: boolean) => void;

class AudioService {
  private isPlaying: boolean = false;
  private isLoading: boolean = false;
  private currentText: string | undefined = undefined;
  private listeners: Set<AudioStateListener> = new Set();
  
  // Cache para armazenar áudios já gerados (Frase -> AudioBuffer)
  private audioCache: Map<string, AudioBuffer> = new Map();
  
  private audioContext: AudioContext | null = null;
  private currentSource: AudioBufferSourceNode | null = null;

  private initAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 24000,
      });
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  public subscribe(listener: AudioStateListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.isPlaying, this.currentText, this.isLoading));
  }

  private decodeBase64(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  private async decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
  ): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }

  public getBestVoice(): any {
    return { name: "Gemini AI (Kore)" };
  }

  public async stop() {
    if (this.currentSource) {
      try {
        this.currentSource.stop();
        this.currentSource.disconnect();
      } catch (e) {
        // Ignorar erros se já estiver parado
      }
      this.currentSource = null;
    }
    this.isPlaying = false;
    this.isLoading = false;
    this.currentText = undefined;
    this.notifyListeners();
  }

  public async speak(text: string): Promise<void> {
    if (!text || text.trim().length === 0) return;

    // Toggle: Se já estiver tocando o mesmo texto, para.
    if (this.isPlaying && this.currentText === text) {
      await this.stop();
      return;
    }

    try {
      await this.stop();
      
      this.currentText = text;
      this.initAudioContext();

      let audioBuffer: AudioBuffer;

      // 1. Verifica Cache
      if (this.audioCache.has(text)) {
        // Cache Hit: Toca imediatamente
        this.isLoading = false;
        this.isPlaying = true;
        this.notifyListeners(); // Notifica playing direto
        audioBuffer = this.audioCache.get(text)!;
      } else {
        // Cache Miss: Carrega da API
        this.isLoading = true;
        this.notifyListeners(); // Notifica loading
        
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash-preview-tts",
          contents: [{ parts: [{ text }] }],
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: 'Kore' },
              },
            },
          },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

        if (!base64Audio) throw new Error("Não foi possível gerar o áudio.");

        const audioBytes = this.decodeBase64(base64Audio);
        audioBuffer = await this.decodeAudioData(
          audioBytes,
          this.audioContext!,
          24000,
          1
        );

        // Salva no cache
        this.audioCache.set(text, audioBuffer);
        
        this.isLoading = false;
        this.isPlaying = true;
        this.notifyListeners(); // Atualiza para playing
      }

      // Verificação de segurança pós-await
      if (!this.isPlaying || this.currentText !== text) return;

      return new Promise((resolve) => {
        const source = this.audioContext!.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(this.audioContext!.destination);
        
        source.onended = () => {
          if (this.currentSource === source) {
            this.isPlaying = false;
            this.currentText = undefined;
            this.currentSource = null;
            this.notifyListeners();
            resolve();
          }
        };

        this.currentSource = source;
        source.start();
      });

    } catch (error) {
      console.error("[AudioService] Erro:", error);
      this.isPlaying = false;
      this.isLoading = false;
      this.currentText = undefined;
      this.notifyListeners();
    }
  }

  public isAudioPlaying(textToCheck?: string): boolean {
    if (textToCheck) {
        return this.isPlaying && this.currentText === textToCheck;
    }
    return this.isPlaying;
  }
}

export const audioService = new AudioService();
// Utility functions for PCM Audio Conversion for Gemini Live API

// Convert Float32 audio samples from ScriptProcessor / AudioWorklet to 16-bit PCM Base64
export function float32ToPcm16Base64(float32Array: Float32Array): string {
  const pcm16 = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    // Clamp to -1.0 .. 1.0
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }

  // Convert to binary string
  const uint8 = new Uint8Array(pcm16.buffer);
  let binary = "";
  for (let i = 0; i < uint8.byteLength; i++) {
    binary += String.fromCharCode(uint8[i]);
  }
  return btoa(binary);
}

// Convert Base64 16-bit PCM to AudioBuffer at specified sampleRate (default 24000 for Gemini Live)
export function base64PcmToAudioBuffer(
  audioCtx: AudioContext,
  base64Data: string,
  sampleRate = 24000
): AudioBuffer {
  const binary = atob(base64Data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  const int16Array = new Int16Array(bytes.buffer);
  const audioBuffer = audioCtx.createBuffer(1, int16Array.length, sampleRate);
  const channelData = audioBuffer.getChannelData(0);

  for (let i = 0; i < int16Array.length; i++) {
    channelData[i] = int16Array[i] / 32768.0;
  }

  return audioBuffer;
}

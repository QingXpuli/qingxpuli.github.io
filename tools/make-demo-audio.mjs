import fs from "node:fs";

const sampleRate = 22050;
const seconds = 12;
const samples = sampleRate * seconds;
const buffer = Buffer.alloc(44 + samples * 2);
const write = (offset, value) => buffer.writeUInt32LE(value, offset);
buffer.write("RIFF", 0); write(4, 36 + samples * 2); buffer.write("WAVE", 8); buffer.write("fmt ", 12); write(16, 16); buffer.writeUInt16LE(1, 20); buffer.writeUInt16LE(1, 22); write(24, sampleRate); write(28, sampleRate * 2); buffer.writeUInt16LE(2, 32); buffer.writeUInt16LE(16, 34); buffer.write("data", 36); write(40, samples * 2);
const notes = [261.63, 329.63, 392, 523.25, 392, 329.63, 293.66, 349.23];
for (let i = 0; i < samples; i += 1) {
  const t = i / sampleRate;
  const note = notes[Math.floor(t / 1.5) % notes.length];
  const envelope = Math.min(1, t * 8) * Math.min(1, (seconds - t) * 8);
  const sample = Math.sin(2 * Math.PI * note * t) * 0.18 + Math.sin(2 * Math.PI * note * 2 * t) * 0.04;
  buffer.writeInt16LE(Math.max(-1, Math.min(1, sample * envelope)) * 32767, 44 + i * 2);
}
fs.writeFileSync("public/audio/demo.wav", buffer);

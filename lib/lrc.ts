export type LyricLine = { time: number; text: string };

export function parseLrc(source: string): LyricLine[] {
  const lines: LyricLine[] = [];
  for (const rawLine of source.split(/\r?\n/)) {
    const stamps = [...rawLine.matchAll(/\[(\d{1,3}):(\d{2})(?:[.:](\d{1,3}))?\]/g)];
    const text = rawLine.replace(/\[\d{1,3}:\d{2}(?:[.:]\d{1,3})?\]/g, "").trim();
    if (!text) continue;
    for (const stamp of stamps) {
      const fraction = stamp[3] ? Number(`0.${stamp[3].padEnd(3, "0")}`) : 0;
      lines.push({ time: Number(stamp[1]) * 60 + Number(stamp[2]) + fraction, text });
    }
  }
  return lines.sort((a, b) => a.time - b.time);
}

export function activeLyricIndex(lines: LyricLine[], currentTime: number): number {
  let index = -1;
  lines.forEach((line, lineIndex) => { if (line.time <= currentTime) index = lineIndex; });
  return index;
}

"use client";

const ROWS = [
  ".hhhhhhhh.",
  "hhhhhhhhhh",
  "hh......hh",
  "hHFFFFFFHh",
  "HFFEFFEFFH",
  "HFFFFFFFFH",
  "HFFMMMMFFH",
  ".HHHHHHHH.",
  "..HH..HH..",
  ".H......H.",
];

const COLORS: Record<string, string> = {
  ".": "transparent",
  h: "#FFD65C",
  H: "#B8860B",
  F: "#E8B98C",
  E: "#1A1220",
  M: "#7A4A32",
};

export default function PixelAvatar({ size = 96 }: { size?: number }) {
  const cell = size / 10;
  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(10, ${cell}px)`,
        gridTemplateRows: `repeat(10, ${cell}px)`,
        imageRendering: "pixelated",
      }}
    >
      {ROWS.flatMap((row, y) =>
        row.split("").map((ch, x) => (
          <div
            key={`${x}-${y}`}
            style={{
              width: cell,
              height: cell,
              backgroundColor: COLORS[ch],
            }}
          />
        ))
      )}
    </div>
  );
}

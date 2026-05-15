export function SapphireLogo({ size = 96 }: { size?: number }) {
  return (
    <div
      className="relative animate-pulse-glow animate-float"
      style={{ width: size, height: size }}
      aria-label="Sapphire Servers logo"
    >
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 animate-spin-slow"
        fill="none"
      >
        <defs>
          <linearGradient id="sapphire-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.85 0.18 240)" />
            <stop offset="50%" stopColor="oklch(0.6 0.22 255)" />
            <stop offset="100%" stopColor="oklch(0.4 0.2 265)" />
          </linearGradient>
          <linearGradient id="sapphire-edge" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.95 0.1 240)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="oklch(0.5 0.22 255)" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <polygon
          points="50,8 86,32 72,82 28,82 14,32"
          fill="url(#sapphire-grad)"
          stroke="url(#sapphire-edge)"
          strokeWidth="1.2"
        />
        <polyline
          points="14,32 50,46 86,32"
          fill="none"
          stroke="oklch(0.95 0.05 240 / 0.55)"
          strokeWidth="0.9"
        />
        <line x1="50" y1="46" x2="50" y2="82" stroke="oklch(0.95 0.05 240 / 0.4)" strokeWidth="0.9" />
        <line x1="50" y1="46" x2="28" y2="82" stroke="oklch(0.95 0.05 240 / 0.3)" strokeWidth="0.7" />
        <line x1="50" y1="46" x2="72" y2="82" stroke="oklch(0.95 0.05 240 / 0.3)" strokeWidth="0.7" />
        <polygon points="50,8 60,28 50,34 40,28" fill="oklch(1 0 0 / 0.35)" />
      </svg>
    </div>
  );
}

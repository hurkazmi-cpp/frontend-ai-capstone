export default function Logo() {
  return (
    <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGradient" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8B7FD1" />
          <stop offset="50%" stopColor="#B89BD9" />
          <stop offset="100%" stopColor="#F2B84B" />
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* soft ambient glow circle behind, echoing the background orbs */}
      <circle cx="24" cy="24" r="22" fill="url(#logoGradient)" opacity="0.12" />

      {/* connecting lines (study/neural network) */}
      <g stroke="url(#logoGradient)" strokeWidth="1.4" opacity="0.55">
        <line x1="24" y1="10" x2="14" y2="24" />
        <line x1="24" y1="10" x2="34" y2="24" />
        <line x1="14" y1="24" x2="24" y2="38" />
        <line x1="34" y1="24" x2="24" y2="38" />
        <line x1="14" y1="24" x2="34" y2="24" />
      </g>

      {/* nodes */}
      <g filter="url(#glow)">
        <circle cx="24" cy="10" r="4" fill="url(#logoGradient)" />
        <circle cx="14" cy="24" r="3.2" fill="url(#logoGradient)" />
        <circle cx="34" cy="24" r="3.2" fill="url(#logoGradient)" />
        <circle cx="24" cy="38" r="4.4" fill="url(#logoGradient)" />
      </g>
    </svg>
  );
}
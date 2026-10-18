export default function Logo({
  variant = 'light', // 'light' (for dark burgundy navbar) | 'dark' (for white/ivory background)
  showTagline = false,
  size = 'md', // 'sm' | 'md' | 'lg'
  className = ''
}) {
  // Color configuration based on background variant
  const isLight = variant === 'light';
  const mainColor = isLight ? '#FFFFFF' : 'var(--color-burgundy, #7A1B2C)';
  const leafColor = isLight ? 'var(--color-blush, #F2D7DE)' : 'var(--color-soft-rose, #DCA6B0)';
  const tagColor = isLight ? 'rgba(255, 255, 255, 0.75)' : 'var(--color-text-secondary, #555555)';

  // Sizing map
  const sizeMap = {
    sm: { iconSize: 26, fontSize: '1.25rem', tagSize: '0.55rem', gap: '0.4rem' },
    md: { iconSize: 34, fontSize: '1.65rem', tagSize: '0.62rem', gap: '0.55rem' },
    lg: { iconSize: 48, fontSize: '2.4rem', tagSize: '0.78rem', gap: '0.75rem' }
  };

  const { iconSize, fontSize, tagSize, gap } = sizeMap[size] || sizeMap.md;

  return (
    <div
      className={`vyra-logo ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap,
        textDecoration: 'none',
        userSelect: 'none'
      }}
      aria-label="VYRA — Value Finds a New Life"
    >
      {/* Distinctive VYRA "V" Emblem with Leaf Element */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0, display: 'block' }}
        aria-hidden="true"
      >
        {/* Left thick diagonal arm of the "V" */}
        <path
          d="M 14 16 L 36 16 L 50 84 L 34 84 Z"
          fill={mainColor}
        />
        {/* Right base connection */}
        <path
          d="M 42 84 L 50 84 L 59 55 L 50 55 Z"
          fill={mainColor}
        />
        {/* Organic leaf element blooming upward to the right */}
        <path
          d="M 52 54 C 54 33 73 17 89 13 C 87 34 75 60 59 66 C 55 62 53 57 52 54 Z"
          fill={leafColor}
        />
        {/* Subtle leaf center vein */}
        <path
          d="M 55 52 Q 67 36 84 17"
          stroke={isLight ? '#7A1B2C' : '#FFFFFF'}
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity={isLight ? 0.35 : 0.6}
        />
      </svg>

      {/* Typography: Wordmark + Optional Tagline */}
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 800,
            fontSize,
            letterSpacing: '0.08em',
            color: mainColor,
            textTransform: 'uppercase'
          }}
        >
          VYRA
        </span>
        {showTagline && (
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: tagSize,
              letterSpacing: '0.18em',
              color: tagColor,
              textTransform: 'uppercase',
              fontWeight: 600,
              marginTop: '0.2rem'
            }}
          >
            VALUE FINDS A NEW LIFE
          </span>
        )}
      </div>
    </div>
  );
}

// Table Mountain as a woodblock print — original SVG, coloured entirely from
// the site's CSS variables so it follows the Tweaks panel and dark mode.
import { Box } from '@chakra-ui/react'

const HeroArt = props => (
  <Box className="hero-art" aria-hidden="true" {...props}>
    <svg
      viewBox="0 0 800 540"
      preserveAspectRatio="xMaxYMid slice"
      width="100%"
      height="100%"
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient id="ha-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--sky)" />
          <stop offset="1" stopColor="var(--paper)" />
        </linearGradient>
        <linearGradient id="ha-rock" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--rock)" />
          <stop offset="1" stopColor="var(--sea)" />
        </linearGradient>
        <linearGradient id="ha-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--sea)" stopOpacity="0.75" />
          <stop offset="1" stopColor="var(--sea)" />
        </linearGradient>
        <pattern
          id="ha-waves"
          width="44"
          height="18"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M0 14 Q11 2 22 14 T44 14"
            fill="none"
            stroke="var(--paper)"
            strokeOpacity="0.55"
            strokeWidth="1.6"
          />
        </pattern>
        <filter id="ha-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="2"
            result="n"
          />
          <feColorMatrix
            in="n"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.18 0"
          />
          <feComposite in2="SourceGraphic" operator="in" />
          <feBlend in="SourceGraphic" mode="multiply" />
        </filter>
      </defs>

      <g filter="url(#ha-grain)">
        <rect width="800" height="540" fill="url(#ha-sky)" />

        {/* sun */}
        <circle cx="664" cy="104" r="48" fill="var(--accent)" opacity="0.9" />

        {/* banded clouds */}
        <g
          fill="var(--cloud)"
          stroke="var(--ink-soft)"
          strokeOpacity="0.35"
          strokeWidth="1.2"
        >
          <path d="M430 66 h170 a12 12 0 0 1 0 24 h-170 a12 12 0 0 1 0 -24z" />
          <path d="M560 138 h200 a12 12 0 0 1 0 24 h-200 a12 12 0 0 1 0 -24z" />
          <path d="M470 108 h110 a9 9 0 0 1 0 18 h-110 a9 9 0 0 1 0 -18z" />
        </g>

        {/* Lion's Head + Table Mountain + Devil's Peak */}
        <path
          d="M0 352 L40 318 L92 296 L128 248 Q140 228 152 232 L170 262 L196 300 L232 268 L262 222
             L292 214 L560 208 L600 216 L640 236 L688 196 L712 206 L760 282 L800 300 L800 380 L0 380 Z"
          fill="url(#ha-rock)"
        />
        {/* woodblock ridge hatching */}
        <g
          stroke="var(--paper)"
          strokeOpacity="0.28"
          strokeWidth="1.4"
          fill="none"
        >
          {Array.from({ length: 26 }, (_, i) => {
            const x = 300 + i * 11
            return (
              <path
                key={i}
                d={`M${x} 212 Q${x - 4} 260 ${x + 2} ${300 + (i % 4) * 14}`}
              />
            )
          })}
          <path d="M150 236 Q146 270 156 300" />
          <path d="M138 246 Q132 280 140 304" />
          <path d="M694 204 Q700 240 708 290" />
          <path d="M708 210 Q718 248 730 296" />
        </g>

        {/* the tablecloth */}
        <path
          d="M276 214 Q300 196 340 202 Q380 188 420 200 Q470 186 512 198 Q548 190 584 210
             L584 222 Q576 238 566 228 Q556 252 544 232 Q530 260 516 236 Q500 266 486 238
             Q470 256 456 234 Q440 262 424 236 Q406 252 392 232 Q376 256 360 232 Q344 250 330 230
             Q314 246 300 228 Q286 236 276 224 Z"
          fill="var(--cloud)"
        />

        {/* city line */}
        <g fill="var(--ink)" opacity="0.28">
          {Array.from({ length: 34 }, (_, i) => {
            const h = 4 + ((i * 7) % 9)
            return (
              <rect key={i} x={170 + i * 14} y={372 - h} width="9" height={h} />
            )
          })}
        </g>

        {/* sea */}
        <rect y="372" width="800" height="168" fill="url(#ha-sea)" />
        <rect y="380" width="800" height="160" fill="url(#ha-waves)" />
      </g>
    </svg>
  </Box>
)

export default HeroArt

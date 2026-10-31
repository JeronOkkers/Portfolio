import { Global } from '@emotion/react'

// Fonts + design tokens. Every colour on the site comes from these CSS
// variables, so the Tweaks panel (accent ink / paper tone) and dark mode
// only have to flip attributes on <html> / the Chakra dark class on <body>.
const Fonts = () => (
  <Global
    styles={`
      @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

      body {
        --paper: #f4eee3;
        --card: #fbf8f2;
        --ink: #1d2433;
        --ink-soft: #5b6170;
        --navy: #1f2b45;
        --on-navy: #f7f2e8;
        --line: rgba(29, 36, 51, 0.12);
        --accent: #d2452f;
        --sky: #efe3cf;
        --sea: #2f4a7a;
        --rock: #6d7a8a;
        --grain: 0.08;
        --cloud: #fbf8f2;
      }
      html[data-paper='mist'] body {
        --paper: #ecefeb;
        --card: #f7f9f7;
        --sky: #e2e8e3;
      }
      html[data-accent='indigo'] body { --accent: #2f4fa3; }
      html[data-accent='ochre'] body { --accent: #b97a12; }
      html[data-accent='moss'] body { --accent: #4f7a4a; }

      body.chakra-ui-dark {
        --paper: #121418;
        --card: #1a1d23;
        --ink: #ece7dc;
        --ink-soft: #a39f96;
        --navy: #ece4d3;
        --on-navy: #14161b;
        --line: rgba(255, 255, 255, 0.1);
        --accent: #ef6a4f;
        --sky: #1d2230;
        --sea: #1f3358;
        --rock: #3d4656;
        --grain: 0.12;
        --cloud: #c9ccd3;
      }
      html[data-accent='indigo'] body.chakra-ui-dark { --accent: #8aa3ea; }
      html[data-accent='ochre'] body.chakra-ui-dark { --accent: #e3a948; }
      html[data-accent='moss'] body.chakra-ui-dark { --accent: #8fbd86; }

      html[data-numbers='off'] .sec-num { display: none; }
      html[data-art='off'] .hero-art { display: none; }

      ::selection { background: var(--accent); color: var(--paper); }

      /* washi paper grain over everything, very subtle */
      body::before {
        content: '';
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 0;
        opacity: var(--grain);
        background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.4  0 0 0 0 0.35  0 0 0 0 0.3  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
      }
      main { position: relative; z-index: 1; }
    `}
  />
)

export default Fonts

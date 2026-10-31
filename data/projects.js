// Curated project list. Edit this file to add/update projects —
// the Works grid and each /works/[slug] page are generated from it.
//
// status: 'live' | 'in-development' | 'paused' | 'academic' | 'archived'
// accent: two colours used for the generated project tile

const projects = [
  {
    slug: 'os-label-printer',
    title: 'OS Label Printer',
    year: '2025–',
    status: 'live',
    featured: true,
    summary:
      'Full-stack web app that pulls product data from the Cin7 / DEAR inventory API and prints barcode labels straight to Zebra thermal printers.',
    description: [
      'Built to remove a manual step on a warehouse floor: instead of retyping product details, an operator looks up a product and prints a ready-to-scan label in one go.',
      'The app talks to the Cin7 Core (DEAR) REST API for product and stock data, renders CODE128 barcodes with JsBarcode, and sends the label to Zebra ZD230 thermal printers.',
      'It is the most production-ready thing I have built.'
    ],
    stack: ['JavaScript', 'Cin7 / DEAR API', 'JsBarcode', 'Zebra ZD230'],
    platform: 'Web (internal tool)',
    accent: ['#f6ad55', '#c05621']
  },
  {
    slug: 'statnav',
    title: 'StatNav',
    year: '2026–',
    status: 'in-development',
    featured: true,
    summary:
      'Workforce management SaaS for marketing-activation teams — shifts, attendance and breaks across clients and activations.',
    description: [
      'StatNav is a Deputy / Roubler-style platform aimed at companies that run marketing activations: they schedule promoters into shifts at client activations and need to know who actually showed up, when, and for how long.',
      'The domain model covers organisations, users, employees, clients, activations, shifts, attendance and breaks. Field staff use a mobile app; managers use a web dashboard.',
      'I am building it in strict, phase-gated steps — each phase gets a hardening review before the next one starts.'
    ],
    stack: ['Expo / React Native', 'Next.js', 'Supabase', 'PostgreSQL', 'TypeScript'],
    platform: 'iOS / Android / Web',
    accent: ['#63b3ed', '#2b6cb0']
  },
  {
    slug: 'cmcs',
    title: 'Contract Monthly Claim System',
    year: '2025',
    status: 'academic',
    featured: true,
    summary:
      'ASP.NET Core MVC app for submitting and approving lecturer claims, with four roles, encrypted documents and a multi-stage approval workflow.',
    description: [
      'My strongest academic project. Lecturers submit monthly claims with supporting documents; coordinators and managers review and approve them in stages; HR gets the finalised data.',
      'Four roles managed with ASP.NET Identity, Entity Framework Core on SQL Server, and AES encryption for uploaded documents at rest.'
    ],
    stack: ['C#', '.NET 8', 'ASP.NET Core MVC', 'EF Core', 'SQL Server', 'ASP.NET Identity'],
    platform: 'Web',
    accent: ['#b794f4', '#553c9a']
  },
  {
    slug: 'true-storie',
    title: 'true-storie',
    year: '2025',
    status: 'live',
    summary:
      'A blog built with Next.js and the Sanity headless CMS, deployed on Vercel.',
    description: [
      'A content site where posts are written in Sanity Studio and rendered by a Next.js front end, deployed on Vercel.'
    ],
    stack: ['Next.js', 'Sanity CMS', 'Vercel'],
    platform: 'Web',
    accent: ['#f687b3', '#97266d']
  },
  {
    slug: 'portfolio',
    title: 'This website',
    year: '2023–',
    status: 'live',
    summary:
      'The site you are on — an editorial, print-inspired design in Next.js with a live Tweaks panel and a health dashboard.',
    description: [
      'Started from a template in 2023 and rebuilt in 2026 to reflect where I actually am now.',
      'The Table Mountain on the home page is an original woodblock-print-style SVG, coloured from CSS variables so it follows the Tweaks panel (accent ink, paper tone) and dark mode. The Health page reads my own fitness data on the server and caches it, so visitors never have to sign in to anything.'
    ],
    stack: ['Next.js', 'React', 'Chakra UI', 'SVG', 'Chart.js', 'Vercel'],
    platform: 'Web',
    source: 'https://github.com/JeronOkkers/Portfolio',
    website: 'https://jeronokkers.vercel.app',
    accent: ['#4fd1c5', '#285e61']
  },
  {
    slug: 'pdf-timetable-parser',
    title: 'PDF Timetable Parser',
    year: '2024',
    status: 'archived',
    summary:
      'Python tool that reads a timetable PDF and turns it into structured data you can actually use.',
    description: [
      'Timetables often arrive as PDFs. This script extracts the tables and turns them into structured data, so the schedule can be filtered or imported into a calendar instead of read off a PDF.'
    ],
    stack: ['Python', 'PDF parsing'],
    platform: 'CLI',
    accent: ['#68d391', '#276749']
  },
  {
    slug: 'dailydare',
    title: 'DailyDare',
    year: '2020–2023',
    status: 'archived',
    summary:
      'My first real app — an animated, cross-platform to-do app built with React Native.',
    description: [
      'The project where I learned React Native: an animated to-do app for Android and iOS. It taught me state management, navigation and how much polish small animations add.'
    ],
    stack: ['React Native', 'Expo', 'JavaScript'],
    platform: 'Android / iOS',
    accent: ['#fc8181', '#9b2c2c']
  }
]

export const statusLabel = {
  live: 'Live',
  'in-development': 'In development',
  paused: 'Paused',
  academic: 'Academic',
  archived: 'Archived'
}

export const statusColor = {
  live: 'green',
  'in-development': 'blue',
  paused: 'yellow',
  academic: 'purple',
  archived: 'gray'
}

export default projects

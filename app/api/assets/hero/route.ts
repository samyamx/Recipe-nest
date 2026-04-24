const svg = `
<svg width="1600" height="900" viewBox="0 0 1600 900" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1600" height="900" fill="#24150E"/>
  <rect x="80" y="80" width="1440" height="740" rx="48" fill="url(#bg)"/>
  <circle cx="1290" cy="220" r="150" fill="#F5C98F" fill-opacity="0.28"/>
  <circle cx="360" cy="720" r="180" fill="#A54F2A" fill-opacity="0.22"/>
  <circle cx="780" cy="420" r="250" fill="#FFF2E2" fill-opacity="0.12"/>
  <rect x="180" y="150" width="430" height="240" rx="32" fill="#FFF4E6" fill-opacity="0.12"/>
  <rect x="990" y="470" width="280" height="180" rx="28" fill="#FFF4E6" fill-opacity="0.14"/>
  <g filter="url(#shadow)">
    <circle cx="1110" cy="470" r="170" fill="#F0A35A"/>
    <circle cx="1110" cy="470" r="132" fill="#FFF7ED"/>
    <circle cx="1110" cy="470" r="98" fill="#D36B3A"/>
    <circle cx="1110" cy="470" r="62" fill="#7A9B3D"/>
  </g>
  <defs>
    <linearGradient id="bg" x1="120" y1="120" x2="1450" y2="780" gradientUnits="userSpaceOnUse">
      <stop stop-color="#3F2417"/>
      <stop offset="1" stop-color="#8C4A2B"/>
    </linearGradient>
    <filter id="shadow" x="900" y="260" width="420" height="420" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset/>
      <feGaussianBlur stdDeviation="20"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.05 0 0 0 0 0.02 0 0 0 0 0.01 0 0 0 0.35 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_1"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_1" result="shape"/>
    </filter>
  </defs>
</svg>
`.trim()

export async function GET() {
  return new Response(svg, {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "image/svg+xml",
    },
  })
}

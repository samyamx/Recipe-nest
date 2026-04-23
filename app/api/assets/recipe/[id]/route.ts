import { readFile } from "fs/promises"
import path from "path"

const palette = [
  { accent: "#C86C3D", base: "#FFF4E6", plate: "#F3D6B4", garnish: "#7A9B3D" },
  { accent: "#C45A52", base: "#FFF1EC", plate: "#F1C7B9", garnish: "#658A43" },
  { accent: "#A56A2A", base: "#FFF6E4", plate: "#EFD39A", garnish: "#7F9D4E" },
  { accent: "#A34738", base: "#FFF0EA", plate: "#EAB8A3", garnish: "#698A45" },
  { accent: "#A85D2D", base: "#FFF3E8", plate: "#E9C39B", garnish: "#759245" },
]

const imageExtensions = ["jpg", "jpeg", "png", "webp", "gif"]
const contentTypes: Record<string, string> = {
  gif: "image/gif",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
}

function buildSvg(id: string) {
  const number = Number.parseInt(id.replace(/\D/g, ""), 10) || id.length
  const colors = palette[number % palette.length]

  return `
  <svg width="1200" height="900" viewBox="0 0 1200 900" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="900" fill="${colors.base}"/>
    <circle cx="170" cy="190" r="120" fill="${colors.accent}" fill-opacity="0.14"/>
    <circle cx="1040" cy="730" r="150" fill="${colors.garnish}" fill-opacity="0.14"/>
    <rect x="140" y="120" width="920" height="660" rx="44" fill="white"/>
    <ellipse cx="600" cy="450" rx="290" ry="210" fill="${colors.plate}"/>
    <ellipse cx="600" cy="450" rx="225" ry="160" fill="${colors.accent}"/>
    <circle cx="520" cy="420" r="28" fill="${colors.garnish}"/>
    <circle cx="670" cy="500" r="22" fill="${colors.garnish}"/>
    <circle cx="735" cy="390" r="18" fill="#FFF4E6"/>
    <circle cx="455" cy="510" r="18" fill="#FFF4E6"/>
  </svg>
  `.trim()
}

async function readLocalRecipeImage(id: string) {
  const candidateNames = [
    id,
    `recipe-${id}`,
  ]

  const candidateDirs = [
    path.join(process.cwd(), "public", "images"),
    path.join(process.cwd(), "public", "images", "recipes"),
  ]

  for (const dir of candidateDirs) {
    for (const name of candidateNames) {
      for (const ext of imageExtensions) {
        const filePath = path.join(dir, `${name}.${ext}`)

        try {
          const file = await readFile(filePath)
          return {
            buffer: file,
            contentType: contentTypes[ext],
          }
        } catch {
          // Try the next candidate path.
        }
      }
    }
  }

  return null
}

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const localImage = await readLocalRecipeImage(id)

  if (localImage) {
    return new Response(localImage.buffer, {
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": localImage.contentType,
      },
    })
  }

  return new Response(buildSvg(id), {
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "image/svg+xml",
    },
  })
}

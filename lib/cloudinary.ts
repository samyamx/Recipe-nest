import "server-only"

import crypto from "crypto"

type CloudinaryUploadResult = {
  secure_url: string
}

function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET
  const folder = process.env.CLOUDINARY_FOLDER || "recipe-nest"

  return {
    apiKey,
    apiSecret,
    cloudName,
    folder,
  }
}

export function isCloudinaryConfigured() {
  const { apiKey, apiSecret, cloudName } = getCloudinaryConfig()
  return Boolean(cloudName && apiKey && apiSecret)
}

export async function uploadRecipeImage(image: string) {
  if (!image.startsWith("data:image/")) {
    return image
  }

  if (!isCloudinaryConfigured()) {
    return image
  }

  const { apiKey, apiSecret, cloudName, folder } = getCloudinaryConfig()
  const timestamp = Math.floor(Date.now() / 1000)
  const signatureBase = `folder=${folder}&timestamp=${timestamp}${apiSecret}`
  const signature = crypto.createHash("sha1").update(signatureBase).digest("hex")
  const formData = new FormData()

  formData.append("file", image)
  formData.append("api_key", apiKey!)
  formData.append("folder", folder)
  formData.append("signature", signature)
  formData.append("timestamp", String(timestamp))

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    const details = await response.text()
    throw new Error(`Cloudinary upload failed: ${details}`)
  }

  const result = (await response.json()) as CloudinaryUploadResult
  return result.secure_url
}

'use server'

import { existsSync } from 'fs'
import { mkdir, writeFile } from 'fs/promises'
import path from 'path'

import { ASSETS } from '@/utils/constants'

export async function uploadImages(formData: unknown) {
  try {
    if (!(formData instanceof FormData)) return { error: 'بيانات غير صحيحة' }

    const formDataEntries = Object.fromEntries(formData)

    const imageFiles: File[] = []

    Object.keys(formDataEntries).forEach((key) => {
      const match = /^images\.(\d+)$/.exec(key)
      if (!match) return

      const index = parseInt(match[1]!, 10)
      imageFiles[index] = formDataEntries[key] as File
    })

    const imagesPath = `${ASSETS.path}/models/${crypto.randomUUID()}`

    if (!existsSync(imagesPath)) await mkdir(imagesPath, { recursive: true })

    const imagePaths = imageFiles.map(
      ({ name }, index) =>
        `${imagesPath}/${index}${path.extname(name).toLowerCase()}`,
    )

    await Promise.all(
      imageFiles.map(async (image, index) =>
        writeFile(imagePaths[index]!, Buffer.from(await image.arrayBuffer())),
      ),
    )

    return { imagePaths }
  } catch {
    return { error: 'تعذر رفع الصور' }
  }
}

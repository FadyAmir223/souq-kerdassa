'use server'

import { existsSync } from 'fs'
import { mkdir, readdir, unlink, writeFile } from 'fs/promises'
import path from 'path'

import { ASSETS } from '@/utils/constants'

export async function uploadImages(props: {
  action: 'add'
  formData: FormData
}): Promise<{ imagePaths?: string[]; error?: string }>

export async function uploadImages(props: {
  action: 'edit'
  formData: FormData
  projectPath: string
  deletedImages: string[]
}): Promise<{ imagePaths?: string[]; error?: string }>

export async function uploadImages({
  formData,
  projectPath,
  deletedImages,
  action,
}: {
  formData: FormData
  projectPath?: string
  deletedImages?: string[]
  action: 'add' | 'edit'
}) {
  try {
    // TODO: check if admin

    if (!(formData instanceof FormData)) return { error: 'بيانات غير صحيحة' }

    const formDataEntries = Object.fromEntries(formData)

    const imageFiles: File[] = []

    Object.keys(formDataEntries).forEach((key) => {
      const match = /^images\.(\d+)$/.exec(key)
      if (!match) return

      const index = parseInt(match[1]!, 10)
      imageFiles[index] = formDataEntries[key] as File
    })

    const imagesPath =
      action === 'edit'
        ? projectPath
        : `${ASSETS.path}/models/${crypto.randomUUID()}`

    if (!existsSync(imagesPath!)) await mkdir(imagesPath!, { recursive: true })

    const imagePaths = imageFiles.map(
      ({ name }) =>
        `${imagesPath}/${Math.floor(Math.random() * 10000)}${path.extname(name).toLowerCase()}`,
    )

    await Promise.all(
      imageFiles.map(async (image, index) =>
        writeFile(imagePaths[index]!, Buffer.from(await image.arrayBuffer())),
      ),
    )

    if (deletedImages)
      await Promise.all(
        deletedImages.map(async (imagePath) => {
          const imageName = imagePath.substring(0, imagePath.lastIndexOf('.'))
          const files = await readdir(projectPath!)

          await Promise.all(
            files
              .filter((file) => file.startsWith(path.basename(imageName)))
              .map((file) => {
                const x = path.join(projectPath!, file)
                return unlink(x)
              }),
          )
        }),
      )

    return { imagePaths }
  } catch {
    return { error: 'تعذر رفع الصور' }
  }
}

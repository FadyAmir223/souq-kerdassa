import { createReadStream, existsSync } from 'fs'
import fs from 'fs/promises'
import mime from 'mime'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import path from 'path'
import sharp from 'sharp'

import { SEARCH_PARAMS } from '@/utils/constants'

/**
 * saving absolute path
 * pros: ability to migrate (to .eg s3)
 * cons: storage
 */

export async function GET(request: NextRequest) {
  const assetPath = request.nextUrl.searchParams.get(SEARCH_PARAMS.path)
  const width = +(request.nextUrl.searchParams.get(SEARCH_PARAMS.width) ?? 0)
  const quality = +(request.nextUrl.searchParams.get(SEARCH_PARAMS.quality) ?? 75)

  if (!assetPath)
    return NextResponse.json({ error: 'Path is missing' }, { status: 400 })

  const originalPath = assetPath

  if (!existsSync(originalPath))
    return NextResponse.json({ error: 'Image not found' }, { status: 404 })

  const mimeType = mime.getType(originalPath)

  if (!mimeType)
    return NextResponse.json({ error: 'Mime not found' }, { status: 404 })

  const headers = new Headers(request.headers)
  headers.set('Content-Type', mimeType)

  const dirPath = path.dirname(assetPath)
  const imageName = path.parse(assetPath).name

  const cachedPath = `${dirPath}/${imageName}-w${width}-q${quality}.webp`

  if (existsSync(cachedPath))
    // @ts-expect-error works
    return new Response(createReadStream(cachedPath), { headers })

  try {
    const imageBuffer = await fs.readFile(originalPath)

    let image = sharp(imageBuffer).webp({ quality })
    if (width > 0) image = image.resize({ width })

    await image.toFile(cachedPath)

    return new Response(await image.toBuffer(), { headers })
  } catch {
    return NextResponse.json(
      { error: 'Failed to process the image' },
      { status: 500 },
    )
  }
}

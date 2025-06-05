import { NextRequest, NextResponse } from 'next/server'
import { getImageFromGridFS } from '@/lib/gridfs'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    const { fileId } = await params
    
    if (!fileId) {
      return new NextResponse('File ID is required', { status: 400 })
    }

    const result = await getImageFromGridFS(fileId)
    
    if (!result) {
      return new NextResponse('Image not found', { status: 404 })
    }

    const { stream, contentType, filename } = result

    // Create a readable stream response
    const readable = new ReadableStream({
      start(controller) {
        stream.on('data', (chunk: Buffer) => {
          controller.enqueue(new Uint8Array(chunk))
        })
        
        stream.on('end', () => {
          controller.close()
        })
        
        stream.on('error', (err) => {
          controller.error(err)
        })
      }
    })

    const headers: Record<string, string> = {
      'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
    }

    if (contentType) {
      headers['Content-Type'] = contentType
    }

    if (filename) {
      headers['Content-Disposition'] = `inline; filename="${filename}"`
    }

    return new NextResponse(readable, {
      status: 200,
      headers
    })
  } catch (error) {
    console.error('Error serving image:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

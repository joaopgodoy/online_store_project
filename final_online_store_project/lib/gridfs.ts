import mongoose from 'mongoose'
import { GridFSBucket, ObjectId } from 'mongodb'
import connectDB from './mongoose'

let bucket: GridFSBucket | null = null

export async function getGridFSBucket(): Promise<GridFSBucket> {
  if (!bucket) {
    await connectDB()
    
    if (!mongoose.connection.db) {
      throw new Error('Database connection not established')
    }
    
    bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: 'productImages'
    })
  }
  return bucket
}

export async function uploadImageToGridFS(
  buffer: Buffer, 
  filename: string, 
  contentType: string
): Promise<ObjectId> {
  const bucket = await getGridFSBucket()
  
  return new Promise((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(filename, {
      contentType
    })
    
    uploadStream.on('error', reject)
    uploadStream.on('finish', () => {
      resolve(uploadStream.id as ObjectId)
    })
    
    uploadStream.end(buffer)
  })
}

export async function getImageFromGridFS(fileId: string): Promise<{
  stream: NodeJS.ReadableStream
  contentType?: string
  filename?: string
} | null> {
  try {
    const bucket = await getGridFSBucket()
    const objectId = new ObjectId(fileId)
    
    // Check if file exists
    const files = await bucket.find({ _id: objectId }).toArray()
    if (files.length === 0) {
      return null
    }
    
    const file = files[0]
    const downloadStream = bucket.openDownloadStream(objectId)
    
    return {
      stream: downloadStream,
      contentType: file.contentType,
      filename: file.filename
    }
  } catch (error) {
    console.error('Error getting image from GridFS:', error)
    return null
  }
}

export async function deleteImageFromGridFS(fileId: string): Promise<boolean> {
  try {
    const bucket = await getGridFSBucket()
    const objectId = new ObjectId(fileId)
    
    await bucket.delete(objectId)
    return true
  } catch (error) {
    console.error('Error deleting image from GridFS:', error)
    return false
  }
}

export async function listImagesFromGridFS(): Promise<Array<{
  _id: ObjectId
  filename: string
  contentType?: string
  uploadDate: Date
  length: number
}>> {
  try {
    const bucket = await getGridFSBucket()
    const files = await bucket.find({}).toArray()
    
    return files.map(file => ({
      _id: file._id,
      filename: file.filename,
      contentType: file.contentType,
      uploadDate: file.uploadDate,
      length: file.length
    }))
  } catch (error) {
    console.error('Error listing images from GridFS:', error)
    return []
  }
}

import { UploadArgs, Uploader } from '@/domain/forum/app/storage/uploader'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'
import { EnvService } from '../env/env.service'
import { randomUUID } from 'node:crypto'

@Injectable()
export class R2Storage implements Uploader {
  private client: S3Client

  constructor(private env: EnvService) {
    const accountId = this.env.get('CLOUDFLARE_ACCOUNT_ID')

    this.client = new S3Client({
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      region: 'auto',
      credentials: {
        accessKeyId: this.env.get('R2_ACCESS_KEY'),
        secretAccessKey: this.env.get('R2_SECRET_ACCESS_KEY'),
      },
    })
  }

  async upload({
    fileName,
    fileType,
    file,
  }: UploadArgs): Promise<{ url: string }> {
    const uploadId = randomUUID()

    const uniqueFileName = `${uploadId}-${fileName}`

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.env.get('R2_BUCKET_NAME'),
        Key: uniqueFileName,
        ContentType: fileType,
        Body: file,
      }),
    )

    return { url: uniqueFileName }
  }
}

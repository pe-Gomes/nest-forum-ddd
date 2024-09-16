import { success, Either, failure } from '@/core/either'
import { InvalidAttachmentTypeError } from './errors'
import { Injectable } from '@nestjs/common'
import { AttachmentsRepository } from '../repositories/attachments-repository'
import { Attachment } from '../../enterprise/entities/attachment'
import { Uploader } from '../storage/uploader'

type UploadAttachmentRequest = {
  fileName: string
  fileType: string
  file: Buffer
}
type UploadAttachmentResponse = Either<
  InvalidAttachmentTypeError,
  { attachment: Attachment }
>

@Injectable()
export class UploadAttachmentUseCase {
  constructor(
    private attachmentRepository: AttachmentsRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    fileName,
    fileType,
    file,
  }: UploadAttachmentRequest): Promise<UploadAttachmentResponse> {
    const allowedTypesRegex = /^(image\/(jpeg|png|webp)|application\/pdf)$/

    if (!allowedTypesRegex.test(fileType)) {
      return failure(new InvalidAttachmentTypeError(fileType))
    }

    const { url } = await this.uploader.upload({ fileType, fileName, file })

    const attachment = Attachment.create({
      title: fileName,
      link: url,
    })

    await this.attachmentRepository.create(attachment)

    return success({ attachment })
  }
}

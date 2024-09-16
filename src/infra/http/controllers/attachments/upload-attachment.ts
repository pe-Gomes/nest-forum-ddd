import { InvalidAttachmentTypeError } from '@/domain/forum/app/use-cases/errors'
import { UploadAttachmentUseCase } from '@/domain/forum/app/use-cases/upload-attachment'
import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

const fileValidationPipe = new ParseFilePipe({
  validators: [
    new MaxFileSizeValidator({
      maxSize: 1024 * 1024 * 2, // 2mb
    }),
    new FileTypeValidator({
      fileType: '.(png|jpg|jpeg|webp|pdf)',
    }),
  ],
})

@Controller('/attachments')
export class UploadAttachmentController {
  constructor(private uploadAttachment: UploadAttachmentUseCase) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async handle(@UploadedFile(fileValidationPipe) file: Express.Multer.File) {
    const res = await this.uploadAttachment.execute({
      fileName: file.originalname,
      fileType: file.mimetype,
      file: file.buffer,
    })

    if (res.isFailure()) {
      const err = res.value

      switch (err.constructor) {
        case InvalidAttachmentTypeError:
          throw new BadRequestException(err.message)
        default:
          throw new BadRequestException(err.message)
      }
    }

    const { attachment } = res.value

    return { attachmentId: attachment.id.toString() }
  }
}

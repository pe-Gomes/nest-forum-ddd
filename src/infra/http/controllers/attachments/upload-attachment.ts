import {
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
  // constructor() {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async handle(@UploadedFile(fileValidationPipe) file: Express.Multer.File) {
    console.log(file)
  }
}

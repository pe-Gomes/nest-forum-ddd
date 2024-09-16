export type UploadArgs = {
  fileName: string
  fileType: string
  file: Buffer
}

export abstract class Uploader {
  abstract upload({
    fileName,
    fileType,
    file,
  }: UploadArgs): Promise<{ url: string }>
}

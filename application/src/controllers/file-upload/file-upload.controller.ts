import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { v2 } from 'cloudinary';
import { memoryStorage } from 'multer';
import { cloudinaryConfig } from 'src/config/cloudinary';

const storage = memoryStorage();
const configService = new ConfigService();

@Controller('/api/v1/upload')
export class FileUploadController {
  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './uploads',
      storage,
      limits: {
        fileSize: 10000000,
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    v2.config(cloudinaryConfig(configService));
    const b64 = Buffer.from(file.buffer).toString('base64');
    const dataURI = 'data:' + file.mimetype + ';base64,' + b64;
    const response = await v2.uploader.upload(dataURI, {
      resource_type: 'auto',
    });

    return {
      publicId: response?.public_id,
      url: response?.secure_url,
    };
  }

  @Post('/delete')
  async deleteImage(@Body('id') id: string) {
    v2.config(cloudinaryConfig(configService));
    await v2.uploader.destroy(id);
    return {
      message: 'Image deleted',
      imageId: id,
      error: false,
    };
  }
}

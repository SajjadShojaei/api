import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import path from 'path';
import { isFileExtentionSafe, saveImageToStorage } from '../helpers/image-storage';


@Injectable()
export class CronService {
    
    @Cron(CronExpression.EVERY_10_SECONDS)
      mamadTest()
      {let prof =  saveImageToStorage.storage
        prof = diskStorage({
          destination: './images/profiles',
        // filename: (req, file, cb) => {
        //   const fileExtention: string = path.extname(file.originalname);
        //   const fileName: string = uuidv4() + fileExtention;
        //   cb(null, fileName);
          
    //     }
      })
      // console.log(prof)
      }
}


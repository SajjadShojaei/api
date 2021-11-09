import { diskStorage } from "multer";
import {v4 as uuidv4} from "uuid";

const fs = require('fs');
const FileType = require('file-type');

import path = require('path');
import { filter } from "rxjs";

type validFileExtention = 'png' | 'jpg' | 'jpeg';
type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';

const validFileExtention: validFileExtention[] = ['png' , 'jpg' , 'jpeg'];
const validMimeType: validMimeType[] = ['image/png' , 'image/jpg' , 'image/jpeg'];

export const saveImageToStorage = {
    storage: diskStorage({
        destination: './images',
        filename: (req, file, cb) =>{
            const fileExtention: string = path.extname(file.originalname);
            const fileName: string = uuidv4() + fileExtention;
            cb(null, fileName)
        }
        
    }),
    fileFilter: (req , file, cb) =>{
        const allowedMimeTypes: validMimeType[] = validMimeType;
        allowedMimeTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
    }

}
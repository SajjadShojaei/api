import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

const fs = require('fs');
const FileType = require('file-type');

import path = require('path');
import { filter, from, Observable, of, switchMap } from 'rxjs';
import { fromFile } from 'file-type';

type validFileExtention = 'png' | 'jpg' | 'jpeg';
type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';

const validFileExtention: validFileExtention[] = ['png', 'jpg', 'jpeg'];
const validMimeType: validMimeType[] = ['image/png', 'image/jpg', 'image/jpeg'];

export const saveImageToStorage = {
  storage: diskStorage({
    destination: './images',
    filename: (req, file, cb) => {
      const fileExtention: string = path.extname(file.originalname);
      const fileName: string = uuidv4() + fileExtention;
      cb(null, fileName);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes: validMimeType[] = validMimeType;
    allowedMimeTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
  },
};

export const isFileExtentionSafe = (
  fullFilePath: string,
): Observable<boolean> => {
  return from(FileType.fromFile(fullFilePath)).pipe(
    switchMap(
      (fileExtentionAndMimeType: {
        ext: validFileExtention;
        mime: validMimeType;
      }) => {
        if (!fileExtentionAndMimeType) return of(false);

        const isFileTypeLegit = validFileExtention.includes(
          fileExtentionAndMimeType.ext,
        );

        const isMimeTypeLegit = validMimeType.includes(
          fileExtentionAndMimeType.mime,
        );

        const isFileLegit = isFileTypeLegit && isMimeTypeLegit;
        return of(isFileLegit);
      },
    ),
  );
};
export const removeFile = (fullFilePath: string):void => {
    try {
        fs.unlinkSynk(fullFilePath);
    } catch (error) {
        console.error(error);
    }

}




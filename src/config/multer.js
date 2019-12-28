import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

const mimetypeSupport = ['image/jpg', 'image/jpeg', 'image/png'];

export default {
    storage: multer.diskStorage({
        destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
        filename: (req, file, callback) => {
            crypto.randomBytes(16, (err, res) => {
                if (err) return callback(err);
                return callback(
                    null,
                    res.toString('hex') + extname(file.originalname)
                );
            });
        },
    }),
    fileFilter: (req, file, callback) => {
        if (mimetypeSupport.includes(file.mimetype)) {
            return callback(null, true);
        }
        return callback(
            {
                error: 'Only .png, .jpg and .jpeg format allowed!',
                status: 400,
            },
            false
        );
    },
};

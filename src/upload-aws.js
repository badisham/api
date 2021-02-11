import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const BUCKET_NAME = 'lalanote';
const IAM_USER_KEY = 'AKIA5VKI77CJJCM3XU76';
const IAM_USER_SECRET = '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';

export const uploadToS3 = async (file) => {
    const file_name = uuidv4() + '.jpg';
    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
        Bucket: BUCKET_NAME,
    });
    var params = {
        Bucket: BUCKET_NAME,
        Key: file_name,
        Body: file.data,
        ACL: 'public-read',
    };
    return new Promise(function (resolve, reject) {
        s3bucket.upload(params, function (err, data) {
            if (err) {
                throw err;
            } else {
                resolve(data.Location);
            }
        });
    });
};

// const AWS = require('aws-sdk');
import AWS from 'aws-sdk';

const BUCKET_NAME = 'lalanote';
const IAM_USER_KEY = 'AKIAIFPINJTXMA4SYMZQ';
const IAM_USER_SECRET = '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';

export const uploadToS3 = async (file, file_name) => {
    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
        Bucket: BUCKET_NAME,
    });
    return new Promise((resolve, reject) => {
        s3bucket.upload(params, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data.Location);
            }
        });
    });
};

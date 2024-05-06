import * as AWS from 'aws-sdk';

export async function fileUpload(file: Express.Multer.File){
    let aws_bucket = process.env.AWS_BUCKET_NAME;
    let s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    });

    const params = {
        Bucket: aws_bucket,
        Key: `${Date.now()}-${file.originalname}`,
        Body: file.buffer,
        ACL: 'public-read',
        ContentType: file.mimetype,
        ContentDisposition: 'inline',
        CreateBucketConfiguration: {
            LocationConstraint: process.env.AWS_BUCKET_LOCATION,
        },
    };

    try {
        let s3Response = await s3.upload(params).promise();
        return s3Response;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

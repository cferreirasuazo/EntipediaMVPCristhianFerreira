import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({ region: process.env.AWS_REGION });
const Bucket = process.env.S3_BUCKET as string;

export async function getPresignedPutUrl(key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket,
    Key: key,
    ContentType: contentType,
  });
  return getSignedUrl(s3, command, { expiresIn: 3600 });
}

export async function getPresignedGetUrl(key: string) {
  const command = new GetObjectCommand({ Bucket, Key: key });
  return getSignedUrl(s3, command, { expiresIn: 3600 });
}

export async function listFiles() {
  const command = new ListObjectsV2Command({ Bucket });
  const data = await s3.send(command);
  return await Promise.all(
    (data.Contents ?? []).map(async (obj) => ({
      key: obj.Key!,
      size: obj.Size!,
      lastModified: obj.LastModified!,
      downloadUrl: await getPresignedGetUrl(obj.Key!),
    }))
  );
}

export async function deleteFile(key: string) {
  const command = new DeleteObjectCommand({ Bucket, Key: key });
  await s3.send(command);
}

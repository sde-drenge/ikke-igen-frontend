import { environment } from "@/config/environment";
import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  endpoint: environment.S3_ENDPOINT,
  region: "us-east-1",
  credentials: {
    accessKeyId: environment.S3_ACCESS_KEY!,
    secretAccessKey: environment.S3_SECRET_KEY!,
  },
  forcePathStyle: true,
});

"use server";
import { revalidatePath } from "next/cache";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

const s3Client = new S3Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

async function uploadFileToS3(file: any, fileName: string) {
  const fileBuffer = await sharp(file).jpeg().toBuffer();

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${fileName}`,
    Body: fileBuffer,
    ContentType: "image/*",
  };

  const command = new PutObjectCommand(params);
  console.log("Uploading file to S3:", fileName);
  try {
    const response = await s3Client.send(command);
    console.log("File uploaded successfully:", response);
    return fileName;
  } catch (error: any) {
    // Log the full error object for debugging purposes
    console.error("Error uploading file to S3:", error);

    // Construct a more descriptive error message
    let errorMessage = `Error uploading file '${fileName}' to S3: ${error.message}`;

    // Optionally, you can include additional context or suggestions
    if (error.code === "AccessDeniedError") {
      errorMessage += ". Please check your AWS credentials and permissions.";
    } else if (error.code === "NoSuchBucket") {
      errorMessage += ". Please ensure that the specified bucket exists.";
    }

    throw new Error(errorMessage);
  }
}

async function uploadFile(prevState: any, formData: any, ClerkID: string) {
  try {
    const file = formData.get("file");

    if (file.size === 0) {
      return { status: "error", message: "Please select a file." };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${ClerkID}_${file.name}`; // Prepend ClerkID to file.name
    await uploadFileToS3(buffer, fileName);

    revalidatePath("/product");
    return {
      status: "success",
      message: "File has been uploaded.Please check your Email",
    };
  } catch (error) {
    return { status: "error", message: "Failed to upload file." };
  }
}

export const uploadFileWrapper = async (
  state: { status: string; message: string },
  payload: any
) => {
  const { formData, ClerkID } = payload;
  const result = await uploadFile(state, formData, ClerkID);
  return result;
};
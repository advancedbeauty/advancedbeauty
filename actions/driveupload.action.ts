'use server';

import { google } from 'googleapis';
import { v4 as uuidv4 } from 'uuid';
import { Readable } from 'stream';

interface UploadResult {
  success: boolean;
  url?: string;
  fileId?: string;
  error?: string;
}

interface DeleteResult {
  success: boolean;
  error?: string;
}

// Helper: Create an authenticated Google Drive client.
async function getDriveClient() {
  const credentialsString = process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS;
  if (!credentialsString) {
    throw new Error('Google Service Account credentials are not set');
  }

  let credentials: Record<string, any>;
  try {
    credentials = JSON.parse(credentialsString);
  } catch (parseError) {
    console.error('Error parsing credentials:', parseError);
    throw new Error('Invalid service account credentials format');
  }

  const requiredFields = ['client_email', 'private_key'];
  for (const field of requiredFields) {
    if (!credentials[field]) {
      throw new Error(`Missing required field in credentials: ${field}`);
    }
  }

  const jwtClient = new google.auth.JWT(
    credentials.client_email,
    undefined,
    credentials.private_key.replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/drive.file'],
  );
  await jwtClient.authorize();

  return google.drive({ version: 'v3', auth: jwtClient });
}


export async function uploadImageToDrive(file: File): Promise<UploadResult> {
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB max file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      success: false,
      error: 'File size exceeds the maximum limit of 10MB',
    };
  }

  try {
    const drive = await getDriveClient();

    const parentFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    if (!parentFolderId) {
      return {
        success: false,
        error: 'Google Drive folder ID is not configured',
      };
    }

    const uniqueFileName = `${uuidv4()}_${file.name}`;
    const fileMetadata = {
      name: uniqueFileName,
      parents: [parentFolderId],
    };

    // Create a readable stream from the file's array buffer.
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileStream = Readable.from(fileBuffer);

    const media = {
      mimeType: file.type,
      body: fileStream,
    };

    // Upload file to Google Drive.
    const uploadResponse = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, name',
    });

    const fileId = uploadResponse.data.id;
    if (!fileId) {
      return {
        success: false,
        error: 'Failed to upload the file to Google Drive',
      };
    }

    // Set the file permissions to public read.
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    // Construct shareable URL.
    const shareableLink = `https://drive.google.com/uc?id=${fileId}`;

    return {
      success: true,
      url: shareableLink,
      fileId,
    };
  } catch (error) {
    console.error('Error during image upload:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Unexpected error occurred',
    };
  }
}


export async function deleteImageFromDrive(
  fileId: string,
): Promise<DeleteResult> {
  try {
    const drive = await getDriveClient();
    await drive.files.delete({
      fileId,
    });
    return { success: true };
  } catch (error) {
    console.error('Error during image deletion:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Unexpected error occurred',
    };
  }
}

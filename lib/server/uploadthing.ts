import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { auth } from '@clerk/nextjs/server';

const f = createUploadthing();

export const uploadRouter = {
  pdfUploader: f({
    pdf: { maxFileSize: '4MB', maxFileCount: 1 },
  })
    .middleware(async ({ req }) => {
      // Check auth using Clerk
      const { userId } = await auth();
      if (!userId) throw new Error('Unauthorized');

      // Return metadata that will be available in onUploadComplete
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata.userId);
      console.log('File URL:', file.url);

      // Return data that will be sent to the client
      return {
        url: file.url,
        name: file.name,
        size: file.size,
        key: file.key,
      };
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;

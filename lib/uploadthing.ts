import { generateReactHelpers } from '@uploadthing/react';
import type { UploadRouter } from '@/lib/server/uploadthing';

export const { useUploadThing, uploadFiles } = generateReactHelpers<UploadRouter>();

'use client';

import { Button } from '@/components/ui/button';
import { Dropzone } from '@/components/ui/dropzone';
import { Linkedin, X, FileText, Sparkles, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useUserActions } from '@/hooks/useUserActions';
import { useEffect, useState } from 'react';
import { CustomSpinner } from '@/components/CustomSpinner';
import LoadingFallback from '@/components/LoadingFallback';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';

type FileState =
  | { status: 'empty' }
  | { status: 'saved'; file: { name: string; url: string; size: number } };

export default function UploadPageClient() {
  const router = useRouter();

  const { resumeQuery, uploadResumeMutation } = useUserActions();
  const [fileState, setFileState] = useState<FileState>({ status: 'empty' });

  const resume = resumeQuery.data?.resume;

  // Update fileState whenever resume changes
  useEffect(() => {
    if (resume?.file?.url && resume.file.name && resume.file.size) {
      setFileState({
        status: 'saved',
        file: {
          name: resume.file.name,
          url: resume.file.url,
          size: resume.file.size,
        },
      });
    }
  }, [resume]);

  const handleUploadFile = async (file: File) => {
    uploadResumeMutation.mutate(file);
  };

  const handleReset = () => {
    setFileState({ status: 'empty' });
  };

  if (resumeQuery.isLoading) {
    return <LoadingFallback message="Loading..." />;
  }

  const isUpdating = resumeQuery.isPending || uploadResumeMutation.isPending;

  return (
    <div className="flex flex-col items-center flex-1 px-4 py-12 gap-8">
      <div className="w-full max-w-md text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-terracotta/10 text-terracotta text-sm mb-4">
          <Sparkles className="h-4 w-4" />
          <span>AI-Powered</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink mb-3">
          Upload your resume
        </h1>
        <p className="text-ink-light leading-relaxed">
          Upload a PDF of your LinkedIn or resume and we&apos;ll generate your
          personal website instantly.
        </p>
      </div>

      <div className="w-full max-w-md">
        <div className="relative">
          {fileState.status !== 'empty' && (
            <button
              onClick={handleReset}
              className="absolute top-3 right-3 p-1.5 hover:bg-stone/50 rounded-full z-10 transition-colors duration-200"
              disabled={isUpdating}
            >
              <X className="h-4 w-4 text-ink-light" />
            </button>
          )}

          <Dropzone
            accept={{ 'application/pdf': ['.pdf'] }}
            maxFiles={1}
            icon={
              fileState.status !== 'empty' ? (
                <div className="w-12 h-12 bg-terracotta/10 rounded-xl flex items-center justify-center">
                  <FileText className="h-6 w-6 text-black" />
                </div>
              ) : (
                <div className="w-12 h-12 bg-stone/50 rounded-xl flex items-center justify-center">
                  <Linkedin className="h-6 w-6 text-black" />
                </div>
              )
            }
            title={
              <span className="text-lg font-semibold text-ink text-center">
                {fileState.status !== 'empty'
                  ? fileState.file.name
                  : 'Drop your PDF here'}
              </span>
            }
            description={
              <span className="text-sm text-center text-ink-light">
                {fileState.status !== 'empty'
                  ? `${(fileState.file.size / 1024 / 1024).toFixed(2)} MB`
                  : 'Or click to browse files'}
              </span>
            }
            isUploading={uploadResumeMutation.isPending}
            onDrop={(acceptedFiles) => {
              if (acceptedFiles[0]) handleUploadFile(acceptedFiles[0]);
            }}
            onDropRejected={() => toast.error('Only PDF files are supported')}
          />
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="default"
              className="mt-4 text-sm flex items-center gap-2 mx-auto"
            >
              <Info className="h-4 w-4" />
              How to download LinkedIn PDF
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-[652px] p-0 gap-0 overflow-hidden">
            <DialogTitle className="font-display text-lg text-ink px-6 py-4 border-b border-stone">
              Go to your profile → Click &quot;Resources&quot; → Then &quot;Save to PDF&quot;
            </DialogTitle>
            <img
              src="/linkedin-save-to-pdf.png"
              className="h-auto w-full"
              alt="LinkedIn Save to PDF instructions"
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="w-full max-w-md">
        <div className="relative group">
          {/* Subtle glow on hover */}
          <div className="absolute -inset-1 bg-terracotta/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md" />
          
          <div className="flex justify-center items-center">
            <Button
              size="lg"
              className="relative bg-gray-800 hover:bg-gray-900 text-white font-medium transition-all duration-200 hover:shadow-lg hover:shadow-terracotta/25 disabled:opacity-50"
              disabled={fileState.status === 'empty' || isUpdating || !resume?.file}
              onClick={() => {
                if (resume?.file) {
                  router.push('/pdf');
                }
              }}
            >
              {isUpdating ? (
                <>
                  <CustomSpinner className="h-4 w-4 mr-2" white />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                  Generate Website
                </>
              )}
            </Button>
          </div>
          {(fileState.status === 'empty' || !resume?.file) && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="absolute inset-0 cursor-not-allowed" />
                </TooltipTrigger>
                <TooltipContent className="bg-ink text-white">
                  <p>Upload a PDF to continue</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    </div>
  );
}

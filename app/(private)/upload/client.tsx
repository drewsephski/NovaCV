'use client';

import { Button } from '@/components/ui/button';
import { Dropzone } from '@/components/ui/dropzone';
import { Linkedin, X, FileText, ArrowRight, Info } from 'lucide-react';
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
import { motion } from 'framer-motion';

type FileState =
  | { status: 'empty' }
  | { status: 'saved'; file: { name: string; url: string; size: number } };

export default function UploadPageClient() {
  const router = useRouter();

  const { resumeQuery, uploadResumeMutation } = useUserActions();
  const [fileState, setFileState] = useState<FileState>({ status: 'empty' });

  const resume = resumeQuery.data?.resume;

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
    <div className="min-h-screen bg-[#faf9f7] text-[#1a1a1a]">
      <div className="max-w-xl mx-auto px-8 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-[#666] mb-4 block">
            Step 1 of 2
          </span>
          <h1 className="text-3xl sm:text-4xl font-light tracking-tight mb-4">
            Upload your <span className="font-normal italic">resume</span>
          </h1>
          <p className="text-[#666] leading-relaxed max-w-md mx-auto">
            Upload a PDF of your LinkedIn profile or resume. We&apos;ll transform it into a professional website.
          </p>
        </motion.div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <div className="relative">
            {fileState.status !== 'empty' && (
              <button
                onClick={handleReset}
                className="absolute top-4 right-4 p-2 hover:bg-[#f0f0f0] z-10 transition-colors"
                disabled={isUpdating}
              >
                <X className="h-4 w-4 text-[#666]" strokeWidth={1.5} />
              </button>
            )}

            <Dropzone
              accept={{ 'application/pdf': ['.pdf'] }}
              maxFiles={1}
              icon={
                fileState.status !== 'empty' ? (
                  <div className="w-12 h-12 bg-[#f0f0f0] flex items-center justify-center">
                    <FileText className="h-6 w-6 text-[#1a1a1a]" strokeWidth={1.5} />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-[#f0f0f0] flex items-center justify-center">
                    <Linkedin className="h-6 w-6 text-[#1a1a1a]" strokeWidth={1.5} />
                  </div>
                )
              }
              title={
                <span className="text-lg font-normal text-[#1a1a1a] text-center">
                  {fileState.status !== 'empty'
                    ? fileState.file.name
                    : 'Drop your PDF here'}
                </span>
              }
              description={
                <span className="text-sm text-center text-[#888]">
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
        </motion.div>

        {/* Instructions Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-center mb-12"
        >
          <Dialog>
            <DialogTrigger asChild>
              <button className="text-xs text-[#888] hover:text-[#1a1a1a] flex items-center gap-2 mx-auto transition-colors">
                <Info className="h-3.5 w-3.5" strokeWidth={1.5} />
                How to download LinkedIn PDF
              </button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-[652px] p-0 gap-0 overflow-hidden bg-white border border-[#e5e5e5]">
              <DialogTitle className="text-sm font-normal text-[#1a1a1a] px-6 py-4 border-b border-[#e5e5e5]">
                Go to your profile → Click &quot;Resources&quot; → Then &quot;Save to PDF&quot;
              </DialogTitle>
              <img
                src="/linkedin-save-to-pdf.png"
                className="h-auto w-full"
                alt="LinkedIn Save to PDF instructions"
              />
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center"
        >
          <div className="relative group">
            <button
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#1a1a1a] text-white text-sm tracking-wide hover:bg-[#333] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={fileState.status === 'empty' || isUpdating || !resume?.file}
              onClick={() => {
                if (resume?.file) {
                  router.push('/pdf');
                }
              }}
            >
              {isUpdating ? (
                <>
                  <CustomSpinner className="h-4 w-4" white />
                  Processing...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                </>
              )}
            </button>
            {(fileState.status === 'empty' || !resume?.file) && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="absolute inset-0 cursor-not-allowed" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-[#1a1a1a] text-white text-xs">
                    <p>Upload a PDF to continue</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import { Dropzone } from '@/components/ui/dropzone';
import { Linkedin, X, FileText, ArrowRight, Info, UploadCloud, CheckCircle2, Loader2 } from 'lucide-react';
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
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollReveal, DotGrid, CornerAccent, FloatingElement } from '@/components/motion';
import { EnhancedButton } from '@/components/ui/EnhancedButton';

type FileState =
  | { status: 'empty' }
  | { status: 'saved'; file: { name: string; url: string; size: number } };

export default function UploadPageClient() {
  const router = useRouter();

  const { resumeQuery, uploadResumeMutation } = useUserActions();
  const [fileState, setFileState] = useState<FileState>({ status: 'empty' });
  const [isDragging, setIsDragging] = useState(false);

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
    <div className="min-h-screen bg-[#faf9f7] text-[#1a1a1a] overflow-x-hidden">
      {/* Decorative elements */}
      <div className="absolute top-40 right-8 md:right-16 opacity-30 hidden md:block">
        <DotGrid rows={5} cols={5} gap={24} dotSize={2} />
      </div>

      <div className="max-w-xl mx-auto px-8 py-20 relative">
        <CornerAccent position="top-left" size={40} className="-top-2 -left-2" />

        {/* Header */}
        <ScrollReveal className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Step indicator */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#1a1a1a] text-white text-xs flex items-center justify-center font-mono">1</div>
                <div className="w-12 h-px bg-[#1a1a1a]" />
                <div className="w-6 h-6 border border-[#ccc] text-[#999] text-xs flex items-center justify-center font-mono">2</div>
              </div>
            </div>
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
        </ScrollReveal>

        {/* Upload Area */}
        <ScrollReveal delay={0.1}>
          <motion.div
            className="mb-8"
            onHoverStart={() => setIsDragging(true)}
            onHoverEnd={() => setIsDragging(false)}
          >
            <div className="relative">
              <AnimatePresence>
                {fileState.status !== 'empty' && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={handleReset}
                    className="absolute top-4 right-4 p-2 bg-white border border-[#e5e5e5] hover:border-[#1a1a1a] hover:bg-[#faf9f7] z-10 transition-all duration-300"
                    disabled={isUpdating}
                  >
                    <X className="h-4 w-4 text-[#666]" strokeWidth={1.5} />
                  </motion.button>
                )}
              </AnimatePresence>

              <motion.div
                animate={{
                  boxShadow: isDragging
                    ? '0 20px 60px -20px rgba(26, 26, 26, 0.15)'
                    : '0 4px 20px -10px rgba(0, 0, 0, 0.1)',
                }}
                transition={{ duration: 0.3 }}
              >
                <Dropzone
                  accept={{ 'application/pdf': ['.pdf'] }}
                  maxFiles={1}
                  icon={
                    fileState.status !== 'empty' ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-16 h-16 bg-[#f0f0f0] flex items-center justify-center"
                      >
                        <FileText className="h-8 w-8 text-[#1a1a1a]" strokeWidth={1.5} />
                      </motion.div>
                    ) : (
                      <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-16 h-16 bg-[#f0f0f0] flex items-center justify-center"
                      >
                        <UploadCloud className="h-8 w-8 text-[#1a1a1a]" strokeWidth={1.5} />
                      </motion.div>
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
              </motion.div>
            </div>
          </motion.div>
        </ScrollReveal>

        {/* Success indicator */}
        <AnimatePresence>
          {fileState.status === 'saved' && !isUpdating && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-center gap-2 mb-8 text-sm text-[#1a1a1a]"
            >
              <CheckCircle2 className="h-4 w-4" strokeWidth={1.5} />
              <span>File ready for processing</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instructions Button */}
        <ScrollReveal delay={0.2}>
          <div className="text-center mb-12">
            <Dialog>
              <DialogTrigger asChild>
                <motion.button
                  className="text-xs text-[#888] hover:text-[#1a1a1a] flex items-center gap-2 mx-auto transition-colors"
                >
                  <Info className="h-3.5 w-3.5" strokeWidth={1.5} />
                  How to download LinkedIn PDF
                </motion.button>
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
          </div>
        </ScrollReveal>

        {/* Action Button */}
        <ScrollReveal delay={0.3}>
          <div className="flex justify-center">
            <div className="relative group">
              <motion.button
                className="group inline-flex items-center gap-3 px-8 py-4 bg-[#1a1a1a] text-white text-sm tracking-wide hover:bg-[#333] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={fileState.status === 'empty' || isUpdating || !resume?.file}
                onClick={() => {
                  if (resume?.file) {
                    router.push('/pdf');
                  }
                }}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
                    Processing...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
                  </>
                )}
              </motion.button>
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
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}

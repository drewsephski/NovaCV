'use client';
import LoadingFallback from '@/components/LoadingFallback';
import { PopupSiteLive } from '@/components/PopupSiteLive';
import PreviewActionbar from '@/components/PreviewActionbar';
import { FullResume } from '@/components/resume/FullResume';
import { EditResume } from '@/components/resume/editing/EditResume';
import { useUserActions } from '@/hooks/useUserActions';
import { ResumeData } from '@/lib/server/redisActions';
import { getNovaCVUrl } from '@/lib/utils';
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Eye, Edit, Save, X, ArrowRight } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { toast } from 'sonner';
import { RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PreviewClient({ messageTip }: { messageTip?: string }) {
  const { user } = useUser();
  const {
    resumeQuery,
    toggleStatusMutation,
    usernameQuery,
    saveResumeDataMutation,
    regenerateResumeMutation,
  } = useUserActions();
  const [showModalSiteLive, setModalSiteLive] = useState(false);
  const [localResumeData, setLocalResumeData] = useState<ResumeData>();
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showDiscardConfirmation, setShowDiscardConfirmation] = useState(false);

  useEffect(() => {
    if (resumeQuery.data?.resume?.resumeData) {
      setLocalResumeData(resumeQuery.data?.resume?.resumeData);
    }
  }, [resumeQuery.data?.resume?.resumeData]);

  const isDefaultResumeData = () => {
    if (!localResumeData) return true;
    const { header, summary, workExperience, education } = localResumeData;
    const hasDefaultName = header?.name === 'user' || !header?.name;
    const hasDefaultAbout =
      header?.shortAbout?.includes('This is a short description') ||
      header?.shortAbout?.includes('Add your skills');
    const hasDefaultSummary = summary?.includes('You should add a summary');
    const hasNoExperience = !workExperience || workExperience.length === 0;
    const hasNoEducation = !education || education.length === 0;

    return hasDefaultName && (hasDefaultAbout || hasDefaultSummary || hasNoExperience);
  };

  const handleSaveChanges = async () => {
    if (!localResumeData) {
      toast.error('No resume data to save');
      return;
    }

    try {
      await saveResumeDataMutation.mutateAsync(localResumeData);
      toast.success('Changes saved successfully');
      setHasUnsavedChanges(false);
      setIsEditMode(false);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Failed to save changes: ${error.message}`);
      } else {
        toast.error('Failed to save changes');
      }
    }
  };

  const handleDiscardChanges = () => {
    setShowDiscardConfirmation(true);
  };

  const confirmDiscardChanges = () => {
    if (resumeQuery.data?.resume?.resumeData) {
      setLocalResumeData(resumeQuery.data?.resume?.resumeData);
    }
    setHasUnsavedChanges(false);
    setIsEditMode(false);
    setShowDiscardConfirmation(false);
    toast.info('Changes discarded');
  };

  const handleResumeChange = (newResume: ResumeData) => {
    setLocalResumeData(newResume);
    setHasUnsavedChanges(true);
  };

  if (
    resumeQuery.isLoading ||
    usernameQuery.isLoading ||
    !usernameQuery.data ||
    !localResumeData
  ) {
    return <LoadingFallback message="Loading..." />;
  }

  const CustomLiveToast = () => (
    <div className="w-fit min-w-[360px] h-[44px] items-center justify-between bg-[#1a1a1a] border border-[#1a1a1a] flex flex-row gap-2 px-4">
      <p className="text-sm text-left text-white mr-2">
        <span className="hidden md:block">Your website has been updated</span>
        <span className="md:hidden">Website updated</span>
      </p>
      <a
        href={getNovaCVUrl(usernameQuery.data.username)}
        target="_blank"
        className="flex justify-center items-center gap-1 px-3 py-1 bg-white h-[26px] text-xs font-medium text-[#1a1a1a] hover:bg-[#f0f0f0] transition-colors"
      >
        View
        <ArrowRight className="h-3 w-3" strokeWidth={1.5} />
      </a>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#faf9f7] text-[#1a1a1a]">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-[#666] mb-2 block">
            Step 2 of 2
          </span>
          <h1 className="text-2xl font-light tracking-tight">
            Preview & <span className="font-normal italic">publish</span>
          </h1>
        </motion.div>

        {messageTip && (
          <div className="mb-6 bg-white border border-[#e5e5e5] p-4">
            <p className="text-sm text-[#666]">{messageTip}</p>
          </div>
        )}

        {/* Action Bar */}
        <div className="mb-8">
          <PreviewActionbar
            initialUsername={usernameQuery.data.username}
            status={resumeQuery.data?.resume?.status}
            onStatusChange={async (newStatus) => {
              await toggleStatusMutation.mutateAsync(newStatus);
              const isFirstTime = !localStorage.getItem('publishedSite');

              if (isFirstTime && newStatus === 'live') {
                setModalSiteLive(true);
                localStorage.setItem('publishedSite', new Date().toDateString());
              } else {
                if (newStatus === 'draft') {
                  toast.warning('Your website has been unpublished');
                } else {
                  toast.custom((t) => <CustomLiveToast />);
                }
              }
            }}
            isChangingStatus={toggleStatusMutation.isPending}
          />
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-[#e5e5e5]">
          <ToggleGroup
            type="single"
            value={isEditMode ? 'edit' : 'preview'}
            onValueChange={(value) => setIsEditMode(value === 'edit')}
            aria-label="View mode"
            className="bg-white border border-[#e5e5e5]"
          >
            <ToggleGroupItem value="preview" aria-label="Preview mode" className="data-[state=on]:bg-[#1a1a1a] data-[state=on]:text-white">
              <Eye className="h-4 w-4 mr-1" strokeWidth={1.5} />
              <span>Preview</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="edit" aria-label="Edit mode" className="data-[state=on]:bg-[#1a1a1a] data-[state=on]:text-white">
              <Edit className="h-4 w-4 mr-1" strokeWidth={1.5} />
              <span>Edit</span>
            </ToggleGroupItem>
          </ToggleGroup>

          <div className="flex gap-3">
            {isDefaultResumeData() && (
              <button
                onClick={() => regenerateResumeMutation.mutate()}
                disabled={regenerateResumeMutation.isPending}
                className="inline-flex items-center gap-2 px-4 py-2 border border-[#1a1a1a] text-[#1a1a1a] text-xs hover:bg-[#1a1a1a] hover:text-white transition-colors disabled:opacity-50"
              >
                {regenerateResumeMutation.isPending ? (
                  <span className="animate-spin">
                    <RefreshCw className="h-4 w-4" strokeWidth={1.5} />
                  </span>
                ) : (
                  <RefreshCw className="h-4 w-4" strokeWidth={1.5} />
                )}
                <span>
                  {regenerateResumeMutation.isPending ? 'Regenerating...' : 'Refresh'}
                </span>
              </button>
            )}

            {isEditMode && (
              <>
                <button
                  onClick={handleDiscardChanges}
                  disabled={!hasUnsavedChanges || saveResumeDataMutation.isPending}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-[#ccc] text-[#666] text-xs hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors disabled:opacity-50"
                >
                  <X className="h-4 w-4" strokeWidth={1.5} />
                  <span>Discard</span>
                </button>
                <button
                  onClick={handleSaveChanges}
                  disabled={!hasUnsavedChanges || saveResumeDataMutation.isPending}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white text-xs hover:bg-[#333] transition-colors disabled:opacity-50"
                >
                  {saveResumeDataMutation.isPending ? (
                    <span className="animate-spin">⌛</span>
                  ) : (
                    <Save className="h-4 w-4" strokeWidth={1.5} />
                  )}
                  <span>
                    {saveResumeDataMutation.isPending ? 'Saving...' : 'Save'}
                  </span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Resume Display */}
        <div className="bg-white border border-[#e5e5e5]">
          {isEditMode ? (
            <EditResume
              resume={localResumeData}
              onChangeResume={handleResumeChange}
            />
          ) : (
            <FullResume
              resume={localResumeData}
              profilePicture={user?.imageUrl}
            />
          )}
        </div>

        <AlertDialog
          open={showDiscardConfirmation}
          onOpenChange={setShowDiscardConfirmation}
        >
          <AlertDialogContent className="bg-white border border-[#e5e5e5]">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-normal">Discard Changes?</AlertDialogTitle>
              <AlertDialogDescription className="text-[#666]">
                Are you sure you want to discard your changes? This action cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-[#ccc] text-[#666] hover:bg-[#f0f0f0]">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmDiscardChanges}
                className="bg-[#1a1a1a] text-white hover:bg-[#333]"
              >
                Discard
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <PopupSiteLive
          isOpen={showModalSiteLive}
          websiteUrl={getNovaCVUrl(usernameQuery.data.username)}
          onClose={() => {
            setModalSiteLive(false);
          }}
        />
      </div>
    </div>
  );
}

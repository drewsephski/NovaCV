import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Resume, ResumeData } from '@/lib/server/redisActions';
import { useUploadThing } from '@/lib/uploadthing';
import { PublishStatuses } from '@/components/PreviewActionbar';
import { ResumeDataSchema } from '@/lib/resume';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// Fetch resume data
const fetchResume = async (): Promise<{
  resume: Resume | undefined;
}> => {
  const response = await fetch('/api/resume');
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch resume');
  }
  return await response.json();
};

const fetchUsername = async (): Promise<{
  username: string;
}> => {
  const response = await fetch('/api/username');
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch username');
  }
  return await response.json();
};

const checkUsernameAvailability = async (
  username: string
): Promise<{
  available: boolean;
}> => {
  const response = await fetch(
    `/api/check-username?username=${encodeURIComponent(username)}`,
    {
      method: 'POST',
    }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to check username availability');
  }
  return await response.json();
};

const regenerateResume = async (): Promise<{ resumeData: ResumeData }> => {
  const response = await fetch('/api/resume/regenerate', {
    method: 'POST',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to regenerate resume');
  }
  return await response.json();
};

const checkSubscriptionStatus = async (): Promise<{
  hasSubscription: boolean;
  subscription?: {
    status: string;
    currentPeriodEnd?: number;
    cancelAtPeriodEnd?: boolean;
  } | null;
}> => {
  const response = await fetch('/api/subscription-check');
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to check subscription');
  }
  return await response.json();
};

export function useUserActions() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { startUpload, isUploading } = useUploadThing('pdfUploader');

  // Query for fetching resume data
  const resumeQuery = useQuery({
    queryKey: ['resume'],
    queryFn: fetchResume,
  });

  const usernameQuery = useQuery({
    queryKey: ['username'],
    queryFn: fetchUsername,
  });

  const internalResumeUpdate = async (newResume: Resume) => {
    const response = await fetch('/api/resume', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newResume),
    });

    if (!response.ok) {
      const error = await response.json();
      return Promise.reject(new Error(error));
    }
  };

  const internalUsernameUpdate = async (newUsername: string) => {
    const response = await fetch('/api/username', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: newUsername }),
    });

    if (!response.ok) {
      const error = await response.json();
      return Promise.reject(error);
    }

    return {
      success: true,
    };
  };

  // Update resume data in Upstash
  const uploadFileResume = async (file: File) => {
    const uploadResult = await startUpload([file]);

    if (!uploadResult || uploadResult.length === 0) {
      throw new Error('Upload failed');
    }

    const uploadedFile = uploadResult[0];
    const serverData = uploadedFile.serverData as {
      url: string;
      name: string;
      size: number;
      key: string;
    };

    const newResume: Resume = {
      file: {
        name: serverData.name,
        url: serverData.url,
        size: serverData.size,
        key: serverData.key,
      },
      resumeData: undefined,
      status: 'draft',
    };

    queryClient.setQueryData(['resume'], (oldData: any) => ({
      ...oldData,
      resume: newResume,
    }));

    await internalResumeUpdate(newResume);
    
    // Refetch to ensure server data is in sync
    await queryClient.refetchQueries({ queryKey: ['resume'] });
  };

  // Mutation for updating resume
  const uploadResumeMutation = useMutation({
    mutationFn: uploadFileResume,
    onSuccess: () => {
      // Invalidate and refetch resume data
      queryClient.invalidateQueries({ queryKey: ['resume'] });
    },
  });

  // Mutation for toggling status of publishment
  const toggleStatusMutation = useMutation({
    mutationFn: async (newPublishStatus: PublishStatuses) => {
      if (!resumeQuery.data?.resume) return;

      // Check subscription if trying to publish (not when unpublishing)
      if (newPublishStatus === 'live') {
        const { hasSubscription } = await checkSubscriptionStatus();
        if (!hasSubscription) {
          throw new Error('SUBSCRIPTION_REQUIRED');
        }
      }

      await internalResumeUpdate({
        ...resumeQuery.data?.resume,
        status: newPublishStatus,
      });

      // Track deployment in history when going live
      if (newPublishStatus === 'live') {
        const response = await fetch('/api/portfolio/track-deployment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.error('Failed to track deployment');
        }
      }
    },
    onSuccess: () => {
      // Invalidate and refetch resume data
      queryClient.invalidateQueries({ queryKey: ['resume'] });
      // Also invalidate dashboard data
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error) => {
      if (error instanceof Error && error.message === 'SUBSCRIPTION_REQUIRED') {
        // Redirect to pricing page
        router.push('/pricing');
        toast.info('Please subscribe to publish your portfolio');
      } else {
        toast.error(
          error instanceof Error ? error.message : 'Failed to update status'
        );
      }
    },
  });

  // mutation to allow editing a username for a user_id, if it fails means that username is already taken
  const updateUsernameMutation = useMutation({
    mutationFn: internalUsernameUpdate,
    onSuccess: () => {
      // Invalidate and refetch username data
      queryClient.invalidateQueries({ queryKey: ['username'] });
    },
    throwOnError: false,
  });

  // Mutation for checking username availability
  const checkUsernameMutation = useMutation({
    mutationFn: checkUsernameAvailability,
    onSuccess: () => {
      // Invalidate and refetch username availability data
      queryClient.invalidateQueries({ queryKey: ['username-availability'] });
    },
  });

  // Mutation for regenerating resume from stored PDF
  const regenerateResumeMutation = useMutation({
    mutationFn: regenerateResume,
    onSuccess: () => {
      // Invalidate and refetch resume data
      queryClient.invalidateQueries({ queryKey: ['resume'] });
      toast.success('Resume regenerated successfully');
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Failed to regenerate resume'
      );
    },
  });

  // Function to save resume data changes
  const saveResumeDataChanges = async (newResumeData: ResumeData) => {
    // Validate the resume data using Zod schema
    try {
      // Validate the resume data
      ResumeDataSchema.parse(newResumeData);

      // If validation passes, update the resume
      if (!resumeQuery.data?.resume) {
        throw new Error('No resume found to update');
      }

      const updatedResume: Resume = {
        ...resumeQuery.data.resume,
        resumeData: newResumeData,
      };

      await internalResumeUpdate(updatedResume);

      return { success: true };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Validation failed: ${error.message}`);
      }
      throw error;
    }
  };

  // Mutation for saving resume data changes
  const saveResumeDataMutation = useMutation({
    mutationFn: saveResumeDataChanges,
    onSuccess: () => {
      // Invalidate and refetch resume data
      queryClient.invalidateQueries({ queryKey: ['resume'] });
    },
  });

  return {
    resumeQuery,
    uploadResumeMutation,
    isUploading,
    toggleStatusMutation,
    usernameQuery,
    updateUsernameMutation,
    checkUsernameMutation,
    saveResumeDataMutation,
    regenerateResumeMutation,
  };
}

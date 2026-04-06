import { generateResumeObject } from '@/lib/server/ai/generateResumeObject';
import { getResume, storeResume } from '@/lib/server/redisActions';
import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// POST endpoint to regenerate resume from stored PDF
export async function POST(): Promise<NextResponse> {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resume = await getResume(user.id);

    if (!resume?.fileContent) {
      return NextResponse.json(
        { error: 'No resume PDF found to regenerate from' },
        { status: 400 }
      );
    }

    // Regenerate resume object from stored PDF content
    const resumeObject = await generateResumeObject(resume.fileContent);

    if (!resumeObject) {
      return NextResponse.json(
        { error: 'Failed to generate resume from PDF' },
        { status: 500 }
      );
    }

    // Store the regenerated resume data
    await storeResume(user.id, {
      ...resume,
      resumeData: resumeObject,
    });

    return NextResponse.json({ success: true, resumeData: resumeObject });
  } catch (error) {
    console.error('Error regenerating resume:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

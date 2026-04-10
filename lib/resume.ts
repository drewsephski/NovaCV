import { z } from 'zod';

// Note: OpenAI structured output requires ALL properties to be in 'required' array.
// Use nullable() instead of optional(), with defaults for truly optional fields.
const HeaderContactsSchema = z.object({
  website: z.string().nullable().default(null).describe('Personal website or portfolio URL'),
  email: z.string().nullable().default(null).describe('Email address'),
  phone: z.string().nullable().default(null).describe('Phone number'),
  twitter: z.string().nullable().default(null).describe('Twitter/X username'),
  linkedin: z.string().nullable().default(null).describe('LinkedIn username'),
  github: z.string().nullable().default(null).describe('GitHub username'),
});

const HeaderSection = z.object({
  name: z.string(),
  shortAbout: z.string().describe('Short description of your profile'),
  location: z
    .string()
    .nullable()
    .default(null)
    .describe("Location with format 'City, Country'"),
  contacts: HeaderContactsSchema,
  skills: z
    .array(z.string())
    .describe('Skills used within the different jobs the user has had.'),
});

const SummarySection = z.string().describe('Summary of your profile');

const WorkExperienceSection = z.array(
  z.object({
    company: z.string().describe('Company name'),
    link: z.string().nullable().default(null).describe('Company website URL'),
    location: z
      .string()
      .describe(
        "Location with format 'City, Country' or could be Hybrid or Remote"
      ),
    contract: z
      .string()
      .describe('Type of work contract like Full-time, Part-time, Contract'),
    title: z.string().describe('Job title'),
    start: z.string().describe("Start date in format 'YYYY-MM-DD'"),
    end: z
      .string()
      .nullable()
      .describe("End date in format 'YYYY-MM-DD' or null if current"),
    description: z.string().describe('Job description'),
  })
);

const EducationSection = z.array(
  z.object({
    school: z.string().describe('School or university name'),
    degree: z.string().describe('Degree or certification obtained'),
    start: z.string().describe('Start year'),
    end: z.string().describe('End year'),
  })
);

export const ResumeDataSchema = z.object({
  header: HeaderSection,
  summary: SummarySection,
  workExperience: WorkExperienceSection,
  education: EducationSection,
});

export type ResumeDataSchemaType = z.infer<typeof ResumeDataSchema>;

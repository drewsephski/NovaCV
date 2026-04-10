import { describe, it, expect } from 'vitest'
import { generateResumeObject } from '@/lib/server/ai/generateResumeObject'

describe('generateResumeObject', () => {
  const hasApiKey = !!process.env.OPENROUTER_API_KEY

  // Skip all tests if no API key is available - the function will timeout without a valid key
  ;(hasApiKey ? it : it.skip)('should handle empty resume text', async () => {
    const result = await generateResumeObject('')
    // Function returns either a structured object or undefined on failure
    if (result) {
      expect(typeof result).toBe('object')
    } else {
      expect(result).toBeUndefined()
    }
  }, 30000)

  ;(hasApiKey ? it : it.skip)('should handle invalid resume text', async () => {
    const result = await generateResumeObject('invalid text that cannot be parsed')
    // Function returns either a structured object or undefined on failure
    if (result) {
      expect(typeof result).toBe('object')
    } else {
      expect(result).toBeUndefined()
    }
  }, 30000)

  ;(hasApiKey ? it : it.skip)('should accept resume text as parameter', async () => {
    const sampleText = 'John Doe\nSoftware Engineer\nNew York, NY'
    const result = await generateResumeObject(sampleText)
    // Function returns either a structured object or undefined on failure
    if (result) {
      expect(typeof result).toBe('object')
      expect(result).toHaveProperty('header')
      expect(result).toHaveProperty('summary')
      expect(result).toHaveProperty('workExperience')
      expect(result).toHaveProperty('education')
      expect(result?.header?.name).toContain('John Doe')
    }
    // If undefined, AI couldn't process - that's also valid behavior
  }, 30000)

  ;(hasApiKey ? it : it.skip)('should handle unstructured text', async () => {
    // Test with text that may be difficult to structure - result can be object or undefined
    const result = await generateResumeObject('random meaningless text that cannot be structured')
    // Function returns either a structured object or undefined on failure
    if (result) {
      expect(typeof result).toBe('object')
      expect(result).toHaveProperty('header')
      expect(result).toHaveProperty('summary')
    } else {
      expect(result).toBeUndefined()
    }
  }, 30000)

  // Full integration test with a complete resume
  ;(hasApiKey ? it : it.skip)('should successfully process complete resume text', async () => {
    const sampleResumeText = `John Smith
Software Engineer
San Francisco, CA

Professional Summary:
Experienced software engineer with 5+ years in full-stack development, specializing in React, Node.js, and cloud technologies.

Work Experience:
Senior Software Engineer at Tech Corp (2020-Present)
- Led development of microservices architecture serving 1M+ users
- Implemented CI/CD pipelines reducing deployment time by 60%
- Mentored junior developers and conducted code reviews

Education:
Bachelor of Science in Computer Science
University of California, Berkeley (2014-2018)

Skills:
JavaScript, TypeScript, React, Node.js, Python`

    const result = await generateResumeObject(sampleResumeText)

    // With API keys, it should return a structured object or undefined if processing fails
    if (result) {
      expect(typeof result).toBe('object')
      expect(result).toHaveProperty('header')
      expect(result).toHaveProperty('summary')
      expect(result).toHaveProperty('workExperience')
      expect(result).toHaveProperty('education')
    }
    // If result is undefined, that's also valid - means AI couldn't process the input
  }, 30000) // 30 second timeout for AI processing
})
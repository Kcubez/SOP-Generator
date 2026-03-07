export const MODIFY_SOP_SYSTEM_INSTRUCTION = `You are an expert Standard Operating Procedure (SOP) analyst and writer. Your job is to:
1. Analyze the existing SOP document provided
2. Identify and address all problems mentioned by the user
3. Generate an improved, professional SOP that resolves all issues
4. Incorporate any additional requirements specified

CRITICAL DATE RULES:
- You MUST preserve ALL original dates from the uploaded SOP document EXACTLY as they appear.
- Do NOT change, modify, or generate different dates. If the original SOP has "2023-10-27" as the effective date, keep it as "2023-10-27".
- Only change dates if the user specifically requests a date change in their problems or additional requirements.
- The "Last Review Date" or "Modified Date" should reflect the current modification date if appropriate, but the original effective dates must be preserved.

Format the improved SOP using clean HTML with proper headings, tables, lists, and sections.
Maintain the original structure where appropriate but improve where needed.
Add any missing sections that should be in a professional SOP.

FONT & STYLE REQUIREMENTS:
- Use consistent font throughout: font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
- All headings (h1, h2, h3) must use the same font family as body text.
- Do NOT mix serif and sans-serif fonts.
- Ensure consistent font sizes: h1=1.75rem, h2=1.35rem, h3=1.1rem, body=0.95rem.
- Use consistent line-height: 1.7 throughout.
- Ensure tables have consistent column widths using percentage-based widths.
- For table headers (<th>), use: background-color: #4338ca; color: #ffffff; padding: 10px 14px; text-align: left; font-weight: 600;
- For table cells (<td>), use: padding: 8px 14px; border-bottom: 1px solid #e2e8f0; color: #334155;

IMPORTANT: At the very end of the SOP document, you MUST include a special section called "AI Suggestions & Recommendations".
This section should:
- Analyze the problems the user mentioned
- Provide specific, actionable suggestions to resolve each problem
- Recommend best practices and improvements that go beyond the stated problems
- Suggest preventive measures to avoid similar issues in the future
- Highlight any gaps or potential risks that the user may not have considered

Format this section with a distinct visual style using a light blue/info background. Example:
<div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 8px; margin-top: 32px;">
  <h2 style="color: #1e40af; margin-bottom: 12px;">💡 AI Suggestions & Recommendations</h2>
  ...suggestions here...
</div>

Do NOT use markdown. Use HTML elements like <h1>, <h2>, <h3>, <table>, <ul>, <ol>, <p>, etc.
Wrap everything in a single <div class="sop-document" style="font-family: 'Inter', 'Segoe UI', system-ui, sans-serif; line-height: 1.7; color: #1e293b;">.
Do NOT wrap the output in a code block. Output raw HTML only.`;

export function buildModifySOPPrompt(data: Record<string, string>): string {
  return `I have an existing SOP document that needs to be modified and improved. Please analyze the existing SOP, identify the problems mentioned, and generate an improved version that addresses all issues.

## Existing SOP Content:
${data.uploadedSOPContent || 'No content provided'}

## Problems Identified:
${data.problems || 'No specific problems mentioned'}

## Additional Requirements:
${data.additionalReq || 'No additional requirements'}

Please:
1. Analyze the existing SOP for the mentioned problems
2. Address each problem with appropriate solutions
3. Incorporate any additional requirements
4. Generate an improved, professional SOP that resolves all issues
5. Maintain the original structure where appropriate but improve where needed
6. Add any missing sections that should be in a professional SOP
7. At the very end, include an "AI Suggestions & Recommendations" section with specific, actionable suggestions to solve the problems mentioned and prevent future issues`;
}

export function buildModifySOPTextPrompt(data: Record<string, string>): string {
  return `The attached document is an existing SOP that needs to be modified and improved. Please analyze it carefully, identify the problems mentioned below, and generate a complete improved version that addresses all issues.

IMPORTANT: Preserve ALL original dates, version numbers, and document identifiers from the uploaded document EXACTLY as they appear. Do NOT change any dates unless specifically requested.

## Problems Identified:
${data.problems || 'No specific problems mentioned'}

## Additional Requirements:
${data.additionalReq || 'No additional requirements'}

Please:
1. Read and understand the attached SOP document completely
2. Analyze the existing SOP for the mentioned problems
3. Address each problem with appropriate solutions
4. Incorporate any additional requirements
5. Generate an improved, professional SOP that resolves all issues
6. Maintain the original structure where appropriate but improve where needed
7. Preserve all original dates, version numbers, and document metadata
8. Add any missing sections that should be in a professional SOP
9. At the very end, include an "AI Suggestions & Recommendations" section with specific, actionable suggestions to solve the problems mentioned and prevent future issues`;
}

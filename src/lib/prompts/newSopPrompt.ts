export const NEW_SOP_SYSTEM_INSTRUCTION = `You are an expert Standard Operating Procedure (SOP) writer. Create professional, detailed, and well-structured SOPs.

Format the SOP using clean HTML with proper headings, tables, lists, and sections. Use professional styling.
The SOP should follow this structure:
1. Document Header (Title, Version, Date, Department)
2. Purpose & Scope
3. Definitions & Abbreviations
4. Roles & Responsibilities
5. Procedure (Step-by-step with detailed instructions)
6. Decision Points & Flowchart descriptions
7. Tools & Resources Required
8. Standards & Compliance
9. Risk Assessment & Controls
10. KPIs & Expected Outcomes
11. Version Control & Review Schedule
12. Training & Communication Plan
13. Appendices & References

IMPORTANT RULES:
- You MUST use the EXACT Effective Date provided by the user. Do NOT change, modify, or generate a different date. Copy the date value exactly as provided.
- You MUST use the EXACT Version number provided by the user.
- For table headers (<th>), use this style: background-color: #4338ca; color: #ffffff; padding: 10px 14px; text-align: left; font-weight: 600;
- For table cells (<td>), use this style: padding: 8px 14px; border-bottom: 1px solid #e2e8f0; color: #334155;

FONT & STYLE REQUIREMENTS:
- Use consistent font throughout: font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
- All headings (h1, h2, h3) must use the same font family as body text.
- Do NOT mix serif and sans-serif fonts.
- Ensure consistent font sizes: h1=1.75rem, h2=1.35rem, h3=1.1rem, body=0.95rem.
- Use consistent line-height: 1.7 throughout.
- Ensure tables have consistent column widths using percentage-based widths.

Use tables where appropriate. Make it comprehensive and ready to use. Format using clean, semantic HTML.
Do NOT use markdown. Use HTML elements like <h1>, <h2>, <h3>, <table>, <ul>, <ol>, <p>, etc.
Wrap everything in a single <div class="sop-document" style="font-family: 'Inter', 'Segoe UI', system-ui, sans-serif; line-height: 1.7; color: #1e293b;">.
Do NOT wrap the output in a code block. Output raw HTML only.`;

export function buildNewSOPPrompt(data: Record<string, string>): string {
  return `Create a comprehensive Standard Operating Procedure (SOP) document based on the following information:

## Process / Procedure Information
- Business Name: ${data.businessName || 'N/A'}
- Business Type: ${data.businessType || 'N/A'}
- Purpose / Objective: ${data.purpose || 'N/A'}
- Business Progress (Start to End): ${data.progressStartEnd || 'N/A'}
- Scope (Department / Team): ${data.scope || 'N/A'}

## Stakeholders & Responsibility
- Personnel who must follow this SOP (Roles/Positions): ${data.stakeholders || 'N/A'}
- Responsibilities (Who does what): ${data.responsibility || 'N/A'}
- Approval Authority: ${data.approvalAuthority || 'N/A'}

## Step-by-Step Procedure
- Process steps (what to do, who does it, when/where): ${data.stepByStep || 'N/A'}
- Decision Points (Yes/No): ${data.decisionPoints || 'N/A'}

## Tools, Documents & Resources
- Software / System / Equipment / Tools: ${data.tools || 'N/A'}
- Reference Documents (Policy, Guideline, Form, Template): ${data.referenceDocuments || 'N/A'}

## Standards & Compliance
- Company Policy / Law / Regulation / Quality Standards: ${data.complianceStandards || 'N/A'}
- Dos & Don'ts: ${data.dosAndDonts || 'N/A'}

## Risks & Controls
- Potential Risks: ${data.risks || 'N/A'}
- Control / Prevention Methods: ${data.controls || 'N/A'}

## KPI / Output
- Expected Result / Output: ${data.expectedOutput || 'N/A'}
- Success Measurement KPI / Metrics: ${data.kpiMetrics || 'N/A'}

## Version Control & Review
- SOP Version No.: ${data.versionNo || '1.0'}
- Effective Date: ${data.effectiveDate || new Date().toISOString().split('T')[0]} (YOU MUST USE THIS EXACT DATE IN THE GENERATED DOCUMENT. DO NOT CHANGE IT.)
- Review Cycle: ${data.reviewCycle || 'N/A'}
- Revision History: ${data.revisionHistory || 'N/A'}

## Training & Communication
- Training Method: ${data.trainingMethod || 'N/A'}
- New Staff Induction Process: ${data.inductionProcess || 'N/A'}
- SOP Update Notification Method: ${data.updateNotification || 'N/A'}

Please generate a professional, comprehensive, detailed SOP document with all sections properly formatted.`;
}

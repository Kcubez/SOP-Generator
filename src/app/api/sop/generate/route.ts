import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { buildNewSOPPrompt, NEW_SOP_SYSTEM_INSTRUCTION } from '@/lib/prompts/newSopPrompt';
import {
  buildModifySOPTextPrompt,
  buildModifySOPPrompt,
  MODIFY_SOP_SYSTEM_INSTRUCTION,
} from '@/lib/prompts/modifySopPrompt';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    // 1. Fetch API key securely from our internal Node.js endpoint using the session cookie
    const cookieHeader = req.headers.get('cookie') || '';
    const internalUrl = new URL('/api/user/internal-api-key', req.url);

    // Pass cookies to maintain authentication session
    const keyRes = await fetch(internalUrl.toString(), {
      headers: { cookie: cookieHeader },
    });

    if (!keyRes.ok) {
      if (keyRes.status === 401) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.json(
        { error: 'NO_API_KEY', message: 'Please set your Gemini API key before generating SOPs.' },
        { status: 400 }
      );
    }

    const { apiKey } = await keyRes.json();

    if (!apiKey) {
      return NextResponse.json(
        { error: 'NO_API_KEY', message: 'API key is missing.' },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    // 2. Parse request data
    const contentType = req.headers.get('content-type') || '';
    let data: Record<string, string>;
    let uploadedFileBase64: string | null = null;
    let uploadedFileMimeType = '';
    let sopId = '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      data = {
        type: (formData.get('type') as string) || '',
        problems: (formData.get('problems') as string) || '',
        additionalReq: (formData.get('additionalReq') as string) || '',
        uploadedSOPContent: (formData.get('uploadedSOPContent') as string) || '',
        businessName: (formData.get('businessName') as string) || '',
        outputLanguage: (formData.get('outputLanguage') as string) || 'english',
      };
      sopId = (formData.get('sopId') as string) || '';

      const file = formData.get('file') as File | null;
      if (file) {
        const buffer = await file.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        // We can use standard btoa, but for large arrays, it's safer to use a function or fromCharCode
        // Vercel edge supports Buffer if imported? No, Buffer is not globally available in Edge by default.
        // We can do an array to base64 conversion manually or use btoa(String.fromCharCode(...bytes)).
        // To avoid max call stack size, we chunk it.
        const chunk = 8192;
        let str = '';
        for (let i = 0; i < bytes.length; i += chunk) {
          str += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)));
        }
        uploadedFileBase64 = btoa(str);

        uploadedFileMimeType =
          file.type ||
          (file.name.endsWith('.pdf')
            ? 'application/pdf'
            : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      }
    } else {
      data = await req.json();
      sopId = data.sopId || '';
    }

    const { type } = data;
    if (!sopId) {
      return NextResponse.json({ error: 'Missing sopId' }, { status: 400 });
    }

    // ─── Stream AI content ─────────────────────────────────────────────
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send the SOP ID immediately as the first line (compatible with existing frontend)
          controller.enqueue(encoder.encode(`__SOP_ID__:${sopId}\n`));

          let systemInst = '';
          const outputLanguage = data.outputLanguage || 'english';

          if (type === 'NEW') {
            const languageInstruction =
              outputLanguage === 'myanmar'
                ? `\n\nCRITICAL LANGUAGE REQUIREMENT: You MUST write the ENTIRE SOP document in Myanmar (Burmese) language using Myanmar Unicode script. ALL text content including headings, paragraphs, table cells, list items, descriptions, and recommendations MUST be written in Myanmar language. The only exceptions are: proper nouns, company names, technical terms (like ISO 9001, KPI), and HTML tags/attributes. Do NOT write in English except for those exceptions.`
                : `\n\nLANGUAGE REQUIREMENT: Write the entire SOP document in English.`;

            systemInst = NEW_SOP_SYSTEM_INSTRUCTION + languageInstruction;
            const prompt = buildNewSOPPrompt(data);

            const response = await ai.models.generateContentStream({
              model: 'gemini-2.5-flash',
              contents: prompt,
              config: {
                systemInstruction: systemInst,
                temperature: 0.7,
                maxOutputTokens: 65000,
              },
            });

            for await (const chunk of response) {
              const text = chunk.text || '';
              if (text) {
                controller.enqueue(encoder.encode(text));
              }
            }
          } else if (type === 'MODIFIED') {
            const languageInstruction =
              outputLanguage === 'myanmar'
                ? `\n\nCRITICAL LANGUAGE REQUIREMENT: You MUST write the ENTIRE SOP document in Myanmar (Burmese) language using Myanmar Unicode script. ALL text content including headings, paragraphs, table cells, list items, descriptions, and recommendations MUST be written in Myanmar language. The only exceptions are: proper nouns, company names, technical terms (like ISO 9001, KPI), and HTML tags/attributes. Do NOT write in English except for those exceptions.\n\nMANDATORY: You MUST include the "💡 AI အကြံပြုချက်များနှင့် အကြံဉာဏ်များ" section at the very end of the document, written entirely in Myanmar language. This section MUST analyze problems, provide actionable suggestions, recommend best practices, suggest preventive measures, and highlight gaps or risks. Do NOT skip this section. Format it with the light blue info background as specified.`
                : `\n\nLANGUAGE REQUIREMENT: Write the entire SOP document in English.`;

            systemInst = MODIFY_SOP_SYSTEM_INSTRUCTION + languageInstruction;

            if (uploadedFileBase64) {
              const textPrompt = buildModifySOPTextPrompt(data);

              const response = await ai.models.generateContentStream({
                model: 'gemini-2.5-flash',
                contents: [
                  {
                    role: 'user',
                    parts: [
                      {
                        inlineData: {
                          mimeType: uploadedFileMimeType,
                          data: uploadedFileBase64,
                        },
                      },
                      {
                        text: textPrompt,
                      },
                    ],
                  },
                ],
                config: {
                  systemInstruction: systemInst,
                  temperature: 0.7,
                  maxOutputTokens: 65000,
                },
              });

              for await (const chunk of response) {
                const text = chunk.text || '';
                if (text) {
                  controller.enqueue(encoder.encode(text));
                }
              }
            } else {
              const prompt = buildModifySOPPrompt(data);
              const response = await ai.models.generateContentStream({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                  systemInstruction: systemInst,
                  temperature: 0.7,
                  maxOutputTokens: 65000,
                },
              });

              for await (const chunk of response) {
                const text = chunk.text || '';
                if (text) {
                  controller.enqueue(encoder.encode(text));
                }
              }
            }
          }

          controller.enqueue(encoder.encode('\n__STREAM_DONE__'));
          controller.close();
        } catch (error: any) {
          console.error('SOP generation stream error:', error);
          const errMsg = error?.message || String(error);

          let friendlyError = 'An unexpected error occurred during generation.';
          let errorCode = 'GENERATION_FAILED';

          if (errMsg.includes('429') || errMsg.includes('quota')) {
            friendlyError = 'API key usage limit reached.';
            errorCode = 'API_LIMIT_REACHED';
          } else if (errMsg.includes('400') || errMsg.includes('API key not valid')) {
            friendlyError = 'Invalid API key provided.';
            errorCode = 'INVALID_API_KEY';
          } else if (errMsg.includes('503')) {
            friendlyError = 'AI generation service is currently overloaded.';
            errorCode = 'OVERLOADED';
          }

          controller.enqueue(encoder.encode(`\n__ERROR__:${errorCode}\n${friendlyError}`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('SOP edge initialization error:', error);
    return NextResponse.json(
      { error: 'GENERATION_FAILED', message: 'Failed to initialize AI generation' },
      { status: 500 }
    );
  }
}

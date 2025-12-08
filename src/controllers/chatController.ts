import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../types/@server";
import { CustomError } from "../types/customErrorInterface";
import { validateChatRequest, ChatRequest } from "../utils/validators/chatValidator";
import { retrieveContext } from "../services/rag/retriever";
import {
  getOrCreateSession,
  addMessageToSession,
  getConversationHistory,
  formatConversationHistory,
} from "../services/rag/session-manager-dataconnect";
import { getLLMConfig, createLLM } from "../config/llmConfig";
import { parsePDFFile, validatePDFFile } from "../services/rag/pdf-parser";

const RETRIEVAL_TOP_K = parseInt(process.env.RETRIEVAL_TOP_K || "5", 10);

/**
 * Handle incoming chat message requests (with optional PDF upload)
 * POST /api/chat
 * Content-Type: multipart/form-data or application/json
 */
export const handleChatMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Extract file if present (multer attaches to req.file)
    const uploadedFile = req.file as Express.Multer.File | undefined;

    // 2. Parse metadata if it's a string (happens with multipart/form-data)
    const requestBody = { ...req.body };
    if (typeof requestBody.metadata === 'string') {
      try {
        requestBody.metadata = JSON.parse(requestBody.metadata);
      } catch (error) {
        console.error('Failed to parse metadata JSON:', error);
        // Leave as string, validator will catch the error
      }
    }

    // 3. Validate request body
    const validatedData = await validateChatRequest(requestBody as ChatRequest);
    const { message, sessionId, metadata } = validatedData;

    console.log(`💬 Received chat message (${message.length} chars, has file: ${!!uploadedFile})`);

    // 4. Handle PDF parsing if file was uploaded
    let pdfText = "";
    let pdfFilename = "";
    let pdfTruncated = false;
    let pdfProcessingError: string | undefined;

    if (uploadedFile) {
      try {
        // Validate PDF
        validatePDFFile(uploadedFile);

        // Parse PDF
        const parsedPDF = await parsePDFFile(
          uploadedFile.buffer,
          uploadedFile.originalname
        );

        pdfText = parsedPDF.text;
        pdfFilename = uploadedFile.originalname;
        pdfTruncated = parsedPDF.truncated;

        console.log(
          `📄 PDF processed: ${pdfFilename} (${parsedPDF.originalLength} chars, truncated: ${pdfTruncated})`
        );
      } catch (pdfError: any) {
        console.error("❌ PDF processing failed:", pdfError);
        pdfProcessingError = pdfError.message;
        // Don't throw - continue with text message only (graceful degradation)
      }
    }

    // 5. Determine final message content
    // If PDF uploaded and parsed successfully: combine message + PDF text
    // If PDF failed or not present: use message only
    let userMessageContent: string;
    let attachmentType: string | undefined;
    let attachmentFilename: string | undefined;

    if (pdfText) {
      // PDF was successfully parsed - content includes extracted text
      userMessageContent = `${message}\n\n[Attached PDF: ${pdfFilename}]\n\n${pdfText}`;
      attachmentType = "pdf";
      attachmentFilename = pdfFilename;
    } else {
      // No PDF or parsing failed - just use the text message
      userMessageContent = message;
    }

    console.log(`💬 Processing message (${userMessageContent.length} chars total)`);

    // 6. Get or create session
    const session = await getOrCreateSession(
      sessionId,
      metadata?.userId,
      metadata || undefined
    );

    // 7. Add user message to session (includes PDF text if present)
    await addMessageToSession(
      session.id,
      "user",
      userMessageContent,
      attachmentType,
      attachmentFilename
    );

    // 8. Retrieve relevant context from RAG
    let ragContext = "";
    let sourceDocuments: string[] = [];

    try {
      // Use the full content (including PDF text if present) for retrieval
      const retrievalResult = await retrieveContext(userMessageContent, RETRIEVAL_TOP_K);
      ragContext = retrievalResult.context;
      sourceDocuments = retrievalResult.sourceDocuments;
      console.log(`📚 Retrieved context from ${sourceDocuments.length} sources`);
    } catch (ragError) {
      console.error("⚠️ RAG retrieval failed, continuing without context:", ragError);
      // Continue without RAG context - LLM can still respond
    }

    // 9. Get conversation history
    const conversationHistory = await getConversationHistory(session.id);
    const formattedHistory = formatConversationHistory(
      conversationHistory.slice(0, -1) // Exclude the message we just added
    );

    // 10. Build prompt for LLM
    const systemPrompt = `You are a helpful HR assistant. Use the following context from HR policy documents to answer the user's question accurately. If the context doesn't contain relevant information, say so clearly.

Context from HR Documents:
${ragContext || "No relevant context available."}

Conversation History:
${formattedHistory || "No previous conversation."}

User Question: ${userMessageContent}

Please provide a clear, helpful answer based on the context above. If you reference specific policies, mention the source document.`;

    // 11. Invoke LLM
    let aiResponse = "";
    let llmModel = "";
    let llmProvider = "";

    try {
      const llmConfig = getLLMConfig();
      const llm = createLLM(llmConfig);

      llmModel = llmConfig.model;
      llmProvider = llmConfig.provider;

      console.log(`🤖 Invoking LLM (${llmProvider}/${llmModel})...`);

      const response = await llm.invoke(systemPrompt);
      aiResponse = typeof response.content === "string"
        ? response.content
        : JSON.stringify(response.content);

      console.log(`✅ LLM response generated (${aiResponse.length} chars)`);
    } catch (llmError) {
      console.error("❌ LLM invocation failed:", llmError);
      const error: CustomError = new Error(
        "Failed to generate AI response. Please try again."
      );
      error.status = 500;
      throw error;
    }

    // 12. Add AI response to session
    await addMessageToSession(session.id, "assistant", aiResponse);

    // 13. Return response with PDF metadata
    const apiResponse: ApiResponse = {
      success: true,
      message: "Chat response generated successfully",
      data: {
        response: aiResponse,
        sessionId: session.id,
        metadata: {
          sourceDocuments,
          model: llmModel,
          provider: llmProvider,
          pdfProcessed: !!pdfText,
          pdfFilename: pdfFilename || undefined,
          pdfTruncated: pdfTruncated || undefined,
          pdfProcessingError: pdfProcessingError || undefined,
        },
      },
    };

    res.status(200).json(apiResponse);
  } catch (error) {
    // Check if it's a validation error
    if (error instanceof Error && error.message.includes("Message")) {
      const validationError: CustomError = new Error(error.message);
      validationError.status = 400;
      next(validationError);
    } else {
      next(error);
    }
  }
};

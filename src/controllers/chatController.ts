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
} from "../services/rag/session-manager";
import { getLLMConfig, createLLM } from "../config/llmConfig";

const RETRIEVAL_TOP_K = parseInt(process.env.RETRIEVAL_TOP_K || "5", 10);

/**
 * Handle incoming chat message requests
 * POST /api/chat
 */
export const handleChatMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Validate request
    const validatedData = await validateChatRequest(req.body as ChatRequest);
    const { message, sessionId, metadata } = validatedData;

    console.log(`💬 Received chat message (${message.length} chars)`);

    // 2. Get or create session
    const session = await getOrCreateSession(
      sessionId,
      metadata?.userId,
      metadata || undefined
    );

    // 3. Add user message to session
    await addMessageToSession(session.id, "user", message);

    // 4. Retrieve relevant context from RAG
    let ragContext = "";
    let sourceDocuments: string[] = [];

    try {
      const retrievalResult = await retrieveContext(message, RETRIEVAL_TOP_K);
      ragContext = retrievalResult.context;
      sourceDocuments = retrievalResult.sourceDocuments;
      console.log(`📚 Retrieved context from ${sourceDocuments.length} sources`);
    } catch (ragError) {
      console.error("⚠️ RAG retrieval failed, continuing without context:", ragError);
      // Continue without RAG context - LLM can still respond
    }

    // 5. Get conversation history
    const conversationHistory = await getConversationHistory(session.id);
    const formattedHistory = formatConversationHistory(
      conversationHistory.slice(0, -1) // Exclude the message we just added
    );

    // 6. Build prompt for LLM
    const systemPrompt = `You are a helpful HR assistant. Use the following context from HR policy documents to answer the user's question accurately. If the context doesn't contain relevant information, say so clearly.

Context from HR Documents:
${ragContext || "No relevant context available."}

Conversation History:
${formattedHistory || "No previous conversation."}

User Question: ${message}

Please provide a clear, helpful answer based on the context above. If you reference specific policies, mention the source document.`;

    // 7. Invoke LLM
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

    // 8. Add AI response to session
    await addMessageToSession(session.id, "assistant", aiResponse);

    // 9. Return response
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

"use client";

import { createClient } from "@/utils/supabase/client";

export interface JWTHandlerOptions {
  onTokenExpired?: () => void;
  onTokenRefresh?: () => void;
  maxRetries?: number;
}

export class JWTHandler {
  private static instance: JWTHandler;
  private retryCount = 0;
  private options: JWTHandlerOptions;

  private constructor(options: JWTHandlerOptions = {}) {
    this.options = {
      maxRetries: 3,
      ...options,
    };
  }

  static getInstance(options?: JWTHandlerOptions): JWTHandler {
    if (!JWTHandler.instance) {
      JWTHandler.instance = new JWTHandler(options);
    }
    return JWTHandler.instance;
  }

  async handleJWTAuth<T>(
    operation: () => Promise<T>,
    fallbackValue?: T
  ): Promise<T | undefined> {
    try {
      const result = await operation();
      this.retryCount = 0; // Reset retry count on success
      return result;
    } catch (error: any) {
      if (this.isJWTError(error)) {
        return this.handleJWTError(operation, fallbackValue);
      }
      throw error;
    }
  }

  private isJWTError(error: any): boolean {
    return (
      error?.code === "PGRST301" ||
      error?.message?.includes("JWT expired") ||
      error?.message?.includes("Invalid JWT")
    );
  }

  private async handleJWTError<T>(
    operation: () => Promise<T>,
    fallbackValue?: T
  ): Promise<T | undefined> {
    if (this.retryCount >= (this.options.maxRetries || 3)) {
      console.warn("Max retries reached for JWT refresh");
      this.options.onTokenExpired?.();
      return fallbackValue;
    }

    this.retryCount++;
    
    try {
      // Attempt to refresh the session
      const supabase = createClient();
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error("Failed to refresh session:", error);
        this.options.onTokenExpired?.();
        return fallbackValue;
      }

      if (data.session) {
        this.options.onTokenRefresh?.();
        // Retry the original operation
        return await operation();
      }
    } catch (refreshError) {
      console.error("Error during JWT refresh:", refreshError);
    }

    this.options.onTokenExpired?.();
    return fallbackValue;
  }

  reset() {
    this.retryCount = 0;
  }
}

// Utility function for easy use
export async function withJWTRefresh<T>(
  operation: () => Promise<T>,
  fallbackValue?: T,
  options?: JWTHandlerOptions
): Promise<T | undefined> {
  const handler = JWTHandler.getInstance(options);
  return handler.handleJWTAuth(operation, fallbackValue);
}



import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";

// Provider configuration types
export type ProviderName = "anthropic" | "openrouter" | "openai";

export interface ProviderConfig {
  name: ProviderName;
  models: {
    primary: string;
    fallback?: string;
  };
  apiKeyEnv: string;
}

// Provider configurations
const PROVIDER_CONFIGS: Record<ProviderName, ProviderConfig> = {
  anthropic: {
    name: "anthropic",
    models: {
      primary: "claude-4-sonnet-20250514",
      fallback: "claude-3-7-sonnet-20250219",
    },
    apiKeyEnv: "ANTHROPIC_API_KEY",
  },
  openrouter: {
    name: "openrouter",
    models: {
      primary: "anthropic/claude-3.5-sonnet",
      fallback: "meta-llama/llama-3.1-70b-instruct",
    },
    apiKeyEnv: "OPENROUTER_API_KEY",
  },
  openai: {
    name: "openai",
    models: {
      primary: "gpt-5-2025-08-07",
      fallback: "gpt-4.1-2025-04-14",
    },
    apiKeyEnv: "OPENAI_API_KEY",
  },
};

// Get current provider from environment
export function getCurrentProvider(): ProviderName {
  const provider = process.env.PROVIDER?.toLowerCase() as ProviderName;
  if (provider && PROVIDER_CONFIGS[provider]) {
    return provider;
  }
  return "anthropic"; // Default fallback
}

// Get provider configuration
export function getProviderConfig(provider?: ProviderName): ProviderConfig {
  const currentProvider = provider || getCurrentProvider();
  return PROVIDER_CONFIGS[currentProvider];
}

// Create model instance based on provider
export function createModel(provider?: ProviderName, useFallback = false) {
  const config = getProviderConfig(provider);
  const modelName = useFallback && config.models.fallback 
    ? config.models.fallback 
    : config.models.primary;

  switch (config.name) {
    case "anthropic":
      return anthropic(modelName);
    
    case "openrouter":
      return openai(modelName, {
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: process.env.OPENROUTER_API_KEY,
        headers: {
          "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
          "X-Title": "AI Builder App",
        },
      });
    
    case "openai":
      return openai(modelName);
    
    default:
      console.warn(`Unknown provider: ${config.name}, falling back to anthropic`);
      return anthropic(PROVIDER_CONFIGS.anthropic.models.primary);
  }
}

// Validate provider setup
export function validateProviderSetup(provider?: ProviderName): {
  isValid: boolean;
  error?: string;
} {
  const config = getProviderConfig(provider);
  const apiKey = process.env[config.apiKeyEnv];
  
  if (!apiKey) {
    return {
      isValid: false,
      error: `Missing API key: ${config.apiKeyEnv} is not set`,
    };
  }
  
  return { isValid: true };
}

// Export current model for backward compatibility
export const MODEL = createModel();
export const CURRENT_PROVIDER = getCurrentProvider();

// Log current provider setup
console.log(`🤖 AI Provider: ${CURRENT_PROVIDER} (${getProviderConfig().models.primary})`);
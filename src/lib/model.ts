import { MODEL, createModel, getCurrentProvider } from "./providers";

// Export current model (provider-aware)
export const ANTHROPIC_MODEL = MODEL;

// Export provider utilities for advanced usage
export { createModel, getCurrentProvider };

export interface IterateRequest {
  componentPath: string;
  currentCode: string;
  prompt: string;
  storyId?: string;
}

export interface IterateResponse {
  success: boolean;
  error?: string;
  message?: string;
}

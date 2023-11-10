declare global {
  type CategoryName = "Best Practices" | "Security" | "Optimisation";

  interface Category {
    color: string;
    description: string;
    name: CategoryName;
  }

  interface Issue {
    category: CategoryName;
    description: string;
    extra: string;
    id: number;
    lines: number[];
    loadingExtra: boolean;
    title: string;
  }

  interface ApiResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: {
      index: number;
      message: {
        role: string;
        content: string;
      };
      finish_reason: string;
    }[];
    usage: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
    system_fingerprint: string;
  }

  interface Message {
    role: "user" | "assistant" | "system";
    content: string;
  }
}

export {};

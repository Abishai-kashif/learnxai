// Base interfaces
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface QuizQuestion {
  question: string
  options: [string, string, string, string] // Exactly 4 options
  answer: string
}

export type QuizMessageResponse = QuizQuestion[]; 

export interface QuizData {
	title?: string;
	estimatedTime?: string;
	questions: QuizMessageResponse; // Array of quiz questions
}

// Variant-specific interfaces
export interface UserMessageProps {
  role: "user"
  content: string
  user?: User
}

export interface AssistantMessageProps {
  role: "assistant"
  content: string
}

export interface QuizMessageProps {
	role: "quiz";
	content: QuizData;
}


// Union type for all message variants
export type ChatMessageProps = UserMessageProps | AssistantMessageProps | QuizMessageProps
export type Session = Array<ChatMessageProps>;
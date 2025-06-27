
export enum MessageAuthor {
  USER = 'user',
  AI = 'ai',
}

export interface AttachedFile {
  name: string;
  type: string;
  content?: string; // base64 or text content
}

export interface Message {
  id: string;
  author: MessageAuthor;
  text: string;
  imageUrl?: string;
  isLoading?: boolean;
  attachedFile?: {
    name: string;
    type: string;
  };
}

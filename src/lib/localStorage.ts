export interface Message {
  id: string;
  name: string;
  email: string;
  title: string;
  content: string;
  createdAt: string;
}

const STORAGE_KEY = 'contact_messages';

export const saveMessage = (message: Omit<Message, 'id' | 'createdAt'>): void => {
  if (typeof window === 'undefined') return;
  
  const existingMessages = getMessages();
  const newMessage: Message = {
    ...message,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  
  const updatedMessages = [...existingMessages, newMessage];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMessages));
};

export const getMessages = (): Message[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

export const deleteMessage = (id: string): void => {
  if (typeof window === 'undefined') return;
  
  const existingMessages = getMessages();
  const updatedMessages = existingMessages.filter(msg => msg.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMessages));
};

export const searchMessages = (query: string): Message[] => {
  const messages = getMessages();
  const lowercaseQuery = query.toLowerCase();
  
  return messages.filter(msg => 
    msg.name.toLowerCase().includes(lowercaseQuery) ||
    msg.email.toLowerCase().includes(lowercaseQuery) ||
    msg.title.toLowerCase().includes(lowercaseQuery) ||
    msg.content.toLowerCase().includes(lowercaseQuery)
  );
};

export const sortMessagesByDate = (messages: Message[], ascending: boolean = false): Message[] => {
  return [...messages].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
};
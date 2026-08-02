export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

export interface Folder {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
}

export interface Note {
  id: string;
  userId: string;
  folderId: string | null;
  title: string;
  content: string;
  createdAt: string;
}

// API responses – exact shapes from specs
export interface AuthResponse {
  message: string;
  user: User;
}

export interface FoldersResponse {
  message: string;
  folders: Folder[];
}

export interface FolderResponse {
  message: string;
  folder: Folder;
}

export interface NotesResponse {
  message: string;
  notes: Note[];
}

export interface NoteResponse {
  message: string;
  note: Note;
}

export interface DeleteResponse {
  message: string;
  deletedCount?: number;  // for batch
}

export interface UserResponse {
  message: string;
  user: User;
}
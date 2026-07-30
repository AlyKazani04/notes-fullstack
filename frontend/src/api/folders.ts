import request from "./client";
import type { FoldersResponse, FolderResponse } from "../types";

export const folders = {
    getAll: () => request<FoldersResponse>('/api/folders'),

    getById: (id: string) => request<FolderResponse>(`/api/folders/${id}`),

    create: (name: string) =>
        request<FolderResponse>('/api/folders', {
            method: 'POST',
            body: JSON.stringify({name}),
        }),
    
    update: (name: string, id: string) =>
        request<FolderResponse>(`/api/folders/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({name})
        }),

    delete: (id: string) => request<FolderResponse>(`/api/folders/${id}`, { 
        method: 'DELETE'
    }),
}
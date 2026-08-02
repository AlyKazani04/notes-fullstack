import request from "./client";
import type { NoteResponse, NotesResponse, DeleteResponse } from "../types";

export const notes = {
    getAll: (folderId?: string) => 
        request<NotesResponse>(`/api/notes${folderId ? `?folderId=${folderId}` : ``}`),

    getById: (id: string) => request<NoteResponse>(`/api/notes/${id}`),
    
    create: (title: string, content: string, fId?: string) => {
        let folderId;
        if (fId) {
            folderId = parseInt(fId, 10);
        } else {
            folderId = undefined;
        }

        return request<NoteResponse>(`/api/notes`, {
            method: 'POST',
            body: JSON.stringify({title, content, folderId})
        });
    },

    update: (id: string, title?: string, content?: string, fId?: string) => {
        let folderId;
        if (fId) {
            folderId = parseInt(fId, 10);
        } else {
            folderId = undefined;
        }

        return request<NoteResponse>(`/api/notes/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({title, content, folderId})
        });
    },
    
    delete: (id: string) => request<DeleteResponse>(`/api/notes/${id}`),

    batchDelete: (noteIds: string[]) => 
        request<DeleteResponse>(`/api/notes/batch-delete`, {
            method: 'POST',
            body: JSON.stringify({noteIds})
        }),
};
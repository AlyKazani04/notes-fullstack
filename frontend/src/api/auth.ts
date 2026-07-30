import request from "./client";
import type {AuthResponse, UserResponse, DeleteResponse} from '../types';

export const auth = {
    login: (email: string, password:string) => 
        request<AuthResponse>('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({email, password})
        }),
    
    register: (name: string, email: string, password: string) => 
        request<AuthResponse>('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({name, email, password})
        }),
    
    getMe: () => request<UserResponse>('/api/users/me'),

    updateProfile: (data: {
        name?: string;
        email?: string;
        currentPassword?: string;
        newPassword?: string;
    }) => 
        request<UserResponse>('/api/users/profile', {
            method: 'PATCH', 
            body: JSON.stringify(data),
        }),

    logout: () => request<DeleteResponse>('/api/users/logout', {
        method: 'POST',
    }),
};
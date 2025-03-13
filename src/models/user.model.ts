export interface User {
    id: number;
    name: string;
    document: string;
    document_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

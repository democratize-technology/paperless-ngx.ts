export interface User {
    id: number; // Read-only
    username: string;
    email: string;
    password?: string; // Write-only
    first_name: string;
    last_name: string;
    date_joined: string;
    is_staff: boolean;
    is_active: boolean;
    is_superuser: boolean;
    groups: number[]; // List of group IDs
    user_permissions: string[];
    inherited_permissions: string[]; // Read-only
    is_mfa_enabled: boolean; // Read-only
}

export interface UserRequest {
    username: string;
    email?: string;
    password?: string;
    first_name?: string;
    last_name?: string;
    date_joined?: string;
    is_staff?: boolean;
    is_active?: boolean;
    is_superuser?: boolean;
    groups?: number[];
    user_permissions?: string[];
}

export interface Group {
    id: number; // Read-only
    name: string;
    permissions: string[];
}

export interface GroupRequest {
    name: string;
    permissions: string[];
}

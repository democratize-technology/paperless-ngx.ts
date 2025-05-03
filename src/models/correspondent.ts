import { MatchingAlgorithm } from "./common";

export interface Correspondent {
    id: number; // Read-only
    slug: string; // Read-only
    name: string;
    match: string;
    matching_algorithm: MatchingAlgorithm;
    is_insensitive: boolean;
    document_count: number; // Read-only
    last_correspondence: string; // Read-only
    owner: number | null;
    permissions?: {
        view?: {
            users?: number[];
            groups?: number[];
        };
        change?: {
            users?: number[];
            groups?: number[];
        };
    }; // Read-only
    user_can_change: boolean; // Read-only
}

export interface CorrespondentRequest {
    name: string;
    match?: string;
    matching_algorithm?: MatchingAlgorithm;
    is_insensitive?: boolean;
    owner?: number | null;
    set_permissions?: {
        view?: {
            users?: number[];
            groups?: number[];
        };
        change?: {
            users?: number[];
            groups?: number[];
        };
    }; // Write-only
}

import { MatchingAlgorithm } from "./common";

export interface Tag {
    id: number; // Read-only
    slug: string; // Read-only
    name: string;
    color: string;
    text_color: string; // Read-only
    match: string;
    matching_algorithm: MatchingAlgorithm;
    is_insensitive: boolean;
    is_inbox_tag: boolean;
    document_count: number; // Read-only
    owner: number | null;
    user_can_change: boolean; // Read-only
}

export interface TagRequest {
    name: string;
    color: string;
    match?: string;
    matching_algorithm?: MatchingAlgorithm;
    is_insensitive?: boolean;
    is_inbox_tag?: boolean;
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

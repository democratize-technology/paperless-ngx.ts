import { FileVersion } from "./common";

export interface ShareLink {
    id: number; // Read-only
    created: string; // Read-only
    expiration: string | null;
    slug: string; // Read-only
    document: number;
    file_version: FileVersion;
}

export interface ShareLinkRequest {
    expiration?: string | null;
    document: number;
    file_version: FileVersion;
}

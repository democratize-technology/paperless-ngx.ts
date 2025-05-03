// System status interfaces
export interface SystemStatus {
    pngx_version: string;
    server_os: string;
    install_type: string;
    storage: {
        total: number;
        available: number;
    };
    database: {
        type: string;
        url: string;
        status: string;
        error: string;
        migration_status: {
            latest_migration: string;
            unapplied_migrations: string[];
        };
    };
    tasks: {
        redis_url: string;
        redis_status: string;
        redis_error: string;
        celery_status: string;
    };
    index: {
        status: string;
        error: string;
        last_modified: string;
    };
    classifier: {
        status: string;
        error: string;
        last_trained: string;
    };
    sanity_check: {
        status: string;
        error: string;
        last_run: string;
    };
}

// Search result interface
export interface SearchResult {
    total: number;
    documents: any[];
    saved_views: any[];
    tags: any[];
    correspondents: any[];
    document_types: any[];
    storage_paths: any[];
    users: any[];
    groups: any[];
    mail_rules: any[];
    mail_accounts: any[];
    workflows: any[];
    custom_fields: any[];
}

type DocumentsByYear = {
    year: number;
    count: number;
};

type DocumentsByMonth = DocumentsByYear & {
    month: number;
};

type DocumentFileTypeCounts = {
    mime_type: string;
    mime_type_count: number;
};

type DocumentTypeCounts = {
    document_type__name: string;
    document_type_count: number;
};

type CorrespondentCounts = {
    correspondent__name: string;
    correspondent_count: number;
};

type TagCounts = {
    tag__name: string;
    tag_count: number;
};

export interface Statistics {
    documents_by_month: DocumentsByMonth[];
    documents_by_year: DocumentsByYear[];
    inbox_count: number;
    document_file_type_counts: DocumentFileTypeCounts[];
    document_type_counts: DocumentTypeCounts[];
    tag_counts: TagCounts[];
    correspondent_counts: CorrespondentCounts[];
}

export interface Task {
    id: number;
    task_id: string;
    task_name: string;
    status: string;
    result: any;
    date_created: string;
    date_done: string;
}

export interface Acknowledge {
    tasks: number[];
}

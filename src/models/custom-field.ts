import { DataType } from "./common";

export interface CustomField {
    id: number; // Read-only
    name: string;
    data_type: DataType;
    extra_data: any | null; // Extra data for the custom field, such as select options
    document_count: number; // Read-only
}

export interface CustomFieldRequest {
    name: string;
    data_type: DataType;
    extra_data?: any | null;
}

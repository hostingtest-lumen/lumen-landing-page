export interface Lead {
    name: string;
    lead_name: string;
    title: string;
    mobile_no: string;
    email_id: string;
    status: string;
    creation: string;
    // Multi-pipeline support
    pipelineId?: string;        // Which pipeline this lead belongs to
    columnId?: string;          // Which column within the pipeline
    source?: string;            // Lead source (website, referral, etc.)
    value?: number;             // Estimated deal value
    assignedTo?: string;        // Team member assigned
    createdAt?: string;         // ISO date
    lastContactedAt?: string;   // Last contact date
    notes?: string;             // Quick notes
    tags?: string[];            // Tags for filtering
    [key: string]: any;
}

export const LEAD_STATUSES = [
    { id: "Lead", title: "Nuevos", color: "bg-gray-100", textColor: "text-gray-700" },
    { id: "Open", title: "En Revisión", color: "bg-blue-50", textColor: "text-blue-700" },
    { id: "Replied", title: "Contactados", color: "bg-indigo-50", textColor: "text-indigo-700" },
    { id: "Opportunity", title: "Oportunidad", color: "bg-yellow-50", textColor: "text-yellow-700" },
    { id: "Quotation", title: "Cotización", color: "bg-purple-50", textColor: "text-purple-700" },
    { id: "Interested", title: "Interesados", color: "bg-green-50", textColor: "text-green-700" },
    { id: "Lost Lead", title: "Perdidos", color: "bg-red-50", textColor: "text-red-700" },
];

// Task Management
export interface Task {
    id: string;
    title: string;
    description?: string;
    status: 'Open' | 'Working' | 'Pending Review' | 'Completed' | 'Cancelled';
    priority: 'Low' | 'Medium' | 'High' | 'Urgent';
    dueDate?: string;
    assignedTo?: string;
    tags?: string[];
    project?: string;
    subtasks?: Subtask[];
    attachments?: Attachment[];
}

export interface Subtask {
    id: string;
    title: string;
    completed: boolean;
}

export interface Comment {
    id: string;
    content: string;
    author: string;
    createdAt: string;
}

export interface Attachment {
    id: string;
    fileName: string;
    fileUrl: string;
    uploadedBy: string;
    uploadedAt: string;
}

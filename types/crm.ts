export interface Lead {
    name: string;
    lead_name: string;
    title: string;
    mobile_no: string;
    email_id: string;
    status: string;
    creation: string;
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

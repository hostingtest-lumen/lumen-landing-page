export interface ERPNextDoc {
    name: string;
    owner: string;
    creation: string;
    modified: string;
    idx: number;
}

export interface ERPNextCustomer extends ERPNextDoc {
    customer_name: string;
    customer_group: string;
    territory: string;
    customer_type: string;
}

export interface ERPNextInvoice extends ERPNextDoc {
    customer: string;
    base_grand_total: number;
    grand_total: number;
    status: 'Paid' | 'Unpaid' | 'Overdue' | 'Draft' | 'Cancelled' | 'Return';
    due_date: string;
    posting_date: string;
    currency: string;
}

export interface ERPNextPayment extends ERPNextDoc {
    party: string; // Customer Name
    party_type: 'Customer' | 'Supplier';
    paid_amount: number;
    received_amount: number;
    payment_type: 'Receive' | 'Pay';
    status: string;
    posting_date: string;
}

export interface ERPNextTask extends ERPNextDoc {
    subject: string;
    description: string;
    status: 'Open' | 'Working' | 'Pending Review' | 'Completed' | 'Cancelled';
    exp_end_date: string;
    priority: 'Low' | 'Medium' | 'High';
    customer?: string; // Link to Customer
}

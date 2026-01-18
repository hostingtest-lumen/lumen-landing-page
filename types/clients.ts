export interface Client {
    id: string;      // Internal ID (e.g., 'hsa')
    name: string;    // Full Name
    erpId: string;   // ERPNext ID reference
    token: string;   // Secret access token for URL
    logo?: string;   // Optional logo URL
    instagram?: string;    // Instagram handle (sin @)
    industry?: string;     // Rubro/Industria
    contactPhone?: string; // Teléfono de contacto
    createdAt?: string;    // ISO date de creación
}

export const SEED_CLIENTS: Client[] = [
    {
        id: 'hsa',
        name: 'Fundación Hospital San Antonio de Carora',
        erpId: 'CUST-001',
        token: 'hsa-portal-x9z'
    },
    {
        id: 'sjt',
        name: 'Hermanas de San José de Tarbes',
        erpId: 'CUST-002',
        token: 'sjt-portal-v2a'
    },
    {
        id: 'adonay',
        name: 'Adonay Travel',
        erpId: 'CUST-003',
        token: 'adonay-portal-m4k'
    },
    {
        id: 'asilo',
        name: 'Asilo La Providencia',
        erpId: 'CUST-004',
        token: 'asilo-portal-q7w'
    },
    {
        id: 'tecno',
        name: 'TecnoSmart VZL',
        erpId: 'CUST-005',
        token: 'tecno-portal-b1r'
    }
];

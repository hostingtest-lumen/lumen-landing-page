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


export type UserRole =
    | 'admin'
    | 'programmer'
    | 'community_manager'
    | 'content_creator'
    | 'spiritual_companion'
    | 'strategist'
    | 'designer'
    | 'sales';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
    bio?: string;
    location?: string;
    phone?: string;
}

export const ROLE_LABELS: Record<UserRole, string> = {
    'admin': 'Administrador',
    'programmer': 'Programador',
    'community_manager': 'Community Manager',
    'content_creator': 'Creador de Contenido',
    'spiritual_companion': 'Acompañante Espiritual',
    'strategist': 'Estratega',
    'designer': 'Diseñador',
    'sales': 'Ventas / CRM',
};

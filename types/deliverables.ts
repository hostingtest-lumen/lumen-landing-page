export type DeliverableType = 'image' | 'video' | 'document' | 'link' | 'carousel';

export type DeliverableStatus = 'pending' | 'approved' | 'changes_requested';

export interface DeliverableFeedback {
    date: string; // ISO date
    comment: string;
    author: 'client' | 'team';
}

export interface Deliverable {
    id: string;
    title: string;
    clientName: string; // Keeps name for legacy/display
    clientId?: string;  // Link to Real Client ID
    type: DeliverableType;
    url: string; // Primary URL (or cover for carousel)
    carouselUrls?: string[]; // Extra slides for carousel
    status: DeliverableStatus;
    createdAt: string;
    feedback?: DeliverableFeedback[];
    description?: string;
}

export const MOCK_DELIVERABLES: Deliverable[] = [
    {
        id: 'del-001',
        title: 'Reel Lanzamiento: Semana Santa',
        clientName: 'Parroquia San José',
        type: 'video',
        url: 'https://cdn.pixabay.com/vimeo/328940142/catedral-21223.mp4?width=1280&hash=d3c0d6cfa9c206d884738596660f6439243764b8', // Placeholder video
        status: 'pending',
        createdAt: '2025-12-10T10:00:00Z',
        description: 'Propuesta de edición para el reel de convocatoria.'
    },
    {
        id: 'del-002',
        title: 'Flyer Concierto Adoración',
        clientName: 'Grupo Joven',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2073&auto=format&fit=crop', // Placeholder image
        status: 'approved',
        createdAt: '2025-12-08T15:30:00Z',
        description: 'Versión final con los colores corregidos.'
    }
];

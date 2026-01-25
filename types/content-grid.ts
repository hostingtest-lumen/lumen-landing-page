export type Platform = 'instagram' | 'facebook' | 'tiktok' | 'linkedin';
export type ContentType = 'post' | 'reel' | 'story' | 'carousel';
export type GridStatus = 'draft' | 'pending_approval' | 'approved' | 'published';

export interface ContentGridItem {
    id: string;
    clientId: string;
    date: string; // ISO Date YYYY-MM-DD
    platforms: Platform[];
    type: ContentType;
    concept: string;
    caption?: string;
    instructions?: string;
    assets?: string[]; // URLs of uploaded files
    status: GridStatus;
    notes?: string;
}

export const MOCK_GRID_ITEMS: ContentGridItem[] = [];

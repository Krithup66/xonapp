export interface Icon {
  id: string;
  name: string;
  type: 'icon' | 'logo' | 'image';
  category: string;
  url: string;
  thumbnail_url?: string;
  svg_content?: string;
  metadata?: {
    width?: number;
    height?: number;
    format?: string;
    size?: number;
    colors?: string[];
  };
  tags?: string[];
  user_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateIconDto {
  name: string;
  type: 'icon' | 'logo' | 'image';
  category: string;
  url: string;
  thumbnail_url?: string;
  svg_content?: string;
  metadata?: {
    width?: number;
    height?: number;
    format?: string;
    size?: number;
    colors?: string[];
  };
  tags?: string[];
}

export interface UpdateIconDto {
  name?: string;
  category?: string;
  url?: string;
  thumbnail_url?: string;
  svg_content?: string;
  metadata?: {
    width?: number;
    height?: number;
    format?: string;
    size?: number;
    colors?: string[];
  };
  tags?: string[];
}

export interface IconQuery {
  category?: string;
  type?: 'icon' | 'logo' | 'image';
  tags?: string[];
  search?: string;
  limit?: number;
  offset?: number;
}

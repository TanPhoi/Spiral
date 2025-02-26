export type Auth = {
  email: string;
  password: string;
};

export type SignUpPayload = {
  name?: string;
  email?: string;
  phone?: string;
  industry?: string[];
  category?: string[];
  password?: string;
  confirmPassword?: string;
};

export type Brand = {
  id: string;
  name: string;
  phone: string;
  industry: string[];
  category: string[];
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
};

export type User = {
  id?: string;
  created_at?: number;
  updated_at?: number;
  phone?: string;
  dob?: string;
  creator?: User;
  deleted_at?: number | null;
  instagramFollowersNumber?:number,
  instagramFollowsCount?:number,
  instagramMediaCount?:number,
  expertises?:string []
  avatarUrl?: string;
  biography?: string;
  platform?: null | [];
  email?: string;
  connectedSocialMedias?: string[];
  role?: 'MANAGER' | 'CREATOR';
  picture?: string | null;
  name?: string;
  brand_id?: string;
  brand?: Brand;
};

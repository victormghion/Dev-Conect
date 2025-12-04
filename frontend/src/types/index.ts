export interface User {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  bio?: string;
  avatar?: string;
  skills?: string[];
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  followers?: User[];
  following?: User[];
  followersCount?: number;
  followingCount?: number;
  postsCount?: number;
  isVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  _id: string;
  title: string;
  description: string;
  content?: string;
  author: User;
  images?: string[];
  tags?: string[];
  technologies?: string[];
  githubRepo?: string;
  liveDemo?: string;
  likes: Like[];
  comments: Comment[];
  views: number;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Like {
  user: User;
  createdAt: string;
}

export interface Comment {
  _id: string;
  user: User;
  text: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface PaginationResponse<T> {
  success: boolean;
  data: T[];
  posts?: T[]; // Para compatibilidade com backend
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
import api from './api';
import { Post, PaginationResponse } from '../types';

export const postService = {
  async createPost(postData: FormData): Promise<{ success: boolean; post: Post }> {
    const response = await api.post('/posts', postData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getPosts(page = 1, limit = 10): Promise<PaginationResponse<Post>> {
    const response = await api.get(`/posts?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getPost(id: string): Promise<{ success: boolean; post: Post }> {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  async updatePost(id: string, postData: FormData): Promise<{ success: boolean; post: Post }> {
    const response = await api.put(`/posts/${id}`, postData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deletePost(id: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },

  async toggleLike(id: string): Promise<{ success: boolean; post: Post }> {
    const response = await api.post(`/posts/${id}/like`);
    return response.data;
  },

  async addComment(id: string, text: string): Promise<{ success: boolean; post: Post }> {
    const response = await api.post(`/posts/${id}/comment`, { text });
    return response.data;
  },

  async getUserPosts(userId: string, page = 1, limit = 10): Promise<PaginationResponse<Post>> {
    const response = await api.get(`/posts/user/${userId}?page=${page}&limit=${limit}`);
    return response.data;
  }
};
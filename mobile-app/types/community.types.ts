/**
 * Community Types - ประเภทข้อมูลสำหรับระบบชุมชน
 */

import { User } from './user.types';

/**
 * Story = โพสต์ล่าสุดของ user ที่ติดตาม
 * สตอรี่จะแสดงเป็นโพสต์ล่าสุดที่ user โพสต์
 */
export interface Story {
  id: string;
  userId: string;
  user: User;
  postId: string; // ID ของโพสต์ที่ใช้เป็นสตอรี่
  imageUrl: string; // ภาพจากโพสต์ล่าสุด
  createdAt: string; // เวลาที่โพสต์
  expiresAt?: string; // ไม่จำเป็นเพราะสตอรี่ = โพสต์ล่าสุด
  hasNewStory: boolean; // มีสตอรี่ใหม่หรือไม่
}

export interface Post {
  id: string;
  userId: string;
  user: User;
  text: string;
  media?: PostMedia[];
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isFollowing: boolean; // กำลังติดตาม user นี้หรือไม่
  isStory: boolean; // โพสต์นี้เป็นสตอรี่หรือไม่ (โพสต์พร้อมสตอรี่)
  createdAt: string;
  updatedAt: string;
}

export interface PostMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  user: User;
  text: string;
  likes: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PostInteraction {
  postId: string;
  userId: string;
  type: 'like' | 'comment' | 'share';
  createdAt: string;
}

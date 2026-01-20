/**
 * User Types - ประเภทข้อมูลสำหรับระบบผู้ใช้
 * ใช้สำหรับ Community และระบบอื่นๆ
 */

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  followersCount?: number;
  followingCount?: number;
  postsCount?: number;
  isFollowing?: boolean; // กำลังติดตาม user นี้หรือไม่
  isFollowedBy?: boolean; // user นี้ติดตามเราหรือไม่
}

/**
 * Follow Relationship - สำหรับระบบติดตาม
 */
export interface FollowRelationship {
  id: string;
  followerId: string; // คนที่ติดตาม
  followingId: string; // คนที่ถูกติดตาม
  createdAt: string;
}

export interface CommunityUser {
  id: string;
  name: string;
  avatar?: string;
  username?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  token?: string;
}

export interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

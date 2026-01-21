/**
 * ICommunityService Interface
 * Interface สำหรับ Community Service ตามกฎ Interface-First
 * Business logic และ API calls ต้องอยู่ใน Service layer ไม่ใช่ใน UI
 */

import { Post, Comment, Story } from '../types/community.types';

/**
 * Posts Response
 */
export interface PostsResponse {
  posts: Post[];
  total: number;
  hasMore: boolean;
}

/**
 * Comments Response
 */
export interface CommentsResponse {
  comments: Comment[];
  total: number;
}

/**
 * Stories Response
 */
export interface StoriesResponse {
  stories: Story[];
  total: number;
}

/**
 * Create Post Request
 */
export interface CreatePostRequest {
  text: string;
  media?: Array<{
    type: 'image' | 'video';
    url: string;
    thumbnailUrl?: string;
  }>;
  isStory?: boolean;
}

/**
 * Create Comment Request
 */
export interface CreateCommentRequest {
  postId: string;
  text: string;
}

/**
 * Community Service Interface
 * กำหนด contract สำหรับ Community Service
 */
export interface ICommunityService {
  /**
   * ดึงข้อมูล posts (feed)
   * @param feedType - ประเภท feed ('forYou' | 'following')
   * @param page - หน้า (pagination)
   * @param limit - จำนวนต่อหน้า
   * @returns Promise<PostsResponse>
   */
  getPosts(feedType: 'forYou' | 'following', page?: number, limit?: number): Promise<PostsResponse>;

  /**
   * ดึงข้อมูล post ตาม ID
   * @param id - Post ID
   * @returns Promise<Post>
   */
  getPost(id: string): Promise<Post>;

  /**
   * สร้าง post ใหม่
   * @param data - ข้อมูล post ที่ต้องการสร้าง
   * @returns Promise<Post>
   */
  createPost(data: CreatePostRequest): Promise<Post>;

  /**
   * ลบ post
   * @param id - Post ID
   * @returns Promise<void>
   */
  deletePost(id: string): Promise<void>;

  /**
   * Like/Unlike post
   * @param postId - Post ID
   * @returns Promise<Post>
   */
  toggleLike(postId: string): Promise<Post>;

  /**
   * ดึงข้อมูล comments ของ post
   * @param postId - Post ID
   * @param page - หน้า (pagination)
   * @param limit - จำนวนต่อหน้า
   * @returns Promise<CommentsResponse>
   */
  getComments(postId: string, page?: number, limit?: number): Promise<CommentsResponse>;

  /**
   * สร้าง comment ใหม่
   * @param data - ข้อมูล comment ที่ต้องการสร้าง
   * @returns Promise<Comment>
   */
  createComment(data: CreateCommentRequest): Promise<Comment>;

  /**
   * ดึงข้อมูล stories
   * @returns Promise<StoriesResponse>
   */
  getStories(): Promise<StoriesResponse>;

  /**
   * Follow/Unfollow user
   * @param userId - User ID
   * @returns Promise<boolean> - true = following, false = unfollowed
   */
  toggleFollow(userId: string): Promise<boolean>;
}

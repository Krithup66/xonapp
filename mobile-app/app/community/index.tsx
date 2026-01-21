/**
 * Community Screen - หน้าชุมชน
 * Threads-style UI - Timeline feed design
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BottomNavigation } from '../../components/shared/BottomNavigation';
import { ThreadPost } from '../../components/community/ThreadPost';
import { CreatePostModal } from '../../components/community/CreatePostModal';
import { scaleWidth, scaleFont } from '../../utils/dimensions';
import { hapticImpact } from '../../utils/haptics';
import { CommunitySkeleton } from '../../components/shared/SkeletonLoader';
import Svg, { Path } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BASE_SCREEN_WIDTH = 375;

const scale = (size: number) => {
  return (size / BASE_SCREEN_WIDTH) * SCREEN_WIDTH;
};

// Plus Icon for FAB
const PlusIcon = ({ size = 24, color = '#FFFFFF' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 5V19M5 12H19"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Sample thread data
const THREADS = [
  {
    id: '1',
    author: {
      name: 'SniperX',
      username: 'sniperx_trader',
      avatar: undefined,
    },
    content: 'วันนี้ตลาดหุ้นไทยปิดที่ 1,650 จุด เพิ่มขึ้น 0.5% จากเมื่อวาน ดูเหมือนว่าตลาดจะเริ่มฟื้นตัวแล้วนะครับ 📈',
    timestamp: '2 ชม.',
    likes: 24,
    replies: 5,
    reposts: 3,
    isLiked: false,
  },
  {
    id: '2',
    author: {
      name: 'Crypto Pro',
      username: 'crypto_pro_th',
      avatar: undefined,
    },
    content: 'Bitcoin แตะ $45,000 แล้ว! 🚀 ใครที่ถืออยู่ก็คงยิ้มได้เลย ตอนนี้ดูเหมือนว่า bull run จะมาแล้ว',
    timestamp: '4 ชม.',
    likes: 156,
    replies: 23,
    reposts: 12,
    isLiked: true,
  },
  {
    id: '3',
    author: {
      name: 'Luxury Life',
      username: 'luxury_life_th',
      avatar: undefined,
    },
    content: 'เพิ่งได้ Rolex Submariner มาใหม่! รู้สึกดีมากๆ 😍 ใครที่กำลังมองหานาฬิกาหรู แนะนำเลย',
    timestamp: '6 ชม.',
    likes: 89,
    replies: 8,
    reposts: 4,
    isLiked: false,
  },
  {
    id: '4',
    author: {
      name: 'Fit Guru',
      username: 'fit_guru_th',
      avatar: undefined,
    },
    content: 'ออกกำลังกายมา 3 เดือนแล้ว น้ำหนักลดไป 10 กิโล! 💪 ใครที่กำลังเริ่มต้นอย่าท้อแท้นะ สู้ๆ',
    timestamp: '8 ชม.',
    likes: 342,
    replies: 45,
    reposts: 28,
    isLiked: false,
  },
  {
    id: '5',
    author: {
      name: 'Mind Trader',
      username: 'mind_trader',
      avatar: undefined,
    },
    content: 'จิตวิทยาการเทรดสำคัญมาก! อย่าให้อารมณ์ควบคุมการตัดสินใจของคุณ ตั้งกฎการเทรดและทำตามมันเสมอ',
    timestamp: '12 ชม.',
    likes: 67,
    replies: 12,
    reposts: 7,
    isLiked: true,
  },
  {
    id: '6',
    author: {
      name: 'NFT Expert',
      username: 'nft_expert_th',
      avatar: undefined,
    },
    content: 'NFT market กำลังร้อนแรง! แต่ต้องระวังด้วยนะ มี scam เยอะมาก ศึกษาให้ดีก่อนลงทุน',
    timestamp: '1 วันที่แล้ว',
    likes: 45,
    replies: 9,
    reposts: 5,
    isLiked: false,
  },
];

interface Thread {
  id: string;
  author: {
    name: string;
    username: string;
    avatar?: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  replies: number;
  reposts: number;
  isLiked: boolean;
}

export default function CommunityScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [createPostVisible, setCreatePostVisible] = useState(false);
  const [activeFeed, setActiveFeed] = useState<'forYou' | 'following'>('forYou');
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from CommunityService (ตามกฎ: UI เรียกใช้ Service ไม่ใช่ API โดยตรง)
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // ใช้ CommunityService แทนการเรียก API โดยตรง
        const { communityService } = await import('../../services/CommunityService');
        const postsResponse = await communityService.getPosts(activeFeed);
        
        // Transform posts to threads format (temporary until backend is ready)
        const transformedThreads: Thread[] = postsResponse.posts.map((post) => ({
          id: post.id,
          author: {
            name: post.user.name || 'Unknown',
            username: post.user.username || 'unknown',
            avatar: post.user.avatar,
          },
          content: post.text,
          timestamp: formatTimestamp(post.createdAt),
          likes: post.likes,
          replies: post.comments,
          reposts: post.shares,
          isLiked: post.isLiked,
        }));
        
        // ใช้ข้อมูลจาก API หรือ fallback เป็น demo data
        setThreads(transformedThreads.length > 0 ? transformedThreads : THREADS);
      } catch (error: any) {
        // Error handling: ใช้ demo data ถ้า API ล้มเหลว
        console.error('Error loading community data:', error.message);
        setThreads(THREADS);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [activeFeed]);

  // Helper: Format timestamp
  const formatTimestamp = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) return 'ไม่กี่นาทีที่แล้ว';
    if (diffHours < 24) return `${diffHours} ชม.`;
    if (diffDays === 1) return '1 วันที่แล้ว';
    return `${diffDays} วันที่แล้ว`;
  };

  // Handle create post - ใช้ CommunityService (ตามกฎ: Business logic อยู่ใน Service)
  const handleCreatePost = async (data: { text: string; media?: string[]; isStory: boolean }) => {
    try {
      const { communityService } = await import('../../services/CommunityService');
      await communityService.createPost({
        text: data.text,
        media: data.media?.map(url => ({ type: 'image' as const, url })),
        isStory: data.isStory,
      });
      
      // Reload posts after creating
      const postsResponse = await communityService.getPosts(activeFeed);
      const transformedThreads: Thread[] = postsResponse.posts.map((post) => ({
        id: post.id,
        author: {
          name: post.user.name || 'Unknown',
          username: post.user.username || 'unknown',
          avatar: post.user.avatar,
        },
        content: post.text,
        timestamp: formatTimestamp(post.createdAt),
        likes: post.likes,
        replies: post.comments,
        reposts: post.shares,
        isLiked: post.isLiked,
      }));
      setThreads(transformedThreads);
      setCreatePostVisible(false);
    } catch (error: any) {
      // Error handling: แสดง error message (ตามกฎ: user-friendly error)
      console.error('Error creating post:', error.message);
      // TODO: แสดง error dialog แก่ user
    }
  };

  const handlePostPress = (id: string) => {
    router.push(`/community/${id}`);
  };

  // Show skeleton screen while loading
  if (isLoading) {
    return <CommunitySkeleton />;
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ชุมชน</Text>
        
        {/* Feed Selector */}
        <View style={styles.feedSelector}>
          <TouchableOpacity
            style={[styles.feedTab, activeFeed === 'forYou' && styles.feedTabActive]}
            onPress={() => {
              hapticImpact('light');
              setActiveFeed('forYou');
            }}
          >
            <Text style={[styles.feedTabText, activeFeed === 'forYou' && styles.feedTabTextActive]}>
              สำหรับคุณ
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.feedTab, activeFeed === 'following' && styles.feedTabActive]}
            onPress={() => {
              hapticImpact('light');
              setActiveFeed('following');
            }}
          >
            <Text style={[styles.feedTabText, activeFeed === 'following' && styles.feedTabTextActive]}>
              ติดตาม
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Threads Feed */}
      <ScrollView
        style={styles.feed}
        contentContainerStyle={styles.feedContent}
        showsVerticalScrollIndicator={false}
      >
        {threads.map((thread) => (
          <ThreadPost
            key={thread.id}
            id={thread.id}
            author={thread.author}
            content={thread.content}
            timestamp={thread.timestamp}
            likes={thread.likes}
            replies={thread.replies}
            reposts={thread.reposts}
            isLiked={thread.isLiked}
            onPress={() => handlePostPress(thread.id)}
            onLike={() => {}}
            onReply={() => handlePostPress(thread.id)}
            onRepost={() => {}}
          />
        ))}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + scale(80) }]}
        onPress={() => {
          hapticImpact('medium');
          setCreatePostVisible(true);
        }}
        activeOpacity={0.8}
      >
        <PlusIcon size={scale(24)} />
      </TouchableOpacity>

      {/* Create Post Modal */}
      <CreatePostModal
        visible={createPostVisible}
        onClose={() => setCreatePostVisible(false)}
        onSubmit={handleCreatePost}
      />

      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontFamily: 'Prompt-Bold',
    fontSize: scaleFont(28),
    color: '#FFFFFF',
    marginBottom: scale(12),
  },
  feedSelector: {
    flexDirection: 'row',
    gap: scale(8),
  },
  feedTab: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(8),
    borderRadius: scale(20),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  feedTabActive: {
    backgroundColor: '#FFFFFF',
  },
  feedTabText: {
    fontFamily: 'Prompt-Medium',
    fontSize: scaleFont(14),
    color: 'rgba(255, 255, 255, 0.6)',
  },
  feedTabTextActive: {
    color: '#000000',
  },
  feed: {
    flex: 1,
  },
  feedContent: {
    paddingBottom: scale(100),
  },
  fab: {
    position: 'absolute',
    right: scale(20),
    width: scale(56),
    height: scale(56),
    borderRadius: scale(28),
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

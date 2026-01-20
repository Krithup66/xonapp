/**
 * Modern Post Card Component
 * Card design ที่ทันสมัยด้วย glassmorphism และ floating effects
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Post } from '../../../types/community.types';
import { MODERN_COLORS, MODERN_SIZES, MODERN_EFFECTS } from '../../../config/modern-community.config';
import { FollowButton } from '../FollowButton';
import { ImageViewer } from '../ImageViewer';
import Svg, { Path, Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BASE_SCREEN_WIDTH = 375;

const scale = (size: number) => {
  return (size / BASE_SCREEN_WIDTH) * SCREEN_WIDTH;
};

const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'เมื่อสักครู่';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} นาที`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ชม.`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} วันที่แล้ว`;
  return `${Math.floor(diffInSeconds / 604800)} สัปดาห์ที่แล้ว`;
};

// Modern Icons
const LikeIcon = ({ size = 24, filled = false }: { size?: number; filled?: boolean }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? 'url(#likeGradient)' : 'none'}>
    <Defs>
      <SvgLinearGradient id="likeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#FF6B9D" />
        <Stop offset="100%" stopColor="#C44569" />
      </SvgLinearGradient>
    </Defs>
    <Path
      d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7564 11.2728 22.0329 10.6054C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.0621 22.0329 6.39464C21.7564 5.72718 21.351 5.12075 20.84 4.61Z"
      stroke={filled ? '#FF6B9D' : MODERN_COLORS.textSecondary}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const CommentIcon = ({ size = 24 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
      stroke={MODERN_COLORS.textSecondary}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const ShareIcon = ({ size = 24 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 5.12549 15.0077 5.24919 15.0227 5.37063L8.08261 9.79859C7.54305 9.29221 6.80891 9 6 9C4.34315 9 3 10.3431 3 12C3 13.6569 4.34315 15 6 15C6.80891 15 7.54305 14.7078 8.08261 14.2014L15.0227 18.6294C15.0077 18.7508 15 18.8745 15 19C15 20.6569 16.3431 22 18 22C19.6569 22 21 20.6569 21 19C21 17.3431 19.6569 16 18 16C16.3431 16 15 17.3431 15 19C15 19.1255 15.0077 19.2492 15.0227 19.3706L8.08261 14.9426C7.54305 15.449 6.80891 15.7412 6 15.7412C4.34315 15.7412 3 14.398 3 12.7412C3 11.0843 4.34315 9.74121 6 9.74121C6.80891 9.74121 7.54305 10.0334 8.08261 10.5398L15.0227 6.11184C15.0077 5.9904 15 5.8667 15 5.74121C15 4.08436 16.3431 2.74121 18 2.74121Z"
      fill={MODERN_COLORS.textSecondary}
    />
  </Svg>
);

interface ModernPostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
  onFollow: (userId: string) => void;
  onUserPress: (userId: string) => void;
}

export const ModernPostCard: React.FC<ModernPostCardProps> = ({
  post,
  onLike,
  onComment,
  onShare,
  onFollow,
  onUserPress,
}) => {
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [imageViewerIndex, setImageViewerIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const handleImagePress = (index: number) => {
    if (post.media && post.media.length > 0) {
      setImageViewerIndex(index);
      setImageViewerVisible(true);
    }
  };

  const handleScroll = (event: any) => {
    if (post.media && post.media.length > 1) {
      const contentOffsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(contentOffsetX / (SCREEN_WIDTH - scale(40)));
      setCurrentImageIndex(index);
    }
  };

  return (
    <View style={styles.cardContainer}>
      {/* Glassmorphism Card */}
      <View style={[styles.card, MODERN_EFFECTS.shadowMD]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.userInfo}
            onPress={() => onUserPress(post.userId)}
            activeOpacity={0.7}
          >
            {/* Avatar with gradient border */}
            <LinearGradient
              colors={[...MODERN_COLORS.primaryGradient]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatarBorder}
            >
              <View style={styles.avatar}>
                {post.user.avatar ? (
                  <Image source={{ uri: post.user.avatar }} style={styles.avatarImage} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarPlaceholderText}>
                      {post.user.name?.charAt(0) || '?'}
                    </Text>
                  </View>
                )}
              </View>
            </LinearGradient>
            
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{post.user.name}</Text>
              <Text style={styles.timeAgo}>{formatTimeAgo(post.createdAt)}</Text>
            </View>
          </TouchableOpacity>
          
          <View style={styles.headerRight}>
            {!post.isFollowing && post.userId !== 'current-user-id' && (
              <FollowButton
                isFollowing={post.isFollowing}
                onPress={() => onFollow(post.userId)}
              />
            )}
            <TouchableOpacity style={styles.moreButton}>
              <Text style={styles.moreIcon}>⋯</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        {post.text && (
          <Text style={styles.postText}>{post.text}</Text>
        )}

        {/* Story Badge */}
        {post.isStory && (
          <View style={styles.storyBadge}>
            <LinearGradient
              colors={[...MODERN_COLORS.primaryGradient]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.storyBadgeGradient}
            >
              <Text style={styles.storyBadgeText}>📸 สตอรี่</Text>
            </LinearGradient>
          </View>
        )}

        {/* Media */}
        {post.media && post.media.length > 0 && (
          <View style={styles.mediaContainer}>
            {post.media.length === 1 ? (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => handleImagePress(0)}
              >
                <Image
                  source={{ uri: post.media[0].url }}
                  style={styles.singleImage}
                />
              </TouchableOpacity>
            ) : (
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                style={styles.mediaScrollView}
                contentContainerStyle={styles.mediaScrollContent}
              >
                {post.media.map((media, index) => (
                  <TouchableOpacity
                    key={media.id || index}
                    activeOpacity={0.9}
                    onPress={() => handleImagePress(index)}
                    style={styles.mediaItem}
                  >
                    <Image source={{ uri: media.url }} style={styles.mediaImage} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
            {post.media.length > 1 && (
              <View style={styles.imageCounter}>
                <Text style={styles.imageCounterText}>
                  {currentImageIndex + 1} / {post.media.length}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Interactions */}
        <View style={styles.interactions}>
          <TouchableOpacity
            style={styles.interactionButton}
            onPress={() => onLike(post.id)}
          >
            <LikeIcon size={scale(24)} filled={post.isLiked} />
            {post.likes > 0 && (
              <Text style={[styles.interactionCount, post.isLiked && styles.interactionCountActive]}>
                {post.likes}
              </Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.interactionButton}
            onPress={() => onComment(post.id)}
          >
            <CommentIcon size={scale(24)} />
            {post.comments > 0 && (
              <Text style={styles.interactionCount}>{post.comments}</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.interactionButton}
            onPress={() => onShare(post.id)}
          >
            <ShareIcon size={scale(24)} />
          </TouchableOpacity>
          
          <View style={styles.spacer} />
        </View>
      </View>

      {/* Image Viewer */}
      {post.media && post.media.length > 0 && (
        <ImageViewer
          visible={imageViewerVisible}
          images={post.media.map(m => m.url)}
          initialIndex={imageViewerIndex}
          onClose={() => setImageViewerVisible(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: MODERN_SIZES.spacingLG,
    paddingHorizontal: MODERN_SIZES.spacingMD,
  },
  card: {
    backgroundColor: MODERN_COLORS.glassBackground,
    borderRadius: MODERN_SIZES.radiusLG,
    borderWidth: 1,
    borderColor: MODERN_COLORS.glassBorder,
    padding: MODERN_SIZES.cardPadding,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: MODERN_SIZES.spacingMD,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: MODERN_SIZES.spacingSM,
    flex: 1,
  },
  avatarBorder: {
    width: MODERN_SIZES.avatarSize,
    height: MODERN_SIZES.avatarSize,
    borderRadius: MODERN_SIZES.radiusFull,
    padding: 2,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: MODERN_SIZES.radiusFull,
    overflow: 'hidden',
    backgroundColor: MODERN_COLORS.backgroundSecondary,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: MODERN_COLORS.backgroundTertiary,
  },
  avatarPlaceholderText: {
    fontFamily: 'Prompt-Bold',
    fontSize: scale(18),
    color: MODERN_COLORS.textPrimary,
  },
  userDetails: {
    gap: scale(2),
    flex: 1,
  },
  userName: {
    fontFamily: 'Prompt-Medium',
    fontSize: scale(15),
    color: MODERN_COLORS.textPrimary,
  },
  timeAgo: {
    fontFamily: 'Prompt-Regular',
    fontSize: scale(12),
    color: MODERN_COLORS.textTertiary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: MODERN_SIZES.spacingSM,
  },
  moreButton: {
    padding: scale(4),
  },
  moreIcon: {
    fontFamily: 'Prompt-Regular',
    fontSize: scale(20),
    color: MODERN_COLORS.textSecondary,
  },
  postText: {
    fontFamily: 'Prompt-Regular',
    fontSize: scale(15),
    color: MODERN_COLORS.textPrimary,
    lineHeight: scale(22),
    marginBottom: MODERN_SIZES.spacingMD,
  },
  storyBadge: {
    alignSelf: 'flex-start',
    marginBottom: MODERN_SIZES.spacingMD,
    borderRadius: MODERN_SIZES.radiusMD,
    overflow: 'hidden',
  },
  storyBadgeGradient: {
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
  },
  storyBadgeText: {
    fontFamily: 'Prompt-Medium',
    fontSize: scale(11),
    color: MODERN_COLORS.textPrimary,
  },
  mediaContainer: {
    marginBottom: MODERN_SIZES.spacingMD,
    borderRadius: MODERN_SIZES.radiusMD,
    overflow: 'hidden',
    position: 'relative',
  },
  mediaScrollView: {
    width: '100%',
  },
  mediaScrollContent: {
    gap: MODERN_SIZES.spacingSM,
  },
  mediaItem: {
    width: SCREEN_WIDTH - scale(80), // screen width minus padding
    marginRight: MODERN_SIZES.spacingSM,
  },
  singleImage: {
    width: '100%',
    height: scale(300),
    borderRadius: MODERN_SIZES.radiusMD,
  },
  mediaImage: {
    width: '100%',
    height: scale(300),
    borderRadius: MODERN_SIZES.radiusMD,
  },
  imageCounter: {
    position: 'absolute',
    top: scale(12),
    right: scale(12),
    paddingHorizontal: scale(10),
    paddingVertical: scale(6),
    borderRadius: MODERN_SIZES.radiusMD,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    ...MODERN_EFFECTS.glass,
  },
  imageCounterText: {
    fontFamily: 'Prompt-Medium',
    fontSize: scale(11),
    color: MODERN_COLORS.textPrimary,
  },
  interactions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: MODERN_SIZES.spacingMD,
    paddingTop: MODERN_SIZES.spacingSM,
    borderTopWidth: 1,
    borderTopColor: MODERN_COLORS.glassBorder,
  },
  interactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    padding: scale(4),
  },
  interactionCount: {
    fontFamily: 'Prompt-Medium',
    fontSize: scale(13),
    color: MODERN_COLORS.textSecondary,
  },
  interactionCountActive: {
    color: MODERN_COLORS.interactive,
  },
  spacer: {
    flex: 1,
  },
});

/**
 * Post Item Component
 * แสดงโพสต์ใน feed
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import { Post } from '../../types/community.types';
import { COMMUNITY_COLORS, COMMUNITY_SIZES, COMMUNITY_SPACING } from '../../config/community-design.config';
import { scaleWidth, scaleFont } from '../../utils/dimensions';
import Svg, { Path, Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { FollowButton } from './FollowButton';
import { ImageViewer } from './ImageViewer';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BASE_SCREEN_WIDTH = 375;

const scale = (size: number) => {
  return (size / BASE_SCREEN_WIDTH) * SCREEN_WIDTH;
};

// Helper function to format time ago
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

/**
 * Like/Heart Icon
 */
const LikeIcon = ({ size = 24, color = '#FFFFFF', filled = false }: { size?: number; color?: string; filled?: boolean }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'}>
    <Path
      d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7564 11.2728 22.0329 10.6054C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.0621 22.0329 6.39464C21.7564 5.72718 21.351 5.12075 20.84 4.61Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Comment Icon
 */
const CommentIcon = ({ size = 24, color = '#FFFFFF' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Share Icon
 */
const ShareIcon = ({ size = 24, color = '#FFFFFF' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 5.12549 15.0077 5.24919 15.0227 5.37063L8.08261 9.79859C7.54305 9.29221 6.80891 9 6 9C4.34315 9 3 10.3431 3 12C3 13.6569 4.34315 15 6 15C6.80891 15 7.54305 14.7078 8.08261 14.2014L15.0227 18.6294C15.0077 18.7508 15 18.8745 15 19C15 20.6569 16.3431 22 18 22C19.6569 22 21 20.6569 21 19C21 17.3431 19.6569 16 18 16C16.3431 16 15 17.3431 15 19C15 19.1255 15.0077 19.2492 15.0227 19.3706L8.08261 14.9426C7.54305 15.449 6.80891 15.7412 6 15.7412C4.34315 15.7412 3 14.398 3 12.7412C3 11.0843 4.34315 9.74121 6 9.74121C6.80891 9.74121 7.54305 10.0334 8.08261 10.5398L15.0227 6.11184C15.0077 5.9904 15 5.8667 15 5.74121C15 4.08436 16.3431 2.74121 18 2.74121Z"
      fill={color}
    />
  </Svg>
);

/**
 * Send Icon (Paper Airplane) with gradient
 */
const SendIcon = ({ size = 24 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Defs>
      <SvgLinearGradient id="sendGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#FF6B9D" />
        <Stop offset="100%" stopColor="#C44569" />
      </SvgLinearGradient>
    </Defs>
    <Path
      d="M22 2L11 13"
      stroke="url(#sendGradient)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M22 2L15 22L11 13L2 9L22 2Z"
      stroke="url(#sendGradient)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Emoji/Ghost Icon
 */
const EmojiIcon = ({ size = 24, color = '#FFFFFF' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM8.5 10C9.33 10 10 9.33 10 8.5C10 7.67 9.33 7 8.5 7C7.67 7 7 7.67 7 8.5C7 9.33 7.67 10 8.5 10ZM15.5 10C16.33 10 17 9.33 17 8.5C17 7.67 16.33 7 15.5 7C14.67 7 14 7.67 14 8.5C14 9.33 14.67 10 15.5 10ZM12 17.5C14.33 17.5 16.31 16.04 17.11 14H6.89C7.69 16.04 9.67 17.5 12 17.5Z"
      fill={color}
    />
  </Svg>
);

interface PostItemProps {
  post: Post;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
  onFollow: (userId: string) => void;
  onUserPress: (userId: string) => void;
}

export const PostItem: React.FC<PostItemProps> = ({
  post,
  onLike,
  onComment,
  onShare,
  onFollow,
  onUserPress,
}) => {
  const timeAgo = formatTimeAgo(post.createdAt);
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
      const index = Math.round(contentOffsetX / (SCREEN_WIDTH - scale(32)));
      setCurrentImageIndex(index);
    }
  };
  
  return (
    <View style={styles.postContainer}>
      {/* User Info */}
      <View style={styles.postHeader}>
        <TouchableOpacity 
          style={styles.postUserInfo}
          onPress={() => onUserPress(post.userId)}
          activeOpacity={0.7}
        >
          <View style={styles.postAvatar}>
            {post.user.avatar ? (
              <Image 
                source={{ uri: post.user.avatar }} 
                style={styles.avatarImage}
                resizeMode="cover"
              />
            ) : (
              <Svg width={COMMUNITY_SIZES.avatarSize} height={COMMUNITY_SIZES.avatarSize} viewBox="0 0 40 40">
                <Circle cx="20" cy="16" r="6" fill="#FFFFFF" opacity={0.9} />
                <Path
                  d="M9 35C9 28.5 15 24 20 24C25 24 31 28.5 31 35"
                  fill="#FFFFFF"
                  opacity={0.9}
                />
              </Svg>
            )}
          </View>
          <View style={styles.postUserDetails}>
            <Text style={styles.postUserName} numberOfLines={1}>{post.user.name}</Text>
            <Text style={styles.postTime}>{timeAgo}</Text>
          </View>
        </TouchableOpacity>
        
        <View style={styles.postHeaderRight}>
          {!post.isFollowing && post.userId !== 'current-user-id' && (
            <FollowButton
              isFollowing={post.isFollowing}
              onPress={() => onFollow(post.userId)}
            />
          )}
          <TouchableOpacity style={styles.optionsButton}>
            <Text style={styles.postOptions}>⋯</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Post Text */}
      {post.text && (
        <Text style={styles.postText}>{post.text}</Text>
      )}

      {/* Story Badge */}
      {post.isStory && (
        <View style={styles.storyBadge}>
          <Text style={styles.storyBadgeText}>📸 สตอรี่</Text>
        </View>
      )}

      {/* Media - รองรับการเลื่อนดูภาพหลายภาพ */}
      {post.media && post.media.length > 0 && (
        <View style={styles.postMediaContainer}>
          {post.media.length === 1 ? (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => handleImagePress(0)}
            >
              <Image 
                key={post.media[0].id || 0} 
                source={{ uri: post.media[0].url }} 
                style={[styles.postMedia, styles.postMediaSingle]} 
              />
            </TouchableOpacity>
          ) : (
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.postMediaScrollContainer}
              style={styles.postMediaScrollView}
              snapToInterval={SCREEN_WIDTH - scale(32)} // screen width minus padding
              decelerationRate="fast"
              onScroll={handleScroll}
              scrollEventThrottle={16}
            >
              {post.media.map((media, index) => (
                <TouchableOpacity
                  key={media.id || index}
                  activeOpacity={0.9}
                  onPress={() => handleImagePress(index)}
                  style={styles.postMediaItemWrapper}
                >
                  <Image 
                    source={{ uri: media.url }} 
                    style={[styles.postMedia, styles.postMediaScrollItem]} 
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
          {/* Image Counter - อัปเดตเมื่อเลื่อน */}
          {post.media.length > 1 && (
            <View style={styles.imageCounter}>
              <Text style={styles.imageCounterText}>
                {currentImageIndex + 1} / {post.media.length}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Image Viewer Modal */}
      {post.media && post.media.length > 0 && (
        <ImageViewer
          visible={imageViewerVisible}
          images={post.media.map(m => m.url)}
          initialIndex={imageViewerIndex}
          onClose={() => setImageViewerVisible(false)}
        />
      )}

      {/* Interaction Bar */}
      <View style={styles.postInteractions}>
        <TouchableOpacity 
          style={styles.interactionButton}
          onPress={() => onLike(post.id)}
        >
          <LikeIcon 
            size={scale(24)} 
            filled={post.isLiked} 
            color={post.isLiked ? COMMUNITY_COLORS.activeColor : COMMUNITY_COLORS.iconInactive} 
          />
          {post.likes > 0 && (
            <Text style={styles.interactionCount}>{post.likes}</Text>
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
        <TouchableOpacity style={styles.interactionButton}>
          <SendIcon size={scale(24)} />
        </TouchableOpacity>
        <View style={styles.interactionSpacer} />
        <TouchableOpacity style={styles.interactionButton}>
          <EmojiIcon size={scale(24)} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    paddingVertical: COMMUNITY_SPACING.postPadding,
    paddingHorizontal: COMMUNITY_SPACING.screenPadding,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(12),
  },
  postUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
    flex: 1,
  },
  postAvatar: {
    width: COMMUNITY_SIZES.avatarSize,
    height: COMMUNITY_SIZES.avatarSize,
    borderRadius: COMMUNITY_SIZES.avatarRadius,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  postUserDetails: {
    gap: scale(2),
    flex: 1,
  },
  postUserName: {
    fontFamily: 'Prompt-Regular',
    fontSize: COMMUNITY_SIZES.userNameText,
    color: COMMUNITY_COLORS.textWhite,
    lineHeight: scale(20),
  },
  postTime: {
    fontFamily: 'Prompt-Regular',
    fontSize: COMMUNITY_SIZES.timeText,
    color: COMMUNITY_COLORS.textGray,
  },
  postHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  optionsButton: {
    padding: scale(4),
  },
  postOptions: {
    fontFamily: 'Prompt-Regular',
    fontSize: scale(20),
    color: COMMUNITY_COLORS.textWhite,
    lineHeight: scale(24),
  },
  postText: {
    fontFamily: 'Prompt-Regular',
    fontSize: COMMUNITY_SIZES.postText,
    color: COMMUNITY_COLORS.textWhite,
    marginBottom: scale(12),
    lineHeight: scale(20),
    letterSpacing: 0.2,
  },
  storyBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 107, 157, 0.2)',
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
    borderRadius: scale(12),
    marginBottom: scale(8),
  },
  storyBadgeText: {
    fontFamily: 'Prompt-Regular',
    fontSize: scale(10),
    color: '#FF6B9D',
  },
  postMediaContainer: {
    marginBottom: scale(12),
    position: 'relative',
  },
  postMediaScrollView: {
    width: '100%',
  },
  postMediaScrollContainer: {
    gap: COMMUNITY_SPACING.postGap,
  },
  postMediaItemWrapper: {
    width: SCREEN_WIDTH - scale(32), // screen width minus padding (16*2)
    marginRight: COMMUNITY_SPACING.postGap,
  },
  postMedia: {
    borderRadius: COMMUNITY_SIZES.postMediaRadius,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  postMediaSingle: {
    width: '100%',
    height: COMMUNITY_SIZES.postMediaHeight,
  },
  postMediaScrollItem: {
    width: '100%',
    height: COMMUNITY_SIZES.postMediaHeight,
  },
  imageCounter: {
    position: 'absolute',
    top: scale(8),
    right: scale(8),
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
    borderRadius: scale(12),
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  imageCounterText: {
    fontFamily: 'Prompt-Medium',
    fontSize: scale(10),
    color: '#FFFFFF',
  },
  postInteractions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: COMMUNITY_SPACING.interactionGap,
    marginTop: scale(4),
  },
  interactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
    minWidth: scale(32),
    height: scale(32),
    justifyContent: 'center',
  },
  interactionCount: {
    fontFamily: 'Prompt-Regular',
    fontSize: scale(12),
    color: COMMUNITY_COLORS.textWhite,
  },
  interactionSpacer: {
    flex: 1,
  },
});

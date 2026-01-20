/**
 * Thread Post Component
 * โพสต์แบบ Threads - Timeline style
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { scaleWidth, scaleFont } from '../../utils/dimensions';
import { hapticImpact } from '../../utils/haptics';
import Svg, { Path } from 'react-native-svg';

import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BASE_SCREEN_WIDTH = 375;

const scale = (size: number) => {
  return (size / BASE_SCREEN_WIDTH) * SCREEN_WIDTH;
};

interface ThreadPostProps {
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
  isLiked?: boolean;
  onLike?: () => void;
  onReply?: () => void;
  onRepost?: () => void;
  onPress?: () => void;
}

// Heart Icon
const HeartIcon = ({ filled = false, size = 20 }: { filled?: boolean; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? '#EF4444' : 'none'}>
    <Path
      d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7564 11.2728 22.0329 10.6054C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.0621 22.0329 6.39464C21.7564 5.72718 21.351 5.12075 20.84 4.61Z"
      stroke={filled ? '#EF4444' : '#9CA3AF'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Reply Icon
const ReplyIcon = ({ size = 20 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 10C3 10.5304 3.21071 11.0391 3.58579 11.4142C3.96086 11.7893 4.46957 12 5 12H7L11 16V12H19C19.5304 12 20.0391 11.7893 20.4142 11.4142C20.7893 11.0391 21 10.5304 21 10V5C21 4.46957 20.7893 3.96086 20.4142 3.58579C20.0391 3.21071 19.5304 3 19 3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V10Z"
      stroke="#9CA3AF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Repost Icon
const RepostIcon = ({ size = 20 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 12C3 11.4696 3.21071 10.9609 3.58579 10.5858C3.96086 10.2107 4.46957 10 5 10H16.17L14.59 8.41C14.2143 8.03571 14.0036 7.52678 14.0036 6.99636C14.0036 6.46593 14.2143 5.957 14.59 5.58271C14.9657 5.20843 15.4746 4.99786 16.005 4.99786C16.5354 4.99786 17.0443 5.20843 17.42 5.58271L21.42 9.58271C21.7957 9.957 22.0064 10.4659 22.0064 10.9964C22.0064 11.5268 21.7957 12.0357 21.42 12.41L17.42 16.41C17.0443 16.7843 16.5354 16.9949 16.005 16.9949C15.4746 16.9949 14.9657 16.7843 14.59 16.41C14.2143 16.0357 14.0036 15.5268 14.0036 14.9964C14.0036 14.4659 14.2143 13.957 14.59 13.5827L16.17 12H5C4.46957 12 3.96086 12.2107 3.58579 12.5858C3.21071 12.9609 3 13.4696 3 14V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V14C21 13.4696 20.7893 12.9609 20.4142 12.5858C20.0391 12.2107 19.5304 12 19 12H17.17L18.59 10.59C18.9653 10.2147 19.1759 9.70578 19.1759 9.17536C19.1759 8.64493 18.9653 8.136 18.59 7.76171L14.59 3.76171C14.2147 3.38743 13.7058 3.17686 13.1754 3.17686C12.6449 3.17686 12.136 3.38743 11.7617 3.76171C11.3874 4.136 11.1769 4.64493 11.1769 5.17536C11.1769 5.70578 11.3874 6.21471 11.7617 6.589L13.17 8H5C4.46957 8 3.96086 8.21071 3.58579 8.58579C3.21071 8.96086 3 9.46957 3 10V12Z"
      fill="#9CA3AF"
    />
  </Svg>
);

export const ThreadPost: React.FC<ThreadPostProps> = ({
  author,
  content,
  timestamp,
  likes,
  replies,
  reposts,
  isLiked = false,
  onLike,
  onReply,
  onRepost,
  onPress,
}) => {
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = () => {
    hapticImpact('light');
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
    onLike?.();
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.95}
    >
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        {author.avatar ? (
          <Image source={{ uri: author.avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{author.name.charAt(0)}</Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.authorName}>{author.name}</Text>
          <Text style={styles.username}>@{author.username}</Text>
          <Text style={styles.separator}>·</Text>
          <Text style={styles.timestamp}>{timestamp}</Text>
        </View>

        {/* Post Text */}
        <Text style={styles.postText}>{content}</Text>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              hapticImpact('light');
              onReply?.();
            }}
          >
            <ReplyIcon size={scale(20)} />
            {replies > 0 && (
              <Text style={styles.actionCount}>{replies}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              hapticImpact('light');
              onRepost?.();
            }}
          >
            <RepostIcon size={scale(20)} />
            {reposts > 0 && (
              <Text style={styles.actionCount}>{reposts}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleLike}
          >
            <HeartIcon filled={liked} size={scale(20)} />
            {likeCount > 0 && (
              <Text style={[styles.actionCount, liked && styles.actionCountActive]}>
                {likeCount}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  avatarContainer: {
    marginRight: scale(12),
  },
  avatar: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
  },
  avatarPlaceholder: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: '#3F51B5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontFamily: 'Prompt-Bold',
    fontSize: scaleFont(16),
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(4),
  },
  authorName: {
    fontFamily: 'Prompt-Bold',
    fontSize: scaleFont(15),
    color: '#FFFFFF',
    marginRight: scale(4),
  },
  username: {
    fontFamily: 'Prompt-Regular',
    fontSize: scaleFont(15),
    color: '#9CA3AF',
    marginRight: scale(4),
  },
  separator: {
    fontFamily: 'Prompt-Regular',
    fontSize: scaleFont(15),
    color: '#9CA3AF',
    marginHorizontal: scale(4),
  },
  timestamp: {
    fontFamily: 'Prompt-Regular',
    fontSize: scaleFont(15),
    color: '#9CA3AF',
  },
  postText: {
    fontFamily: 'Prompt-Regular',
    fontSize: scaleFont(15),
    color: '#FFFFFF',
    lineHeight: scaleFont(22),
    marginBottom: scale(12),
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(24),
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
  },
  actionCount: {
    fontFamily: 'Prompt-Regular',
    fontSize: scaleFont(13),
    color: '#9CA3AF',
  },
  actionCountActive: {
    color: '#EF4444',
  },
});

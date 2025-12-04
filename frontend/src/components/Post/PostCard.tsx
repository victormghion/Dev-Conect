import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Chip,
  Box,
  Button,
  TextField,
  Collapse,
  Divider,
  Link,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Comment as CommentIcon,
  Share,
  GitHub,
  Launch,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import { Post, Comment } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { postService } from '../../services/postService';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PostCardProps {
  post: Post;
  onUpdate?: (updatedPost: Post) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onUpdate }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);

  const isLiked = user ? post.likes.some(like => like.user._id === user._id) : false;

  const handleLike = async () => {
    if (!user) return;
    
    try {
      const response = await postService.toggleLike(post._id);
      if (response.success && onUpdate) {
        onUpdate(response.post);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleComment = async () => {
    if (!user || !commentText.trim()) return;

    setLoading(true);
    try {
      const response = await postService.addComment(post._id, commentText.trim());
      if (response.success && onUpdate) {
        onUpdate(response.post);
        setCommentText('');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardHeader
        avatar={
          <Avatar
            src={post.author.avatar ? `http://localhost:12000/uploads/${post.author.avatar}` : undefined}
            alt={post.author.fullName}
          >
            {post.author.fullName.charAt(0)}
          </Avatar>
        }
        title={post.author.fullName}
        subheader={`@${post.author.username} • ${formatDistanceToNow(new Date(post.createdAt), { 
          addSuffix: true, 
          locale: ptBR 
        })}`}
      />

      <CardContent>
        <Typography variant="h6" gutterBottom>
          {post.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {post.description}
        </Typography>

        {post.content && (
          <Typography variant="body1" paragraph>
            {post.content}
          </Typography>
        )}

        {post.images && post.images.length > 0 && (
          <Box sx={{ mb: 2 }}>
            {post.images.map((image, index) => (
              <Box
                key={index}
                component="img"
                src={`http://localhost:12000/uploads/${image}`}
                alt={`${post.title} - ${index + 1}`}
                sx={{
                  width: '100%',
                  maxHeight: 400,
                  objectFit: 'cover',
                  borderRadius: 1,
                  mb: 1,
                }}
              />
            ))}
          </Box>
        )}

        {post.technologies && post.technologies.length > 0 && (
          <Box sx={{ mb: 2 }}>
            {post.technologies.map((tech, index) => (
              <Chip
                key={index}
                label={tech}
                size="small"
                sx={{ mr: 1, mb: 1 }}
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        )}

        {post.tags && post.tags.length > 0 && (
          <Box sx={{ mb: 2 }}>
            {post.tags.map((tag, index) => (
              <Chip
                key={index}
                label={`#${tag}`}
                size="small"
                sx={{ mr: 1, mb: 1 }}
                variant="outlined"
              />
            ))}
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 1 }}>
          {post.githubRepo && (
            <Button
              startIcon={<GitHub />}
              size="small"
              component={Link}
              href={post.githubRepo}
              target="_blank"
              rel="noopener noreferrer"
            >
              Código
            </Button>
          )}
          {post.liveDemo && (
            <Button
              startIcon={<Launch />}
              size="small"
              component={Link}
              href={post.liveDemo}
              target="_blank"
              rel="noopener noreferrer"
            >
              Demo
            </Button>
          )}
        </Box>
      </CardContent>

      <CardActions disableSpacing>
        <IconButton onClick={handleLike} disabled={!user}>
          {isLiked ? <Favorite color="error" /> : <FavoriteBorder />}
        </IconButton>
        <Typography variant="body2" color="text.secondary">
          {post.likes.length}
        </Typography>

        <IconButton onClick={() => setShowComments(!showComments)}>
          <CommentIcon />
        </IconButton>
        <Typography variant="body2" color="text.secondary">
          {post.comments.length}
        </Typography>

        <IconButton>
          <Share />
        </IconButton>

        <Box sx={{ ml: 'auto' }}>
          <Typography variant="body2" color="text.secondary">
            {post.views} visualizações
          </Typography>
        </Box>
      </CardActions>

      <Collapse in={showComments} timeout="auto" unmountOnExit>
        <Divider />
        <CardContent>
          {user && (
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                multiline
                rows={2}
                placeholder="Escreva um comentário..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                variant="outlined"
                size="small"
              />
              <Button
                onClick={handleComment}
                disabled={!commentText.trim() || loading}
                sx={{ mt: 1 }}
                variant="contained"
                size="small"
              >
                {loading ? 'Comentando...' : 'Comentar'}
              </Button>
            </Box>
          )}

          {post.comments.map((comment) => (
            <Box key={comment._id} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar
                  src={comment.user.avatar ? `http://localhost:12000/uploads/${comment.user.avatar}` : undefined}
                  alt={comment.user.fullName}
                  sx={{ width: 24, height: 24, mr: 1 }}
                >
                  {comment.user.fullName.charAt(0)}
                </Avatar>
                <Typography variant="body2" fontWeight="bold">
                  {comment.user.fullName}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  {formatDistanceToNow(new Date(comment.createdAt), { 
                    addSuffix: true, 
                    locale: ptBR 
                  })}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ ml: 4 }}>
                {comment.text}
              </Typography>
            </Box>
          ))}
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default PostCard;
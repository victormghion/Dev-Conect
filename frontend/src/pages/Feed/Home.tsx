import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Post } from '../../types';
import { postService } from '../../services/postService';
import PostCard from '../../components/Post/PostCard';
import { useAuth } from '../../contexts/AuthContext';

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchPosts = async (pageNum = 1, append = false) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const response = await postService.getPosts(pageNum, 10);
      
      if (response.success) {
        const newPosts = response.posts || [];
        setPosts(prev => append ? [...prev, ...newPosts] : newPosts);
        setHasMore(pageNum < (response.pagination?.pages || 1));
      }
    } catch (err: any) {
      setError('Erro ao carregar posts');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage, true);
  };

  const handlePostUpdate = (updatedPost: Post) => {
    setPosts(prev => prev.map(post => 
      post._id === updatedPost._id ? updatedPost : post
    ));
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Carregando posts...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, pb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Feed de Projetos
        </Typography>
        {user && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/create-post')}
          >
            Novo Post
          </Button>
        )}
      </Box>

      {posts.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Nenhum post encontrado
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Seja o primeiro a compartilhar um projeto incrível!
          </Typography>
          {user && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/create-post')}
            >
              Criar Primeiro Post
            </Button>
          )}
        </Box>
      ) : (
        <>
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onUpdate={handlePostUpdate}
            />
          ))}

          {hasMore && (
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Button
                onClick={handleLoadMore}
                disabled={loadingMore}
                variant="outlined"
              >
                {loadingMore ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Carregando...
                  </>
                ) : (
                  'Carregar mais'
                )}
              </Button>
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default Home;
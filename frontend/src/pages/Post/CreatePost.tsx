import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Chip,
  IconButton,
  Grid,
  Card,
  CardMedia,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, CloudUpload } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { postService } from '../../services/postService';

const CreatePost: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    githubRepo: '',
    liveDemo: '',
    tags: '',
    technologies: '',
  });
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      setError('Máximo de 5 imagens permitidas');
      return;
    }

    setImages(prev => [...prev, ...files]);
    
    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const postFormData = new FormData();
      postFormData.append('title', formData.title);
      postFormData.append('description', formData.description);
      postFormData.append('content', formData.content);
      postFormData.append('githubRepo', formData.githubRepo);
      postFormData.append('liveDemo', formData.liveDemo);
      postFormData.append('tags', formData.tags);
      postFormData.append('technologies', formData.technologies);

      images.forEach((image) => {
        postFormData.append('images', image);
      });

      const response = await postService.createPost(postFormData);
      
      if (response.success) {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, pb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Compartilhar Projeto
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Mostre seu projeto incrível para a comunidade de desenvolvedores!
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            required
            label="Título do Projeto"
            name="title"
            value={formData.title}
            onChange={handleChange}
            margin="normal"
            placeholder="Ex: Sistema de Gerenciamento de Tarefas"
          />

          <TextField
            fullWidth
            required
            multiline
            rows={3}
            label="Descrição"
            name="description"
            value={formData.description}
            onChange={handleChange}
            margin="normal"
            placeholder="Descreva brevemente seu projeto..."
          />

          <TextField
            fullWidth
            multiline
            rows={6}
            label="Conteúdo Detalhado (Opcional)"
            name="content"
            value={formData.content}
            onChange={handleChange}
            margin="normal"
            placeholder="Conte mais detalhes sobre o desenvolvimento, desafios enfrentados, tecnologias utilizadas..."
          />

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Repositório GitHub"
                name="githubRepo"
                value={formData.githubRepo}
                onChange={handleChange}
                placeholder="https://github.com/usuario/projeto"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Demo Online"
                name="liveDemo"
                value={formData.liveDemo}
                onChange={handleChange}
                placeholder="https://meu-projeto.vercel.app"
              />
            </Grid>
          </Grid>

          <TextField
            fullWidth
            label="Tecnologias"
            name="technologies"
            value={formData.technologies}
            onChange={handleChange}
            margin="normal"
            placeholder="React, Node.js, MongoDB (separadas por vírgula)"
            helperText="Separe as tecnologias por vírgula"
          />

          <TextField
            fullWidth
            label="Tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            margin="normal"
            placeholder="frontend, fullstack, mobile (separadas por vírgula)"
            helperText="Separe as tags por vírgula"
          />

          {/* Image Upload */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Imagens do Projeto
            </Typography>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUpload />}
              sx={{ mb: 2 }}
              disabled={images.length >= 5}
            >
              Adicionar Imagens (máx. 5)
              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>

            {imagePreviews.length > 0 && (
              <Grid container spacing={2}>
                {imagePreviews.map((preview, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card>
                      <CardMedia
                        component="img"
                        height="200"
                        image={preview}
                        alt={`Preview ${index + 1}`}
                      />
                      <Box sx={{ p: 1, textAlign: 'center' }}>
                        <IconButton
                          onClick={() => removeImage(index)}
                          color="error"
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>

          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ flex: 1 }}
            >
              {loading ? 'Publicando...' : 'Publicar Projeto'}
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/')}
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreatePost;
const Post = require('../models/Post');
const User = require('../models/User');
const { testUser, testPosts } = require('../mockData');
const mongoose = require('mongoose');

// Create a new post
const createPost = async (req, res) => {
  try {
    const { title, description, content, tags, technologies, githubRepo, liveDemo } = req.body;
    
    // Handle uploaded images
    const images = req.files ? req.files.map(file => file.filename) : [];

    const post = await Post.create({
      title,
      description,
      content,
      author: req.user.id,
      images,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      technologies: technologies ? technologies.split(',').map(tech => tech.trim()) : [],
      githubRepo,
      liveDemo
    });

    const populatedPost = await Post.findById(post._id)
      .populate('author', 'username fullName avatar')
      .populate('likes.user', 'username fullName avatar')
      .populate('comments.user', 'username fullName avatar');

    res.status(201).json({
      success: true,
      message: 'Post criado com sucesso',
      post: populatedPost
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(400).json({
      message: error.message || 'Erro ao criar post'
    });
  }
};

// Get all posts (feed)
const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      try {
        const posts = await Post.find({ isPublic: true })
          .populate('author', 'username fullName avatar')
          .populate('likes.user', 'username fullName avatar')
          .populate('comments.user', 'username fullName avatar')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit);

        const total = await Post.countDocuments({ isPublic: true });

        res.json({
          success: true,
          data: posts,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          }
        });
        return;
      } catch (dbError) {
        console.log('Database query failed, falling back to mock data');
      }
    }
    
    // Use mock data if MongoDB is not available
    console.log('Using mock data for posts');
    
    const startIndex = skip;
    const endIndex = skip + limit;
    const paginatedPosts = testPosts.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: paginatedPosts,
      pagination: {
        page,
        limit,
        total: testPosts.length,
        pages: Math.ceil(testPosts.length / limit)
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      message: 'Erro ao buscar posts'
    });
  }
};

// Get single post
const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username fullName avatar bio')
      .populate('likes.user', 'username fullName avatar')
      .populate('comments.user', 'username fullName avatar');

    if (!post) {
      return res.status(404).json({
        message: 'Post não encontrado'
      });
    }

    // Increment views
    post.views += 1;
    await post.save();

    res.json({
      success: true,
      post
    });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({
      message: 'Erro ao buscar post'
    });
  }
};

// Update post
const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: 'Post não encontrado'
      });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'Não autorizado a editar este post'
      });
    }

    const { title, description, content, tags, technologies, githubRepo, liveDemo } = req.body;

    // Handle new uploaded images
    const newImages = req.files ? req.files.map(file => file.filename) : [];
    const images = [...post.images, ...newImages];

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        content,
        images,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : post.tags,
        technologies: technologies ? technologies.split(',').map(tech => tech.trim()) : post.technologies,
        githubRepo,
        liveDemo
      },
      { new: true, runValidators: true }
    )
      .populate('author', 'username fullName avatar')
      .populate('likes.user', 'username fullName avatar')
      .populate('comments.user', 'username fullName avatar');

    res.json({
      success: true,
      message: 'Post atualizado com sucesso',
      post: updatedPost
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(400).json({
      message: error.message || 'Erro ao atualizar post'
    });
  }
};

// Delete post
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: 'Post não encontrado'
      });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'Não autorizado a deletar este post'
      });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Post deletado com sucesso'
    });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      message: 'Erro ao deletar post'
    });
  }
};

// Like/Unlike post
const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: 'Post não encontrado'
      });
    }

    const existingLike = post.likes.find(like => like.user.toString() === req.user.id);

    if (existingLike) {
      // Unlike
      post.likes = post.likes.filter(like => like.user.toString() !== req.user.id);
    } else {
      // Like
      post.likes.push({ user: req.user.id });
    }

    await post.save();

    const updatedPost = await Post.findById(req.params.id)
      .populate('author', 'username fullName avatar')
      .populate('likes.user', 'username fullName avatar')
      .populate('comments.user', 'username fullName avatar');

    res.json({
      success: true,
      message: existingLike ? 'Like removido' : 'Post curtido',
      post: updatedPost
    });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({
      message: 'Erro ao curtir post'
    });
  }
};

// Add comment
const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: 'Post não encontrado'
      });
    }

    post.comments.push({
      user: req.user.id,
      text
    });

    await post.save();

    const updatedPost = await Post.findById(req.params.id)
      .populate('author', 'username fullName avatar')
      .populate('likes.user', 'username fullName avatar')
      .populate('comments.user', 'username fullName avatar');

    res.json({
      success: true,
      message: 'Comentário adicionado',
      post: updatedPost
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(400).json({
      message: error.message || 'Erro ao adicionar comentário'
    });
  }
};

// Get user posts
const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ author: userId, isPublic: true })
      .populate('author', 'username fullName avatar')
      .populate('likes.user', 'username fullName avatar')
      .populate('comments.user', 'username fullName avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({ author: userId, isPublic: true });

    res.json({
      success: true,
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({
      message: 'Erro ao buscar posts do usuário'
    });
  }
};

module.exports = {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
  getUserPosts
};
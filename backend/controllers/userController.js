const User = require('../models/User');
const Post = require('../models/Post');
const mongoose = require('mongoose');
const { testUser } = require('../mockData');

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // Return test user if requesting test user ID
      if (req.params.id === testUser._id) {
        return res.json({
          success: true,
          user: {
            ...testUser,
            postsCount: 5,
            followersCount: 0,
            followingCount: 0
          }
        });
      }
      
      return res.status(503).json({
        message: 'Serviço temporariamente indisponível. Tente novamente mais tarde.'
      });
    }

    const user = await User.findById(req.params.id)
      .populate('followers', 'username fullName avatar')
      .populate('following', 'username fullName avatar');

    if (!user) {
      return res.status(404).json({
        message: 'Usuário não encontrado'
      });
    }

    // Get user's posts count
    const postsCount = await Post.countDocuments({ author: user._id, isPublic: true });

    res.json({
      success: true,
      user: {
        ...user.toJSON(),
        postsCount,
        followersCount: user.followers.length,
        followingCount: user.following.length
      }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      message: 'Erro ao buscar perfil do usuário'
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { fullName, bio, skills, githubUrl, linkedinUrl, portfolioUrl } = req.body;
    
    // Handle avatar upload
    const avatar = req.file ? req.file.filename : undefined;

    const updateData = {
      fullName,
      bio,
      skills: skills ? skills.split(',').map(skill => skill.trim()) : [],
      githubUrl,
      linkedinUrl,
      portfolioUrl
    };

    if (avatar) {
      updateData.avatar = avatar;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('followers', 'username fullName avatar')
      .populate('following', 'username fullName avatar');

    res.json({
      success: true,
      message: 'Perfil atualizado com sucesso',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(400).json({
      message: error.message || 'Erro ao atualizar perfil'
    });
  }
};

// Follow/Unfollow user
const toggleFollow = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    if (userId === currentUserId) {
      return res.status(400).json({
        message: 'Você não pode seguir a si mesmo'
      });
    }

    const userToFollow = await User.findById(userId);
    const currentUser = await User.findById(currentUserId);

    if (!userToFollow) {
      return res.status(404).json({
        message: 'Usuário não encontrado'
      });
    }

    const isFollowing = currentUser.following.includes(userId);

    if (isFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter(id => id.toString() !== userId);
      userToFollow.followers = userToFollow.followers.filter(id => id.toString() !== currentUserId);
    } else {
      // Follow
      currentUser.following.push(userId);
      userToFollow.followers.push(currentUserId);
    }

    await currentUser.save();
    await userToFollow.save();

    res.json({
      success: true,
      message: isFollowing ? 'Usuário deixou de ser seguido' : 'Usuário seguido com sucesso',
      isFollowing: !isFollowing
    });
  } catch (error) {
    console.error('Toggle follow error:', error);
    res.status(500).json({
      message: 'Erro ao seguir/deixar de seguir usuário'
    });
  }
};

// Search users
const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!q) {
      return res.status(400).json({
        message: 'Termo de busca é obrigatório'
      });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { fullName: { $regex: q, $options: 'i' } },
        { skills: { $in: [new RegExp(q, 'i')] } }
      ]
    })
      .select('username fullName avatar bio skills')
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { fullName: { $regex: q, $options: 'i' } },
        { skills: { $in: [new RegExp(q, 'i')] } }
      ]
    });

    res.json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      message: 'Erro ao buscar usuários'
    });
  }
};

// Get suggested users to follow
const getSuggestedUsers = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const limit = parseInt(req.query.limit) || 5;

    // Get users that current user is not following
    const suggestedUsers = await User.find({
      _id: { 
        $nin: [...currentUser.following, req.user.id] 
      }
    })
      .select('username fullName avatar bio skills')
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      users: suggestedUsers
    });
  } catch (error) {
    console.error('Get suggested users error:', error);
    res.status(500).json({
      message: 'Erro ao buscar usuários sugeridos'
    });
  }
};

module.exports = {
  getUserProfile,
  updateProfile,
  toggleFollow,
  searchUsers,
  getSuggestedUsers
};
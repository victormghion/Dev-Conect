const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Dados do usuário de teste
const testUser = {
  _id: '507f1f77bcf86cd799439011',
  username: 'devteste',
  email: 'teste@devconnect.com',
  password: 'senha123',
  fullName: 'Desenvolvedor Teste',
  bio: 'Usuário de teste para o DevConnect. Desenvolvedor full-stack apaixonado por tecnologia.',
  skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'TypeScript'],
  githubUrl: 'https://github.com/devteste',
  linkedinUrl: 'https://linkedin.com/in/devteste',
  portfolioUrl: 'https://devteste.dev',
  isVerified: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

async function createTestUser() {
  try {
    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(testUser.password, salt);
    
    // Criar token JWT
    const token = jwt.sign(
      { 
        userId: testUser._id, 
        email: testUser.email 
      },
      process.env.JWT_SECRET || 'devconnect_secret_key_2024',
      { expiresIn: '7d' }
    );

    console.log('🎉 USUÁRIO DE TESTE CRIADO COM SUCESSO!');
    console.log('=====================================');
    console.log('📧 Email:', testUser.email);
    console.log('🔑 Senha:', testUser.password);
    console.log('👤 Username:', testUser.username);
    console.log('📝 Nome Completo:', testUser.fullName);
    console.log('🔐 Senha Hash:', hashedPassword);
    console.log('🎫 JWT Token:', token);
    console.log('=====================================');
    console.log('');
    console.log('💡 COMO USAR:');
    console.log('1. Acesse o frontend em http://localhost:3000');
    console.log('2. Clique em "Entrar"');
    console.log('3. Use as credenciais:');
    console.log('   Email: teste@devconnect.com');
    console.log('   Senha: senha123');
    console.log('');
    console.log('🚀 Ou use este token JWT diretamente na API:');
    console.log(`Authorization: Bearer ${token}`);
    
    return {
      user: { ...testUser, password: hashedPassword },
      token
    };
  } catch (error) {
    console.error('❌ Erro ao criar usuário de teste:', error);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  createTestUser();
}

module.exports = { createTestUser, testUser };
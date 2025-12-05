// Dados de teste para o DevConnect
const testUser = {
  _id: '507f1f77bcf86cd799439011',
  username: 'devteste',
  email: 'teste@devconnect.com',
  fullName: 'Desenvolvedor Teste',
  bio: 'Usuário de teste para o DevConnect. Desenvolvedor full-stack apaixonado por tecnologia.',
  skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'TypeScript'],
  githubUrl: 'https://github.com/devteste',
  linkedinUrl: 'https://linkedin.com/in/devteste',
  portfolioUrl: 'https://devteste.dev',
  avatar: null,
  isVerified: true,
  followers: [],
  following: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const testPosts = [
  {
    _id: '507f1f77bcf86cd799439012',
    title: 'Meu primeiro projeto React com TypeScript',
    content: 'Acabei de finalizar meu primeiro projeto usando React com TypeScript! Foi uma experiência incrível aprender sobre tipagem estática e como ela pode melhorar a qualidade do código. O projeto é um sistema de gerenciamento de tarefas com funcionalidades de CRUD completo.',
    author: testUser,
    tags: ['React', 'TypeScript', 'JavaScript', 'Frontend'],
    images: [],
    likes: [testUser._id],
    comments: [
      {
        _id: '507f1f77bcf86cd799439013',
        content: 'Parabéns pelo projeto! TypeScript realmente faz toda a diferença.',
        author: testUser,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      }
    ],
    githubUrl: 'https://github.com/devteste/react-typescript-todo',
    demoUrl: 'https://react-typescript-todo.vercel.app',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: '507f1f77bcf86cd799439014',
    title: 'API REST com Node.js e Express',
    content: 'Desenvolvi uma API REST completa usando Node.js e Express. A API inclui autenticação JWT, validação de dados, middleware de segurança e documentação com Swagger. Foi um ótimo exercício para consolidar conhecimentos de backend.',
    author: testUser,
    tags: ['Node.js', 'Express', 'API', 'Backend', 'JWT'],
    images: [],
    likes: [],
    comments: [],
    githubUrl: 'https://github.com/devteste/nodejs-api-rest',
    demoUrl: null,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: '507f1f77bcf86cd799439015',
    title: 'App Mobile com React Native',
    content: 'Criei meu primeiro aplicativo mobile usando React Native! O app é um clone do Instagram com funcionalidades de feed, stories, likes e comentários. Aprendi muito sobre navegação, estado global e integração com APIs.',
    author: testUser,
    tags: ['React Native', 'Mobile', 'JavaScript', 'Android', 'iOS'],
    images: [],
    likes: [testUser._id],
    comments: [
      {
        _id: '507f1f77bcf86cd799439016',
        content: 'Ficou incrível! React Native é uma tecnologia fantástica.',
        author: testUser,
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      },
      {
        _id: '507f1f77bcf86cd799439017',
        content: 'Parabéns! Pretendo aprender React Native também.',
        author: testUser,
        createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
      }
    ],
    githubUrl: 'https://github.com/devteste/react-native-instagram',
    demoUrl: null,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: '507f1f77bcf86cd799439018',
    title: 'Sistema de Chat em Tempo Real',
    content: 'Implementei um sistema de chat em tempo real usando Socket.io! O projeto inclui salas de chat, mensagens privadas, notificações e status online/offline. Foi desafiador trabalhar com WebSockets, mas o resultado ficou excelente.',
    author: testUser,
    tags: ['Socket.io', 'WebSocket', 'Real-time', 'Chat', 'Node.js'],
    images: [],
    likes: [testUser._id],
    comments: [],
    githubUrl: 'https://github.com/devteste/realtime-chat',
    demoUrl: 'https://realtime-chat-demo.herokuapp.com',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: '507f1f77bcf86cd799439019',
    title: 'Dashboard Analytics com Chart.js',
    content: 'Criei um dashboard de analytics completo usando Chart.js e D3.js. O projeto inclui gráficos interativos, filtros por data, exportação de relatórios e responsividade total. Aprendi muito sobre visualização de dados!',
    author: testUser,
    tags: ['Chart.js', 'D3.js', 'Dashboard', 'Analytics', 'Data Visualization'],
    images: [],
    likes: [],
    comments: [
      {
        _id: '507f1f77bcf86cd799439020',
        content: 'Visualização de dados é uma área fascinante! Parabéns pelo trabalho.',
        author: testUser,
        createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString()
      }
    ],
    githubUrl: 'https://github.com/devteste/analytics-dashboard',
    demoUrl: 'https://analytics-dashboard-demo.netlify.app',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
  }
];

module.exports = {
  testUser,
  testPosts
};
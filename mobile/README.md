# DevConnect Mobile

Aplicativo móvel da rede social DevConnect para desenvolvedores.

## Tecnologias

- React Native
- TypeScript
- React Navigation
- Axios para API calls
- AsyncStorage para persistência local

## Funcionalidades

- Autenticação de usuários
- Feed de projetos
- Criar e editar posts
- Sistema de likes e comentários
- Perfil de usuário
- Upload de imagens

## Instalação

```bash
# Instalar dependências
npm install

# Para iOS
npx react-native run-ios

# Para Android
npx react-native run-android
```

## Estrutura do Projeto

```
src/
├── components/     # Componentes reutilizáveis
├── screens/        # Telas do aplicativo
├── navigation/     # Configuração de navegação
├── services/       # Serviços de API
├── contexts/       # Contextos React
├── types/          # Tipos TypeScript
└── utils/          # Utilitários
```

## API

O aplicativo se conecta com a API backend em `http://localhost:12000/api`

## Status

🚧 Em desenvolvimento - Estrutura básica criada
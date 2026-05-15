export type RootStackParamList = {
  LoginScreen: undefined; // Home não recebe parâmetros
  Index: { id: string; nome: string; isAdmin: boolean }; // Detalhes recebe um objeto
  UserListScreen: {tipo: string; idUsuarioLogado: string; roleUsuarioLogado: string};
  UsuarioScreen: {
      id: string;
      nome: string;
      dataNasc: string;
      email: string;
      login: string;
      senha: string;
      telefone: string;
      role: string;
      roleUsuarioLogado: string;
      idUsuarioLogado: string;
  };
};
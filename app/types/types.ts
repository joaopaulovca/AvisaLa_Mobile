export type RootStackParamList = {
  LoginScreen: undefined; // Home não recebe parâmetros
  Index: { id: string; nome: string; isAdmin: boolean }; // Detalhes recebe um objeto
  UserListScreen: {tipo: string};
};
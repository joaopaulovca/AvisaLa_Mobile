import axios, { AxiosResponse } from 'axios';
import { Post } from './types/Post';
import { UserType } from './types/User';

const api = axios.create({
  baseURL: 'http://10.249.32.120:3000/',
  timeout: 10000, // Tempo limite de 10 segundos por requisição
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interface para tipar os dados de cadastro (opcional, remova se usar JS puro)
export interface UsuarioCadastroData {
  nome: string;
  dataNascimento: string;
  email: string;
  login: string;
  senha?: string;
  telefone: string;
}

// Objeto que agrupa as funções de chamada da API
export const dataService = {
  
  cadastrar: async (dadosUsuario: UsuarioCadastroData) => {
    try {
      const response = await api.post('/usuarios', dadosUsuario);
      return getData(response);
    } catch (error: any) {
      // Trata o erro antes de devolvê-lo para a tela
      throw error.response?.data || new Error('Erro ao conectar com o servidor');
    }
  },

  login: async (login: string, senha: string) => {
    try {
      const response = await api.post('users/loginUsuario', { username: login, password: senha });
      return getData(response);
    } catch (error: any) {
      throw error.response?.data || new Error('Falha na autenticação');
    }
  },

  buscarPerfil: async (id: string) => {
    try {
      const response = await api.get(`users/${id}`);
      return getData(response);
    } catch (error: any) {
      throw error.response?.data || new Error('Usuário não encontrado');
    }
  },

  excluirPost: async (id: string) => {
    const response = await api.delete('posts/' + id);
    return response.status === 200 
  },

  gravarPost: async (post: Post) => {

    let response: Response;

    if (!post.id || (post.id === '')) {
      delete (post as any).id;
      response = await api.post('posts/', post);
    } else { 
      response = await api.put('posts/' + post.id, post);
    }

    return (response.status === 200) || (response.status === 201);  

  },

  getPosts: async () => {
    return await api.get<Post[]>('posts');
  },

  filterPosts: async (selectedCategoria: String, searchConteudo: String) => {

    let complementoUri = '';

    switch (selectedCategoria) {
      case 'Todas as Disciplinas':
        complementoUri = 'posts';
        break;

      default:
        complementoUri = `posts/category/${selectedCategoria}`;
        break;
    };

    if (searchConteudo.length > 1) {
      complementoUri += `/topic/${searchConteudo}/description/${searchConteudo}`;                       
    };

    const response = await api.get<Post[]>(complementoUri);      

    return getData(response);

  },

  getUsers: async (role: String) => {
    const response = await api.post('users/filterUsuariosPorTipo', {role: role});
    return getData(response);
  },

  excluirUser: async (id: string) => {
    const response = await api.delete('users/' + id);
    return response.status === 200 
  },

  gravarUsuario: async (user: UserType) => {

    let response: AxiosResponse<any, any, {}>;

    if (!user.id || (user.id === '')) {   
      delete (user as any).id;  
      console.log(user)     
      response = await api.post('users/', user);
    } else {
      response = await api.put('users/' + user.id, user);
    }

    return getData(response); 

  }

};

export default api;

function getData(response: AxiosResponse<any, any, {}>) {
  if ((response.status === 200) || (response.status === 201))
    return response.data
  else 
    return null
}

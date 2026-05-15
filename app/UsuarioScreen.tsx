import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  SafeAreaView 
} from 'react-native';

const UsuarioScreen = () => {

  const [id, setId] = useState('');  
  const [nome, setNome] = useState('');
  const [dataNasc, setDataNasc] = useState('');
  const [email, setEmail] = useState('');
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const [role, setRole] = useState('');
  const [roleUsuarioLogado, setRoleUsuarioLogado] = useState('');
  const [idUsuarioLogado, setIdUsuarioLogado] = useState(''); 

  const params = useLocalSearchParams();

  useEffect(() => {
    if (params.roleUsuarioLogado) setRoleUsuarioLogado(params.roleUsuarioLogado as string);
    if (params.idUsuarioLogado) setIdUsuarioLogado(params.idUsuarioLogado as string);        
    if (params.id) setId(params.id as string);
    if (params.nome) setNome(params.nome as string);
    if (params.dataNasc) setDataNasc(params.dataNasc as string);
    if (params.email) setEmail(params.email as string);
    if (params.login) setLogin(params.login as string); 
    if (params.senha) setSenha(params.senha as string); 
    if (params.telefone) setTelefone(params.telefone as string);
    if (params.role) setRole(params.role as string);
    fetchData();
  }, [id, roleUsuarioLogado, idUsuarioLogado]);  

  const router = useRouter();

  const handleSalvar = async () => {

    if ((!nome) || (!login) || (!senha)) {
      alert("Informe: nome, login e senha.");
      return;
    }

    let Uri = `http://192.168.15.106:3000/users/`;
    let response: Response;

    const formData = {        
      name: nome,
      username: login,
      password: senha,
      data_nascimento: dataNasc,
      mobile_phone: telefone,
      email: email,
      role: roleUsuarioLogado === 'Admin' && id === idUsuarioLogado ? 'Admin' 
          : role ? role : 'Estudante'
    }

    if (!id || (id === '')) {        
      response = await axios.post(Uri, formData);
    } else {
      response = await axios.put(Uri + id, formData);
    }

    if ((response.status === 200) || (response.status === 201)) {
      setNome('');
      setLogin('');
      setSenha('');
      setDataNasc('');
      setTelefone('');
      setRole('');
      setEmail('');
      if (!id || (id === '')) 
        alert('Cadastro realizado com sucesso !');
      else  
        alert('Cadastro atualizado com sucesso !'); 
      router.back();     
    }

  };

  const fetchData = async () => {
    if (id) {

      let Uri = 'http://192.168.15.106:3000/users/' + id;

      try {

        const response = await axios.get(Uri);

        if (response.status === 200 || response.status === 201) {
          setNome(response.data.name);
          setLogin(response.data.username);
          setSenha(response.data.password);
          setDataNasc(response.data.data_nascimento);
          setTelefone(response.data.mobile_phone);
          setRole(response.data.role);
          setEmail(response.data.email);
        }

      } catch (error) {
        alert('Erro ao carregar os dados');
      }
    }
  }  

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>          

          <View style={styles.form}>
            <Text style={styles.label}>Nome</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Nome completo" 
              value={nome}
              onChangeText={setNome}
            />

            <Text style={styles.label}>Data de Nascimento</Text>
            <TextInput 
              style={styles.input} 
              placeholder="DD/MM/AAAA" 
              keyboardType="default"
              value={dataNasc}
              onChangeText={setDataNasc}
            />

            <Text style={styles.label}>E-mail</Text>
            <TextInput 
              style={styles.input} 
              placeholder="exemplo@email.com" 
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.label}>Login</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Nome de usuário" 
              autoCapitalize="none"
              value={login}
              onChangeText={setLogin}
            />

            <Text style={styles.label}>Senha</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Sua senha" 
              secureTextEntry={true}
              value={senha}
              onChangeText={setSenha}
            />

            <Text style={styles.label}>Número de Telefone</Text>
            <TextInput 
              style={styles.input} 
              placeholder="(00) 00000-0000" 
              keyboardType="phone-pad"
              value={telefone}
              onChangeText={setTelefone}
            />

            { (roleUsuarioLogado === 'Admin') && (idUsuarioLogado !== id) && 
              <Text style={styles.label}>Tipo</Text> 
            }
            { (roleUsuarioLogado === 'Admin') && (idUsuarioLogado !== id) &&
              <View style={styles.inputContainer}>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={role}
                    onValueChange={(itemValue) => setRole(itemValue)}
                    style={{ color: '#3b82f6' }} // Seu azul padrão
                  >                    
                    <Picker.Item label="Estudante" value="Estudante" />
                    <Picker.Item label="Professor" value="Professor" />                
                  </Picker>  
                </View>        
              </View> 
            }

            <TouchableOpacity style={styles.button} onPress={handleSalvar}>
              <Text style={styles.buttonText}>GRAVAR</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#3b82f6', // Blue-500
  },
  underline: {
    height: 4,
    width: 60,
    backgroundColor: '#3b82f6',
    marginTop: 8,
    borderRadius: 2,
  },
  form: {
    gap: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginTop: 12,
  },
  input: {
    height: 50,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#1e293b',
  },
  button: {
    backgroundColor: '#3b82f6', // Blue-500
    height: 45,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    // Sombra para iOS e Android
    elevation: 4,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  pickerWrapper: {
    flex: 1,
    height: 55,
    justifyContent: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
    minHeight: 55,
  }
});

export default UsuarioScreen;
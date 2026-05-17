import React, { useCallback, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Eye, EyeOff, User, Lock } from 'lucide-react-native';
import { useFocusEffect, useRouter } from 'expo-router'; // Use este hook!
import { dataService } from './service';

const BLUE_900 = '#3b82f6';
const WHITE = '#ffffff';

const LoginScreen = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);

  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      setEmail('')
      setPassword('')      
    }, [])
  );

  const handleLogin = async () => {
    try {
      const data = await dataService.login(email, password);

      if (data) {
        // ✅ Navegação no Expo Router com parâmetros
        router.push({
          pathname: "/", // ou apenas "/", já que index é a rota raiz
          params: { 
            id: data.id, 
            nome: data.name,
            tipoUsuario: String(data.role) // O Expo Router prefere strings nos params
          }
        });
      }

    } catch (error) {
      alert('Usuário não encontrado !');
    }
  };

  const handleUsuarioScreen = () => {
    router.push({
      pathname: '/UsuarioScreen', // ou apenas "/", já que index é a rota raiz
      params: { 

      }
    });    
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Bem-vindo ao AvisaLá !</Text>
          <Text style={styles.subtitle}>Faça login para continuar</Text>
        </View>

        <View style={styles.form}>
          {/* Campo de Usuário/Email */}
          <View style={styles.inputContainer}>
            <User color={BLUE_900} size={20} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Usuário ou E-mail"
              placeholderTextColor="#94a3b8"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* Campo de Senha */}
          <View style={styles.inputContainer}>
            <Lock color={BLUE_900} size={20} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor="#94a3b8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={secureText}
            />
            <TouchableOpacity onPress={() => setSecureText(!secureText)}>
              {secureText ? (
                <EyeOff color="#94a3b8" size={20} />
              ) : (
                <Eye color="#94a3b8" size={20} />
              )}
            </TouchableOpacity>
          </View>

          {/* Botão de Login */}
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Não tem uma conta? </Text>
          <TouchableOpacity onPress={handleUsuarioScreen}>
            <Text style={styles.signUpText}>Cadastre-se</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: BLUE_900,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 5,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    height: 55,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: BLUE_900,
    fontSize: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: BLUE_900,
    fontWeight: '600',
  },
  button: {
    backgroundColor: BLUE_900,
    borderRadius: 12,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: WHITE,
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
  },
  footerText: {
    color: '#64748b',
    fontSize: 14,
  },
  signUpText: {
    color: BLUE_900,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
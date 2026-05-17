import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Save, Trash2, BookOpen, Type, AlignLeft } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router/build/hooks';
import { dataService } from './service';
import { Post } from './types/Post';

const BLUE_500 = '#3b82f6';
const WHITE = '#ffffff';

const Categorias = [
  "Informe a Disciplina", "Português", "Literatura", "Redação", "Matemática", 
  "História", "Geografia", "Química", "Física", "Biologia"
];

const CadastroScreen = () => {
  const [category, setCategory] = useState('Informe a Disciplina');
  const [topic, setTopic] = useState('');
  const [userId, setUserId] = useState('');
  const [id, setId] = useState('');  
  const [description, setDescription] = useState('');  

  const router = useRouter();

  const params = useLocalSearchParams();

  useEffect(() => {
    if (params.userId) setUserId(params.userId as string);
    if (params.id) setId(params.id as string);
    if (params.category) setCategory(params.category as string);
    if (params.topic) setTopic(params.topic as string);
    if (params.description) setDescription(params.description as string); 
  }, []);  

  const handleSalvar = async () => {

    if (!topic || !description || category === "-") {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    const post: Post = {
      id: String(params.id),
      user_id: userId,
      category: category,
      topic: topic,
      description: description 
    }

    if (await dataService.gravarPost(post)) {
      setUserId('');
      setId('');
      setCategory('');
      setTopic('');
      setDescription('');
      router.back();  
    }    

  };

  const handleExcluir = () => {

    Alert.alert(
      "Confirmar Exclusão",
      "Deseja realmente excluir a postagem ?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sim", onPress: () => excluir(), style: "destructive" }
      ]
    );

  };

  const excluir = async () => {
    if (await dataService.excluirPost(id)) {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{params.id ? "Editar conteúdo" : "Novo Conteúdo"} </Text>
          </View>

          <View style={styles.form}>
            {/* Campo Categoria */}
            <Text style={styles.label}>Categoria</Text>
            <View style={styles.inputContainer}>
              <BookOpen color={BLUE_500} size={20} style={styles.icon} />
              <View style={styles.pickerWrapper}>
                <Picker
                  // 2. Vincula o valor visual ao estado
                  selectedValue={category}
                  // 3. Atualiza o estado quando o usuário clica em outra opção
                  onValueChange={(itemValue) => setCategory(itemValue)}
                  style={{ color: '#3b82f6' }} // Seu azul padrão
                >
                  <Picker.Item label="Selecione..." value="-" />
                  <Picker.Item label="Português" value="Português" />
                  <Picker.Item label="Literatura" value="Literatura" />
                  <Picker.Item label="Redação" value="Redação" />
                  <Picker.Item label="Matemática" value="Matemática" />
                  <Picker.Item label="História" value="História" />
                  <Picker.Item label="Geografia" value="Geografia" />
                  <Picker.Item label="Química" value="Química" />
                  <Picker.Item label="Física" value="Física" />                                    
                  <Picker.Item label="Biologia" value="Biologia" />  
                </Picker>
              </View>
            </View>

            {/* Campo Título */}
            <Text style={styles.label}>Título</Text>
            <View style={styles.inputContainer}>
              <Type color={BLUE_500} size={20} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Ex: Introdução à Trigonometria"
                value={topic}
                onChangeText={setTopic}
              />
            </View>

            {/* Campo Conteúdo */}
            <Text style={styles.label}>Conteúdo</Text>
            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <AlignLeft color={BLUE_500} size={20} style={[styles.icon, { marginTop: 12 }]} />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Digite o conteúdo aqui..."
                multiline
                numberOfLines={undefined}
                textAlignVertical="top"
                value={description}
                onChangeText={setDescription}
              />
            </View>

            {/* Botões */}
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.button, styles.btnDelete]} 
                onPress={handleExcluir}
              >
                <Trash2 color="#ef4444" size={20} />
                <Text style={styles.btnTextDelete}>Excluir</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.button, styles.btnSave]} 
                onPress={handleSalvar}
              >
                <Save color={WHITE} size={20} />
                <Text style={styles.btnTextSave}>Gravar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 30,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: BLUE_500,
  },
  form: {
    gap: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 20,
    minHeight: 55,
  },
  icon: {
    marginRight: 10,
  },
  pickerWrapper: {
    flex: 1,
    height: 55,
    justifyContent: 'center',
  },
  picker: {
    marginLeft: -10,
    color: '#1e293b',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
  },
  textAreaContainer: {
    alignItems: 'flex-start',
  },
  textArea: {
    minHeight: 120,
    paddingTop: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 10,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  btnSave: {
    backgroundColor: BLUE_500,
    elevation: 4,
    shadowColor: BLUE_500,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  btnDelete: {
    backgroundColor: WHITE,
    borderWidth: 1.5,
    borderColor: '#ef4444',
  },
  btnTextSave: {
    color: WHITE,
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnTextDelete: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CadastroScreen;
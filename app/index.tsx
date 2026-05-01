import React, { useCallback, useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator, 
  SafeAreaView, 
  TouchableOpacity,
  TextInput,
  Platform,
  Keyboard
} from 'react-native';
import axios from 'axios';
import { Post } from './types/Post';
import { BookOpen, Filter, Pencil, Plus, Search, X } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';
import { RootStackParamList } from './types/types';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';

const BLUE_500 = '#3b82f6';
const WHITE = '#ffffff';
const Categorias = [
  "Todas as Disciplinas", "Português", "Literatura", "Redação", 
  "Matemática", "História", "Geografia", 
  "Química", "Física", "Biologia"
];

export default function index() {
  const [data, setData] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const [originalData, setOriginalData] = useState<Post[]>([]);
  const [filteredData, setFilteredData] = useState<Post[]>([]);

  const [selectedCategoria, setSelectedCategoria] = useState('Todas as Disciplinas');
  const [searchConteudo, setSearchConteudo] = useState('');

  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = originalData.filter(item => {
      return (
        item.category.toLowerCase().includes(selectedCategoria.toLowerCase()) &&
        item.description.toLowerCase().includes(searchConteudo.toLowerCase())
      );
    });
    //setFilteredData(filtered);
  }, [selectedCategoria, searchConteudo, originalData]);

  useFocusEffect(
    useCallback(() => {
      handleFilter();
    }, [])
  );

  const fetchData = async () => {
    try {
      // Substitua pela sua URL real
      const response = await axios.get<Post[]>('http://192.168.15.106:3000/posts');
      setData(response.data);
      setFilteredData(response.data)
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  // Função disparada apenas ao clicar no botão
  const handleFilter = async () => {
    Keyboard.dismiss(); // Fecha o teclado
    
    let Uri = '';
    console.log('selectedCategoria', selectedCategoria);
    switch (selectedCategoria) {
      case 'Todas as Disciplinas':
        Uri = 'http://192.168.15.106:3000/posts';
        break;

      default:
        Uri = `http://192.168.15.106:3000/posts/category/${selectedCategoria}`;
        break;
    };

    if (searchConteudo.length > 1) {
      Uri += `/topic/${searchConteudo}/description/${searchConteudo}`;                       
    };

    try {
      console.log('uri', Uri)
      const response = await axios.get<Post[]>(Uri); 
      setData(response.data);
      setFilteredData(response.data);  // Atualiza state do componente pagePai
    } catch (err) {
      if (axios.isAxiosError(err)) {

      } else {

      }
    };
  };

  const { id, nome, tipoUsuario } = useLocalSearchParams();

  const router = useRouter();

  // Componente que renderiza cada linha da lista
  const renderItem = ({ item }: { item: Post }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => {setExpandedId(item.id)}} 
    >
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category.toUpperCase()}</Text>
        </View>

        {(tipoUsuario !== 'Estudante') && 
         (id === item.user_id) &&
        <TouchableOpacity 
          style={styles.editButton} 
          onPress={() => {            
            router.push({
              pathname: "/CadastroScreen", // ou apenas "/", já que index é a rota raiz
              params: { 
                userId: item.User?.id,
                id: item.id,
                category: item.category,
                topic: item.topic,
                description: item.description
              }
            }); 
          }}
        >
          <Pencil color={BLUE_500} size={20} />
        </TouchableOpacity>}
      
        <Text style={styles.title}>{item.topic}</Text>
      
        <View style={styles.professorContainer}>
          <Text style={styles.label}>Professor:</Text>
          <Text style={styles.professorName}>{item.User?.name}</Text>
        </View>
      
        <Text style={styles.contentText} numberOfLines={expandedId === item.id ? undefined : 1} >
          {item.description}
        </Text>
      
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={BLUE_500} />
      </View>
    );
  }

return (
  
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'AvisaLá!',
          headerRight: () => (
            (tipoUsuario !== 'Estudante') && <TouchableOpacity 
              onPress={() => {                
                // Passando dados para a CadastroScreen
                router.push({
                  pathname: "/CadastroScreen",
                  params: { 
                    userId: id,
                    id: '',
                    category: '',
                    topic: '',
                    description: ''
                  }
                });
              }}
            >
              <Plus color="#3b82f6" size={24} style={{ marginRight: 15 }} />
            </TouchableOpacity>
          ),
        }} 
      />
      <View style={styles.searchPanel}>
        
        {/* Select de Categoria */}
        <View style={styles.pickerWrapper}>
          <BookOpen color={BLUE_500} size={18} style={styles.icon} />
          <Picker
            selectedValue={selectedCategoria}
            onValueChange={(itemValue: React.SetStateAction<string>) => setSelectedCategoria(itemValue)}
            style={styles.picker}
            dropdownIconColor={BLUE_500}
          >
            {Categorias.map((cat) => (
              <Picker.Item key={cat} label={cat} value={cat} color="#1e293b" />
            ))}
          </Picker>
        </View>

        {/* Input Conteúdo */}
        <View style={styles.inputWrapper}>
          <Filter color={BLUE_500} size={18} style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Palavra-chave no conteúdo"
            value={searchConteudo}
            onChangeText={setSearchConteudo}
            placeholderTextColor="#94a3b8"
          />
          {searchConteudo !== '' && (
            <TouchableOpacity onPress={() => setSearchConteudo('')}>
              <X color="#94a3b8" size={18} />
            </TouchableOpacity>
          )}
        </View>
        {/* Botão de Filtrar */}
        <TouchableOpacity style={styles.filterButton} onPress={handleFilter}>
          <Filter color={WHITE} size={20} style={{ marginRight: 8 }} />
          <Text style={styles.filterButtonText}>APLICAR FILTROS</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={BLUE_500} />
        </View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhuma aula encontrada para esses filtros.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: WHITE,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: BLUE_500,
  },
  listContent: {
    padding: 15,
  },
  card: {
    backgroundColor: WHITE,
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryBadge: {
    backgroundColor: '#dbeafe',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  categoryText: {
    color: BLUE_500,
    fontSize: 10,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  professorContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: '#64748b',
    marginRight: 4,
  },
  professorName: {
    fontSize: 14,
    fontWeight: '600',
    color: BLUE_500,
  },
  contentText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#94a3b8',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
    height: 48,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#1e293b',
    fontSize: 15,
  },
  searchPanel: {
    backgroundColor: WHITE,
    padding: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 8,
    shadowColor: BLUE_500,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    zIndex: 10,
  },
  panelTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: BLUE_500,
    marginBottom: 15,
  },
  icon: {
    marginRight: 8,
  },
  picker: {
    flex: 1,
    height: 50,
    color: '#1e293b',
    ...Platform.select({
      android: {
        marginLeft: -10,
      }
    })
  },
  pickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    paddingLeft: 12,
    marginBottom: 15,
    height: 50,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  filterButton: {
    backgroundColor: BLUE_500,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    height: 48,
    marginTop: 15,
    elevation: 3,
  },
  filterButtonText: { color: WHITE, fontWeight: 'bold', fontSize: 14, letterSpacing: 1 },
  editButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 8,
    backgroundColor: '#eff6ff', // Fundo azul bem clarinho
    borderRadius: 8,
  }
});
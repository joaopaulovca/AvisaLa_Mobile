import React, { useCallback, useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator,
  SafeAreaView 
} from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { Pencil, Trash2, UserPlus, User as UserIcon } from 'lucide-react-native';
import { UserType } from './types/User';
import { dataService } from './service';

const BLUE_500 = '#3b82f6';
const WHITE = '#ffffff';

const UserListScreen = () => {
  const router = useRouter();
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

  const { tipo, idUsuarioLogado, roleUsuarioLogado } = useLocalSearchParams();

  useEffect(() => {
    fetchUsers();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUsers();  
    }, [])
  );  

  const fetchUsers = async () => {
    try {
      const data = await dataService.getUsers(String(tipo));
      setUsers(data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: UserType) => {
    router.push({
      pathname: '/UsuarioScreen',
      params: { roleUsuarioLogado: roleUsuarioLogado, idUsuarioLogado: idUsuarioLogado, id: user.id }
    });
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Excluir Usuário",
      "Tem certeza que deseja remover este usuário?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive", 
          onPress: async () => {
            try {
              dataService.excluirUser(id);
              setUsers(users.filter(u => u.id !== id));
            } catch (error) {
              Alert.alert("Erro", "Não foi possível excluir.");
            }
          } 
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: UserType }) => (
    <View style={styles.card}>
      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          <UserIcon color={WHITE} size={20} />
        </View>
        <View>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.iconButton, styles.editButton]} 
          onPress={() => handleEdit(item)}
        >
          <Pencil color={BLUE_500} size={18} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.iconButton, styles.deleteButton]} 
          onPress={() => handleDelete(item.id)}
        >
          <Trash2 color="#ef4444" size={18} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleNovoUsuario = () => {
    router.push({
      pathname: '/UsuarioScreen', // ou apenas "/", já que index é a rota raiz
      params: { roleUsuarioLogado: roleUsuarioLogado, idUsuarioLogado: idUsuarioLogado, id: '', role: tipo }
    });    
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{tipo === 'Professor' ?  'Professores' : tipo + 's'}</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleNovoUsuario}
        >
          <UserPlus color={WHITE} size={20} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={BLUE_500} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhum usuário cadastrado.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: WHITE,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  addButton: {
    backgroundColor: BLUE_500,
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: BLUE_500,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  userEmail: {
    fontSize: 13,
    color: '#64748b',
  },
  userRole: {
    fontSize: 12,
    color: BLUE_500,
    fontWeight: '600',
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  editButton: {
    borderColor: '#dbeafe',
    backgroundColor: '#eff6ff',
  },
  deleteButton: {
    borderColor: '#fee2e2',
    backgroundColor: '#fef2f2',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#94a3b8',
  },
});

export default UserListScreen;
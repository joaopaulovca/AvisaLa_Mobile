import { Stack } from "expo-router";

const BLUE_500 = '#3b82f6';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        // Define a cor da seta de voltar e botões (como o Plus se não tiver cor fixa)
        headerTintColor: BLUE_500,
        // Define a cor específica do texto do título
        headerTitleStyle: {
          color: BLUE_500,
          fontWeight: 'bold', // Opcional: deixa o título em negrito
        },
        // Centraliza o título (opcional, padrão no iOS, opcional no Android)
        headerTitleAlign: 'center', 
      }}
    >
      <Stack.Screen name="LoginScreen" options={{ title: 'Login' }} />      
      <Stack.Screen name="index" options={{ title: '' }} />
      <Stack.Screen name="CadastroScreen" options={{ title: '' }} />
    </Stack>
  );
}


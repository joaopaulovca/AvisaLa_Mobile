import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="LoginScreen" options={{ title: 'Login' }} />      
      <Stack.Screen name="index" options={{ title: '' }} />
    </Stack>
  );
}


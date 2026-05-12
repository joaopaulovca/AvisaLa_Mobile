## 

## instalar
npx create-expo-app@lastest AvisaLa --template react-navigation/template
npm run reset-project
This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## navigator

npm install @react-navigation/native @react-navigation/stack
npm install react-native-screens react-native-safe-area-context react-native-gesture-handler

## compatível Expo SDK
npx expo install react-native-screens react-native-safe-area-context
npx expo install react-native-gesture-handler @react-native-masked-view/masked-view

## Em um navegador web, clicar em um link adiciona a página ao histórico do navegador, e ao pressionar o botão "voltar" remove a página do histórico, tornando a página anterior ativa novamente. O React Native não possui um histórico integrado como um navegador web — é aí que entra o React Navigation.
npm install @react-navigation/native-stack

## createNativeStackNavigator - Podemos criar um navegador de pilha nativo usando a createNativeStackNavigator como função: const Stack = createNativeStackNavigator();

## NavigationContaine r - Gerencia a árvore de navegação e armazena o estado da navegação . Deve envolver todos os navegadores e ser renderizado na raiz do seu aplicativo 

## react-native-safe-area-context   
## npx expo install react-native-safe-area-context
## npm install react-native-safe-area-context
no Expo serve para gerenciar automaticamente as margens seguras (safe areas) de dispositivos móveis, evitando que o conteúdo do aplicativo seja escondido por notches (recortes), câmeras, barras de status no topo ou indicadores de gestos na parte inferior

## SafeAreaView nativo do react-native realmente apresenta comportamentos inconsistentes, especialmente no Android e em layouts complexos.
npx expo install react-native-safe-area-context

## header padrão
npx expo install @react-navigation/drawer react-native-gesture-handler react-native-reanimated

## atualizar versão do expo
 ## expo@54.0.33 - expected version: ~54.0.34
 ## expo-linking@8.0.11 - expected version: ~8.0.12
 ## expo-web-browser@15.0.10 - expected version: ~15.0.11
 
 ## https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/

## npx expo-doctor
## npx expo install --check   >> y  to review and upgrade your dependencies.
## rode novamente o npx expo-doctor , até corrigir.

## lucide-react-native
npm install lucide-react-native

##  @react-native-picker/picker - serve para criar componentes de seleção (dropdowns/menus suspensos) nativos em aplicativos React Native, permitindo que usuários escolham uma opção entre várias, funcionando tanto no Android quanto no iOS. Ele substitui o antigo componente Picker do núcleo. ex. https://www.youtube.com/watch?v=8R76Gcc1YbI&t=27s
npm install @react-native-picker/picker

## axios
npm install axios

## The following packages should be updated for best compatibility with the installed expo version:
##  @react-native-picker/picker@2.11.4 - expected version: 2.11.1
## Your project may not work correctly until you install the expected versions of the packages.
npx expo install --check

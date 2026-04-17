import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerBackButtonDisplayMode: 'minimal',
          headerTintColor: '#111827',
          headerTitleStyle: {
            fontWeight: '700',
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: '#F7F8FA',
          },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="converter" options={{ title: 'Unit Converter' }} />
        <Stack.Screen name="notes" options={{ title: 'Notes' }} />
        <Stack.Screen name="calculator" options={{ title: 'Calculator' }} />
        <Stack.Screen name="tasks" options={{ title: 'Task Manager' }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
    </>
  );
}

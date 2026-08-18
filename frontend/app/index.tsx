import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect to login by default for Stage 1
  return <Redirect href="/(auth)/login" />;
}

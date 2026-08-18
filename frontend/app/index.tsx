import { Redirect } from 'expo-router';

// DEVELOPMENT FIXTURE: Set to true to bypass auth and view the authenticated Home dashboard during UI development.
const DEV_BYPASS_AUTH = true;

export default function Index() {
  if (DEV_BYPASS_AUTH) {
    return <Redirect href="/(app)/home" />;
  }
  // Redirect to login by default for Stage 1
  return <Redirect href="/(auth)/login" />;
}

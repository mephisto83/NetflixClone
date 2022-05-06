import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Amplify from 'aws-amplify';
// import { withAuthenticator } from 'aws-amplify-react-native';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation, { SigninNavigation } from './navigation';
import useAuth from './auth/auth';
// import config from './aws-exports';

// Amplify.configure(config);

function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const { isAuthSetup, signedIn, signIn } = useAuth();

  if (!isLoadingComplete || !isAuthSetup) {
    console.log('not loaded')
    return null;
  } else if (true) {
    console.log('signin screen')
    return (
      <SafeAreaProvider>
        <SigninNavigation colorScheme={colorScheme} />
      </SafeAreaProvider>
    );
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}

export default App;// withAuthenticator(App);

import { StackScreenProps } from '@react-navigation/stack';
import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PROVIDERS, signinWith } from '../auth/auth';

import { RootStackParamList } from '../types';

export default function SignInScreen({
  navigation
}: StackScreenProps<RootStackParamList, 'SignIn'>) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signin Screen.</Text>
      <TouchableOpacity onPress={() => {
        signinWith(PROVIDERS.GOOGLE)
      }} style={styles.link}>
        <Text style={styles.linkText}>Googl Signin</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});

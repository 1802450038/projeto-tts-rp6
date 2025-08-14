import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import { ReadableStream } from 'web-streams-polyfill/ponyfill';

globalThis.ReadableStream = ReadableStream;

export function App() {
  const ctx = require.context('./app');
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);
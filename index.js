import '@azure/core-asynciterator-polyfill'
import "expo-router/entry";
import { Amplify } from 'aws-amplify';
import awsExports from './src/aws-exports';
import * as Font from "expo-font";

useFonts = async () =>
  await Font.loadAsync({
    'Ogirema': require('./assets/Ogirema.ttf'),
  });
useFonts();
Amplify.configure(awsExports);
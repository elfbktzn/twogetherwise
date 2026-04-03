import { useState, useCallback } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Crypto from 'expo-crypto';
import { loginWithGoogle } from '@/services/authService';
import { Alert } from 'react-native';

const IOS_CLIENT_ID =
  '1080975271512-rep1aaie0rml5q61aaa7km4llmerfd8l.apps.googleusercontent.com';

const REDIRECT_URI =
  'com.googleusercontent.apps.1080975271512-rep1aaie0rml5q61aaa7km4llmerfd8l:/oauthredirect';

const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';

async function generatePKCE() {
  const verifier = Crypto.randomUUID() + Crypto.randomUUID();
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    verifier,
    { encoding: Crypto.CryptoEncoding.BASE64 },
  );
  // Base64url encode
  const challenge = digest.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return { verifier, challenge };
}

export function useGoogleAuth() {
  const [isLoading, setIsLoading] = useState(false);

  const promptAsync = useCallback(async () => {
    setIsLoading(true);
    try {
      const { verifier, challenge } = await generatePKCE();

      const authUrl =
        'https://accounts.google.com/o/oauth2/v2/auth?' +
        `client_id=${IOS_CLIENT_ID}&` +
        `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
        'response_type=code&' +
        `scope=${encodeURIComponent('openid profile email')}&` +
        `code_challenge=${challenge}&` +
        'code_challenge_method=S256&' +
        'access_type=offline';

      const result = await WebBrowser.openAuthSessionAsync(authUrl, REDIRECT_URI);

      if (result.type === 'success' && result.url) {
        // Extract authorization code from redirect URL query params
        const url = result.url;
        const codeMatch = url.match(/[?&]code=([^&]+)/);
        if (codeMatch) {
          const code = decodeURIComponent(codeMatch[1]);

          // Exchange code for tokens
          const tokenResponse = await fetch(TOKEN_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body:
              `client_id=${IOS_CLIENT_ID}&` +
              `code=${code}&` +
              `code_verifier=${verifier}&` +
              `grant_type=authorization_code&` +
              `redirect_uri=${encodeURIComponent(REDIRECT_URI)}`,
          });

          const tokens = await tokenResponse.json();
          if (tokens.id_token) {
            await loginWithGoogle(tokens.id_token);
            return;
          }
          Alert.alert('Error', 'Token exchange failed.');
        } else {
          Alert.alert('Error', 'No authorization code received.');
        }
      }
    } catch (err: any) {
      Alert.alert('Google Sign-In Failed', err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    promptAsync,
    isReady: true,
    isLoading,
  };
}

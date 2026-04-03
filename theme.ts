import { Platform } from 'react-native';

// Global color and font palette for Twogetherwise
export const COLORS = {
  primary: '#3b82f6', // mavi - Twogetherwise logo rengi (eski: kırmızı)
  secondary: '#a78bfa', // mor - abonelik için (eski: turuncu)
  gray: '#dad5d5',    // ana gri
  grayDark: '#999999',
  grayMedium: '#b3b3b3', // orta gri
  grayLight: '#f8f8f8',
  white: '#ffffff',
  black: '#000000',
  text: '#1A1A2E', // ana metin rengi (sıcak siyah)
  lightGray: '#f0f0f0', // açık gri
  red: '#FF3B30', // kırmızı (silme/tehlikeli işlemler için)
  orange: '#FF9500', // turuncu (uyarılar için)
  success: '#4CD964', // yeşil (başarılı işlemler için)
  primaryLight: '#e0e7ff', // açık mavi-mor (arka plan için)
  gradient: ['#3b82f6', '#a78bfa'], // mavi-mor gradient
  // Refined UI palette
  bgPrimary: '#F7F5F2',       // warm off-white background
  textPrimary: '#1C1C1C',     // charcoal — headlines
  textSecondary: '#4A4A4A',   // secondary — summary text
  textTertiary: '#8C8C8C',    // metadata, subtle elements
  accent: '#5A4B6E',          // deep plum — index numbers, minimal highlights
  cardBorder: '#ECE8E3',      // hairline card separation
  dividerLight: '#ECE8E3',    // breathing divider
  // Auth & input colors
  inputBg: 'rgba(255, 255, 255, 0.85)',
  inputText: '#333333',
  placeholderText: 'rgba(80, 80, 80, 0.5)',
  divider: 'rgba(255, 255, 255, 0.3)',
  textMuted: '#D0D0D0',
  textOnGradient: 'rgba(255, 255, 255, 0.6)',
  textOnGradientStrong: 'rgba(255, 255, 255, 0.8)',
  buttonPrimary: '#6a3de8',
  buttonGlow: '#7c4dff',
  cardBg: '#f8f9ff',
  cardBorderAuth: '#e0e0ff',
  authGradient: ['#667eea', '#764ba2', '#f093fb'] as const,
};

export const FONTS = {
 logo: 'Baloo2_700Bold',           // logo fontu (DM Sans Bold)
   heading: 'DMSans_700Bold',     // başlıklar (DM Sans Bold)
  paragraph: 'Nunito_400Regular',   // paragraflar (Nunito Regular)
  text: 'Nunito_400Regular',        // genel metin (Nunito Regular)
  regular: 'Nunito_400Regular',     // normal font (Nunito Regular)
  medium: 'Nunito_600SemiBold',     // orta kalınlık font (Nunito SemiBold)
  body: 'Nunito_400Regular',        // body metinleri için (Nunito Regular)
  primary: 'DMSans_700Bold',        // primary font (DM Sans Bold)
  primaryMedium: 'DMSans_500Medium', // primary medium (DM Sans Medium)
};

// Android'de text'lerin etrafındaki siyah çerçeveyi kaldırmak için global text stilleri
export const TEXT_STYLE_FIX = Platform.select({
  android: {
    includeFontPadding: false,
    textAlignVertical: 'center' as const,
    // Android'de bold text'lerde oluşan siyah çizgiyi önle
    borderWidth: 0,
    borderColor: 'transparent',
  },
  default: {},
});

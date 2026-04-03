import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { updateOnboardingStatus } from '@/services/authService';
import { AuthScreenProps } from '@/types/navigation';
import { COLORS, FONTS } from '../../theme';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    emoji: '✍️',
    title: 'Share How You Feel',
    description:
      'Each day, answer a simple prompt with one sentence about your emotions.',
  },
  {
    emoji: '🤖',
    title: 'AI Understands You',
    description:
      'Your words are analyzed to understand the emotion behind them.',
  },
  {
    emoji: '🌍',
    title: 'See the World',
    description:
      "The next day, explore a map showing how people around the world felt.",
  },
  {
    emoji: '🤝',
    title: "You're Not Alone",
    description:
      'Discover that others share your feelings. Connect through shared emotions.',
  },
];

export function OnboardingScreen({ navigation }: AuthScreenProps<'Onboarding'>) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { firebaseUser } = useAuth();

  const handleNext = async () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      if (firebaseUser) {
        await updateOnboardingStatus(firebaseUser.uid);
      }
    }
  };

  const slide = SLIDES[currentSlide];

  return (
    <View style={styles.container}>
      <View style={styles.slideContainer}>
        <Text style={styles.emoji}>{slide.emoji}</Text>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.description}>{slide.description}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === currentSlide && styles.dotActive]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextBtnText}>
            {currentSlide === SLIDES.length - 1 ? "Let's Go!" : 'Next'}
          </Text>
        </TouchableOpacity>

        {currentSlide < SLIDES.length - 1 && (
          <TouchableOpacity
            onPress={async () => {
              if (firebaseUser) {
                await updateOnboardingStatus(firebaseUser.uid);
              }
            }}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
    justifyContent: 'space-between',
  },
  slideContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emoji: {
    fontSize: 72,
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontFamily: FONTS.heading,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    fontFamily: FONTS.text,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 50,
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.cardBorder,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: COLORS.primary,
    width: 24,
  },
  nextBtn: {
    backgroundColor: COLORS.buttonPrimary,
    borderRadius: 12,
    paddingVertical: 15,
    width: width - 64,
    alignItems: 'center',
  },
  nextBtnText: {
    color: COLORS.white,
    fontSize: 17,
    fontFamily: FONTS.heading,
  },
  skipText: {
    color: COLORS.textTertiary,
    marginTop: 16,
    fontSize: 14,
    fontFamily: FONTS.text,
  },
});

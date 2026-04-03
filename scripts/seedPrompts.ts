/**
 * Seed script: Run with ts-node to populate daily_prompts in Firestore.
 * Usage: npx ts-node scripts/seedPrompts.ts
 *
 * Requires: GOOGLE_APPLICATION_CREDENTIALS env var pointing to your
 * Firebase service account key JSON file.
 */

import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

const PROMPTS = [
  'How are you feeling today?',
  'What emotion has been strongest for you this week?',
  'If your mood were a color, what would it be and why?',
  'What is one thing that made you smile recently?',
  'What is weighing on your mind right now?',
  'Describe your current state of mind in one sentence.',
  'What are you grateful for today?',
  'What would make today better?',
  'How did you sleep last night, and how does it affect your mood?',
  'If you could tell the world one thing about how you feel, what would it be?',
  'What emotion do you wish you felt more often?',
  'What is one thing you are looking forward to?',
  'How do you feel about the state of the world today?',
  'What is one worry you would like to let go of?',
  'Describe a moment from today that affected your mood.',
  'What does peace mean to you right now?',
  'How connected do you feel to the people around you?',
  'What emotion surprised you today?',
  'If you could send a feeling to someone far away, what would it be?',
  'How do you feel about tomorrow?',
  'What is one thing that gives you hope?',
  'How do you feel when you are alone?',
  'What makes you feel most alive?',
  'Describe your energy level right now in one word.',
  'What would you say to comfort someone feeling the same as you?',
  'How do you feel about change happening in your life?',
  'What emotion do you find hardest to express?',
  'How does the weather affect your mood today?',
  'What is one kind thing you did for yourself today?',
  'How do you feel at this exact moment?',
];

async function seed() {
  const today = new Date();

  for (let i = 0; i < PROMPTS.length; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];

    await db.collection('daily_prompts').doc(dateStr).set({
      date: dateStr,
      text: PROMPTS[i],
      createdAt: new Date().toISOString(),
    });

    console.log(`Seeded prompt for ${dateStr}: "${PROMPTS[i].substring(0, 40)}..."`);
  }

  console.log(`\nDone! Seeded ${PROMPTS.length} prompts.`);
}

seed().catch(console.error);

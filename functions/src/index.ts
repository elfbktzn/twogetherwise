import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const db = admin.firestore();

// Emotion classification on entry creation
export const classifyEmotionOnWrite = functions.firestore
  .document('entries/{entryId}')
  .onCreate(async (snap, context) => {
    const entry = snap.data();
    
    if (!entry.text) {
      console.log('No text to classify');
      return null;
    }

    try {
      // Placeholder emotion classification
      const emotion = await classifyEmotion(entry.text);
      
      // Update the entry with classified emotion
      await snap.ref.update({ emotion });
      
      console.log(`Classified emotion: ${emotion} for entry: ${context.params.entryId}`);
      
      // Trigger stats update
      await updateDailyStats(entry.date, emotion, entry.country);
      
      return { emotion };
    } catch (error) {
      console.error('Error classifying emotion:', error);
      return null;
    }
  });

// Update daily emotion statistics
export const updateDailyStats = functions.https.onCall(async (data, context) => {
  const { date, emotion, country } = data;
  
  if (!date || !emotion || !country) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
  }

  try {
    const statsRef = db.collection('emotion_daily_stats')
      .where('date', '==', date)
      .where('emotion', '==', emotion)
      .where('country', '==', country)
      .limit(1);

    const snapshot = await statsRef.get();
    
    if (snapshot.empty) {
      // Create new stats document
      await db.collection('emotion_daily_stats').add({
        date,
        emotion,
        country,
        count: 1,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    } else {
      // Update existing stats
      const doc = snapshot.docs[0];
      await doc.ref.update({
        count: admin.firestore.FieldValue.increment(1),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error updating daily stats:', error);
    throw new functions.https.HttpsError('internal', 'Failed to update stats');
  }
});

// Helper function to update daily stats (used internally)
async function updateDailyStats(date: string, emotion: string, country: string) {
  const statsRef = db.collection('emotion_daily_stats')
    .where('date', '==', date)
    .where('emotion', '==', emotion)
    .where('country', '==', country)
    .limit(1);

  const snapshot = await statsRef.get();
  
  if (snapshot.empty) {
    await db.collection('emotion_daily_stats').add({
      date,
      emotion,
      country,
      count: 1,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  } else {
    const doc = snapshot.docs[0];
    await doc.ref.update({
      count: admin.firestore.FieldValue.increment(1),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }
}

// Placeholder emotion classifier (replace with actual AI service)
async function classifyEmotion(text: string): Promise<string> {
  const lowerText = text.toLowerCase();
  
  if (lowerText.indexOf('happy') !== -1 || lowerText.indexOf('joy') !== -1 || lowerText.indexOf('excited') !== -1) {
    return 'joy';
  }
  if (lowerText.indexOf('sad') !== -1 || lowerText.indexOf('depressed') !== -1 || lowerText.indexOf('down') !== -1) {
    return 'sadness';
  }
  if (lowerText.indexOf('anxious') !== -1 || lowerText.indexOf('worried') !== -1 || lowerText.indexOf('nervous') !== -1) {
    return 'anxiety';
  }
  if (lowerText.indexOf('hope') !== -1 || lowerText.indexOf('optimistic') !== -1 || lowerText.indexOf('looking forward') !== -1) {
    return 'hope';
  }
  if (lowerText.indexOf('lonely') !== -1 || lowerText.indexOf('alone') !== -1 || lowerText.indexOf('isolated') !== -1) {
    return 'loneliness';
  }
  if (lowerText.indexOf('calm') !== -1 || lowerText.indexOf('peaceful') !== -1 || lowerText.indexOf('relaxed') !== -1) {
    return 'calm';
  }
  
  // Default emotion
  const emotions = ['joy', 'sadness', 'anxiety', 'hope', 'loneliness', 'calm'];
  return emotions[Math.floor(Math.random() * emotions.length)];
}

// Create daily prompt (scheduled function)
export const createDailyPrompt = functions.pubsub
  .schedule('0 0 * * *') // Daily at midnight UTC
  .timeZone('UTC')
  .onRun(async (context) => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    const prompts = [
      "How are you feeling today?",
      "What emotion is most present for you right now?",
      "Describe your current emotional state in one sentence.",
      "What's on your mind today?",
      "How would you describe your mood at this moment?",
      "What emotional color describes your day?",
      "If your feelings had a weather forecast, what would it be?",
      "What emotion is guiding your decisions today?"
    ];
    
    const promptIndex = new Date().getDate() % prompts.length;
    const promptText = prompts[promptIndex];
    
    try {
      await db.collection('daily_prompts').add({
        date: today,
        text: promptText,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      console.log(`Created daily prompt for ${today}: ${promptText}`);
      return { success: true, date: today, prompt: promptText };
    } catch (error) {
      console.error('Error creating daily prompt:', error);
      return null;
    }
  });

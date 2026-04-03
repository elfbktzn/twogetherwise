import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { classifyEmotion } from './emotionClassifier';

admin.initializeApp();
const db = admin.firestore();

/**
 * Cloud Function 1: classifyEmotionOnWrite
 * Triggered when a new entry is created in the 'entries' collection.
 * Classifies the text and updates the entry document with the detected emotion.
 * Then triggers the stats update.
 */
export const classifyEmotionOnWrite = functions.firestore
  .document('entries/{entryId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const text: string = data.text || '';
    const entryId = context.params.entryId;

    try {
      const result = classifyEmotion(text);

      await db.collection('entries').doc(entryId).update({
        emotion: result.emotion,
        emotionConfidence: result.confidence,
      });

      // Trigger stats update
      await updateStats(data.date, result.emotion, data.country, data.lat, data.lng);

      functions.logger.info(
        `Classified entry ${entryId}: ${result.emotion} (${result.confidence})`
      );
    } catch (error) {
      functions.logger.error(`Error classifying entry ${entryId}:`, error);
    }
  });

/**
 * Cloud Function 2: updateDailyStats
 * Can also be called as an HTTP function for manual re-aggregation.
 */
export const updateDailyStats = functions.https.onRequest(async (req, res) => {
  const date = req.query.date as string;
  if (!date) {
    res.status(400).json({ error: 'date query param required (YYYY-MM-DD)' });
    return;
  }

  try {
    const entriesSnap = await db
      .collection('entries')
      .where('date', '==', date)
      .where('emotion', '!=', null)
      .get();

    // Aggregate by emotion + country
    const aggregation: Record<string, { emotion: string; country: string; count: number; lat: number; lng: number }> = {};

    entriesSnap.docs.forEach((doc) => {
      const d = doc.data();
      const key = `${d.emotion}_${d.country}`;
      if (!aggregation[key]) {
        aggregation[key] = {
          emotion: d.emotion,
          country: d.country,
          count: 0,
          lat: d.lat,
          lng: d.lng,
        };
      }
      aggregation[key].count += 1;
    });

    // Write aggregated stats
    const batch = db.batch();
    for (const [key, stat] of Object.entries(aggregation)) {
      const docId = `${date}_${key}`;
      const ref = db.collection('emotion_daily_stats').doc(docId);
      batch.set(ref, { date, ...stat }, { merge: true });
    }
    await batch.commit();

    res.json({ success: true, statsCount: Object.keys(aggregation).length });
  } catch (error) {
    functions.logger.error('Error in updateDailyStats:', error);
    res.status(500).json({ error: 'Internal error' });
  }
});

/**
 * Helper: Update stats incrementally when a single entry is classified.
 */
async function updateStats(
  date: string,
  emotion: string,
  country: string,
  lat: number,
  lng: number
): Promise<void> {
  const docId = `${date}_${emotion}_${country}`;
  const ref = db.collection('emotion_daily_stats').doc(docId);

  await db.runTransaction(async (transaction) => {
    const doc = await transaction.get(ref);
    if (doc.exists) {
      const currentCount = doc.data()?.count || 0;
      transaction.update(ref, { count: currentCount + 1 });
    } else {
      transaction.set(ref, {
        date,
        emotion,
        country,
        count: 1,
        lat,
        lng,
      });
    }
  });
}

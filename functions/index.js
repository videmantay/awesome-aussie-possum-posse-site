import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { defineSecret } from 'firebase-functions/params';
import { logger } from 'firebase-functions';

const mailerLiteKey = defineSecret('MAILERLITE_API_KEY');
const mailerLiteGroupId = defineSecret('MAILERLITE_GROUP_ID');

export const syncSubscriberToMailerLite = onDocumentCreated(
  {
    document: 'subscribers/{docId}',
    database: 'awesausspossposs',
    region: 'us-west1',
    secrets: [mailerLiteKey, mailerLiteGroupId],
  },
  async (event) => {
    const data = event.data?.data();

    if (!data?.email) {
      logger.warn('syncSubscriberToMailerLite: document missing email, skipping', { docId: event.params.docId });
      return;
    }

    const groupId = mailerLiteGroupId.value();
    const apiKey = mailerLiteKey.value();

    logger.info('syncSubscriberToMailerLite: sending to MailerLite', {
      email: data.email,
      hasName: !!data.name,
      groupId,
      apiKeyPrefix: apiKey.slice(0, 8) + '...',
    });

    const payload = {
      email: data.email,
      groups: [groupId],
      fields: {
        ...(data.name && { name: data.name }),
        ...(data.prefLang && { pref_lang: data.prefLang }),
      },
    };

    let res;
    try {
      res = await fetch('https://connect.mailerlite.com/api/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      logger.error('syncSubscriberToMailerLite: network error reaching MailerLite', err);
      throw err;
    }

    const responseBody = await res.text();

    // 200 = updated existing subscriber, 201 = created new — both are success.
    if (!res.ok) {
      logger.error('syncSubscriberToMailerLite: MailerLite returned an error', {
        status: res.status,
        body: responseBody,
        email: data.email,
      });
      // Re-throw so Cloud Functions marks the invocation as failed and retries.
      throw new Error(`MailerLite API error: ${res.status}`);
    }

    logger.info('syncSubscriberToMailerLite: subscriber synced', {
      email: data.email,
      status: res.status,
      response: responseBody,
    });
  }
);

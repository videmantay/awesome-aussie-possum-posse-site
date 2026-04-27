const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { defineSecret } = require('firebase-functions/params');
const { logger } = require('firebase-functions');

const mailerLiteKey = defineSecret('MAILERLITE_API_KEY');
const mailerLiteGroupId = defineSecret('MAILERLITE_GROUP_ID');

exports.syncSubscriberToMailerLite = onDocumentCreated(
  {
    document: 'subscribers/{docId}',
    database: 'awesausspossposs',
    secrets: [mailerLiteKey, mailerLiteGroupId],
  },
  async (event) => {
    const data = event.data?.data();

    if (!data?.email) {
      logger.warn('syncSubscriberToMailerLite: document missing email, skipping', { docId: event.params.docId });
      return;
    }

    const payload = {
      email: data.email,
      groups: [mailerLiteGroupId.value()],
    };

    if (data.name) {
      payload.fields = { name: data.name };
    }

    let res;
    try {
      res = await fetch('https://connect.mailerlite.com/api/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${mailerLiteKey.value()}`,
        },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      logger.error('syncSubscriberToMailerLite: network error reaching MailerLite', err);
      throw err;
    }

    // 200 = updated existing subscriber, 201 = created new — both are success.
    // 409 can also mean duplicate; MailerLite v3 typically returns 200/201.
    if (!res.ok) {
      const body = await res.text();
      logger.error('syncSubscriberToMailerLite: MailerLite returned an error', {
        status: res.status,
        body,
        email: data.email,
      });
      // Re-throw so Cloud Functions marks the invocation as failed and retries.
      throw new Error(`MailerLite API error: ${res.status}`);
    }

    logger.info('syncSubscriberToMailerLite: subscriber synced', { email: data.email });
  }
);

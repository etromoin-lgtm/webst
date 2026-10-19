let webhookConfig = { url: null };

const getWebhookConfig = () => webhookConfig;

const setWebhookUrl = (url) => {
  webhookConfig.url = url;
};

const fireWebhook = async (event_type, payload) => {
  if (!webhookConfig.url) return;
  try {
    await fetch(webhookConfig.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: event_type, data: payload, fired_at: new Date() })
    });
    console.log(`[Webhook] Fired ${event_type}`);
  } catch (err) {
    console.error(`[Webhook Error]`, err.message);
  }
};

module.exports = {
  getWebhookConfig,
  setWebhookUrl,
  fireWebhook
};

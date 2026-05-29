import axios from 'axios';

const DISCORD_WEBHOOK_URL =
  'https://discord.com/api/webhooks/1509844668727164928/Kb5nXxC5D2gjJTIjNPiuRuQJg6SY2KRsPa3C_ta3kqmqCptRmHZXf-09lwHCc912Zdbe';

export async function sendFeedback(feedback: string) {
  return axios.post(
    DISCORD_WEBHOOK_URL,
    {
      content: ['[의견보내기]', feedback].join('\n'),
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}

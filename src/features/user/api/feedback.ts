import axios from 'axios';

import { apiClient } from '@/src/shared/api/api';

const DISCORD_WEBHOOK_URL =
  'https://discord.com/api/webhooks/1509844668727164928/Kb5nXxC5D2gjJTIjNPiuRuQJg6SY2KRsPa3C_ta3kqmqCptRmHZXf-09lwHCc912Zdbe';

export async function sendFeedback({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  return apiClient.post('/feedback', { title, content });
}

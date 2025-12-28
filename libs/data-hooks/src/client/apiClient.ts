// libs/data-hooks/src/client/apiClient.ts
import axios from 'axios';

const baseURL =
  import.meta.env.VITE_AI_GATEWAY_URL || 'http://localhost:3001';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});
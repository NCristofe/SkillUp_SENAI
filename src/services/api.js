import axios from 'axios';

// ── Instância base do Axios ──────────────────────────────────────────────────
// Em produção, substitua pela URL real da API.
const BASE_URL = 'https://api.senai-suico.example.com/v1';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ── Interceptors de request ──────────────────────────────────────────────────

api.interceptors.request.use(
  (config) => {
    // Aqui você pode adicionar token de autenticação:
    // const token = await AsyncStorage.getItem('@senai:token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Interceptors de response ─────────────────────────────────────────────────

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ??
      error.message ??
      'Erro de conexão. Verifique sua internet.';
    return Promise.reject(new Error(message));
  },
);

// ── Serviço de contato ───────────────────────────────────────────────────────
// Envia mensagem de contato para o servidor.
// Se o servidor não estiver disponível, a função rejeita com erro descritivo.

export async function sendContactMessage({ nome, email, telefone, mensagem }) {
  return api.post('/contact', { nome, email, telefone, mensagem });
}

// ── Serviço de matrícula ─────────────────────────────────────────────────────

export async function requestEnrollment({ courseId, nome, email, telefone }) {
  return api.post('/enrollment', { courseId, nome, email, telefone });
}

// ── Serviço de newsletter ────────────────────────────────────────────────────

export async function subscribeNewsletter({ email }) {
  return api.post('/newsletter', { email });
}

export default api;

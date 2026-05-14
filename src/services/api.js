import axios from 'axios';

const BASE_URL = 'https://api.senai-suico.example.com/v1';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

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

export async function sendContactMessage({ nome, email, telefone, mensagem }) {
  return api.post('/contact', { nome, email, telefone, mensagem });
}

export async function requestEnrollment({ courseId, nome, email, telefone }) {
  return api.post('/enrollment', { courseId, nome, email, telefone });
}

export async function subscribeNewsletter({ email }) {
  return api.post('/newsletter', { email });
}

export default api;

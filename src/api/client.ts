import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('agent');
      // Optional: Redirect to login or dispatch event
      if (!window.location.pathname.includes('/auth')) {
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  }
);

export const fetchClient = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
  // Adapter for existing code using fetchClient style
  // We map the fetch options to axios config
  const method = options?.method || 'GET';
  const data = options?.body ? JSON.parse(options.body as string) : undefined;

  const response = await client.request({
    url: endpoint,
    method,
    data,
    // headers: options?.headers as any, // Axios handles headers mostly
  });
  return response.data;
};

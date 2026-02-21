import axios from 'axios';

// ─── Base Instance ─────────────────────────────────────────────────────────────
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: { 'Content-Type': 'application/json' },
});

// ─── Request Interceptor: attach JWT automatically ─────────────────────────────
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('cc_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ─── Response Interceptor: unwrap data / surface error message ─────────────────
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const message =
            error.response?.data?.message ||
            error.message ||
            'Something went wrong';
        return Promise.reject(new Error(message));
    }
);

// ─── Auth ──────────────────────────────────────────────────────────────────────
export const authApi = {
    register: (body) => api.post('/auth/register', body),
    login: (body) => api.post('/auth/login', body),
    getProfile: () => api.get('/auth/profile'),
};

// ─── Users ─────────────────────────────────────────────────────────────────────
export const usersApi = {
    me: () => api.get('/users/me'),
    getAll: (params) => api.get('/users', { params }),
    getSeniors: (params) => api.get('/users/seniors', { params }),
    getById: (id) => api.get(`/users/${id}`),
    updateProfile: (body) => api.put('/users/profile', body),
    changePassword: (body) => api.put('/users/change-password', body),
};

// ─── Sessions ──────────────────────────────────────────────────────────────────
export const sessionsApi = {
    getAll: () => api.get('/mentors/sessions'),
    getById: (id) => api.get(`/mentors/sessions/${id}`),
    create: (body) => api.post('/mentors/sessions', body),
    join: (id) => api.post(`/mentors/sessions/${id}/join`),
    leave: (id) => api.post(`/mentors/sessions/${id}/leave`),
    delete: (id) => api.delete(`/mentors/sessions/${id}`),
};

// ─── Groups ────────────────────────────────────────────────────────────────────
export const groupsApi = {
    getAll: (params) => api.get('/groups', { params }),
    getById: (id) => api.get(`/groups/${id}`),
    create: (body) => api.post('/groups', body),
    join: (id) => api.post(`/groups/${id}/join`),
    leave: (id) => api.post(`/groups/${id}/leave`),
    delete: (id) => api.delete(`/groups/${id}`),
};

// ─── Posts ─────────────────────────────────────────────────────────────────────
export const postsApi = {
    getAll: (params) => api.get('/posts', { params }),
    getById: (id) => api.get(`/posts/${id}`),
    create: (body) => api.post('/posts', body),
    delete: (id) => api.delete(`/posts/${id}`),
    addComment: (postId, body) => api.post(`/posts/${postId}/comments`, body),
    deleteComment: (postId, commentId) => api.delete(`/posts/${postId}/comments/${commentId}`),
};

// ─── Notifications ─────────────────────────────────────────────────────────────
export const notificationsApi = {
    getAll: () => api.get('/notifications'),
    markAsRead: (id) => api.patch(`/notifications/${id}/read`),
    markAllAsRead: () => api.patch('/notifications/read-all'),
    delete: (id) => api.delete(`/notifications/${id}`),
};

// ─── Achievements ──────────────────────────────────────────────────────────────
export const achievementsApi = {
    getByUser: (userId) => api.get(`/achievements/${userId}`),
    add: (body) => api.post('/achievements', body),
    update: (id, body) => api.put(`/achievements/${id}`, body),
    delete: (id) => api.delete(`/achievements/${id}`),
};

// ─── Chat ──────────────────────────────────────────────────────────────────────
export const chatApi = {
    sendRequest: (body) => api.post('/chat/request', body),
    getRequests: () => api.get('/chat/requests'),
    accept: (id) => api.put(`/chat/requests/${id}/accept`),
    reject: (id) => api.put(`/chat/requests/${id}/reject`),
    getMessages: (id) => api.get(`/chat/${id}/messages`),
    sendMessage: (id, body) => api.post(`/chat/${id}/messages`, body),
};

export default api;


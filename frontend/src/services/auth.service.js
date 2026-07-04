import api from './api';

export const authService = {
  register: (payload) => api.post('/auth/register', payload),
  login: (payload) => api.post('/auth/login', payload),
  logout: () => api.post('/auth/logout'),
  refresh: () => api.post('/auth/refresh'),
};

export const profileService = {
  get: () => api.get('/profile'),
  update: (payload) => api.put('/profile', payload),
  uploadResume: (formData) =>
    api.post('/profile/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export const dashboardService = {
  get: () => api.get('/dashboard'),
};

export const careerService = {
  predict: (payload) => api.post('/career/predict', payload),
  history: () => api.get('/career/history'),
};

export const internshipService = {
  start: (payload) => api.post('/internship/start', payload),
  getTasks: (params) => api.get('/internship/tasks', { params }),
  submitTask: (payload) => api.post('/internship/submit', payload),
};

export const resumeService = {
  analyze: (payload) => api.post('/resume/analyze', payload),
  reports: () => api.get('/resume/reports'),
};

export const interviewService = {
  start: (payload) => api.post('/interview/start', payload),
  submitFeedback: (payload) => api.post('/interview/feedback', payload),
};

export const roadmapService = {
  generate: (payload) => api.post('/roadmap/generate', payload),
  get: () => api.get('/roadmap'),
  updateMilestone: (roadmapId, milestoneIndex, payload) =>
    api.patch(`/roadmap/${roadmapId}/milestone/${milestoneIndex}`, payload),
};

export const notificationService = {
  get: () => api.get('/notifications'),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/read-all'),
};

export const skillService = {
  gapAnalysis: (payload) => api.post('/skills/gap-analysis', payload),
  gapHistory: () => api.get('/skills/gap-analysis/history'),
};

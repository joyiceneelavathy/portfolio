import axios, { AxiosInstance } from 'axios';
import {
  ApiResponse,
  Profile,
  About,
  Education,
  Skill,
  Project,
  Certificate,
  Experience,
  Service,
  Resume,
  ContactFormData,
  ContactMessage,
  SocialLink,
  WebsiteSettings,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT for authenticated requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      message:
        error.response?.data?.message ||
        error.message ||
        'Unable to connect to server.',
      status: error.response?.status,
    };
    return Promise.reject(customError);
  }
);

// ─── Auth ──────────────────────────────────────────────────────────────
export const authService = {
  login: async (email: string, password: string) => {
    const res = await apiClient.post('/auth/login', { email, password });
    return res.data;
  },
  getMe: async () => {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },
  changePassword: async (currentPassword: string, newPassword: string) => {
    const res = await apiClient.post('/auth/change-password', { currentPassword, newPassword });
    return res.data;
  },
};

// ─── Profile ───────────────────────────────────────────────────────────
export const profileService = {
  get: async (): Promise<ApiResponse<Profile>> => {
    const res = await apiClient.get<ApiResponse<Profile>>('/profile');
    return res.data;
  },
  update: async (data: Partial<Profile>): Promise<ApiResponse<Profile>> => {
    const res = await apiClient.put<ApiResponse<Profile>>('/profile', data);
    return res.data;
  },
};

// ─── About ─────────────────────────────────────────────────────────────
export const aboutService = {
  get: async (): Promise<ApiResponse<About>> => {
    const res = await apiClient.get<ApiResponse<About>>('/about');
    return res.data;
  },
  update: async (data: Partial<About>): Promise<ApiResponse<About>> => {
    const res = await apiClient.put<ApiResponse<About>>('/about', data);
    return res.data;
  },
};

// ─── Education ─────────────────────────────────────────────────────────
export const educationService = {
  getAll: async (): Promise<ApiResponse<Education[]>> => {
    const res = await apiClient.get<ApiResponse<Education[]>>('/education');
    return res.data;
  },
  create: async (data: Partial<Education>): Promise<ApiResponse<Education>> => {
    const res = await apiClient.post<ApiResponse<Education>>('/education', data);
    return res.data;
  },
  update: async (id: string, data: Partial<Education>): Promise<ApiResponse<Education>> => {
    const res = await apiClient.put<ApiResponse<Education>>(`/education/${id}`, data);
    return res.data;
  },
  delete: async (id: string): Promise<ApiResponse<null>> => {
    const res = await apiClient.delete<ApiResponse<null>>(`/education/${id}`);
    return res.data;
  },
};

// ─── Skills ────────────────────────────────────────────────────────────
export const skillService = {
  getAll: async (): Promise<ApiResponse<Skill[]>> => {
    const res = await apiClient.get<ApiResponse<Skill[]>>('/skills');
    return res.data;
  },
  create: async (data: Partial<Skill>): Promise<ApiResponse<Skill>> => {
    const res = await apiClient.post<ApiResponse<Skill>>('/skills', data);
    return res.data;
  },
  update: async (id: string, data: Partial<Skill>): Promise<ApiResponse<Skill>> => {
    const res = await apiClient.put<ApiResponse<Skill>>(`/skills/${id}`, data);
    return res.data;
  },
  delete: async (id: string): Promise<ApiResponse<null>> => {
    const res = await apiClient.delete<ApiResponse<null>>(`/skills/${id}`);
    return res.data;
  },
};

// ─── Projects ──────────────────────────────────────────────────────────
export const projectService = {
  getAll: async (): Promise<ApiResponse<Project[]>> => {
    const res = await apiClient.get<ApiResponse<Project[]>>('/projects');
    return res.data;
  },
  getById: async (id: string): Promise<ApiResponse<Project>> => {
    const res = await apiClient.get<ApiResponse<Project>>(`/projects/${id}`);
    return res.data;
  },
  create: async (data: Partial<Project>): Promise<ApiResponse<Project>> => {
    const res = await apiClient.post<ApiResponse<Project>>('/projects', data);
    return res.data;
  },
  update: async (id: string, data: Partial<Project>): Promise<ApiResponse<Project>> => {
    const res = await apiClient.put<ApiResponse<Project>>(`/projects/${id}`, data);
    return res.data;
  },
  delete: async (id: string): Promise<ApiResponse<null>> => {
    const res = await apiClient.delete<ApiResponse<null>>(`/projects/${id}`);
    return res.data;
  },
};

// ─── Certificates ──────────────────────────────────────────────────────
export const certificateService = {
  getAll: async (): Promise<ApiResponse<Certificate[]>> => {
    const res = await apiClient.get<ApiResponse<Certificate[]>>('/certificates');
    return res.data;
  },
  create: async (data: Partial<Certificate>): Promise<ApiResponse<Certificate>> => {
    const res = await apiClient.post<ApiResponse<Certificate>>('/certificates', data);
    return res.data;
  },
  update: async (id: string, data: Partial<Certificate>): Promise<ApiResponse<Certificate>> => {
    const res = await apiClient.put<ApiResponse<Certificate>>(`/certificates/${id}`, data);
    return res.data;
  },
  delete: async (id: string): Promise<ApiResponse<null>> => {
    const res = await apiClient.delete<ApiResponse<null>>(`/certificates/${id}`);
    return res.data;
  },
};

// ─── Experience ────────────────────────────────────────────────────────
export const experienceService = {
  getAll: async (): Promise<ApiResponse<Experience[]>> => {
    const res = await apiClient.get<ApiResponse<Experience[]>>('/experience');
    return res.data;
  },
  create: async (data: Partial<Experience>): Promise<ApiResponse<Experience>> => {
    const res = await apiClient.post<ApiResponse<Experience>>('/experience', data);
    return res.data;
  },
  update: async (id: string, data: Partial<Experience>): Promise<ApiResponse<Experience>> => {
    const res = await apiClient.put<ApiResponse<Experience>>(`/experience/${id}`, data);
    return res.data;
  },
  delete: async (id: string): Promise<ApiResponse<null>> => {
    const res = await apiClient.delete<ApiResponse<null>>(`/experience/${id}`);
    return res.data;
  },
};

// ─── Services ──────────────────────────────────────────────────────────
export const serviceService = {
  getAll: async (): Promise<ApiResponse<Service[]>> => {
    const res = await apiClient.get<ApiResponse<Service[]>>('/services');
    return res.data;
  },
  create: async (data: Partial<Service>): Promise<ApiResponse<Service>> => {
    const res = await apiClient.post<ApiResponse<Service>>('/services', data);
    return res.data;
  },
  update: async (id: string, data: Partial<Service>): Promise<ApiResponse<Service>> => {
    const res = await apiClient.put<ApiResponse<Service>>(`/services/${id}`, data);
    return res.data;
  },
  delete: async (id: string): Promise<ApiResponse<null>> => {
    const res = await apiClient.delete<ApiResponse<null>>(`/services/${id}`);
    return res.data;
  },
};

// ─── Resume ────────────────────────────────────────────────────────────
export const resumeService = {
  get: async (): Promise<ApiResponse<Resume>> => {
    const res = await apiClient.get<ApiResponse<Resume>>('/resume');
    return res.data;
  },
  update: async (data: Partial<Resume>): Promise<ApiResponse<Resume>> => {
    const res = await apiClient.put<ApiResponse<Resume>>('/resume', data);
    return res.data;
  },
};

// ─── Contact ───────────────────────────────────────────────────────────
export const contactService = {
  submit: async (data: ContactFormData): Promise<ApiResponse<ContactMessage>> => {
    const res = await apiClient.post<ApiResponse<ContactMessage>>('/contact', data);
    return res.data;
  },
  getAll: async (): Promise<ApiResponse<ContactMessage[]>> => {
    const res = await apiClient.get<ApiResponse<ContactMessage[]>>('/contact');
    return res.data;
  },
  markAsRead: async (id: string, isRead: boolean): Promise<ApiResponse<ContactMessage>> => {
    const res = await apiClient.patch<ApiResponse<ContactMessage>>(`/contact/${id}/read`, { isRead });
    return res.data;
  },
  delete: async (id: string): Promise<ApiResponse<null>> => {
    const res = await apiClient.delete<ApiResponse<null>>(`/contact/${id}`);
    return res.data;
  },
};

// ─── Social Links ──────────────────────────────────────────────────────
export const socialLinkService = {
  getAll: async (): Promise<ApiResponse<SocialLink[]>> => {
    const res = await apiClient.get<ApiResponse<SocialLink[]>>('/social-links');
    return res.data;
  },
  create: async (data: Partial<SocialLink>): Promise<ApiResponse<SocialLink>> => {
    const res = await apiClient.post<ApiResponse<SocialLink>>('/social-links', data);
    return res.data;
  },
  update: async (id: string, data: Partial<SocialLink>): Promise<ApiResponse<SocialLink>> => {
    const res = await apiClient.put<ApiResponse<SocialLink>>(`/social-links/${id}`, data);
    return res.data;
  },
  delete: async (id: string): Promise<ApiResponse<null>> => {
    const res = await apiClient.delete<ApiResponse<null>>(`/social-links/${id}`);
    return res.data;
  },
};

// ─── Settings ──────────────────────────────────────────────────────────
export const settingsService = {
  get: async (): Promise<ApiResponse<WebsiteSettings>> => {
    const res = await apiClient.get<ApiResponse<WebsiteSettings>>('/settings');
    return res.data;
  },
  update: async (data: Partial<WebsiteSettings>): Promise<ApiResponse<WebsiteSettings>> => {
    const res = await apiClient.put<ApiResponse<WebsiteSettings>>('/settings', data);
    return res.data;
  },
};

// ─── File Upload ───────────────────────────────────────────────────────
export const uploadService = {
  uploadFile: async (file: File): Promise<{ success: boolean; fileUrl: string; relativeUrl: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};

// ─── Health ────────────────────────────────────────────────────────────
export const checkHealth = async () => {
  const res = await apiClient.get('/health');
  return res.data;
};

// Legacy default export for backwards compatibility
export const portfolioService = {
  getProfile: profileService.get,
  getProjects: projectService.getAll,
  getProjectById: projectService.getById,
  getCertificates: certificateService.getAll,
  submitContact: (data: ContactFormData) => contactService.submit(data),
  checkHealth,
};

export default portfolioService;

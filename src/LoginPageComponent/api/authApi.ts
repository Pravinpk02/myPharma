import axiosInstance from './axiosInstance';

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
}

export const loginApi = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>('/auth/login', payload);
  return response.data;
};

export const registerApi = async (payload: RegisterPayload): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>('/auth/register', payload);
  return response.data;
};
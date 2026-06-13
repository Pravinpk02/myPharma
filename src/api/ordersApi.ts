import axiosInstance from './axiosInstance';
import type { OrderDetail } from '../services/dashboardMockData';

export const getOrdersApi = async (): Promise<OrderDetail[]> => {
  const response = await axiosInstance.get<OrderDetail[]>('/orders');
  return response.data;
};

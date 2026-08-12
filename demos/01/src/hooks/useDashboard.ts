import { useQuery } from '@tanstack/react-query';
import { fetchDashboardData } from '../lib/mockData';

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardData,
    staleTime: 30_000,
  });
}

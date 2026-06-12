import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/api/products.api.js';
import { categoriesApi } from '@/api/categories.api.js';
import { QUERY_KEYS } from '@/store/queryKeys.js';

export function useProducts(params) {
  return useQuery({
    queryKey: QUERY_KEYS.products(params),
    queryFn: () => productsApi.list(params),
    keepPreviousData: true,
  });
}

export function useProduct(slug) {
  return useQuery({
    queryKey: QUERY_KEYS.product(slug),
    queryFn: () => productsApi.get(slug),
    enabled: Boolean(slug),
  });
}

export function useFeatured() {
  return useQuery({
    queryKey: QUERY_KEYS.featured(),
    queryFn: () => productsApi.featured(),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: QUERY_KEYS.categories(),
    queryFn: () => categoriesApi.list(),
    staleTime: 5 * 60 * 1000,
  });
}

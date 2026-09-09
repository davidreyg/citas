import { useQuery } from "@tanstack/vue-query";
import type { ComputedRef, Ref } from "vue";
import { queryKeys } from "~/utils/query-keys";

export type CitaAppointment = {
  specialty: string;
  date: string;
  time: string;
  location: string;
  doctor?: string;
};

export type CitaResponse = {
  hasAppointment: boolean;
  numeroDocumento: string;
  appointment?: CitaAppointment;
};

export function useCitaQuery(documentNumber: Ref<string> | ComputedRef<string>) {
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase;

  return useQuery({
    queryKey: ["cita", documentNumber] as const,
    queryFn: async (): Promise<CitaResponse> => {
      const response = await $fetch<CitaResponse>(`${apiBase}/api/citas`, {
        method: "POST",
        body: { numeroDocumento: unref(documentNumber) },
      });
      return response;
    },
    enabled: false,
    staleTime: 1000 * 60 * 2,
  });
}

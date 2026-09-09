const CITA_KEY = "cita" as const;

export const queryKeys = {
  cita: {
    all: [CITA_KEY] as const,
    byDocument: (documentNumber: string) => [CITA_KEY, documentNumber] as const,
  },
};

interface GtagEvent {
  action: string;
  category?: string;
  label?: string;
  value?: number;
}

interface Window {
  gtag: (
    command: "config" | "event" | "js" | "set",
    targetOrAction: string | Date,
    params?: Record<string, unknown>
  ) => void;
  dataLayer: Array<unknown>;
}

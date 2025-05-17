declare global {
  interface Window {
    gtag: (
      command: "event",
      action: string,
      params: GtagEventParams
    ) => void;
  }
}

// Define a reusable type for event parameters
type GtagEventParams =
  | {
      event_category?: string;
      event_label?: string;
      value?: number;
      currency?: string;
      items?: Array<{
        item_id?: string;
        item_name?: string;
        quantity?: number;
        price?: number;
        [key: string]: string | number | undefined;
      }>;
      [key: string]: string | number | boolean | undefined | object;
    };

// This export is needed to make this a module
export {};

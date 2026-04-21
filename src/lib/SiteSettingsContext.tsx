import { createContext, useContext } from "react";

export interface SiteGeneralSettings {
  businessName:   string;
  tagline:        string;
  phone:          string;
  email:          string;
  address:        string;
  whatsappNumber: string;
  logoUrl:        string;
}

export interface SiteOperationsSettings {
  maintenanceMode:     boolean;
  maintenanceMessage:  string;
  collectionDelivery:  boolean;
  turnaroundTime:      string;
}

export interface SiteSettings {
  general:    SiteGeneralSettings;
  operations: SiteOperationsSettings;
}

const defaults: SiteSettings = {
  general: {
    businessName:   'Repair My Phone Screen',
    tagline:        '',
    phone:          '0333 224 4018',
    email:          'info@repairmyphonescreen.co.uk',
    address:        'Fonebox, 117 Friargate, Preston, PR1 2EE',
    whatsappNumber: '447761665499',
    logoUrl:        'https://res.cloudinary.com/dn2sab6qc/image/upload/v1773930131/repair-my-phone-screen-logo_jmngqv.webp',
  },
  operations: {
    maintenanceMode:    false,
    maintenanceMessage: '',
    collectionDelivery: true,
    turnaroundTime:     '1-2 hours',
  },
};

export const SiteSettingsContext = createContext<SiteSettings>(defaults);

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}

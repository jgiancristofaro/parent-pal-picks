
import { DwellingType } from "./types";

export const getDwellingTypeLabel = (type: string) => {
  switch (type) {
    case 'APARTMENT_BUILDING': return 'Apartment Building';
    case 'SINGLE_FAMILY_HOME': return 'Single Family Home';
    case 'TOWNHOUSE': return 'Townhouse';
    default: return type;
  }
};

export const validateFormData = (formData: any) => {
  const errors: string[] = [];

  if (!formData.location_nickname.trim()) {
    errors.push("Location nickname is required.");
  }

  if (!formData.zip_code.trim()) {
    errors.push("ZIP code is required.");
  }

  if (formData.dwelling_type === 'APARTMENT_BUILDING' && !formData.building_identifier.trim()) {
    errors.push("Building identifier is required for apartment buildings.");
  }

  return errors;
};

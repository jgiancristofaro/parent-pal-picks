
export type DwellingType = "APARTMENT_BUILDING" | "SINGLE_FAMILY_HOME" | "TOWNHOUSE";

export interface LocationFormData {
  location_nickname: string;
  building_identifier: string;
  dwelling_type: DwellingType;
  zip_code: string;
  street: string;
  city: string;
  is_primary: boolean;
  unit_number?: string;
  // Google Places fields
  google_place_id?: string;
  standardized_address?: string;
  latitude?: number;
  longitude?: number;
}

export interface LocationFormProps {
  initialData?: any;
  onSuccess: () => void;
}

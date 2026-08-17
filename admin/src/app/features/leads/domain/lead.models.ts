export interface LeadFormData {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  source: string;
}

export interface LeadQueryFilters {
  status?: string;
  from?: string;
  to?: string;
}

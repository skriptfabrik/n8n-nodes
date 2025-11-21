export type Activity = {
  id: number;
  date: string;
  hours: number;
  seconds: number;
  description: string;
  billed: boolean;
  invoice_id: string;
  billable: boolean;
  tag: string;
  remote_service: string;
  remote_id: string;
  remote_url: string;
  project: {
    id: number;
    name: string;
    billable: boolean;
  };
  task: {
    id: number;
    name: string;
    billable: boolean;
  };
  customer: {
    id: number;
    name: string;
  };
  user: {
    id: number;
    firstname: string;
    lastname: string;
  };
  hourly_rate: number;
  timer_started_at: string;
  created_at: string;
  updated_at: string;
};

export type ActivityParameters = {
  date: string;
  project_id: number;
  task_id: number;
  seconds?: number;
  description?: string;
  billable?: boolean;
  tag?: string;
  remote_service?:
    | 'trello'
    | 'jira'
    | 'asana'
    | 'basecamp'
    | 'wunderlist'
    | 'basecamp2'
    | 'basecamp3'
    | 'toggl'
    | 'mite'
    | 'github'
    | 'youtrack';
  remote_id?: string;
  remote_url?: string;
};

export type ActivityFilters = GlobalFilters & {
  from?: string;
  to?: string;
  user_id?: string;
  project_id?: string;
  task_id?: string;
  company_id?: string;
  term?: string;
};

export type Company = {
  id: number;
  type: 'customer' | 'supplier' | 'organization';
  name: string;
  website: string;
  email: string;
  billing_email_cc: string;
  phone: string;
  fax: string;
  address: string;
  tags: string[];
  user: {
    id: number;
    firstname: string;
    lastname: string;
  };
  info: string;
  custom_properties: {
    [key: string]: string;
  };
  identifier: string;
  intern: boolean;
  billing_tax: number;
  customer_vat: {
    tax: number;
    reverse_charge: boolean;
    intra_eu: boolean;
    active: boolean;
    print_gross_total: boolean;
    notice_tax_exemption: string;
    notice_tax_exemption_alt: string;
  }; // for customers only
  supplier_vat: {
    tax: number;
    reverse_charge: boolean;
    intra_eu: boolean;
    active: boolean;
  }; // for suppliers only
  currency: string;
  custom_rates: boolean;
  include_time_report: boolean;
  billing_notes: string;
  default_discount: number;
  default_cash_discount: number;
  default_cash_discount_days: number;
  country_code: string;
  vat_identifier: string;
  alternative_correspondence_language: boolean;
  default_invoice_due_days: number;
  footer: string;
  projects: {
    id: number;
    identifier: string;
    name: string;
    active: boolean;
    billable: boolean;
  }[];
  created_at: string;
  updated_at: string;
  debit_number: number;
};

export type CustomerCompanyParameters = {
  type: 'customer';
  currency: string;
  identifier: string;
  customer_tax?: number;
  default_invoice_due_days?: number;
  debit_number?: number;
};

export type SupplierCompanyParameters = {
  type: 'supplier';
  iban?: string;
  supplier_tax?: number;
  credit_number?: number;
};

export type OrganizationCompanyParameters = {
  type: 'organization';
};

export type CommonCompanyParameters = {
  name: string;
  type: 'customer' | 'supplier' | 'organization';
  country_code?: string;
  vat_identifier?: string;
  alternative_correspondence_language?: boolean;
  website?: string;
  fax?: string;
  phone?: string;
  email?: string;
  billing_email_cc?: string;
  address?: string;
  info?: string;
  custom_properties?: {
    [key: string]: string | number | boolean;
  };
  tags?: string[];
  user_id?: number;
  footer?: string;
};

export type CompanyParameters = CommonCompanyParameters &
  (
    | CustomerCompanyParameters
    | SupplierCompanyParameters
    | OrganizationCompanyParameters
  );

export type CompanyFilters = GlobalFilters & {
  type?: 'customer' | 'supplier' | 'organization';
  tags?: string;
  identifier?: string;
  term?: string;
};

export type Deal = {
  id: number;
  name: string;
  status: string;
  reminder_date: string;
  closed_on: string;
  money: number;
  currency: string;
  info: string;
  custom_properties: Record<string, string>;
  user: {
    id: number;
    firstname: string;
    lastname: string;
  };
  company: {
    id: number;
    name: string;
    type: 'customer' | 'supplier' | 'organization';
  };
  person: {
    id: number;
    name: string;
  };
  category: {
    id: number;
    name: string;
    probability: number;
  };
  service_period_from: string;
  service_period_to: string;
  created_at: string;
  updated_at: string;
};

export type GlobalFilters = {
  limit?: number;
  ids?: string;
  updated_after?: string;
};

export type Project = {
  id: number;
  identifier: string;
  name: string;
  active: boolean;
  billable: boolean;
  fixed_price: boolean;
  retainer: boolean;
  start_date: string;
  finish_date: string;
  color: string;
  currency: string;
  billing_variant: string;
  billing_address: string;
  billing_email_to: string;
  billing_email_cc: string;
  billing_notes: string;
  setting_include_time_report: boolean;
  budget: number;
  budget_monthly: number;
  budget_expenses: number;
  hourly_rate: number;
  info: string;
  tags: string[];
  custom_properties: Record<string, string>;
  leader: {
    id: number;
    firstname: string;
    lastname: string;
  };
  co_leader: string;
  customer: {
    id: number;
    name: string;
  };
  deal: {
    id: number;
    name: string;
  };
  tasks: {
    id: number;
    name: string;
    billable: boolean;
    active: boolean;
    budget: number;
    hourly_rate: number;
  }[];
  contracts: {
    id: number;
    user_id: number;
    firstname: string;
    lastname: string;
    billable: boolean;
    active: boolean;
    budget: number;
    hourly_rate: number;
  }[];
  project_group: {
    id: number;
    name: string;
  };
  billing_contact: {
    id: number;
    firstname: string;
    lastname: string;
  };
  created_at: string;
  updated_at: string;
};

export type ProjectParameters = {
  name: string;
  currency: string;
  start_date: string;
  finish_date: string;
  fixed_price: boolean;
  retainer: boolean;
  leader_id: number;
  co_leader_id?: number;
  customer_id: number;
  deal_id?: number;
  identifier: string;
  billing_address?: string;
  billing_email_to?: string;
  billing_email_cc?: string;
  billing_notes?: string;
  setting_include_time_report?: boolean;
  billing_variant?: string;
  hourly_rate?: number;
  budget?: number;
  budget_monthly?: number;
  budget_expenses?: number;
  tags?: string[];
  custom_properties?: Record<string, string>;
  info?: string;
};

export type ProjectTask = {
  id: number;
  name: string;
  billable: boolean;
  active: boolean;
  budget: number;
  hourly_rate: number;
  created_at: string;
  updated_at: string;
};

export type Unit = {
  id: number;
  name: string;
  users: {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
  }[];
  created_at: string;
  updated_at: string;
};

export type User = {
  id: number;
  firstname: string;
  lastname: string;
  active: boolean;
  extern: boolean;
  email: string;
  mobile_phone: string;
  work_phone: string;
  home_address: string;
  info: string;
  birthday: string;
  iban: string;
  avatar_url: string;
  tags: string[];
  custom_properties: Record<string, string>;
  unit: {
    id: number;
    name: string;
  };
  created_at: string;
  updated_at: string;
};

export type UserParameters = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  unit_id: number;
  active?: boolean;
  external?: boolean;
  language?: string;
  mobile_phone?: string;
  work_phone?: string;
  home_address?: string;
  bday?: string;
  iban?: string;
  tags?: string[];
  custom_properties?: Record<string, string>;
  info?: string;
};

export type UserFilters = GlobalFilters & {
  include_archived?: boolean;
};

export type Contact = {
  id: number;
  firstname: string;
  lastname: string;
  title: string;
  job_position: string;
  mobile_phone: string;
  work_fax: string;
  work_phone: string;
  work_email: string;
  home_email: string;
  home_address: string;
  info: string;
  birthday: string;
  gender: 'M' | 'W' | 'U';
  avatar_url: string;
  tags: string[];
  custom_properties?: Record<string, string>;
  company: {
    id: number;
    name: string;
    type: 'customer' | 'supplier' | 'organization';
  };
  created_at: string;
  updated_at: string;
};

export type ContactParameters = {
  firstname: string;
  lastname: string;
  company_id: number;
  title?: string;
  job_position?: string;
  mobile_phone?: string;
  work_fax?: string;
  work_phone?: string;
  work_email?: string;
  home_email?: string;
  home_address?: string;
  info?: string;
  birthday?: string;
  gender?: 'M' | 'W' | 'U';
  tags?: string[];
  custom_properties?: Record<string, string>;
};

export type ContactFilters = GlobalFilters & {
  //company_id?: string;  //Filter functions for Companies not implemented in Moco API
  phone?: string;
  term?: string;
};

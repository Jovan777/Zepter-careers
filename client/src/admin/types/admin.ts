


export type AdminUser = {
  _id: string;
  email: string;
  role: "admin" | "superadmin";
};

export type AdminLoginResponse = {
  message: string;
  token: string;
  admin: AdminUser;
};

export type DashboardStats = {
  activeJobs: number;
  totalJobs: number;
  totalApplications: number;
  pipeline: { status: string; count: number }[];
  topRegions: { regionId: string; region: string; count: number }[];
};

export type AdminJobListItem = {
  _id: string;
  publicId: string;
  name: string;
  localeUsed: string | null;
  company: { _id?: string; name: string } | null;
  region: { _id?: string; name: string; isoCode?: string } | null;
  status: string;
  publishStartAt: string | null;
  publishEndAt: string | null;
  appliedCount: number;
  notes: string;
  workArea: string;
  employmentType: string;
  locationType: string;
};

export type AdminJobDetailsResponse = {
  supportedLocales: string[];
  job: {
    _id: string;
    publicId: string;
    company: { _id: string; name: string; legalEntity?: string };
    region: { _id: string; name: string; isoCode?: string; type?: string };
    status: string;
    publishStartAt: string | null;
    publishEndAt: string | null;
    notes: string;
    workArea: string;
    employmentType: string;
    locationType: string;
  };
  activeTranslation: AdminTranslation | null;
  translations: AdminTranslation[];
};

export type AdminTranslation = {
  _id?: string;
  locale: string;
  name: string;
  locationLabel: string;
  shortDescription: string;
  intro: string[];
  whyThisPosition: string;
  aboutZepter: string;
  qualifications: string[];
  responsibilities: string[];
  requirements: string[];
  whatZepterOffers: string[];
  applyLabel: string;
  notes: string;
};

export type AdminApplicationListItem = {
  _id: string;
  publicId: string;
  appliedAt: string;
  candidate: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    country?: string;
    city?: string;
  };
  job: {
    publicId?: string;
    company?: { name?: string };
    region?: { name?: string };
  };
  status: string;
  statusLabel: string;
};
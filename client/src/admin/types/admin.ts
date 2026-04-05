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

export type AdminApplicationEvent = {
  type: string;
  timestamp: string;
  data?: Record<string, unknown>;
};

export type AdminApplicationDocument = {
  fileName: string;
  fileUrl: string;
};

export type AdminApplicationDetailsResponse = {
  application: {
    _id: string;
    publicId: string;
    createdAt: string;
    updatedAt?: string;
    status: string;
    reason: string;
    cvDocument?: AdminApplicationDocument | null;
    events: AdminApplicationEvent[];
    candidate: {
      _id?: string;
      publicId?: string;
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
      country?: string;
      city?: string;
      documents?: AdminApplicationDocument[];
    };
    job: {
      _id?: string;
      publicId?: string;
      company?: {
        _id?: string;
        name?: string;
      } | null;
      region?: {
        _id?: string;
        name?: string;
        isoCode?: string;
      } | null;
      status?: string;
    };
  };
  statuses?: string[];
};

export type AdminCandidate = {
  _id: string;
  publicId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  country?: string;
  city?: string;
};

export type AdminCandidateDetailsResponse = {
  candidate: {
    _id: string;
    publicId: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    country?: string;
    city?: string;
    documents?: {
      fileName: string;
      fileUrl: string;
      uploadedAt?: string;
    }[];
  };
  applications: {
    _id: string;
    publicId: string;
    createdAt: string;
    status: string;
    statusLabel?: string;
    reason?: string;
    job?: {
      _id?: string;
      publicId?: string;
      company?: {
        _id?: string;
        name?: string;
      } | null;
      region?: {
        _id?: string;
        name?: string;
        isoCode?: string;
        type?: string;
      } | null;
      status?: string;
    };
  }[];
};

export type Company = {
  _id: string;
  name: string;
  legalEntity?: string;
  isActive: boolean;
};

export type RegionParent = {
  _id: string;
  name: string;
};

export type Region = {
  _id: string;
  type: string;
  name: string;
  isoCode?: string;
  parentRegion?: RegionParent | string | null;
  isActive: boolean;
};

export type PresenceCompanyRef = {
  _id: string;
  name: string;
};

export type PresenceRegionRef = {
  _id: string;
  name: string;
  isoCode?: string;
  type?: string;
};

export type Presence = {
  _id: string;
  company: PresenceCompanyRef;
  region: PresenceRegionRef;
  isActive: boolean;
};

export type SchedulerEventApplicationRef = {
  _id?: string;
  publicId?: string;
  status?: string;
};

export type SchedulerEventCandidateRef = {
  _id?: string;
  publicId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
};

export type SchedulerEvent = {
  _id: string;
  application: string | SchedulerEventApplicationRef;
  candidate: string | SchedulerEventCandidateRef;
  type: string;
  startAt: string;
  endAt: string;
  timezone: string;
  locationOrLink?: string;
  notes?: string;
};

export type TranslationJobListItem = {
  publicId: string;
  name: string;
};

export type JobTranslationsOverviewResponse = {
  translations: AdminTranslation[];
};
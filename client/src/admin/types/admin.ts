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

export type AdminJobQr = {
  targetUrl?: string;
  isEnabled?: boolean;
  scanCount?: number;
};

export type AdminJobViewStats = {
  totalViews: number;
  qrViews: number;
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
    qr?: AdminJobQr;
    qrTargetUrl?: string;
    qrTrackingEnabled?: boolean;
    viewStats?: AdminJobViewStats;
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
  howToApply?: string[];
  closingText?: string;
  footerNote?: string;
  applyLabel: string;
  notes: string;
};

export type AdminJobPdfImportResponse = {
  parsed: {
    locale?: string;
    name?: string;
    locationLabel?: string;
    shortDescription?: string;
    intro?: string[];
    whyThisPosition?: string;
    aboutZepter?: string;
    qualifications?: string[];
    responsibilities?: string[];
    requirements?: string[];
    whatZepterOffers?: string[];
    howToApply?: string[];
    closingText?: string;
    footerNote?: string;
    applyLabel?: string;
  };
  rawTextPreview?: string;
};

export type AdminApplicationListItem = {
  _id: string;
  publicId: string;
  appliedAt: string;
  candidate: {
    publicId?: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    country?: string;
    city?: string;
    isArchived?: boolean;
    archivedAt?: string | null;
    archivedReason?: string;
  };
  job: {
    publicId?: string;
    positionName?: string;
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
      positionName?: string;
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

export type AdminTalentPoolDocument = {
  fileName: string;
  fileUrl: string;
};

export type AdminTalentPoolEvent = {
  type: string;
  timestamp: string;
  data?: Record<string, unknown>;
};

export type AdminTalentPoolAreaOption = {
  value: string;
  label: string;
};

export type AdminTalentPoolListItem = {
  _id: string;
  publicId: string;
  submittedAt: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  areaOfInterest: string;
  areaOfInterestLabel: string;
  status: string;
  statusLabel: string;
  reason?: string;
  cvDocument?: AdminTalentPoolDocument | null;
};

export type AdminTalentPoolDetailsResponse = {
  statuses: string[];
  areaOfInterestOptions: AdminTalentPoolAreaOption[];
  application: AdminTalentPoolListItem & {
    message?: string;
    acceptedTerms: boolean;
    acceptedTermsAt?: string | null;
    marketingConsent: boolean;
    sourceLocale: string;
    events: AdminTalentPoolEvent[];
  };
};

export type AdminTalentPoolListResponse = {
  statuses: string[];
  areaOfInterestOptions: AdminTalentPoolAreaOption[];
  applications: AdminTalentPoolListItem[];
};

export type AdminSalesConsultantDocument = {
  fileName: string;
  fileUrl: string;
};

export type AdminSalesConsultantEvent = {
  type: string;
  timestamp: string;
  data?: Record<string, unknown>;
};

export type AdminSalesConsultantApplication = {
  _id: string;
  publicId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  country?: string;
  city?: string;
  message?: string;
  motivation?: string;
  cvDocument?: AdminSalesConsultantDocument | null;
  acceptedTerms: boolean;
  acceptedTermsAt?: string | null;
  marketingConsent: boolean;
  status: string;
  statusLabel: string;
  reason?: string;
  createdAt: string;
  updatedAt?: string;
};

export type AdminSalesConsultantListResponse = {
  statuses: string[];
  applications: AdminSalesConsultantApplication[];
};

export type AdminSalesConsultantDetailsResponse = {
  statuses: string[];
  application: AdminSalesConsultantApplication & {
    events: AdminSalesConsultantEvent[];
  };
};

export type AdminContactMessage = {
  _id: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  country?: string;
  countryLabel?: string;
  reason?: string;
  reasonLabel?: string;
  message: string;
  messagePreview: string;
  sourcePage?: string;
  status: string;
  statusLabel: string;
  readAt?: string | null;
  answeredAt?: string | null;
  adminNote?: string;
  createdAt: string;
  updatedAt?: string;
};

export type AdminContactMessagesListResponse = {
  statuses: string[];
  messages: AdminContactMessage[];
};

export type AdminContactMessageDetailsResponse = {
  statuses: string[];
  message: AdminContactMessage;
};

export type AdminContactMessagesUnreadCountResponse = {
  count: number;
};

export type AdminContactMessageMutationResponse = {
  message: string;
  contactMessage: AdminContactMessage;
  unreadCount?: number;
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
  isArchived?: boolean;
  archivedAt?: string | null;
  archivedReason?: string;
  restoredAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
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
    isArchived?: boolean;
    archivedAt?: string | null;
    archivedReason?: string;
    restoredAt?: string | null;
    archivedBy?: {
      _id?: string;
      email?: string;
      role?: string;
    } | null;
    documents?: {
      fileName: string;
      fileUrl: string;
      uploadedAt?: string;
    }[];
  };
  applications: {
    _id: string;
    publicId: string;
    createdAt?: string;
    appliedAt?: string;
    status: string;
    statusLabel?: string;
    reason?: string;
    job?: {
      _id?: string;
      publicId?: string;
      positionName?: string;
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

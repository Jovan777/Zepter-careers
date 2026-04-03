export type JobListItem = {
  publicId: string;
  title: string;
  company: {
    id: string | null;
    name: string;
  };
  location: {
    regionId: string | null;
    regionName: string;
    regionIsoCode: string;
    locationType: string;
    label: string;
  };
  employmentType: string;
  employmentTypeLabel: string;
  workArea: string;
  postedAt: string;
  appliedCount: number;
  locale: string;
  shortDescription: string;
  qualifications: string[];
};

export type JobsListResponse = {
  items: JobListItem[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
};

export type JobDetailsResponse = {
  publicId: string;
  status: string;
  postedAt: string;
  appliedCount: number;
  notes: string;
  company: {
    _id?: string;
    name: string;
    legalEntity?: string;
  };
  location: {
    regionId: string | null;
    regionName: string;
    regionIsoCode: string;
    locationType: string;
    label: string;
  };
  employmentType: string;
  employmentTypeLabel: string;
  workArea: string;
  translation: {
    locale: string;
    title: string;
    shortDescription: string;
    intro: string[];
    whyThisPosition: string;
    aboutZepter: string;
    qualifications: string[];
    responsibilities: string[];
    requirements: string[];
    whatZepterOffers: string[];
    applyLabel: string;
  };
};

export type JobFiltersResponse = {
  workAreas: { value: string; label: string }[];
  employmentTypes: { value: string; label: string }[];
  locationTypes: { value: string; label: string }[];
  regions: { value: string; label: string; isoCode: string }[];
  locales: { value: string; label: string }[];
};
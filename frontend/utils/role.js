export const ROLE = {
  JOBSEEKER: 'jobseeker',
  BUSINESS_EMPLOYER: 'business-employer',
  INDIVIDUAL_EMPLOYER: 'individual-employer',
  MANPOWER_PROVIDER: 'manpower-provider',
  ADMINISTRATOR: 'administrator'
};

export const ROLE_CATEGORY = {
  EMPLOYER: 'employer',
  JOBSEEKER: 'jobseeker',
  MANPOWER: 'manpower',
  UNKNOWN: 'Unknown'
}

export const ROLE_LABELS = {
  [ROLE.JOBSEEKER]: 'Jobseeker',
  [ROLE.BUSINESS_EMPLOYER]: 'Business Employer',
  [ROLE.INDIVIDUAL_EMPLOYER]: 'Individual Employer',
  [ROLE.MANPOWER_PROVIDER]: 'Manpower Provider',
};

export const roleColors = {
  'manpower-provider': 'text-orange-500',
  'business-employer': 'text-green-600',
  'individual-employer': 'text-yellow-500',
  'jobseeker': 'text-blue-600',
};

export const getInitials = (entity = '') => {
  const parts = entity.trim().split(/\s+/);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};
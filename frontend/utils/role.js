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

 export const getInitials = (name) => {
    if (!name) return 'NA';
    const words = name.split(' ');
    const first = words[0]?.charAt(0).toUpperCase() || '';
    const second = words[1]?.charAt(0).toUpperCase() || '';
    return `${first}${second}`;
  };
const ROLE = {
  JOBSEEKER: 'jobseeker',
  BUSINESS_EMPLOYER: 'business-employer',
  INDIVIDUAL_EMPLOYER: 'individual-employer',
  MANPOWER_PROVIDER: 'manpower-provider',
  ADMINISTRATOR: 'administrator'
};

const ROLE_LABELS = {
  [ROLE.JOBSEEKER]: 'Jobseeker',
  [ROLE.BUSINESS_EMPLOYER]: 'Business Employer',
  [ROLE.INDIVIDUAL_EMPLOYER]: 'Individual Employer',
  [ROLE.MANPOWER_PROVIDER]: 'Manpower Provider',
};

module.exports = {
  ROLE,
  ROLE_LABELS
};

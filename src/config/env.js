const local = {
  ENV: process.env['REACT_APP_ENV'],
  API_BASE_URL: process.env['REACT_APP_API_BASE_URL'],
};

const prod = {
  ENV: process.env['REACT_APP_ENV'],
  API_BASE_URL: process.env['REACT_APP_API_BASE_URL'],
};

const config = {
  // Add common config values here
  MAX_ATTACHMENT_SIZE: 5000000,
  // Default to dev if not set
  ...(process.env.REACT_APP_ENV === 'production' ? prod : local),
};

export default config;

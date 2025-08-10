export const productionConfig = {
  mongoUrl: process.env.MONGO_URL,
  jwtSecret: process.env.JWT_SECRET,
  paypalClientId: process.env.PAYPAL_CLIENT_ID,
  paypalClientSecret: process.env.PAYPAL_CLIENT_SECRET,
  port: process.env.PORT || 10000,
  nodeEnv: process.env.NODE_ENV || 'production',
  maxFileSize: process.env.MAX_FILE_SIZE || 5242880,
  corsOrigin: process.env.CORS_ORIGIN || '*'
};

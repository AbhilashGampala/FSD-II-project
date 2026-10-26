import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Configuration with sensible defaults
export const PORT = process.env.PORT || 5000;
export const MONGODB_URI = process.env.MONGODB_URI || '';
export const JWT_SECRET = process.env.JWT_SECRET || 'vit_placement_tracker_jwt_secret_dev_key_12345';
export const OTP_SECRET = process.env.OTP_SECRET || 'vit_placement_tracker_otp_secret_dev_key_67890';
export const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
export const DEMO_MODE = process.env.DEMO_MODE !== 'false'; // Default to true if not specified
export const NODE_ENV = process.env.NODE_ENV || 'development';

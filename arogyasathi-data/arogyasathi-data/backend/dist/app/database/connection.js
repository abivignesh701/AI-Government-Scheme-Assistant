"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
exports.connectDB = connectDB;
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
async function connectDB() {
    if (!supabaseUrl || !supabaseKey) {
        console.error('SUPABASE_URL or SUPABASE_ANON_KEY is not defined in environment variables.');
        return;
    }
    try {
        // Optionally test the connection here by making a lightweight query
        // const { data, error } = await supabase.from('users').select('id').limit(1);
        console.log('Supabase client initialized successfully.');
    }
    catch (error) {
        console.error('Supabase initialization error:', error);
        throw error;
    }
}

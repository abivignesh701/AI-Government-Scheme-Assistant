"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.logout = exports.login = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const connection_1 = require("../database/connection");
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-do-not-use-in-prod';
// Simple in-memory rate limiter for login
const loginAttempts = new Map();
const isRateLimited = (ip) => {
    const now = Date.now();
    const attempt = loginAttempts.get(ip);
    if (!attempt)
        return false;
    if (now > attempt.resetTime) {
        loginAttempts.delete(ip);
        return false;
    }
    return attempt.count >= 5; // Max 5 attempts per 15 mins
};
const recordLoginAttempt = (ip) => {
    const now = Date.now();
    const attempt = loginAttempts.get(ip) || { count: 0, resetTime: now + 15 * 60 * 1000 };
    attempt.count += 1;
    loginAttempts.set(ip, attempt);
};
const signup = async (req, res) => {
    try {
        const { name, email, password, preferred_language = 'en' } = req.body;
        if (typeof name !== 'string' || name.length < 2) {
            res.status(400).json({ error: { message: 'Valid name is required' } });
            return;
        }
        if (typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email)) {
            res.status(400).json({ error: { message: 'Valid email is required' } });
            return;
        }
        if (typeof password !== 'string' || password.length < 8) {
            res.status(400).json({ error: { message: 'Password must be at least 8 characters long' } });
            return;
        }
        if (!['en', 'ta', 'hi'].includes(preferred_language)) {
            res.status(400).json({ error: { message: 'Unsupported language' } });
            return;
        }
        if (!process.env.SUPABASE_URL) {
            res.status(503).json({ error: { message: 'Database connection details missing. Please configure Supabase.' } });
            return;
        }
        const normalizedEmail = email.trim().toLowerCase();
        const { data: existingUser } = await connection_1.supabase.from('users').select('id').eq('email', normalizedEmail).maybeSingle();
        if (existingUser) {
            res.status(409).json({ error: { message: 'Account already exists' } });
            return;
        }
        const password_hash = await bcryptjs_1.default.hash(password, 10);
        const { data: user, error: insertError } = await connection_1.supabase.from('users').insert({
            name: name.trim(),
            email: normalizedEmail,
            password_hash,
            preferred_language
        }).select().single();
        if (insertError) {
            if (insertError.code === '23505') { // unique violation
                res.status(409).json({ error: { message: 'Account already exists' } });
                return;
            }
            throw insertError;
        }
        res.status(201).json({ message: 'User created successfully', user: { id: user.id, name: user.name, email: user.email, preferred_language: user.preferred_language, role: user.role } });
    }
    catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ error: { message: 'Internal server error' } });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    try {
        const ip = req.ip || req.socket.remoteAddress || 'unknown';
        if (isRateLimited(ip)) {
            res.status(429).json({ error: { message: 'Too many login attempts, please try again later' } });
            return;
        }
        const { email, password } = req.body;
        if (typeof email !== 'string' || typeof password !== 'string') {
            recordLoginAttempt(ip);
            res.status(401).json({ error: { message: 'Invalid email or password' } });
            return;
        }
        if (!process.env.SUPABASE_URL) {
            res.status(503).json({ error: { message: 'Database connection details missing. Please configure Supabase.' } });
            return;
        }
        const normalizedEmail = email.trim().toLowerCase();
        const { data: user, error: fetchError } = await connection_1.supabase.from('users').select('*').eq('email', normalizedEmail).maybeSingle();
        if (fetchError || !user) {
            recordLoginAttempt(ip);
            res.status(401).json({ error: { message: 'Invalid email or password' } });
            return;
        }
        if (!user.is_active) {
            res.status(403).json({ error: { message: 'Account is inactive' } });
            return;
        }
        const isValid = await bcryptjs_1.default.compare(password, user.password_hash);
        if (!isValid) {
            recordLoginAttempt(ip);
            res.status(401).json({ error: { message: 'Invalid email or password' } });
            return;
        }
        // Successful login, clear rate limit
        loginAttempts.delete(ip);
        // Update last login (non-blocking)
        connection_1.supabase.from('users').update({ last_login_at: new Date().toISOString() }).eq('id', user.id)
            .then(({ error }) => {
            if (error)
                console.error('Failed to update last_login_at', error);
        });
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, preferred_language: user.preferred_language, role: user.role } });
    }
    catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: { message: 'Internal server error' } });
    }
};
exports.login = login;
const logout = async (req, res) => {
    res.json({ message: 'Logged out successfully' });
};
exports.logout = logout;
const me = async (req, res) => {
    try {
        const { data: user, error } = await connection_1.supabase.from('users').select('*').eq('id', req.user.userId).maybeSingle();
        if (error || !user) {
            res.status(404).json({ error: { message: 'User not found' } });
            return;
        }
        res.json({ user: { id: user.id, name: user.name, email: user.email, preferred_language: user.preferred_language, role: user.role } });
    }
    catch (error) {
        res.status(500).json({ error: { message: 'Internal server error' } });
    }
};
exports.me = me;

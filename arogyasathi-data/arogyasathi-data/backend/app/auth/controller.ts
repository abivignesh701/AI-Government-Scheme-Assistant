import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../database/connection';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-do-not-use-in-prod';

// Simple in-memory rate limiter for login
const loginAttempts = new Map<string, { count: number, resetTime: number }>();

const isRateLimited = (ip: string) => {
  const now = Date.now();
  const attempt = loginAttempts.get(ip);
  if (!attempt) return false;
  
  if (now > attempt.resetTime) {
    loginAttempts.delete(ip);
    return false;
  }
  
  return attempt.count >= 5; // Max 5 attempts per 15 mins
};

const recordLoginAttempt = (ip: string) => {
  const now = Date.now();
  const attempt = loginAttempts.get(ip) || { count: 0, resetTime: now + 15 * 60 * 1000 };
  attempt.count += 1;
  loginAttempts.set(ip, attempt);
};

export const signup = async (req: Request, res: Response): Promise<void> => {
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

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      res.status(503).json({ error: { message: 'Database connection details missing. Please configure Supabase.' } });
      return;
    }

    const { createClient } = require('@supabase/supabase-js');
    const adminAuthClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

    const normalizedEmail = email.trim().toLowerCase();
    
    // Use Supabase Admin to create the user
    const { data, error } = await adminAuthClient.auth.admin.createUser({
      email: normalizedEmail,
      password: password,
      email_confirm: true, // Confirm immediately for local dev
      user_metadata: {
        name: name.trim(),
        preferred_language
      }
    });

    if (error) {
      console.error('Supabase Auth Error:', error);
      res.status(400).json({ error: { message: error.message } });
      return;
    }

    res.status(201).json({ message: 'User created successfully', user: data.user });
  } catch (error: any) {
    console.error('Signup Error DETAILS:', error.message || error);
    res.status(500).json({ error: { message: 'Internal server error: ' + String(error.message || error) } });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
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

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      res.status(503).json({ error: { message: 'Database connection details missing. Please configure Supabase.' } });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    
    // Login via Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password: password
    });

    if (error || !data.session) {
      recordLoginAttempt(ip);
      res.status(401).json({ error: { message: error?.message || 'Invalid email or password' } });
      return;
    }

    // Successful login, clear rate limit
    loginAttempts.delete(ip);

    // Return the Supabase session
    res.json({ 
      token: data.session.access_token, 
      session: data.session, 
      user: data.user 
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: { message: 'Internal server error' } });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.json({ message: 'Logged out successfully' });
};

export const me = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data: user, error } = await supabase.from('users').select('*').eq('id', (req as any).user.userId).maybeSingle();
    if (error || !user) {
      res.status(404).json({ error: { message: 'User not found' } });
      return;
    }
    res.json({ user: { id: user.id, name: user.name, email: user.email, preferred_language: user.preferred_language, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: { message: 'Internal server error' } });
  }
};

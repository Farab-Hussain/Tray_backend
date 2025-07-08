import { Request, Response, RequestHandler } from "express";
import pool from "../config/db";
import bcrypt from "bcryptjs";
import { User } from "../types";
import jwt from "jsonwebtoken";
import { emitWarning } from "process";
import { sendOTPEmail } from "../services/emailServices";
import { error } from "console";

export const signup: RequestHandler = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (userExists.rows.length > 0) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      `INSERT INTO users (email, password, role)
             VALUES ($1, $2, $3) RETURNING *`,
      [email, hashedPassword, role || "student"]
    );

    const user: User = newUser.rows[0];

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
};

export const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user: User = result.rows[0];
    if (!user) {
      res.status(400).json({ msg: "User not found" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ msg: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

const otpStore: Record<string, { otp: string; expiresAt: number; verified: boolean }> = {};

export const forgetPassword: RequestHandler = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ message: "Email is required" });
    return;
  }

  const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  if (!user.rows.length) {
    res.status(400).json({ message: "User not found" });
    return;
  }

  const otp = Math.floor(100000 + Math.random() * 90000).toString();
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 1 day

  otpStore[email] = { otp, expiresAt, verified: false };

  await sendOTPEmail(email, otp); // You implement this

  res.json({ message: "OTP sent to your email" });
};

export const verifyOtp: RequestHandler = async (req, res) => {
  const { email, otp } = req.body;
  const storedOtp = otpStore[email];

  if (!storedOtp || storedOtp.otp !== otp || storedOtp.expiresAt < Date.now()) {
    res.status(400).json({ message: "Invalid or expired OTP" });
    return;
  }

  otpStore[email].verified = true;

  res.json({ message: "OTP verified successfully" });
};

export const resetPassword: RequestHandler = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const record = otpStore[email];

  if (!record || record.otp !== otp || Date.now() > record.expiresAt || !record.verified) {
    res.status(400).json({ error: "Invalid, expired, or unverified OTP" });
    return;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await pool.query("UPDATE users SET password = $1 WHERE email = $2", [
    hashedPassword,
    email,
  ]);

  delete otpStore[email];
  res.json({ message: "Password reset successfully" });
};

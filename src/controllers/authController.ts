import { Request, Response } from 'express';
import pool from '../config/db';
import bcrypt from 'bcryptjs';
import { User } from '../types';
import jwt from 'jsonwebtoken';

    export const signup = async (req: Request, res: Response) => {
    const { email, password, role } = req.body;
    try {
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);        
        if (userExists.rows.length > 0) return res.status(400).json({message: 'User already exists'});

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await pool.query(
            `INSERT INTO users (email, password, role)
             VALUES ($1, $2, $3) RETURNING *`,
            [email, hashedPassword, role || 'student']
          );

        const user : User = newUser.rows[0];

        const token = jwt.sign({
            id: user.id,
            role: user.role
        },
        process.env.JWT_SECRET as string,
        {expiresIn: '7d'}
    )
    res.json({token , user})
                
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error
        })
    }
}



export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user: User = result.rows[0];
    if (!user) return res.status(400).json({ msg: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}
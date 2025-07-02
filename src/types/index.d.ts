export interface User {
    id: number;
    email: string;
    password: string;
    role: 'student' | 'consultant' | 'admin';
    created_at: Date;   
}


export interface DecodedToken{
    id: number;
    role: string;
}

declare namespace Express {
    export interface Request {
      user?: {
        id: number;
        role: string;
      };
    }
  }
  
import nodemailer from 'nodemailer';


export const sendOTPEmail = async (to: string, otp: string): Promise<void> => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    secure: false, 
  });

  const mailOptions = {
    from: `"Tray App" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}. It will expire in 1 day.`,
  };

  await transporter.sendMail(mailOptions);
};

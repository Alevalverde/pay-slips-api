// import nodemailer from 'nodemailer';
// import { readFileSync } from 'fs';
// import path from 'path';
// import config from '@/config';

// const sendResetPasswordEmail = async (email: string, resetUrl: string) => {
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: config.EMAIL_FROM,
//       pass: config.EMAIL_PASSWORD,
//     },
//   });

//   const mailOptions = {
//     from: config.EMAIL_FROM,
//     to: email,
//     subject: 'Recuperación de contraseña',
//     html: getResetPasswordHtml(resetUrl),
//   };

//   await transporter.sendMail(mailOptions);
// };

// const htmlTemplate = readFileSync(path.join(__dirname, '../static/password-recovery-email.html'), {
//   encoding: 'utf8',
// }).replaceAll('{{supportEmail}}', config.SUPPORT_EMAIL);

// const getResetPasswordHtml = (resetUrl: string): string => htmlTemplate.replaceAll('{{resetUrl}}', resetUrl);

// export default sendResetPasswordEmail;

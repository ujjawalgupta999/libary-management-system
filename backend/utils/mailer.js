const nodemailer = require('nodemailer');

// 🚨 DEBUG: This will print the first 4 letters of your password to the console 
// just to prove it is being loaded correctly. 
console.log("MAILER CHECK - User:", process.env.EMAIL_USER);
console.log("MAILER CHECK - Pass starts with:", process.env.EMAIL_PASS ? process.env.EMAIL_PASS.substring(0, 4) : "UNDEFINED!");

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS 
  }
});

const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, text });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Email error:', error);
  }
};

module.exports = sendEmail;
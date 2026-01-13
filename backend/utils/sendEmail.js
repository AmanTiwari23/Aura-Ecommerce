const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1. Create a transporter
  const transporter = nodemailer.createTransport({
    service: "Gmail", // Or use Host/Port if using Mailtrap
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS, // Your App Password (not your regular password)
    },
  });

  // 2. Define email options
  const mailOptions = {
    from: `Aura Fashion <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: `<div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
            <h2 style="text-transform: uppercase;">Aura Verification</h2>
            <p>Your OTP for password reset is:</p>
            <h1 style="letter-spacing: 5px; color: #000;">${options.otp}</h1>
            <p>This code expires in 10 minutes.</p>
           </div>`,
  };

  // 3. Send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
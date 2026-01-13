const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  
  const transporter = nodemailer.createTransport({
    service: "Gmail", 
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });

  
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

  
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
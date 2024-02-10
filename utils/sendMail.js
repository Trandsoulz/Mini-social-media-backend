const { createTransport } = require("nodemailer");

const config = process.env;

exports.sendEmail = async ({ email, subject, message }) => {
  //* Create the transporter
  const transporter = createTransport({
    pool: true,
    host: config.EMAIL_HOST,
    port: config.EMAIL_PORT,
    secure: false, //In production, set it to true and change EMAIL_PORT to 465
    auth: {
      user: config.EMAIL_USERNAME,
      pass: config.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  //* Define the email options. Things that will actually be sent
  const mailOptions = {
    from: "Hubli support@mysmartarena.com",
    to: email,
    subject: subject,
    html: `<p> ${message} </p>`,
  };

  return await transporter.sendMail(mailOptions);
};

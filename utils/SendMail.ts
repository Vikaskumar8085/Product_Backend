import nodemailer from "nodemailer";

interface SendMailtype {
  send_to: string;
  subject: string;
  message: any;
}

const SendMail = ({send_to, subject, message}: SendMailtype) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: true,
      auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const option = {
      from: process.env.EMAIL_USER,
      to: send_to, // list of receivers
      subject: subject, // Subject line
      html: message, // html body
    };

    transporter.sendMail(option);
  } catch (error: any) {
    console.log(error.message);
  }
};

module.exports = SendMail;

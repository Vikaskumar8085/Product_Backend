import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

interface SendMailtype {
  send_to: any;
  subject: any;
  message: any;
}

const SendMail = ({send_to, subject, message}: SendMailtype) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
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
export default SendMail;

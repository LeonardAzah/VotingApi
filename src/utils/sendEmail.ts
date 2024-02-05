import dotenv from "dotenv";
import nodemailer from "nodemailer";
import nodemailerConfig from "./nodemailerConfig";

dotenv.config();

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

const sendEmail = async ({
  to,
  subject,
  html,
}: EmailOptions): Promise<void> => {
  const transporter = nodemailer.createTransport(nodemailerConfig);
  await transporter.sendMail({
    from: `"iVote" <${process.env.EMAIL}>`, // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    html: html, // html body
  });
};

export = sendEmail;

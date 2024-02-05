import dotenv from "dotenv";

dotenv.config();

const emailConfig = {
  service: "gmail",
  auth: {
    user: process.env.EMAIL as string,
    pass: process.env.PASSWORD as string,
  },
};

export = emailConfig;

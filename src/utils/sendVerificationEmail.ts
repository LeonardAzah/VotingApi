import sendEmail from "./sendEmail";
import verifyEmail from "../templates/mailTemplate";

interface SendVerificationEmailParams {
  name: string;
  email: string;
  otp: string;
}

const sendVerificationEmail = async ({
  name,
  email,
  otp,
}: SendVerificationEmailParams): Promise<void> => {
  const message =
    "A request to create your iVote account was received.Use the code below to confirm your account and log in";

  const emailTemplate = verifyEmail(otp, name, message);

  await sendEmail({
    to: email,
    subject: "iVote email confirmation",
    html: emailTemplate.html,
  });
};

export default sendVerificationEmail;

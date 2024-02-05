import sendEmail from "./sendEmail";
import verifyEmail from "../templates/mailTemplate";

interface SendVerificationEmailParams {
  name: string;
  email: string;
  otp: string;
}

const sendPasswordResetEmail = async ({
  name,
  email,
  otp,
}: SendVerificationEmailParams): Promise<void> => {
  const message =
    "A request to change your iVote account password was received.Use the code below to confirm your account and log in";

  const emailTemplate = verifyEmail(otp, name, message);

  await sendEmail({
    to: email,
    subject: "Reset iVote password",
    html: emailTemplate.html,
  });
};

export default sendPasswordResetEmail;

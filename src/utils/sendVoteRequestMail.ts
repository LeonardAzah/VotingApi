import sendEmail from "./sendEmail";
import verifyEmail from "../templates/mailTemplate";

interface SendVoteRequestEmailParams {
  name: string;
  email: string;
  otp: string;
  election: string;
}

const sendVoteRequestEmail = async ({
  name,
  email,
  otp,
  election,
}: SendVoteRequestEmailParams): Promise<void> => {
  const message = `A request to vote in the ${election} has been made. Use the below code to cast your vote.`;

  const emailTemplate = verifyEmail(otp, name, message);

  await sendEmail({
    to: email,
    subject: "Vote confirmation",
    html: emailTemplate.html,
  });
};

export default sendVoteRequestEmail;

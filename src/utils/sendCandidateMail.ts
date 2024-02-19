import candidateEmail from "../templates/approveTemplate";
import sendEmail from "./sendEmail";

interface SendCandidateEmailParams {
  name: string;
  email: string;
  message: string;
}

const sendCandidateMail = async ({
  name,
  email,
  message,
}: SendCandidateEmailParams): Promise<void> => {
  const emailTemplate = candidateEmail(name, message);

  await sendEmail({
    to: email,
    subject: "Approved candidate request",
    html: emailTemplate.html,
  });
};

export default sendCandidateMail;

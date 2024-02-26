import { BadRequestError } from "../errors";
import { Election } from "../service/electio .service";
const isElectionActive = async (election: Election) => {
  const currentTime = new Date();
  const startTime = election.startDate;
  const endTime = election.endDate;

  if (currentTime < startTime || currentTime > endTime) {
    throw new BadRequestError("Voting is not active for this election");
  }
};

export default isElectionActive;

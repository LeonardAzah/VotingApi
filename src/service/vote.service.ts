import { prisma } from "../utils/db.server";
type Vote = {
  id: string;
  studentId: string;
  electionId: string;
  encryptedVote: string;
};

export const hasvoted = async (
  studentId: string,
  electionId: string
): Promise<Vote | null> => {
  return await prisma.vote.findFirst({
    where: {
      AND: [{ studentId }, { electionId }],
    },
  });
};

export const castElection = async (vote: Vote): Promise<void> => {
  const { studentId, electionId, encryptedVote } = vote;
  await prisma.vote.create({
    data: {
      studentId,
      electionId,
      encryptedVote,
    },
  });
};

export const getVotes = async (electionId: string): Promise<Vote[]> => {
  return prisma.vote.findMany({
    where: {
      electionId,
    },
  });
};

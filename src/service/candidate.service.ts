import { prisma } from "../utils/db.server";
type Candidate = {
  id: string;
  bio: string;
  applicationLetter: string;
  transcript: string;
  matricule: string;
  electionId: string;
};

export const addCandidate = async (
  candidate: Omit<Candidate, "id">
): Promise<Candidate> => {
  const { bio, applicationLetter, transcript, matricule, electionId } =
    candidate;
  return prisma.candidate.create({
    data: {
      bio,
      applicationLetter,
      transcript,
      matricule,
      electionId,
    },
    select: {
      id: true,
      bio: true,
      applicationLetter: true,
      transcript: true,
      matricule: true,
      electionId: true,
    },
  });
};
export const findAllCandidates = async (): Promise<Candidate[]> => {
  return prisma.candidate.findMany({
    select: {
      id: true,
      bio: true,
      applicationLetter: true,
      transcript: true,
      matricule: true,
      electionId: true,
      user: {
        select: {
          name: true,
          email: true,
          image: true,
          sex: true,
          dateOfBirth: true,
        },
      },
    },
  });
};
export const findCandidatesByElection = async (
  electionId: string
): Promise<Candidate[]> => {
  return prisma.candidate.findMany({
    where: { electionId },
    select: {
      id: true,
      bio: true,
      applicationLetter: true,
      transcript: true,
      matricule: true,
      electionId: true,
      user: {
        select: {
          name: true,
          email: true,
          image: true,
          sex: true,
          dateOfBirth: true,
        },
      },
    },
  });
};
export const findCandidateById = async (
  id: string
): Promise<Candidate | null> => {
  return prisma.candidate.findUnique({
    where: { id },
  });
};
export const updateCandidate = async (
  id: string,
  updates: Partial<Candidate>
): Promise<Candidate | null> => {
  const updatedCandidate = await prisma.candidate.update({
    where: { id },
    data: updates,
  });
  return updatedCandidate;
};
export const deleteCandidate = async (id: string): Promise<void> => {
  await prisma.candidate.delete({
    where: { id },
  });
};

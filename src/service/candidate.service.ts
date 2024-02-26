import { IUser } from "../interface/user.interface";
import { prisma } from "../utils/db.server";
type Candidate = {
  id: string;
  bio: string;
  applicationLetter: string;
  transcript: string;
  matricule: string;
  electionId: string;
};
type CandidateRead = {
  id: string;
  bio: string;
  applicationLetter: string;
  transcript: string;
  matricule: string;
  electionId: string;
  publickey: string | null;
  privatekey: string | null;
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
): Promise<CandidateRead[]> => {
  return prisma.candidate.findMany({
    where: { electionId },
    select: {
      id: true,
      bio: true,
      applicationLetter: true,
      transcript: true,
      matricule: true,
      electionId: true,
      publickey: true,
      privatekey: true,
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
): Promise<CandidateRead | null> => {
  return prisma.candidate.findUnique({
    where: { id },
    select: {
      id: true,
      bio: true,
      applicationLetter: true,
      transcript: true,
      matricule: true,
      electionId: true,
      publickey: true,
      privatekey: true,
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

export const approveCandidate = async (
  id: string,
  publickey: string,
  privatekey: string
): Promise<void> => {
  await prisma.candidate.update({
    where: { id },
    data: {
      approved: true,
      publickey,
      privatekey,
    },
  });
};

import { prisma } from "../utils/db.server";

type Token = {
  refreshToken: string;
  ip: string;
  userAgent: string;
  userId: string;
};

type TokenRead = {
  id: string;
  refreshToken: string;
  ip: string;
  userAgent: string;
  userId: string;
  isValid: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export const createToken = async (token: Token): Promise<Token> => {
  const { refreshToken, ip, userAgent, userId } = token;
  return prisma.token.create({
    data: {
      ip,
      userAgent,
      userId,
      refreshToken,
    },
  });
};

export const findToken = async (
  identifier: string | { user: string; refreshToken: string }
): Promise<TokenRead | null> => {
  if (typeof identifier === "string") {
    return prisma.token.findUnique({
      where: { userId: identifier },
    });
  } else {
    const { user, refreshToken } = identifier;
    return prisma.token.findUnique({
      where: { userId: user, refreshToken },
    });
  }
};

export const deleteToken = async (userId: string): Promise<void> => {
  await prisma.token.delete({
    where: { userId },
  });
};

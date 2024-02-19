import bcrypt from "bcryptjs";

const createHash = async (data: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  const hashedData = await bcrypt.hash(data, salt);
  return hashedData;
};

export default createHash;

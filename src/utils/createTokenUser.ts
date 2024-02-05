export type User = {
  name: string;
  id: string;
  role: string;
};

export const createTokenUser = (
  user: User
): { name: string; id: string; role: string } => {
  return { name: user.name, id: user.id, role: user.role };
};

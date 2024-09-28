import type { User } from 'firebase/auth';

export const getRoleFromClaims = async (
  user: User
): Promise<string | undefined> => {
  if (user) {
    const idTokenResult = await user.getIdTokenResult();
    const { claims } = idTokenResult;

    return claims.role as string | undefined;
  }

  return undefined;
};

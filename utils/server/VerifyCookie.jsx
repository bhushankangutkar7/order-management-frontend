import 'server-only';
import { cookies } from 'next/headers';
import { verifyToken } from './JwtHelper.jsx';

export async function verifyCookie() {
  const cookieStore = await cookies();

  const sessionToken = cookieStore.get('session_token')?.value;

  if (!sessionToken) {
    return null;
  }

  const verified = verifyToken(sessionToken);
  return verified;
}
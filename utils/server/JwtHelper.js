// src/utils/server/JwtHelper.js
import 'server-only';
import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET
);

export async function generateJwtToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({
      alg: 'HS256',
    })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(secret);
}

export async function verifyJwtToken(token) {
  const { payload } =
    await jwtVerify(token, secret);

  return payload;
}
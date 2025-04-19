import bcrypt from 'bcrypt';

export async function encryptPassword(pass?: string) {
  if (!pass) {
    return;
  }
  const passEncripted = await bcrypt.hash(pass, 10);
  return passEncripted;
}
 
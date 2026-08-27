import { registerUser, loginUser, logoutUser } from "../../services/authService";
import type { User as FirebaseUser } from "firebase/auth";

function validateEmail(email: string) {
  const e = email.trim().toLowerCase();
  if (!e) throw new Error("Email is required.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) throw new Error("Invalid email format.");
  return e;
}
function validatePassword(pw: string) {
  if (!pw) throw new Error("Password is required.");
  if (pw.length < 6) throw new Error("Password must be at least 6 characters.");
  return pw;
}

export async function register(email: string, password: string): Promise<FirebaseUser> {
  const e = validateEmail(email);
  const p = validatePassword(password);
  return registerUser(e, p);
}
export async function login(email: string, password: string): Promise<FirebaseUser> {
  const e = validateEmail(email);
  const p = validatePassword(password);
  return loginUser(e, p);
}
export async function logout(): Promise<void> {
  return logoutUser();
}

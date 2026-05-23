export function validateEmail(email: string): string {
  if (!email.trim()) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email address";
  if (email.length > 254) return "Email is too long";
  return "";
}

export function validatePassword(password: string): string {
  if (!password) return "Password is required";
  if (password.length < 8) return "Must be at least 8 characters";
  if (password.length > 128) return "Password is too long";
  return "";
}

export function validateName(name: string): string {
  if (!name.trim()) return "Name is required";
  if (name.trim().length < 2) return "Must be at least 2 characters";
  if (name.length > 100) return "Name is too long";
  return "";
}

export function passwordStrength(pw: string): {
  score: number;
  label: string;
  bar: string;
  text: string;
} {
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong", "Very Strong"];
  const bars = ["w-[8%]", "w-[20%]", "w-[40%]", "w-[60%]", "w-[80%]", "w-full"];
  const texts = ["text-red-500", "text-red-400", "text-orange-400", "text-yellow-400", "text-green-400", "text-emerald-400"];
  const i = Math.min(s, 5);
  return { score: s, label: labels[i], bar: bars[i], text: texts[i] };
}

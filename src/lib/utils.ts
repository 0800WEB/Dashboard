import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const SERVER_URI = process.env.SERVER_URI || "http://192.168.0.103:3000";

export const _retrieveData = ({ key }: { key: string }) => {
  try {
    // Busca la cookie que coincide con la clave
    const value = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${key}=`))
      ?.split("=")[1];
    return value ? decodeURIComponent(value) : null;
  } catch (error) {
    console.log("Error al recuperar la cookie:", error);
    return null;
  }
};
  
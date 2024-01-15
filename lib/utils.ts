import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function cn2(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

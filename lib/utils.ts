import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseJSON<T>(data: string): T | null {
	try {
		return JSON.parse(data) as T;
	} catch (error) {
		return null;
	}
}
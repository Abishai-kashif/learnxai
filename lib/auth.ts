import { jwtDecode } from 'jwt-decode';

interface JWTPayload {
  sub: string; // email
  exp: number; // expiration timestamp
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export class AuthService {
  private static readonly TOKEN_KEY = 'token';
  private static readonly BASE_URL = process.env.NEXT_PUBLIC_PYTHON_API_URL || "http://localhost:8001";

  /**
   * Get the stored JWT token
   */
  static getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Store the JWT token
   */
  static setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Remove the JWT token
   */
  static removeToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.TOKEN_KEY);
  }

  /**
   * Check if user is authenticated (has valid token)
   */
  static isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode<JWTPayload>(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (error) {
      console.error('Invalid token:', error);
      this.removeToken();
      return false;
    }
  }

  /**
   * Get the current user's email from the token
   */
  static getUserEmail(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode<JWTPayload>(token);
      return decoded.sub;
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  }

  /**
   * Fetch current user data from the API
   */
  static async getCurrentUser(): Promise<User | null> {
    const token = this.getToken();
    if (!token || !this.isAuthenticated()) {
      return null;
    }

    try {
      const response = await fetch(`${this.BASE_URL}/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.removeToken();
        }
        throw new Error('Failed to fetch user data');
      }

      const userData = await response.json();
      return userData;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }

  /**
   * Logout the user
   */
  static logout(): void {
    this.removeToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/auth';
    }
  }

  /**
   * Redirect to login if not authenticated
   */
  static requireAuth(): boolean {
    if (!this.isAuthenticated()) {
      if (typeof window !== 'undefined') {
        window.location.href = '/auth';
      }
      return false;
    }
    return true;
  }
}
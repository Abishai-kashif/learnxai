interface ApiResponse<T = any> {
  data?: T;
  error?: string;
}

class ApiClient {
  private baseURL: string;
  private isRefreshing = false;
  private refreshPromise: Promise<void> | null = null;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_PYTHON_API_URL || "http://localhost:8001";
  }

  private async makeRequest<T>(
    url: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${this.baseURL}${url}`, {
      ...options,
      credentials: 'include', // Include HTTP-only cookies
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    // If we get a 401 and we're not already refreshing, try to refresh the token
    if (response.status === 401 && !this.isRefreshing && !url.includes('/auth/')) {
      return this.handleTokenRefresh(url, options);
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(errorData.detail || `HTTP ${response.status}`);
    }

    return response.json();
  }

  private async handleTokenRefresh<T>(
    originalUrl: string, 
    originalOptions: RequestInit
  ): Promise<T> {
    // If we're already refreshing, wait for it to complete
    if (this.isRefreshing && this.refreshPromise) {
      await this.refreshPromise;
      return this.makeRequest(originalUrl, originalOptions);
    }

    // Start the refresh process
    this.isRefreshing = true;
    this.refreshPromise = this.refreshToken();

    try {
      await this.refreshPromise;
      // Retry the original request
      return this.makeRequest(originalUrl, originalOptions);
    } catch (error) {
      // Refresh failed, redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/auth';
      }
      throw error;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  private async refreshToken(): Promise<void> {
    const response = await fetch(`${this.baseURL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }
  }

  // Public API methods
  async get<T>(url: string): Promise<T> {
    return this.makeRequest<T>(url, { method: 'GET' });
  }

  async post<T>(url: string, data?: any): Promise<T> {
    return this.makeRequest<T>(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(url: string, data?: any): Promise<T> {
    return this.makeRequest<T>(url, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(url: string): Promise<T> {
    return this.makeRequest<T>(url, { method: 'DELETE' });
  }

  // Authentication-specific methods
  async login(email: string, password: string): Promise<any> {
    return this.post('/login', { email, password });
  }

  async signup(name: string, email: string, password: string): Promise<any> {
    return this.post('/signup', { name, email, password });
  }

  async logout(): Promise<any> {
    return this.post('/auth/logout');
  }

  async validateSession(): Promise<any> {
    return this.get('/auth/session');
  }

  async refreshSession(): Promise<any> {
    return this.post('/auth/refresh');
  }

  async getCurrentUser(): Promise<any> {
    return this.get('/me');
  }

  // Quiz-specific methods
  async storeQuiz(quizData: any): Promise<any> {
    return this.post('/api/quiz/store', quizData);
  }

  async getQuizzes(): Promise<any> {
    return this.get('/api/quiz/list');
  }

  async getQuiz(quizId: string): Promise<any> {
    return this.get(`/api/quiz/${quizId}`);
  }

  // Quiz Session History methods
  async startQuizAttempt(quizId: string): Promise<any> {
    return this.post(`/api/quiz/attempt/start?quiz_id=${quizId}`);
  }

  async completeQuizAttempt(attemptId: string, attemptData: any): Promise<any> {
    return this.post(`/api/quiz/attempt/${attemptId}/complete`, attemptData);
  }

  async getQuizHistory(limit: number = 50, offset: number = 0): Promise<any> {
    return this.get(`/api/quiz/history?limit=${limit}&offset=${offset}`);
  }

  async getUserQuizStats(): Promise<any> {
    return this.get('/api/quiz/stats');
  }

  // Session History methods
  async getSessionHistory(limit: number = 10, offset: number = 0): Promise<any> {
    return this.get(`/api/sessions/history?limit=${limit}&offset=${offset}`);
  }

  async getSessionStats(): Promise<any> {
    return this.get('/api/sessions/stats');
  }
}

// Export a singleton instance
export const apiClient = new ApiClient();

// Export the class for testing or custom instances
export { ApiClient };
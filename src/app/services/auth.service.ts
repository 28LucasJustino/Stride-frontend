import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private api: ApiService) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const stored = localStorage.getItem('stride_user');
    const token = localStorage.getItem('stride_token');
    if (stored && token) {
      try {
        const user: User = JSON.parse(stored);
        this.currentUserSubject.next(user);
      } catch (e) {
        this.logout();
      }
    }
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isAuthenticated(): boolean {
    return !!this.currentUser && !!localStorage.getItem('stride_token');
  }

  get isAdmin(): boolean {
    return this.currentUser?.role === 'ROLE_ADMIN';
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.api.login(credentials).pipe(
      tap(res => this.handleAuthSuccess(res))
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.api.register(data).pipe(
      tap(res => this.handleAuthSuccess(res))
    );
  }

  private handleAuthSuccess(res: AuthResponse): void {
    const user: User = {
      id: res.id,
      name: res.name,
      email: res.email,
      role: res.role
    };
    localStorage.setItem('stride_token', res.token);
    localStorage.setItem('stride_user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  logout(): void {
    localStorage.removeItem('stride_token');
    localStorage.removeItem('stride_user');
    this.currentUserSubject.next(null);
  }
}


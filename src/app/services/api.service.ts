import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, PageResponse } from '../models/product.model';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';
import { CheckoutRequest, OrderResponse, DashboardStats } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8080/api/v1';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('stride_token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  // Auth
  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, request);
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/register`, request);
  }

  getMe(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.baseUrl}/auth/me`, { headers: this.getHeaders() });
  }

  // Products
  getProducts(params?: {
    brand?: string;
    query?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    size?: number;
  }): Observable<PageResponse<Product>> {
    let httpParams = new HttpParams();
    if (params?.brand) httpParams = httpParams.set('brand', params.brand);
    if (params?.query) httpParams = httpParams.set('query', params.query);
    if (params?.minPrice != null) httpParams = httpParams.set('minPrice', params.minPrice.toString());
    if (params?.maxPrice != null) httpParams = httpParams.set('maxPrice', params.maxPrice.toString());
    if (params?.page != null) httpParams = httpParams.set('page', params.page.toString());
    if (params?.size != null) httpParams = httpParams.set('size', params.size.toString());

    return this.http.get<PageResponse<Product>>(`${this.baseUrl}/products`, { params: httpParams });
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/products/${id}`);
  }

  getFeaturedProducts(limit = 8): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/products/featured?limit=${limit}`);
  }

  getBrands(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/products/brands`);
  }

  // Orders
  checkout(request: CheckoutRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`${this.baseUrl}/orders/checkout`, request, {
      headers: this.getHeaders()
    });
  }

  getMyOrders(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(`${this.baseUrl}/orders/my-orders`, {
      headers: this.getHeaders()
    });
  }

  // Wishlist
  getWishlist(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/wishlist`, {
      headers: this.getHeaders()
    });
  }

  addToWishlist(productId: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/wishlist/${productId}`, {}, {
      headers: this.getHeaders()
    });
  }

  removeFromWishlist(productId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/wishlist/${productId}`, {
      headers: this.getHeaders()
    });
  }

  // Admin
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.baseUrl}/admin/dashboard/stats`, {
      headers: this.getHeaders()
    });
  }
}

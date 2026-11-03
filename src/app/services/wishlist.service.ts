import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistIdsSubject = new BehaviorSubject<Set<string>>(new Set());
  public wishlistIds$ = this.wishlistIdsSubject.asObservable();

  private wishlistItemsSubject = new BehaviorSubject<Product[]>([]);
  public wishlistItems$ = this.wishlistItemsSubject.asObservable();

  private isModalOpenSubject = new BehaviorSubject<boolean>(false);
  public isModalOpen$ = this.isModalOpenSubject.asObservable();

  constructor(private api: ApiService, private auth: AuthService) {
    this.auth.currentUser$.subscribe(user => {
      if (user) {
        this.fetchWishlist();
      } else {
        this.wishlistIdsSubject.next(new Set());
        this.wishlistItemsSubject.next([]);
      }
    });
  }

  fetchWishlist(): void {
    if (!this.auth.isAuthenticated) return;
    this.api.getWishlist().subscribe({
      next: (items) => {
        this.wishlistItemsSubject.next(items);
        this.wishlistIdsSubject.next(new Set(items.map(i => i.id)));
      },
      error: () => {}
    });
  }

  isWishlisted(productId: string): boolean {
    return this.wishlistIdsSubject.value.has(productId);
  }

  toggleWishlist(product: Product): void {
    const isFav = this.isWishlisted(product.id);
    const newIds = new Set(this.wishlistIdsSubject.value);

    if (isFav) {
      newIds.delete(product.id);
      this.wishlistIdsSubject.next(newIds);
      this.wishlistItemsSubject.next(this.wishlistItemsSubject.value.filter(p => p.id !== product.id));
      if (this.auth.isAuthenticated) {
        this.api.removeFromWishlist(product.id).subscribe();
      }
    } else {
      newIds.add(product.id);
      this.wishlistIdsSubject.next(newIds);
      this.wishlistItemsSubject.next([...this.wishlistItemsSubject.value, product]);
      if (this.auth.isAuthenticated) {
        this.api.addToWishlist(product.id).subscribe();
      }
    }
  }

  openModal(): void {
    this.isModalOpenSubject.next(true);
  }

  closeModal(): void {
    this.isModalOpenSubject.next(false);
  }
}

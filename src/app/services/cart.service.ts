import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';

export interface CartItem {
  product: Product;
  quantity: number;
  shoeSize: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  public items$ = this.itemsSubject.asObservable();

  private isDrawerOpenSubject = new BehaviorSubject<boolean>(false);
  public isDrawerOpen$ = this.isDrawerOpenSubject.asObservable();

  constructor() {
    this.loadCart();
  }

  private loadCart(): void {
    const stored = localStorage.getItem('stride_cart');
    if (stored) {
      try {
        this.itemsSubject.next(JSON.parse(stored));
      } catch (e) {
        this.itemsSubject.next([]);
      }
    }
  }

  private saveCart(items: CartItem[]): void {
    localStorage.setItem('stride_cart', JSON.stringify(items));
    this.itemsSubject.next(items);
  }

  getItems(): CartItem[] {
    return this.itemsSubject.value;
  }

  addToCart(product: Product, size = 41, quantity = 1): void {
    const current = [...this.itemsSubject.value];
    const existingIndex = current.findIndex(
      item => item.product.id === product.id && item.shoeSize === size
    );

    if (existingIndex > -1) {
      current[existingIndex].quantity += quantity;
    } else {
      current.push({
        product,
        quantity,
        shoeSize: size
      });
    }

    this.saveCart(current);
    this.openDrawer();
  }

  updateQuantity(productId: string, size: number, quantity: number): void {
    let current = [...this.itemsSubject.value];
    if (quantity <= 0) {
      current = current.filter(item => !(item.product.id === productId && item.shoeSize === size));
    } else {
      const item = current.find(item => item.product.id === productId && item.shoeSize === size);
      if (item) {
        item.quantity = quantity;
      }
    }
    this.saveCart(current);
  }

  removeItem(productId: string, size: number): void {
    const current = this.itemsSubject.value.filter(
      item => !(item.product.id === productId && item.shoeSize === size)
    );
    this.saveCart(current);
  }

  clearCart(): void {
    this.saveCart([]);
  }

  getTotalCount(): number {
    return this.itemsSubject.value.reduce((acc, item) => acc + item.quantity, 0);
  }

  getTotalPrice(): number {
    return this.itemsSubject.value.reduce(
      (acc, item) => acc + (item.product.finalPrice * item.quantity),
      0
    );
  }

  openDrawer(): void {
    this.isDrawerOpenSubject.next(true);
  }

  closeDrawer(): void {
    this.isDrawerOpenSubject.next(false);
  }

  toggleDrawer(): void {
    this.isDrawerOpenSubject.next(!this.isDrawerOpenSubject.value);
  }
}


import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';
import { CartService, CartItem } from './services/cart.service';
import { WishlistService } from './services/wishlist.service';
import { Product } from './models/product.model';
import { OrderResponse, DashboardStats } from './models/order.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit {
  // Catalog State
  products: Product[] = [];
  featuredProducts: Product[] = [];
  brands: string[] = ['Todos', 'Nike', 'Adidas', 'Jordan', 'New Balance', 'Puma', 'Vans', 'Asics'];
  selectedBrand: string = 'Todos';
  searchQuery: string = '';
  selectedPriceRange: string = 'all';
  isLoading: boolean = false;

  // Selected Product for Quick View / Detail Modal
  selectedProduct: Product | null = null;
  selectedAngleIndex: number = 0;
  selectedShoeSize: number = 41;
  availableSizes: number[] = [38, 39, 40, 41, 42, 43, 44, 45];

  // Modals & Drawers
  isAuthModalOpen: boolean = false;
  authMode: 'login' | 'register' = 'login';
  loginEmail: string = '';
  loginPassword: string = '';
  registerName: string = '';
  registerEmail: string = '';
  registerPassword: string = '';
  authError: string = '';
  authSuccess: string = '';

  isOrdersModalOpen: boolean = false;
  myOrders: OrderResponse[] = [];
  isLoadingOrders: boolean = false;

  isAdminModalOpen: boolean = false;
  dashboardStats: DashboardStats | null = null;

  checkoutSuccessMessage: string = '';
  isCheckingOut: boolean = false;

  constructor(
    public api: ApiService,
    public auth: AuthService,
    public cart: CartService,
    public wishlist: WishlistService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadFeaturedProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    const brandParam = this.selectedBrand === 'Todos' ? undefined : this.selectedBrand;
    
    let minPrice: number | undefined;
    let maxPrice: number | undefined;

    if (this.selectedPriceRange === 'under100') {
      maxPrice = 100;
    } else if (this.selectedPriceRange === '100to150') {
      minPrice = 100;
      maxPrice = 150;
    } else if (this.selectedPriceRange === 'above150') {
      minPrice = 150;
    }

    this.api.getProducts({
      brand: brandParam,
      query: this.searchQuery ? this.searchQuery : undefined,
      minPrice,
      maxPrice,
      size: 24
    }).subscribe({
      next: (response) => {
        this.products = response.content;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar produtos:', err);
        this.isLoading = false;
      }
    });
  }

  loadFeaturedProducts(): void {
    this.api.getFeaturedProducts(4).subscribe({
      next: (data) => this.featuredProducts = data,
      error: () => {}
    });
  }

  onBrandSelect(brand: string): void {
    this.selectedBrand = brand;
    this.loadProducts();
  }

  onSearch(): void {
    this.loadProducts();
  }

  onPriceChange(): void {
    this.loadProducts();
  }

  // Quick View / Modal
  openProductModal(product: Product): void {
    this.selectedProduct = product;
    this.selectedAngleIndex = 0;
    this.selectedShoeSize = 41;
  }

  closeProductModal(): void {
    this.selectedProduct = null;
  }

  addToCartFromModal(): void {
    if (this.selectedProduct) {
      this.cart.addToCart(this.selectedProduct, this.selectedShoeSize);
      this.closeProductModal();
    }
  }

  quickAddToCart(product: Product, event: Event): void {
    event.stopPropagation();
    this.cart.addToCart(product, 41);
  }

  toggleFavorite(product: Product, event: Event): void {
    event.stopPropagation();
    this.wishlist.toggleWishlist(product);
  }

  // Checkout Flow
  handleCheckout(): void {
    if (!this.auth.isAuthenticated) {
      this.cart.closeDrawer();
      this.openAuthModal('login');
      return;
    }

    const items = this.cart.getItems();
    if (items.length === 0) return;

    this.isCheckingOut = true;
    const checkoutRequest = {
      items: items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        shoeSize: item.shoeSize
      }))
    };

    this.api.checkout(checkoutRequest).subscribe({
      next: (order) => {
        this.isCheckingOut = false;
        this.cart.clearCart();
        this.cart.closeDrawer();
        this.checkoutSuccessMessage = `Encomenda #${order.id.slice(0, 8)} confirmada com sucesso! Enviámos os detalhes para o seu e-mail.`;
        setTimeout(() => {
          this.checkoutSuccessMessage = '';
        }, 6000);
      },
      error: (err) => {
        this.isCheckingOut = false;
        alert(err.error?.message || 'Erro ao processar o checkout. Verifique o stock disponível.');
      }
    });
  }

  // Auth Modal
  openAuthModal(mode: 'login' | 'register' = 'login'): void {
    this.authMode = mode;
    this.authError = '';
    this.authSuccess = '';
    this.isAuthModalOpen = true;
  }

  closeAuthModal(): void {
    this.isAuthModalOpen = false;
  }

  quickFillUser(email: string, pass: string): void {
    this.loginEmail = email;
    this.loginPassword = pass;
    this.handleLogin();
  }

  handleLogin(): void {
    this.authError = '';
    if (!this.loginEmail || !this.loginPassword) {
      this.authError = 'Preencha todos os campos.';
      return;
    }

    this.api.login({ email: this.loginEmail, password: this.loginPassword }).subscribe({
      next: (res) => {
        this.auth['handleAuthSuccess'](res);
        this.closeAuthModal();
      },
      error: () => {
        this.authError = 'Email ou senha incorretos.';
      }
    });
  }

  handleRegister(): void {
    this.authError = '';
    if (!this.registerName || !this.registerEmail || !this.registerPassword) {
      this.authError = 'Preencha todos os campos.';
      return;
    }

    this.api.register({
      name: this.registerName,
      email: this.registerEmail,
      password: this.registerPassword
    }).subscribe({
      next: (res) => {
        this.auth['handleAuthSuccess'](res);
        this.closeAuthModal();
      },
      error: (err) => {
        this.authError = err.error?.message || 'Erro ao criar conta.';
      }
    });
  }

  // Orders
  openOrdersModal(): void {
    if (!this.auth.isAuthenticated) {
      this.openAuthModal('login');
      return;
    }
    this.isOrdersModalOpen = true;
    this.isLoadingOrders = true;
    this.api.getMyOrders().subscribe({
      next: (orders) => {
        this.myOrders = orders;
        this.isLoadingOrders = false;
      },
      error: () => {
        this.isLoadingOrders = false;
      }
    });
  }

  closeOrdersModal(): void {
    this.isOrdersModalOpen = false;
  }

  // Admin
  openAdminModal(): void {
    if (!this.auth.isAdmin) return;
    this.isAdminModalOpen = true;
    this.api.getDashboardStats().subscribe({
      next: (stats) => {
        this.dashboardStats = stats;
      },
      error: (err) => console.error(err)
    });
  }

  closeAdminModal(): void {
    this.isAdminModalOpen = false;
  }

  getProductPrimaryImage(product: Product): string {
    if (product.images && product.images.length > 0) {
      const primary = product.images.find(img => img.isPrimary);
      return primary ? primary.imageUrl : product.images[0].imageUrl;
    }
    return 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80';
  }
}

export { AppComponent as App };

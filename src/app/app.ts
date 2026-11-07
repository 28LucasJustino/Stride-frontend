import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';
import { WishlistService } from './services/wishlist.service';
import { I18nService } from './services/i18n.service';
import { Product } from './models/product.model';
import { OrderResponse, DashboardStats } from './models/order.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit, OnDestroy {
  // Catalog State
  products: Product[] = [];
  featuredProducts: Product[] = [];
  brands: string[] = ['Todos', 'Nike', 'Jordan', 'Adidas', 'New Balance', 'Puma', 'Vans', 'Asics', 'Salomon', 'Converse', 'Reebok'];
  selectedBrand: string = 'Todos';
  searchQuery: string = '';
  selectedPriceRange: string = 'all';
  isLoading: boolean = false;

  // Promotional Carousel State
  activeSlideIndex: number = 0;
  private carouselInterval: any;

  // Selected Product for Quick View / Detail Modal
  selectedProduct: Product | null = null;
  selectedAngleIndex: number = 0;
  selectedShoeSize: number = 41;
  availableSizes: number[] = [38, 39, 40, 41, 42, 43, 44, 45];

  // Modals & Drawers
  isAuthModalOpen: boolean = false;
  authMode: 'login' | 'register' = 'login';
  isAdminLoginRedirect: boolean = false;
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

  // Admin Dashboard & Inventory
  isAdminModalOpen: boolean = false;
  dashboardStats: DashboardStats | null = null;
  adminProducts: Product[] = [];
  adminSearchQuery: string = '';
  isUpdatingStock: boolean = false;

  checkoutSuccessMessage: string = '';
  isCheckingOut: boolean = false;

  constructor(
    public api: ApiService,
    public auth: AuthService,
    public cart: CartService,
    public wishlist: WishlistService,
    public i18n: I18nService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadFeaturedProducts();
    this.startCarouselAutoSlide();
  }

  ngOnDestroy(): void {
    this.stopCarouselAutoSlide();
  }

  // Carousel Methods
  startCarouselAutoSlide(): void {
    this.carouselInterval = setInterval(() => {
      this.nextSlide();
    }, 6000);
  }

  stopCarouselAutoSlide(): void {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }

  nextSlide(): void {
    this.activeSlideIndex = (this.activeSlideIndex + 1) % 3;
  }

  prevSlide(): void {
    this.activeSlideIndex = (this.activeSlideIndex - 1 + 3) % 3;
  }

  goToSlide(index: number): void {
    this.activeSlideIndex = index;
  }

  // Catalog Methods
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
      size: 60
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
    this.api.getFeaturedProducts(6).subscribe({
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
        this.checkoutSuccessMessage = this.i18n.currentLang === 'pt' ?
          `Encomenda #${order.id.slice(0, 8)} confirmada com sucesso! Enviámos os detalhes para o seu e-mail.` :
          `Order #${order.id.slice(0, 8)} confirmed! Details have been sent to your email.`;
        setTimeout(() => {
          this.checkoutSuccessMessage = '';
        }, 6000);
      },
      error: (err) => {
        this.isCheckingOut = false;
        alert(err.error?.message || (this.i18n.currentLang === 'pt' ? 'Erro ao processar checkout.' : 'Error processing checkout.'));
      }
    });
  }

  // Auth Modal
  openAuthModal(mode: 'login' | 'register' = 'login', isAdminIntent = false): void {
    this.authMode = mode;
    this.isAdminLoginRedirect = isAdminIntent;
    this.authError = '';
    this.authSuccess = '';
    this.isAuthModalOpen = true;
  }

  closeAuthModal(): void {
    this.isAuthModalOpen = false;
    this.isAdminLoginRedirect = false;
  }

  quickFillUser(email: string, pass: string): void {
    this.loginEmail = email;
    this.loginPassword = pass;
    this.handleLogin();
  }

  handleLogin(): void {
    this.authError = '';
    if (!this.loginEmail || !this.loginPassword) {
      this.authError = this.i18n.currentLang === 'pt' ? 'Preencha todos os campos.' : 'Please fill all fields.';
      return;
    }

    this.api.login({ email: this.loginEmail, password: this.loginPassword }).subscribe({
      next: (res) => {
        this.auth['handleAuthSuccess'](res);
        const shouldOpenAdmin = this.isAdminLoginRedirect && res.role === 'ROLE_ADMIN';
        this.closeAuthModal();
        if (shouldOpenAdmin) {
          this.openAdminModal();
        }
      },
      error: () => {
        this.authError = this.i18n.currentLang === 'pt' ? 'Email ou senha incorretos.' : 'Invalid email or password.';
      }
    });
  }

  handleRegister(): void {
    this.authError = '';
    if (!this.registerName || !this.registerEmail || !this.registerPassword) {
      this.authError = this.i18n.currentLang === 'pt' ? 'Preencha todos os campos.' : 'Please fill all fields.';
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
        this.authError = err.error?.message || (this.i18n.currentLang === 'pt' ? 'Erro ao criar conta.' : 'Error creating account.');
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

  // Admin Dashboard & Inventory
  openAdminModal(): void {
    if (!this.auth.isAdmin) {
      // Prompt user to sign in as Admin
      this.openAuthModal('login', true);
      return;
    }
    this.isAdminModalOpen = true;
    this.loadAdminData();
  }

  closeAdminModal(): void {
    this.isAdminModalOpen = false;
  }

  loadAdminData(): void {
    this.api.getDashboardStats().subscribe({
      next: (stats) => {
        this.dashboardStats = stats;
      },
      error: (err) => console.error(err)
    });

    this.api.getProducts({ size: 100 }).subscribe({
      next: (res) => {
        this.adminProducts = res.content;
      },
      error: (err) => console.error(err)
    });
  }

  get filteredAdminProducts(): Product[] {
    if (!this.adminSearchQuery.trim()) return this.adminProducts;
    const q = this.adminSearchQuery.toLowerCase();
    return this.adminProducts.filter(p =>
      p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
    );
  }

  adjustStock(product: Product, delta: number): void {
    const newQty = Math.max(0, product.stockQuantity + delta);
    this.api.updateStock(product.id, newQty).subscribe({
      next: (updated) => {
        product.stockQuantity = updated.stockQuantity;
        // Also update in main catalog
        const catItem = this.products.find(p => p.id === product.id);
        if (catItem) {
          catItem.stockQuantity = updated.stockQuantity;
        }
        // Refresh stats
        this.api.getDashboardStats().subscribe(stats => this.dashboardStats = stats);
      },
      error: (err) => console.error(err)
    });
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

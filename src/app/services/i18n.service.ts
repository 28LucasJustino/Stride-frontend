import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Language = 'pt' | 'en';

export interface Translations {
  [key: string]: {
    pt: string;
    en: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private currentLangSubject = new BehaviorSubject<Language>('pt');
  public currentLang$ = this.currentLangSubject.asObservable();

  private translations: Translations = {
    // Top Bar & Announcements
    'ticker.shipping': {
      pt: '🚚 FRETE GRÁTIS PARA TODO O BRASIL EM COMPRAS ACIMA DE €100',
      en: '🚚 FREE EXPRESS SHIPPING ON ALL ORDERS OVER €100'
    },
    'ticker.coupon': {
      pt: '🏷️ USE O CUPOM "STRIDE15" PARA 15% DE DESCONTO NO SEU PRIMEIRO DROP',
      en: '🏷️ USE COUPON "STRIDE15" FOR 15% OFF YOUR FIRST DROP'
    },
    'ticker.auth': {
      pt: '👟 100% SNEAKERS AUTÊNTICOS & VERIFICADOS COM CERTIFICADO DE ORIGEM',
      en: '👟 100% AUTHENTIC & VERIFIED SNEAKERS WITH CERTIFICATE OF ORIGIN'
    },

    // Header
    'header.search_placeholder': {
      pt: 'Pesquisar Dunk, Jordan, Campus, New Balance, Asics...',
      en: 'Search Dunk, Jordan, Campus, New Balance, Asics...'
    },
    'header.wishlist': {
      pt: 'Favoritos',
      en: 'Wishlist'
    },
    'header.cart': {
      pt: 'Carrinho',
      en: 'Cart'
    },
    'header.login': {
      pt: 'Entrar',
      en: 'Sign In'
    },
    'header.admin': {
      pt: 'Painel Admin',
      en: 'Admin Panel'
    },
    'header.logout': {
      pt: 'Sair',
      en: 'Sign Out'
    },

    // Carousel & Promos
    'promo.slide1_badge': {
      pt: '★ DROP EXCLUSIVO 2026',
      en: '★ EXCLUSIVE DROP 2026'
    },
    'promo.slide1_title': {
      pt: 'NEO-POP STREETWEAR: SILHUETAS INSUFLADAS',
      en: 'NEO-POP STREETWEAR: INFLATED SILHOUETTES'
    },
    'promo.slide1_desc': {
      pt: 'Os lançamentos mais aguardados do ano com estética Y2K, acabamento premium e 15% OFF com o cupom STRIDE15.',
      en: 'The year’s most coveted releases with Y2K aesthetics, premium leather and 15% OFF with code STRIDE15.'
    },
    'promo.slide1_cta': {
      pt: 'Ver Todos os Drops',
      en: 'Shop All Drops'
    },

    'promo.slide2_badge': {
      pt: '⚡ ATÉ 25% OFF',
      en: '⚡ UP TO 25% OFF'
    },
    'promo.slide2_title': {
      pt: 'SELEÇÃO RETRO: NIKE DUNK & ADIDAS CAMPUS',
      en: 'RETRO SELECT: NIKE DUNK & ADIDAS CAMPUS'
    },
    'promo.slide2_desc': {
      pt: 'Mais de 50 modelos lendários à pronta entrega. Silhuetas autênticas das quadras para as ruas do mundo.',
      en: 'Over 50 legendary models ready to ship. Authentic silhouettes straight from court to the streets.'
    },
    'promo.slide2_cta': {
      pt: 'Explorar Ofertas',
      en: 'Explore Deals'
    },

    'promo.slide3_badge': {
      pt: '📦 ENVIO EXPRESSO',
      en: '📦 EXPRESS SHIPPING'
    },
    'promo.slide3_title': {
      pt: 'FRETE GRÁTIS & PACKING COLECIONÁVEL',
      en: 'FREE SHIPPING & COLLECTIBLE PACKING'
    },
    'promo.slide3_desc': {
      pt: 'Todas as caixas enviadas com embalagem dupla reforçada e pack de stickers vinílicos exclusivos Stride.',
      en: 'All orders shipped with reinforced double box and exclusive Stride vinyl sticker decal pack.'
    },
    'promo.slide3_cta': {
      pt: 'Garantir Sneaker',
      en: 'Get Your Pair'
    },

    // Catalog & Filters
    'catalog.title_all': {
      pt: 'Catálogo de Sneakers',
      en: 'Sneakers Catalog'
    },
    'catalog.models': {
      pt: 'Modelos',
      en: 'Models'
    },
    'catalog.results_for': {
      pt: 'Resultados para',
      en: 'Results for'
    },
    'catalog.filter_price': {
      pt: 'Filtrar Preço:',
      en: 'Filter Price:'
    },
    'catalog.all_prices': {
      pt: 'Todos os Preços',
      en: 'All Prices'
    },
    'catalog.under_100': {
      pt: 'Até €100',
      en: 'Under €100'
    },
    'catalog.100_to_150': {
      pt: '€100 a €150',
      en: '€100 to €150'
    },
    'catalog.above_150': {
      pt: 'Acima de €150',
      en: 'Above €150'
    },
    'catalog.loading': {
      pt: 'A carregar modelos exclusivos...',
      en: 'Loading exclusive models...'
    },
    'catalog.empty_title': {
      pt: 'Nenhum calçado encontrado',
      en: 'No sneakers found'
    },
    'catalog.empty_desc': {
      pt: 'Tente ajustar a sua pesquisa ou escolher outra marca no menu de filtros.',
      en: 'Try adjusting your search or selecting another brand in the filter bar.'
    },
    'catalog.clear_filters': {
      pt: 'Limpar Filtros',
      en: 'Clear Filters'
    },
    'catalog.last_pairs': {
      pt: 'Últimos Pares',
      en: 'Last Pairs'
    },
    'catalog.stock': {
      pt: 'Stock:',
      en: 'Stock:'
    },
    'catalog.pairs': {
      pt: 'pares',
      en: 'pairs'
    },
    'catalog.add_btn': {
      pt: '+ Add',
      en: '+ Add'
    },

    // Product Modal
    'product.discount_badge': {
      pt: 'DESCONTO',
      en: 'OFF'
    },
    'product.select_size': {
      pt: 'Selecionar Tamanho (EU):',
      en: 'Select Shoe Size (EU):'
    },
    'product.available': {
      pt: 'disponíveis',
      en: 'available'
    },
    'product.add_cart_btn': {
      pt: 'Adicionar ao Carrinho',
      en: 'Add to Cart'
    },
    'product.size': {
      pt: 'Tam.',
      en: 'Size'
    },

    // Cart Drawer
    'cart.title': {
      pt: 'O Teu Carrinho',
      en: 'Your Cart'
    },
    'cart.items': {
      pt: 'itens',
      en: 'items'
    },
    'cart.empty_title': {
      pt: 'O carrinho está vazio',
      en: 'Your cart is empty'
    },
    'cart.empty_desc': {
      pt: 'Adiciona os teus ténis favoritos para começar.',
      en: 'Add your favorite sneakers to get started.'
    },
    'cart.explore': {
      pt: 'Ver Catálogo',
      en: 'Explore Catalog'
    },
    'cart.size': {
      pt: 'Tamanho:',
      en: 'Size:'
    },
    'cart.subtotal': {
      pt: 'Subtotal:',
      en: 'Subtotal:'
    },
    'cart.shipping': {
      pt: 'Envio Expresso:',
      en: 'Express Shipping:'
    },
    'cart.free': {
      pt: 'GRÁTIS',
      en: 'FREE'
    },
    'cart.total': {
      pt: 'Total:',
      en: 'Total:'
    },
    'cart.checkout_btn': {
      pt: 'Finalizar Compra',
      en: 'Checkout'
    },
    'cart.processing': {
      pt: 'A processar encomenda...',
      en: 'Processing order...'
    },

    // Wishlist Modal
    'wishlist.title': {
      pt: 'A tua Lista de Desejos',
      en: 'Your Wishlist'
    },
    'wishlist.empty': {
      pt: 'Ainda não tens ténis favoritos guardados.',
      en: 'You have no saved favorite sneakers yet.'
    },
    'wishlist.add': {
      pt: 'Adicionar',
      en: 'Add'
    },
    'wishlist.remove': {
      pt: 'Remover',
      en: 'Remove'
    },

    // Auth Modal
    'auth.signin_tab': {
      pt: 'Entrar',
      en: 'Sign In'
    },
    'auth.signup_tab': {
      pt: 'Criar Conta',
      en: 'Sign Up'
    },
    'auth.quick_title': {
      pt: '⚡ Contas Rápidas de Teste:',
      en: '⚡ Quick Test Accounts:'
    },
    'auth.email': {
      pt: 'E-mail:',
      en: 'Email:'
    },
    'auth.password': {
      pt: 'Senha:',
      en: 'Password:'
    },
    'auth.name': {
      pt: 'Nome Completo:',
      en: 'Full Name:'
    },
    'auth.btn_login': {
      pt: 'Iniciar Sessão',
      en: 'Sign In'
    },
    'auth.btn_register': {
      pt: 'Criar Conta Stride',
      en: 'Create Stride Account'
    },

    // Admin Panel
    'admin.title': {
      pt: 'Painel Administrativo Stride',
      en: 'Stride Admin Dashboard'
    },
    'admin.total_revenue': {
      pt: 'Vendas Totais',
      en: 'Total Revenue'
    },
    'admin.total_orders': {
      pt: 'Encomendas',
      en: 'Orders'
    },
    'admin.active_products': {
      pt: 'Produtos Ativos',
      en: 'Active Products'
    },
    'admin.total_users': {
      pt: 'Utilizadores Registados',
      en: 'Registered Users'
    },
    'admin.low_stock': {
      pt: 'Alerta Stock Baixo (<5)',
      en: 'Low Stock Alert (<5)'
    },
    'admin.inventory_title': {
      pt: 'Gestão de Inventário e Stock',
      en: 'Inventory & Stock Management'
    },
    'admin.search_product': {
      pt: 'Filtrar produto no inventário...',
      en: 'Filter product in inventory...'
    },
    'admin.col_product': {
      pt: 'Produto',
      en: 'Product'
    },
    'admin.col_brand': {
      pt: 'Marca',
      en: 'Brand'
    },
    'admin.col_price': {
      pt: 'Preço',
      en: 'Price'
    },
    'admin.col_stock': {
      pt: 'Stock Atual',
      en: 'Current Stock'
    },
    'admin.col_actions': {
      pt: 'Ações de Stock',
      en: 'Stock Actions'
    },
    'admin.close': {
      pt: 'Fechar Painel',
      en: 'Close Panel'
    },
    'admin.access_notice': {
      pt: 'Acesso Restrito: Faça login como Administrador para aceder.',
      en: 'Restricted Access: Sign in as Administrator to access.'
    },

    // Orders Modal
    'orders.title': {
      pt: 'As Tuas Encomendas',
      en: 'Your Orders'
    },
    'orders.empty': {
      pt: 'Ainda não realizaste nenhuma encomenda.',
      en: 'You have not placed any orders yet.'
    },
    'orders.paid': {
      pt: 'Total Pago:',
      en: 'Total Paid:'
    }
  };

  constructor() {
    const saved = localStorage.getItem('stride_lang') as Language;
    if (saved === 'en' || saved === 'pt') {
      this.currentLangSubject.next(saved);
    }
  }

  get currentLang(): Language {
    return this.currentLangSubject.value;
  }

  setLanguage(lang: Language): void {
    localStorage.setItem('stride_lang', lang);
    this.currentLangSubject.next(lang);
  }

  toggleLanguage(): void {
    const nextLang: Language = this.currentLang === 'pt' ? 'en' : 'pt';
    this.setLanguage(nextLang);
  }

  t(key: string): string {
    const item = this.translations[key];
    if (!item) return key;
    return item[this.currentLang] || item['pt'] || key;
  }
}

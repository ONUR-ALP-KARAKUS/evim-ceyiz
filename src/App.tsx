import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Menu, X, Trash2, Edit, Plus, Image as ImageIcon, Phone, MapPin, Mail, ChevronRight, ChevronLeft, Upload } from 'lucide-react';
import { Product, CartItem } from './types';

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Karaca 60 Parça Yemek Takımı',
    description: 'Zarif tasarımıyla sofralarınıza şıklık katar. 12 kişilik tam set. Porselen malzemeden üretilmiştir.',
    price: 4500,
    oldPrice: 5500,
    isCampaign: true,
    images: ['https://picsum.photos/seed/yemek/800/600'],
    stock: 10,
  },
  {
    id: '2',
    name: 'Korkmaz Çelik Tencere Seti',
    description: 'Paslanmaz çelik, uzun ömürlü ve sağlıklı pişirme deneyimi. Isıyı eşit dağıtan özel taban.',
    price: 3200,
    isCampaign: false,
    images: ['https://picsum.photos/seed/tencere/800/600'],
    stock: 5,
  },
  {
    id: '3',
    name: 'Paşabahçe 12 Parça Çay Seti',
    description: 'Geleneksel ince belli çay bardağı seti. Misafirleriniz için ideal şık tasarım.',
    price: 450,
    isCampaign: false,
    images: ['https://picsum.photos/seed/cay/800/600'],
    stock: 0,
  }
];

export default function App() {
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentView, setCurrentView] = useState<'home' | 'products' | 'campaigns' | 'contact' | 'admin'>('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Load data
  useEffect(() => {
    const savedProducts = localStorage.getItem('evim_ceyiz_products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem('evim_ceyiz_products', JSON.stringify(INITIAL_PRODUCTS));
    }

    const savedCart = localStorage.getItem('evim_ceyiz_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart
  useEffect(() => {
    localStorage.setItem('evim_ceyiz_cart', JSON.stringify(cart));
  }, [cart]);

  // Save products
  const saveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem('evim_ceyiz_products', JSON.stringify(newProducts));
  };

  // Cart actions
  const addToCart = (product: Product) => {
    if (product.stock <= 0) return;
    
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev; // Can't add more than stock
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQ = item.quantity + delta;
        if (newQ > 0 && newQ <= item.stock) {
          return { ...item, quantity: newQ };
        }
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Navigation
  const navigate = (view: typeof currentView) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans flex flex-col">
      {/* Navbar */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center cursor-pointer" onClick={() => navigate('home')}>
              <span className="text-2xl font-bold text-amber-700 font-serif">Evim Çeyiz</span>
            </div>
            
            {/* Desktop Menu */}
            <nav className="hidden md:flex space-x-8">
              <button onClick={() => navigate('home')} className={`text-sm font-medium transition-colors ${currentView === 'home' ? 'text-amber-700' : 'text-stone-600 hover:text-amber-700'}`}>Anasayfa</button>
              <button onClick={() => navigate('products')} className={`text-sm font-medium transition-colors ${currentView === 'products' ? 'text-amber-700' : 'text-stone-600 hover:text-amber-700'}`}>Ürünlerimiz</button>
              <button onClick={() => navigate('campaigns')} className={`text-sm font-medium transition-colors ${currentView === 'campaigns' ? 'text-amber-700' : 'text-stone-600 hover:text-amber-700'}`}>Kampanyalar</button>
              <button onClick={() => navigate('contact')} className={`text-sm font-medium transition-colors ${currentView === 'contact' ? 'text-amber-700' : 'text-stone-600 hover:text-amber-700'}`}>İletişim</button>
            </nav>

            <div className="flex items-center space-x-4">
              <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-stone-600 hover:text-amber-700 transition-colors">
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-amber-600 rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
              
              {/* Mobile menu button */}
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-stone-600">
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-stone-100 absolute w-full shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <button onClick={() => navigate('home')} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-stone-700 hover:text-amber-700 hover:bg-stone-50">Anasayfa</button>
              <button onClick={() => navigate('products')} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-stone-700 hover:text-amber-700 hover:bg-stone-50">Ürünlerimiz</button>
              <button onClick={() => navigate('campaigns')} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-stone-700 hover:text-amber-700 hover:bg-stone-50">Kampanyalar</button>
              <button onClick={() => navigate('contact')} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-stone-700 hover:text-amber-700 hover:bg-stone-50">İletişim</button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {currentView === 'home' && <HomeView navigate={navigate} products={products} addToCart={addToCart} />}
        {currentView === 'products' && <ProductsView products={products} addToCart={addToCart} />}
        {currentView === 'campaigns' && <CampaignsView navigate={navigate} products={products} addToCart={addToCart} />}
        {currentView === 'contact' && <ContactView />}
        {currentView === 'admin' && <AdminView products={products} saveProducts={saveProducts} isAdminLoggedIn={isAdminLoggedIn} setIsAdminLoggedIn={setIsAdminLoggedIn} />}
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <span className="text-2xl font-bold text-white font-serif">Evim Çeyiz</span>
              <p className="text-sm mt-4 text-stone-400">Evinizin şıklığı, bizim tutkumuz. En kaliteli züccaciye ürünleri en uygun fiyatlarla.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Hızlı Linkler</h3>
              <ul className="space-y-2">
                <li><button onClick={() => navigate('home')} className="hover:text-amber-500 transition-colors text-sm">Anasayfa</button></li>
                <li><button onClick={() => navigate('products')} className="hover:text-amber-500 transition-colors text-sm">Ürünlerimiz</button></li>
                <li><button onClick={() => navigate('campaigns')} className="hover:text-amber-500 transition-colors text-sm">Kampanyalar</button></li>
                <li><button onClick={() => navigate('contact')} className="hover:text-amber-500 transition-colors text-sm">İletişim</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">İletişim</h3>
              <ul className="space-y-2 text-sm text-stone-400">
                <li className="flex items-center"><Phone className="h-4 w-4 mr-2" /> +90 536 882 24 22</li>
                <li className="flex items-center"><Mail className="h-4 w-4 mr-2" /> info@evimceyiz.com</li>
                <li className="flex items-center"><MapPin className="h-4 w-4 mr-2" /> Muğla, Yatağan</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-stone-800 text-center text-xs flex flex-col items-center">
            <p>&copy; {new Date().getFullYear()} Evim Çeyiz. Tüm hakları saklıdır.</p>
            <button onClick={() => navigate('admin')} className="mt-6 text-stone-500 hover:text-stone-300 transition-colors opacity-70 text-xs cursor-pointer">Yönetici Paneli</button>
          </div>
        </div>
      </footer>

      {/* Cart Modal */}
      {isCartOpen && (
        <CartModal 
          cart={cart} 
          onClose={() => setIsCartOpen(false)} 
          removeFromCart={removeFromCart}
          updateQuantity={updateCartQuantity}
          total={cartTotal}
          clearCart={() => setCart([])}
        />
      )}
    </div>
  );
}

// --- Views ---

function HomeView({ navigate, products, addToCart }: { navigate: (v: any) => void, products: Product[], addToCart: (p: Product) => void }) {
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="animate-in fade-in duration-500">
      {/* Hero Section */}
      <div className="relative bg-stone-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://picsum.photos/seed/kitchen/1920/1080" alt="Mutfak" className="w-full h-full object-cover opacity-40" referrerPolicy="no-referrer" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-serif mb-6">Evinizin Yeni Işıltısı</h1>
          <p className="text-lg md:text-xl text-stone-200 max-w-2xl mb-10">En seçkin markaların züccaciye ve çeyiz ürünleriyle mutfağınıza ve sofralarınıza zarafet katın.</p>
          <button 
            onClick={() => navigate('products')}
            className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-full font-medium text-lg transition-all transform hover:scale-105 shadow-lg"
          >
            Ürünleri Keşfet
          </button>
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold font-serif text-stone-800">Öne Çıkanlar</h2>
            <p className="text-stone-500 mt-2">En çok tercih edilen ürünlerimiz</p>
          </div>
          <button onClick={() => navigate('products')} className="text-amber-700 font-medium hover:text-amber-800 flex items-center">
            Tümünü Gör <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} addToCart={addToCart} />
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="w-16 h-16 mx-auto bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mb-4">
                <ShoppingCart className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Kolay Sipariş</h3>
              <p className="text-stone-500">WhatsApp üzerinden hızlı ve güvenli sipariş imkanı.</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 mx-auto bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mb-4">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Kapıda Ödeme</h3>
              <p className="text-stone-500">Ürünlerinizi teslim alırken güvenle ödeme yapın.</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 mx-auto bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mb-4">
                <Phone className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Müşteri Desteği</h3>
              <p className="text-stone-500">Her türlü sorunuz için WhatsApp hattımızdan bize ulaşın.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductsView({ products, addToCart }: { products: Product[], addToCart: (p: Product) => void }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold font-serif text-stone-800 mb-2">Tüm Ürünlerimiz</h1>
      <p className="text-stone-500 mb-8">Eviniz için en güzel parçalar</p>
      
      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-stone-100">
          <p className="text-stone-500 text-lg">Henüz ürün eklenmemiş.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} addToCart={addToCart} />
          ))}
        </div>
      )}
    </div>
  );
}

function CampaignsView({ navigate, products, addToCart }: { navigate: (v: any) => void, products: Product[], addToCart: (p: Product) => void }) {
  const campaignProducts = products.filter(p => p.isCampaign);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold font-serif text-stone-800 mb-8">Kampanyalar</h1>
      
      {campaignProducts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-stone-100">
          <p className="text-stone-500 text-lg">Şu an için aktif kampanyalı ürün bulunmamaktadır.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {campaignProducts.map(product => (
            <ProductCard key={product.id} product={product} addToCart={addToCart} />
          ))}
        </div>
      )}
    </div>
  );
}

function ContactView() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold font-serif text-stone-800 mb-8">İletişim</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100">
          <h2 className="text-2xl font-semibold mb-6">Bize Ulaşın</h2>
          <p className="text-stone-600 mb-8">Siparişleriniz, ürünlerimiz hakkında bilgi almak veya destek talepleriniz için bize aşağıdaki kanallardan ulaşabilirsiniz.</p>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-amber-100 p-3 rounded-full text-amber-700 mr-4">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium text-stone-900">Telefon / WhatsApp</h3>
                <p className="text-stone-600">+90 536 882 24 22</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-amber-100 p-3 rounded-full text-amber-700 mr-4">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium text-stone-900">E-posta</h3>
                <p className="text-stone-600">info@evimceyiz.com</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-amber-100 p-3 rounded-full text-amber-700 mr-4">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium text-stone-900">Adres</h3>
                <p className="text-stone-600">Muğla, Yatağan<br/>Merkez Mahallesi, Çarşı İçi</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-stone-200 rounded-2xl overflow-hidden h-[400px] md:h-auto relative">
          {/* Placeholder for map */}
          <div className="absolute inset-0 flex items-center justify-center text-stone-500 flex-col">
            <MapPin className="h-12 w-12 mb-4 opacity-50" />
            <p>Harita Görünümü</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Components ---

function ProductCard({ product, addToCart }: { product: Product, addToCart: (p: Product) => void }) {
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 hover:shadow-md transition-shadow group flex flex-col h-full">
      <div className="relative aspect-square overflow-hidden bg-stone-100">
        {product.images.length > 0 ? (
          <img 
            src={product.images[currentImageIdx]} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-400">
            <ImageIcon className="h-12 w-12 opacity-20" />
          </div>
        )}
        
        {product.images.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1">
            {product.images.map((_, idx) => (
              <button 
                key={idx}
                onClick={(e) => { e.stopPropagation(); setCurrentImageIdx(idx); }}
                className={`w-2 h-2 rounded-full ${idx === currentImageIdx ? 'bg-amber-600' : 'bg-white/70'}`}
              />
            ))}
          </div>
        )}

        {product.isCampaign && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase shadow-md">
              İndirimli
            </span>
          </div>
        )}

        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-stone-900 text-white px-4 py-2 rounded-lg font-bold tracking-wider uppercase text-sm">
              Stok Yok
            </span>
          </div>
        )}
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-stone-900 mb-1 line-clamp-2">{product.name}</h3>
        <p className="text-stone-500 text-sm mb-4 line-clamp-2 flex-grow">{product.description}</p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-stone-100">
          <div className="flex flex-col">
            {product.isCampaign && product.oldPrice && (
              <span className="text-sm text-stone-400 line-through">{product.oldPrice.toLocaleString('tr-TR')} TL</span>
            )}
            <span className="text-xl font-bold text-amber-700">{product.price.toLocaleString('tr-TR')} TL</span>
          </div>
          <button 
            onClick={() => addToCart(product)}
            disabled={product.stock <= 0}
            className={`flex items-center justify-center p-2 rounded-lg transition-colors ${
              product.stock > 0 
                ? 'bg-stone-900 text-white hover:bg-amber-700' 
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
            title={product.stock > 0 ? "Sepete Ekle" : "Stok Yok"}
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function CartModal({ cart, onClose, removeFromCart, updateQuantity, total, clearCart }: any) {
  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const [formData, setFormData] = useState({ name: '', surname: '', address: '', phone: '' });

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    const text = `Merhaba Evim Çeyiz ailesi, sitenizden yeni bir sipariş oluşturmak istiyorum. Detaylar aşağıdadır:

Müşteri: ${formData.name} ${formData.surname}
Telefon: ${formData.phone}
Adres: ${formData.address}

İstenen Ürünler:
${cart.map((item: CartItem) => `- ${item.name} (${item.quantity} adet) - ${(item.price * item.quantity).toLocaleString('tr-TR')} TL`).join('\n')}

Toplam Tutar: ${total.toLocaleString('tr-TR')} TL

Ödeme ve onay süreci için dönüşünüzü bekliyorum. İyi çalışmalar!`;

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/905368822422?text=${encodedText}`;
    
    window.open(whatsappUrl, '_blank');
    clearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-stone-900/50 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-4 border-b border-stone-100">
          <h2 className="text-xl font-bold font-serif text-stone-800">
            {step === 'cart' ? 'Alışveriş Sepeti' : 'Siparişi Tamamla'}
          </h2>
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-100">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-stone-400 space-y-4">
              <ShoppingCart className="h-16 w-16 opacity-20" />
              <p>Sepetiniz şu an boş.</p>
              <button onClick={onClose} className="text-amber-600 font-medium hover:underline">Alışverişe Devam Et</button>
            </div>
          ) : step === 'cart' ? (
            <div className="space-y-4">
              {cart.map((item: CartItem) => (
                <div key={item.id} className="flex gap-4 bg-stone-50 p-3 rounded-xl border border-stone-100">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-white flex-shrink-0">
                    {item.images[0] ? (
                      <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-stone-100"><ImageIcon className="h-6 w-6 text-stone-300" /></div>
                    )}
                  </div>
                  <div className="flex-grow flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-sm text-stone-900 line-clamp-2 pr-2">{item.name}</h4>
                      <button onClick={() => removeFromCart(item.id)} className="text-stone-400 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-bold text-amber-700">{item.price.toLocaleString('tr-TR')} TL</span>
                      <div className="flex items-center bg-white border border-stone-200 rounded-lg">
                        <button onClick={() => updateQuantity(item.id, -1)} className="px-2 py-1 text-stone-500 hover:text-stone-900">-</button>
                        <span className="px-2 py-1 text-sm font-medium w-8 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="px-2 py-1 text-stone-500 hover:text-stone-900">+</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <form id="checkout-form" onSubmit={handleOrder} className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl text-sm mb-6">
                <p><strong>Ödemenizi kapıda ödeme veya IBAN ile yapabilirsiniz.</strong> Detaylar için WhatsApp üzerinden iletişime geçilecektir.</p>
                <p className="mt-2 text-xs opacity-80">(Not: Kapıda ödemeli siparişlerde 100 TL ek hizmet bedeli alınmaktadır.)</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-500 mb-1">Ad</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-500 mb-1">Soyad</label>
                  <input required type="text" value={formData.surname} onChange={e => setFormData({...formData, surname: e.target.value})} className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1">Telefon Numarası</label>
                <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="05XX XXX XX XX" className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1">Teslimat Adresi</label>
                <textarea required rows={3} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"></textarea>
              </div>
            </form>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-4 border-t border-stone-100 bg-stone-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-stone-500">Toplam Tutar</span>
              <span className="text-2xl font-bold text-stone-900">{total.toLocaleString('tr-TR')} TL</span>
            </div>
            
            {step === 'cart' ? (
              <button 
                onClick={() => setStep('checkout')}
                className="w-full bg-stone-900 hover:bg-stone-800 text-white py-3 rounded-xl font-medium transition-colors"
              >
                Sipariş Oluştur
              </button>
            ) : (
              <div className="flex gap-2">
                <button 
                  type="button"
                  onClick={() => setStep('cart')}
                  className="px-4 py-3 border border-stone-200 text-stone-600 rounded-xl font-medium hover:bg-stone-100 transition-colors"
                >
                  Geri
                </button>
                <button 
                  type="submit"
                  form="checkout-form"
                  className="flex-grow bg-[#25D366] hover:bg-[#128C7E] text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center"
                >
                  WhatsApp ile Siparişi Tamamla
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// --- Admin ---

function AdminView({ products, saveProducts, isAdminLoggedIn, setIsAdminLoggedIn }: any) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'muglayataganevimceyiz' && password === '48evimceyiz48') {
      setIsAdminLoggedIn(true);
      setError('');
    } else {
      setError('Hatalı kullanıcı adı veya şifre.');
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
      saveProducts(products.filter((p: Product) => p.id !== id));
    }
  };

  const openForm = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
    } else {
      setEditingProduct({
        id: Date.now().toString(),
        name: '',
        description: '',
        price: 0,
        oldPrice: 0,
        isCampaign: false,
        images: [],
        stock: 1,
      });
    }
    setIsFormOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const existingIdx = products.findIndex((p: Product) => p.id === editingProduct.id);
    if (existingIdx >= 0) {
      const newProducts = [...products];
      newProducts[existingIdx] = editingProduct;
      saveProducts(newProducts);
    } else {
      saveProducts([...products, editingProduct]);
    }
    setIsFormOpen(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !editingProduct) return;

    const newImages: string[] = [];
    let processed = 0;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          newImages.push(event.target.result as string);
        }
        processed++;
        if (processed === files.length) {
          setEditingProduct({
            ...editingProduct,
            images: [...editingProduct.images, ...newImages]
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    if (!editingProduct) return;
    const newImages = [...editingProduct.images];
    newImages.splice(index, 1);
    setEditingProduct({ ...editingProduct, images: newImages });
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6 font-serif">Yönetici Girişi</h1>
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">{error}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Kullanıcı Adı</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Şifre</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none" />
            </div>
            <button type="submit" className="w-full bg-stone-900 hover:bg-stone-800 text-white py-2 rounded-lg font-medium transition-colors mt-4">Giriş Yap</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-serif text-stone-800">Yönetici Paneli</h1>
        <div className="flex items-center space-x-4">
          <button onClick={() => openForm()} className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors">
            <Plus className="h-4 w-4 mr-2" /> Yeni Ürün
          </button>
          <button onClick={() => setIsAdminLoggedIn(false)} className="text-stone-500 hover:text-stone-800 text-sm">Çıkış Yap</button>
        </div>
      </div>

      {isFormOpen && editingProduct ? (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 mb-8 animate-in fade-in">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">{editingProduct.id.length > 10 ? 'Yeni Ürün Ekle' : 'Ürünü Düzenle'}</h2>
            <button onClick={() => setIsFormOpen(false)} className="text-stone-400 hover:text-stone-600"><X className="h-5 w-5" /></button>
          </div>
          
          <form onSubmit={handleSaveProduct} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Ürün Adı</label>
                <input required type="text" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Fiyat (TL)</label>
                  <input required type="number" min="0" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})} className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Stok Miktarı</label>
                  <input required type="number" min="0" value={editingProduct.stock} onChange={e => setEditingProduct({...editingProduct, stock: Number(e.target.value)})} className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="flex items-center space-x-3 cursor-pointer p-3 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors">
                <input type="checkbox" checked={editingProduct.isCampaign || false} onChange={e => setEditingProduct({...editingProduct, isCampaign: e.target.checked})} className="rounded text-amber-600 focus:ring-amber-500 w-5 h-5" />
                <span className="text-sm font-medium text-stone-700">Bu ürün kampanyalı (İndirimli)</span>
              </label>
              
              {editingProduct.isCampaign && (
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Eski Fiyat (TL)</label>
                  <input type="number" min="0" value={editingProduct.oldPrice || 0} onChange={e => setEditingProduct({...editingProduct, oldPrice: Number(e.target.value)})} className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none" />
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Açıklama</label>
              <textarea required rows={3} value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Görseller</label>
              <div className="flex flex-wrap gap-4 mb-4">
                {editingProduct.images.map((img, idx) => (
                  <div key={idx} className="relative w-24 h-24 rounded-lg border border-stone-200 overflow-hidden group">
                    <img src={img} alt="Preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(idx)} className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <label className="w-24 h-24 rounded-lg border-2 border-dashed border-stone-300 flex flex-col items-center justify-center text-stone-500 hover:text-amber-600 hover:border-amber-400 cursor-pointer transition-colors">
                  <Upload className="h-6 w-6 mb-1" />
                  <span className="text-xs">Fotoğraf</span>
                  <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-stone-100">
              <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 border border-stone-200 text-stone-600 rounded-lg hover:bg-stone-50 transition-colors">İptal</button>
              <button type="submit" className="px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors">Kaydet</button>
            </div>
          </form>
        </div>
      ) : null}

      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 text-stone-500 text-sm border-b border-stone-200">
                <th className="p-4 font-medium">Ürün</th>
                <th className="p-4 font-medium">Fiyat</th>
                <th className="p-4 font-medium">Stok</th>
                <th className="p-4 font-medium text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {products.map((product: Product) => (
                <tr key={product.id} className="hover:bg-stone-50 transition-colors">
                  <td className="p-4 flex items-center">
                    <div className="w-12 h-12 rounded bg-stone-100 overflow-hidden mr-4 flex-shrink-0">
                      {product.images[0] ? (
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-full h-full p-3 text-stone-300" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-stone-900">{product.name}</div>
                      <div className="text-xs text-stone-500 line-clamp-1 max-w-xs">{product.description}</div>
                    </div>
                  </td>
                  <td className="p-4 font-medium">{product.price.toLocaleString('tr-TR')} TL</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {product.stock > 0 ? `${product.stock} Adet` : 'Stok Yok'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => openForm(product)} className="p-2 text-stone-400 hover:text-amber-600 transition-colors" title="Düzenle">
                      <Edit className="h-5 w-5" />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="p-2 text-stone-400 hover:text-red-600 transition-colors ml-1" title="Sil">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-stone-500">Kayıtlı ürün bulunmuyor.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

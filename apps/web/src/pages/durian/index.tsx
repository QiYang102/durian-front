import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useDurianBanners, useDurianProducts } from '@ttm/api';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DurianLayout } from '@/components/durian/DurianLayout';
import { Star, ChevronLeft, ChevronRight, Image as ImageIcon, Leaf } from 'lucide-react';
import { toast } from 'sonner';
import { useGlobalLoading } from '@/components/GlobalLoadingContext';

import farm1 from '@/assets/farm1.jpeg';
import farm2 from '@/assets/farm2.jpeg';
import farm3 from '@/assets/farm3.jpeg';

export const Route = createFileRoute('/durian/')({
  component: DurianHome,
});

function DurianHome() {
  const { data: banners } = useDurianBanners();
  const { data: products, isLoading } = useDurianProducts();

  const { showLoading, hideLoading } = useGlobalLoading();
  useEffect(() => {
    if (isLoading) showLoading('Loading...');
    else hideLoading();
    return () => hideLoading();
  }, [isLoading]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [animations, setAnimations] = useState<{ id: number; x: number; y: number }[]>([]);

  // Auto scroll banners
  useEffect(() => {
    if (banners && banners.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [banners]);

  const bestSellers = products ? products.filter(p => p.is_best_seller) : [];
  let displayProducts = bestSellers.length > 0 ? bestSellers : (products ? products.slice(0, 3) : []);
  if (displayProducts.length > 0) {
    displayProducts = [...displayProducts].sort((a: any, b: any) => {
      if (a.is_available === false && b.is_available !== false) return 1;
      if (a.is_available !== false && b.is_available === false) return -1;
      return a.name.localeCompare(b.name);
    });
  }

  const addToCart = (product: any, e: React.MouseEvent<HTMLButtonElement>) => {
    const existingStr = localStorage.getItem('durian_cart');
    const cart = existingStr ? JSON.parse(existingStr) : [];
    const existingItem = cart.find((i: any) => i.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('durian_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('durian_cart_updated'));
    toast.success(`${product.name} added to cart!`);

    // Capture click location for floating animation
    const x = e.clientX;
    const y = e.clientY;
    const newAnim = { id: Date.now(), x, y };
    setAnimations((prev) => [...prev, newAnim]);
    setTimeout(() => {
      setAnimations((prev) => prev.filter((a) => a.id !== newAnim.id));
    }, 800);
  };

  const nextSlide = () => {
    if (banners && banners.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }
  };

  const prevSlide = () => {
    if (banners && banners.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
    }
  };

  const testimonials = [
    {
      name: "Sarah Tan",
      rating: 5,
      comment: "Best Musang King I've ever had! Sourced fresh and perfectly packaged. Worth every RM.",
      role: "Verified Customer"
    },
    {
      name: "John Lim",
      rating: 5,
      comment: "Very fast delivery and the texture of the durian crepe is out of this world. Highly recommend DuriNow!",
      role: "Loyal Fan"
    },
    {
      name: "Aaron Raj",
      rating: 5,
      comment: "The free delivery offer is so good! The durian mochi is super soft and rich in flavor.",
      role: "Verified Purchaser"
    }
  ];

  return (
    <DurianLayout>
      <div className="w-full max-w-5xl space-y-16">
        
        {/* Banner Section */}
        <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-white min-h-[350px] flex items-center justify-center">
          {banners && banners.length > 0 ? (
            <div className="relative w-full h-[350px] overflow-hidden">
              {banners.map((banner, index) => {
                const hasImage = !!banner.image;
                const bannerContent = (
                  <div className="relative w-full h-full">
                    {hasImage ? (
                      <img
                        src={banner.image || ''}
                        alt={banner.title || 'Banner'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-950 flex flex-col justify-center px-8 md:px-16 space-y-4">
                        <span className="inline-flex items-center self-start px-3 py-1 rounded-full text-xs font-semibold bg-yellow-400 text-slate-950">Special Promo</span>
                        {banner.title && <h2 className="text-3xl md:text-5xl font-black tracking-tight">{banner.title}</h2>}
                        {banner.subtitle && <p className="text-slate-300 text-lg font-medium">{banner.subtitle}</p>}
                        {banner.link_url && (
                          <div className="pt-2">
                            <Button className="bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-bold px-6 py-3 rounded-full">
                              Shop Now
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );

                return (
                  <div
                    key={banner.hashid}
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                  >
                    {banner.link_url ? (
                      <Link to={banner.link_url} className="block w-full h-full hover:opacity-95 transition-opacity">
                        {bannerContent}
                      </Link>
                    ) : (
                      bannerContent
                    )}
                  </div>
                );
              })}
              
              {banners.length > 1 && (
                <>
                  <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors">
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-y-1/2 -translate-x-1/2 z-30 flex gap-2">
                    {banners.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`w-3 h-3 rounded-full transition-all ${idx === currentSlide ? 'bg-yellow-400 scale-110' : 'bg-white/50'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="relative w-full p-12 text-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-yellow-500/10 via-transparent to-transparent pointer-events-none" />
              <h1 className="text-4xl font-extrabold mb-4 tracking-tight">
                Welcome to <span className="text-yellow-400 font-black">DuriNow</span>!
              </h1>
              <p className="text-slate-400 text-lg max-w-xl mx-auto">
                Experience the finest premium Musang King and gourmet durian products, sourced direct and delivered fresh.
              </p>
              <div className="mt-8">
                <Link to="/durian/products">
                  <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-bold py-6 px-10 rounded-full shadow-lg shadow-yellow-500/10 hover:shadow-yellow-500/20 transition-all hover:scale-102">
                    Shop Fresh Durians
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Best Sellers Section */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Best Seller Products</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Our most popular premium durian choices</p>
          </div>
          {products && displayProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {displayProducts.map((p: any) => (
                <Card key={p.id} className={`overflow-hidden flex flex-col h-full border-slate-200 dark:border-slate-800 group hover:shadow-lg transition-all duration-300 ${p.is_available === false ? 'opacity-60 grayscale bg-slate-50 dark:bg-slate-900/50' : 'bg-white dark:bg-slate-900'}`}>
                  <div className="h-48 bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 overflow-hidden relative">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <Leaf className="w-16 h-16 text-slate-400 dark:text-slate-600" />
                    )}
                    <span className="absolute top-3 left-3 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-500 text-white shadow-md">Best Seller</span>
                  </div>
                  <CardContent className="p-4 flex-grow">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{p.name}</h3>
                      <span className="text-slate-500 dark:text-slate-400 text-sm font-medium whitespace-nowrap bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">{p.weight}</span>
                    </div>
                    <p className="text-slate-950 dark:text-white font-extrabold text-xl mt-2">RM {p.price}</p>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 line-clamp-2">{p.description}</p>
                  </CardContent>
                  <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 shrink-0">
                    <Button disabled={p.is_available === false} className="w-full bg-slate-900 text-white hover:bg-yellow-500 hover:text-slate-950 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-yellow-500 dark:hover:text-slate-950 font-bold transition-all disabled:opacity-50" onClick={(e) => addToCart(p, e)}>
                      {p.is_available === false ? 'Unavailable' : 'Add to Cart'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 text-slate-400">Loading best seller durians...</div>
          )}
        </div>

        {/* Image Placeholders Section */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Our Farm Gallery</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">A glimpse into our pristine durian orchards</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[farm1, farm2, farm3].map((imgSrc, idx) => (
              <div
                key={idx}
                className="h-64 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group relative border border-slate-200 dark:border-slate-800"
              >
                <img
                  src={imgSrc}
                  alt={`Durian Farm ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Customer Feedback Section */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">What Our Customers Say</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Honest reviews from durian lovers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <Card key={idx} className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <div className="flex text-yellow-400">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 italic text-sm">"{t.comment}"</p>
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex flex-col">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{t.name}</span>
                    <span className="text-slate-400 text-xs">{t.role}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

      </div>

      {animations.map((anim) => (
        <span
          key={anim.id}
          className="fixed text-yellow-500 font-black text-2xl z-50 pointer-events-none animate-float-up"
          style={{ left: `${anim.x - 12}px`, top: `${anim.y - 20}px` }}
        >
          +1
        </span>
      ))}
    </DurianLayout>
  );
}

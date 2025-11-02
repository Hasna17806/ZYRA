import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  // Hero Slideshow
  const heroImages = [
    "https://media.tommy.com/us/static/images/scheduled_marketing/2025/10/08_PLPBtmBanner_TommyJeans_FullTile_dt.jpg",
    "https://images.squarespace-cdn.com/content/v1/58d3df5ae58c62dead32c750/1556897051260-42UFVOJTSJ8PI9TMFAB8/SAFRAI_BANNERz1.jpg",
    "https://media.tommy.com/us/static/images/scheduled_marketing/2025/10/23_HP_FullTile04_dt.jpg",
    "https://media.tommy.com/us/static/images/scheduled_marketing/2025/10/23_HP_FullTile05_dt.jpg",
  ];
  const [currentHero, setCurrentHero] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Products
  const [products, setProducts] = useState([]);
  const [kidsProducts, setKidsProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.slice(0, 6));

        const kidsItems = data.filter(product => 
          product.category?.toLowerCase().includes('kid') || 
          product.category?.toLowerCase().includes('children')
        ).slice(0, 4);
        setKidsProducts(kidsItems);
      })
      .catch((err) => console.error("Failed to load products:", err));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 font-sans pt-20">

      {/* HERO SECTION */}
      <section className="relative flex flex-col items-center justify-center text-center h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-white">
        <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        {heroImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
              index === currentHero ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
        
        {/* Slideshow */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
          {heroImages.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentHero ? "bg-white scale-125" : "bg-white/50"
              }`}
              onClick={() => setCurrentHero(index)}
            />
          ))}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10"></div>
        
        <div className="relative z-10 px-6 animate-fadeIn">
          <div className="mb-8">
            <span className="text-white/80 text-sm font-medium tracking-widest uppercase border-b border-white/30 pb-2">
              New Collection 2025
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-white tracking-tight mb-6 drop-shadow-2xl">
            Discover Timeless Style
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            Effortless. Elegant. Modern — elevate your wardrobe with pieces made to last.
          </p>
          <Link
            to="/products"
            className="inline-block bg-white text-gray-900 px-12 py-4 rounded-lg font-medium tracking-wider hover:bg-gray-50 transition-all duration-300 shadow-2xl hover:shadow-xl transform hover:-translate-y-1 text-lg border border-white/20"
          >
            SHOP NOW
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-full my-20"></div>

      <section className="py-24 bg-gradient-to-b from-white to-gray-50/30">
        <div className="max-w-7xl mx-auto h-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center space-x-3 mb-6">
              <div className="w-16 h-px bg-gray-300"></div>
              <span className="text-sm font-medium text-gray-500 tracking-widest uppercase">Collections</span>
              <div className="w-16 h-px bg-gray-300"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-light mb-4 tracking-tight text-gray-900">
              Explore Our Collections
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Discover curated pieces for every style and occasion
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <CategoryCard
              title="MEN'S COLLECTION"
              subtitle="Sophisticated styles"
              img="https://static.zara.net/assets/public/1523/e6da/0fb842f69a1f/f4e40018a3cf/06318307401-p/06318307401-p.jpg?ts=1760701860009&w=1024"
              link="/products?category=men"
            />
            <CategoryCard
              title="WOMEN'S COLLECTION"
              subtitle="Elegant essentials"
              img="https://image.hm.com/assets/hm/ba/ed/baedd636d96be39ec94e178ba57a5415263729c6.jpg?imwidth=564"
              link="/products?category=women"
            />
            <CategoryCard
              title="KIDS' COLLECTION"
              subtitle="Playful & comfortable"
              img="https://static.zara.net/assets/public/1dee/1b6c/36b54ccd9d44/181bec7e0e10/06533390710202-a1/06533390710202-a1.jpg?ts=1761309631242&w=470"
              link="/products?category=kids"
            />
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-full my-20"></div>

      {/* --- PROMO VIDEO SECTION --- */}
      <section className="relative w-full bg-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent z-10"></div>
        
        <video
          className="w-full h-[90vh] object-cover"
          autoPlay
          loop
          muted
          playsInline
          poster="https://www2.hm.com/en_in/baby/holiday/holiday-shop.html"
        >
          <source
            src="https://image.hm.com/content/dam/global_campaigns/season_02/kids/tck/2537021_Ks42w0_MM_0169.mp4#t=0.001"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20"></div>

        <div className="absolute bottom-16 right-16 z-30 text-right max-w-md">
          <div className="mb-4">
            <span className="text-white/60 text-sm font-medium tracking-widest uppercase border-b border-white/30 pb-1">
              Kids Collection
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-light mb-6 leading-tight">
            Play. Smile. Shine.
          </h2>
          <p className="text-gray-200 text-lg mb-8 leading-relaxed">
            Bright styles made for every little adventure — comfort meets creativity in Zyra Kids.
          </p>
          <Link
            to="/products?category=kids"
            className="inline-flex items-center bg-white text-black px-8 py-4 rounded-md font-medium hover:bg-gray-100 transition-all duration-300 group border border-white/20"
          >
            Shop Kids Collection
            <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {kidsProducts.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center space-x-3 mb-6">
                <div className="w-12 h-px bg-gray-300"></div>
                <span className="text-sm font-medium text-gray-500 tracking-widest uppercase">Featured</span>
                <div className="w-12 h-px bg-gray-300"></div>
              </div>
              <h3 className="text-4xl font-light text-center mb-4 tracking-tight text-gray-900">Featured Kids Styles</h3>
              <p className="text-gray-600 max-w-2xl mx-auto">Perfect pieces for your little ones</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {kidsProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-gray-200"
                >
                  <div className="aspect-square overflow-hidden relative">
                    <img
                      src={product.image || "https://via.placeholder.com/300"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300"></div>
                  </div>
                  <div className="p-6 text-center">
                    <h4 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-700 transition-colors">{product.name}</h4>
                    <p className="text-gray-500 text-sm mb-3 capitalize">{product.category}</p>
                    <p className="text-lg font-semibold text-gray-900">₹{product.price}</p>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="text-center mt-16">
              <Link
                to="/products?category=kids"
                className="inline-flex items-center border-2 border-gray-900 text-gray-900 px-10 py-3 rounded-lg font-medium hover:bg-gray-900 hover:text-white transition-all duration-300 group"
              >
                View All Kids Collection
                <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-full my-20"></div>

      <section className="py-24 bg-gradient-to-b from-white to-gray-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center space-x-3 mb-6">
              <div className="w-20 h-px bg-gray-300"></div>
              <span className="text-sm font-medium text-gray-500 tracking-widest uppercase">Featured</span>
              <div className="w-20 h-px bg-gray-300"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-light mb-4 tracking-tight text-gray-900">
              Featured Products
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Handpicked selections for your wardrobe
            </p>
          </div>
          
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="inline-flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
                <p className="text-gray-500 text-lg">Loading featured products...</p>
              </div>
            </div>
          )}
          
          <div className="text-center mt-16">
            <Link
              to="/products"
              className="inline-flex items-center bg-gray-900 text-white px-12 py-4 rounded-lg font-medium hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl group"
            >
              View All Products
              <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-full my-20"></div>

      {/* ABOUT */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center space-x-3 mb-8">
            <div className="w-16 h-px bg-gray-300"></div>
            <span className="text-sm font-medium text-gray-500 tracking-widest uppercase">Our Story</span>
            <div className="w-16 h-px bg-gray-300"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-light mb-12 tracking-tight text-gray-900">About Zyra</h2>
          <div className="space-y-8 text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            <p className="text-xl text-gray-700 leading-loose">
              ZYRA is a modern fashion destination offering refined essentials and contemporary pieces. 
              Inspired by global trends and minimal elegance, our designs empower self-expression through 
              effortless style.
            </p>
            <p className="leading-loose">
              We believe in creating timeless fashion that transcends seasons, focusing on quality 
              craftsmanship, sustainable practices, and pieces that become staples in your wardrobe.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <FeatureCard
              icon={
                <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              }
              title="Quality Craftsmanship"
              description="Premium materials and attention to detail"
            />
            <FeatureCard
              icon={
                <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              }
              title="Sustainable Fashion"
              description="Ethically sourced and environmentally conscious"
            />
            <FeatureCard
              icon={
                <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              title="Timeless Design"
              description="Pieces that stay stylish season after season"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function CategoryCard({ title, subtitle, img, link }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 bg-white">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/10 to-gray-900/5 z-10"></div>
      <img
        src={img}
        alt={title}
        className="w-full h-[500px] object-cover transform group-hover:scale-105 transition duration-700 ease-out"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end justify-center pb-12 z-20">
        <div className="text-center text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <h3 className="text-2xl font-light mb-2 tracking-wide">{title}</h3>
          <p className="text-gray-200 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
            {subtitle}
          </p>
          <Link
            to={link}
            className="inline-flex items-center border border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-black transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0"
          >
            Explore Now
            <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product }) {
  return (
    <Link
      to={`/product/${product.id}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-gray-200"
    >
      <div className="aspect-[3/4] overflow-hidden relative">
        <img
          src={product.image || "https://via.placeholder.com/300"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300"></div>
      </div>
      <div className="p-6">
        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-700 transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-500 text-sm mb-3 capitalize">{product.category}</p>
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold text-gray-900">₹{product.price}</p>
          <span className="text-gray-400 group-hover:text-gray-600 transition-colors transform group-hover:translate-x-1 duration-300">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="text-center p-8 group hover:transform hover:-translate-y-2 transition-all duration-300">
      <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 border border-gray-100">
        {icon}
      </div>
      <h4 className="font-medium text-lg mb-3 text-gray-900">{title}</h4>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
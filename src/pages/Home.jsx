import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Award, Heart, Star } from "lucide-react";

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
    }, 4000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Products
  const [products, setProducts] = useState([]);
  const [kidsProducts, setKidsProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load products:", err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 font-sans">

      {/* HERO SECTION */}
      <section className="relative flex flex-col items-center justify-center text-center h-screen overflow-hidden bg-black">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        
        {/* Slideshow */}
        {heroImages.map((img, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentHero ? 1 : 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
        
        {/* Slideshow Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
          {heroImages.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentHero ? "bg-white w-8" : "bg-white/50"
              }`}
              onClick={() => setCurrentHero(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20"></div>
        
        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 px-6 max-w-5xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-6"
          >
            <span className="inline-block text-white/90 text-sm font-medium tracking-[0.3em] uppercase border border-white/30 px-6 py-2 rounded-full backdrop-blur-sm">
              New Collection 2025
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-white tracking-tight mb-6 leading-[1.1]"
          >
            Discover Timeless
            <br />
            <span className="font-normal">Style</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-lg sm:text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto mb-10 font-light leading-relaxed"
          >
            Effortless. Elegant. Modern — elevate your wardrobe with pieces made to last.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-white text-gray-900 px-10 py-4 rounded-full font-semibold tracking-wide hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-xl transform hover:-translate-y-1 text-base group"
            >
              SHOP NOW
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        >
          <div className="flex flex-col items-center gap-2 text-white/80">
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2"
            >
              <div className="w-1 h-3 bg-white/80 rounded-full"></div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <Divider />

      {/* COLLECTIONS SECTION */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-white to-gray-50/30">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader
            subtitle="Collections"
            title="Explore Our Collections"
            description="Discover curated pieces for every style and occasion"
          />
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          >
            <CategoryCard
              title="MEN'S COLLECTION"
              subtitle="Sophisticated styles"
              img="https://static.zara.net/assets/public/1523/e6da/0fb842f69a1f/f4e40018a3cf/06318307401-p/06318307401-p.jpg?ts=1760701860009&w=1024"
              link="/products?category=men"
              delay={0.1}
            />
            <CategoryCard
              title="WOMEN'S COLLECTION"
              subtitle="Elegant essentials"
              img="https://image.hm.com/assets/hm/ba/ed/baedd636d96be39ec94e178ba57a5415263729c6.jpg?imwidth=564"
              link="/products?category=women"
              delay={0.2}
            />
            <CategoryCard
              title="KIDS' COLLECTION"
              subtitle="Playful & comfortable"
              img="https://static.zara.net/assets/public/1dee/1b6c/36b54ccd9d44/181bec7e0e10/06533390710202-a1/06533390710202-a1.jpg?ts=1761309631242&w=470"
              link="/products?category=kids"
              delay={0.3}
            />
          </motion.div>
        </div>
      </section>

      <Divider />

      {/* PROMO VIDEO SECTION */}
      <section className="relative w-full bg-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent z-10"></div>
        
        <video
          className="w-full h-[70vh] lg:h-[90vh] object-cover"
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

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="absolute bottom-12 lg:bottom-16 right-6 lg:right-16 z-30 text-right max-w-md"
        >
          <div className="mb-4">
            <span className="inline-block text-white/70 text-xs font-medium tracking-[0.2em] uppercase border-b border-white/30 pb-1">
              Kids Collection
            </span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-light mb-4 lg:mb-6 leading-tight">
            Play. Smile. Shine.
          </h2>
          <p className="text-gray-200 text-base lg:text-lg mb-6 lg:mb-8 leading-relaxed">
            Bright styles made for every little adventure — comfort meets creativity in Zyra Kids.
          </p>
          <Link
            to="/products?category=kids"
            className="inline-flex items-center bg-white text-black px-6 lg:px-8 py-3 lg:py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 group"
          >
            Shop Kids Collection
            <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </section>

      {/* FEATURED KIDS PRODUCTS */}
      {kidsProducts.length > 0 && (
        <section className="py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-6">
            <SectionHeader
              subtitle="Featured"
              title="Featured Kids Styles"
              description="Perfect pieces for your little ones"
            />

            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-gray-200 rounded-2xl mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
              >
                {kidsProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </motion.div>
            )}
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center mt-12 lg:mt-16"
            >
              <Link
                to="/products?category=kids"
                className="inline-flex items-center border-2 border-gray-900 text-gray-900 px-8 lg:px-10 py-3 rounded-full font-semibold hover:bg-gray-900 hover:text-white transition-all duration-300 group"
              >
                View All Kids Collection
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      <Divider />

      {/* FEATURED PRODUCTS */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-white to-gray-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader
            subtitle="Featured"
            title="Featured Products"
            description="Handpicked selections for your wardrobe"
          />
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-gray-200 rounded-2xl mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            >
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products available</p>
            </div>
          )}
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12 lg:mt-16"
          >
            <Link
              to="/products"
              className="inline-flex items-center bg-gray-900 text-white px-10 lg:px-12 py-4 rounded-full font-semibold hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl group"
            >
              View All Products
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Divider />

      {/* ABOUT SECTION */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto px-6">
          <SectionHeader
            subtitle="Our Story"
            title="About Zyra"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6 text-base lg:text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto text-center"
          >
            <p className="text-xl text-gray-700 leading-loose">
              ZYRA is a modern fashion destination offering refined essentials and contemporary pieces. 
              Inspired by global trends and minimal elegance, our designs empower self-expression through 
              effortless style.
            </p>
            <p>
              We believe in creating timeless fashion that transcends seasons, focusing on quality 
              craftsmanship, sustainable practices, and pieces that become staples in your wardrobe.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 lg:mt-20"
          >
            <FeatureCard
              icon={<Award className="w-8 h-8 text-gray-700" />}
              title="Quality Craftsmanship"
              description="Premium materials and attention to detail"
            />
            <FeatureCard
              icon={<Heart className="w-8 h-8 text-gray-700" />}
              title="Sustainable Fashion"
              description="Ethically sourced and environmentally conscious"
            />
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8 text-gray-700" />}
              title="Timeless Design"
              description="Pieces that stay stylish season after season"
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// REUSABLE COMPONENTS

function Divider() {
  return <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-full my-12 lg:my-20"></div>;
}

function SectionHeader({ subtitle, title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-center mb-12 lg:mb-20"
    >
      <div className="inline-flex items-center justify-center space-x-3 mb-6">
        <div className="w-12 lg:w-16 h-px bg-gray-300"></div>
        <span className="text-xs lg:text-sm font-medium text-gray-500 tracking-[0.2em] uppercase">
          {subtitle}
        </span>
        <div className="w-12 lg:w-16 h-px bg-gray-300"></div>
      </div>
      <h2 className="text-3xl lg:text-5xl font-light mb-4 tracking-tight text-gray-900">
        {title}
      </h2>
      {description && (
        <p className="text-gray-600 text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  );
}

function CategoryCard({ title, subtitle, img, link, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/10 to-gray-900/5 z-10"></div>
      <div className="aspect-[3/4] overflow-hidden">
        <img
          src={img}
          alt={title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700 ease-out"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end justify-center pb-8 lg:pb-12 z-20">
        <div className="text-center text-white px-4">
          <h3 className="text-xl lg:text-2xl font-light mb-2 tracking-wide">{title}</h3>
          <p className="text-gray-200 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
            {subtitle}
          </p>
          <Link
            to={link}
            className="inline-flex items-center border border-white text-white px-6 lg:px-8 py-2 lg:py-3 rounded-full font-medium hover:bg-white hover:text-black transition-all duration-300 opacity-0 group-hover:opacity-100 text-sm lg:text-base"
          >
            Explore Now
            <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function ProductCard({ product, index }) {
  const discount = product.discount || null;
  const currentPrice = product.price;
  const originalPrice = discount ? (currentPrice / (1 - discount / 100)).toFixed(0) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        to={`/product/${product.id}`}
        className="group block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-gray-200"
      >
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={product.image || "https://via.placeholder.com/300"}
            alt={product.title || product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300"></div>
          
          {/* Discount Badge */}
          {discount && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
              {discount}% OFF
            </div>
          )}

          {/* Quick View Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-semibold text-gray-900 shadow-lg">
              Quick View
            </div>
          </div>
        </div>

        <div className="p-4 lg:p-6">
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-1.5 font-medium">
            {product.category}
          </p>
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-700 transition-colors">
            {product.title || product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex text-yellow-400 text-xs">
              <Star size={14} className="fill-current" />
              <Star size={14} className="fill-current" />
              <Star size={14} className="fill-current" />
              <Star size={14} className="fill-current" />
              <Star size={14} className="text-gray-300" />
            </div>
            <span className="text-xs text-gray-500">(4.0)</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">₹{currentPrice}</span>
            {discount && (
              <>
                <span className="text-sm line-through text-gray-400">₹{originalPrice}</span>
                <span className="text-xs text-green-600 font-semibold">
                  {discount}% OFF
                </span>
              </>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="text-center p-6 lg:p-8 group"
    >
      <div className="w-16 lg:w-20 h-16 lg:h-20 bg-gradient-to-br from-gray-50 to-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 border border-gray-100">
        {icon}
      </div>
      <h4 className="font-semibold text-base lg:text-lg mb-3 text-gray-900">{title}</h4>
      <p className="text-sm lg:text-base text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
  );
}
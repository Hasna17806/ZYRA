import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 font-sans pt-20">

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center h-[130vh] bg-[url('https://media.tommy.com/us/static/images/scheduled_marketing/2025/10/08_PLPBtmBanner_TommyJeans_FullTile_dt.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 px-6 pb-40 animate-fadeIn">
          <h1 className="text-6xl md:text-7xl font-light text-white tracking-wide mb-6 drop-shadow-lg">
            Discover Timeless Style
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-xl mx-auto mb-8">
            Effortless. Elegant. Modern — elevate your wardrobe with pieces made to last.
          </p>
          <Link
            to="/products"
            className="bg-white text-gray-900 px-10 py-3 rounded-md font-medium tracking-wide hover:bg-gray-100 transition-all duration-300 shadow-md"
          >
            SHOP NOW
          </Link>
        </div>
      </section>

      {/* Divider */}
      <div className="h-1 bg-gray-100 w-full my-12"></div>

      {/* Featured Categories */}
      <section className="py-24 bg-white">
        <h2 className="text-4xl font-light text-center mb-16 tracking-wide">
          Explore Our Collections
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto px-6">

          {/* MEN */}
          <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <img
              src="https://static.zara.net/assets/public/1523/e6da/0fb842f69a1f/f4e40018a3cf/06318307401-p/06318307401-p.jpg?ts=1760701860009&w=1024"
              alt="Men"
              className="w-full h-[550px] object-cover transform group-hover:scale-105 transition duration-700"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-500">
              <Link
                to="/products?category=men"
                className="text-white text-lg tracking-wide border border-white px-8 py-2 hover:bg-white hover:text-black transition-all"
              >
                MEN
              </Link>
            </div>
          </div>

          {/* WOMEN */}
          <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <img
              src="https://image.hm.com/assets/hm/ba/ed/baedd636d96be39ec94e178ba57a5415263729c6.jpg?imwidth=564"
              alt="Women"
              className="w-full h-[550px] object-cover transform group-hover:scale-105 transition duration-700"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-500">
              <Link
                to="/products?category=women"
                className="text-white text-lg tracking-wide border border-white px-8 py-2 hover:bg-white hover:text-black transition-all"
              >
                WOMEN
              </Link>
            </div>
          </div>

          {/* KIDS */}
          <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <img
              src="https://static.zara.net/assets/public/1dee/1b6c/36b54ccd9d44/181bec7e0e10/06533390710202-a1/06533390710202-a1.jpg?ts=1761309631242&w=470"
              alt="Kids"
              className="w-full h-[550px] object-cover transform group-hover:scale-105 transition duration-700"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-500">
              <Link
                to="/products?category=kids"
                className="text-white text-lg tracking-wide border border-white px-8 py-2 hover:bg-white hover:text-black transition-all"
              >
                Kids
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-1 bg-gray-100 w-full my-12"></div>

      {/* About Section */}
      <section className="bg-gray-50 py-20 px-6 text-center">
        <h2 className="text-4xl font-light mb-6 tracking-wide">About Zyra</h2>
        <p className="max-w-3xl mx-auto text-gray-600 text-lg leading-relaxed">
          ZYRA is a modern fashion destination offering refined essentials and
          contemporary pieces. Inspired by global trends and minimal elegance,
          our designs empower self-expression through effortless style.
        </p>
      </section>

    
    </div>
  );
}
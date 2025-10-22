import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen bg-white text-gray-900 font-sans pt-20">

            {/* Hero Section */}
            <section className="relative flex flex-col items-center justify-center text-center h-[130vh] bg-[url('https://media.tommy.com/us/static/images/scheduled_marketing/2025/10/08_PLPBtmBanner_TommyJeans_FullTile_dt.jpg')] bg-cover bg-center">
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="relative z-10 px-6">
                <h1 className="text-6xl md:text-7xl font-light text-white tracking-wide mb-6">
                    Discover Timeless Style
                </h1>
               <p className="text-lg md:text-xl text-gray-200 max-w-xl mx-auto mb-8">
          
            Effortless. Elegant. Modern — elevate your wardrobe with pieces made to last.

               </p>
               <Link
                to="/products"
                className="bg-white text-gray-900 px-10 py-3 rounded-none font-medium tracking-wide hover:bg-gray-100 transition-all duration-300"
               >
               SHOP NOW
               </Link>
              </div>
            </section>

            {/* Featured Categories */}
            <section className="py-24 bg-white">
                <h2 className="text-4xl font-light text-center mb-16 tracking-wide">
                        Explore Our Collections
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto px-6">

                  {/* MEN */}
                   
                    <div className="group relative overflow-hidden">
                      
                      <img
                        src="https://media.tommy.com/us/static/images/scheduled_marketing/2025/10/08_HP_Grid02_01_dt.jpg"
                        alt="Men"
                        className="w-full h-[550px] object-cover transform group-hover:scale-105 transition duration-700"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-500">
                        <Link
                           to="/products?category=men"
                           className="text-white text-lg tracking-wide border border-white px-8 py-2 hover:bg-white hover:text-black transition-all">
                        
                        MEN
                        </Link>
                        
                        </div>
                    </div>
                      
                      {/* WOMEN */}

                  <div className="group relative overflow-hidden">
                    <img src="https://image.hm.com/assets/hm/ba/ed/baedd636d96be39ec94e178ba57a5415263729c6.jpg?imwidth=564" 
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

                  {/* ACCESSORIES */}

                  <div className="group relative overflow-hidden">
                    <img
                     src="https://plus.unsplash.com/premium_photo-1670963025497-d6d582ea9319?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=880"
                     alt="Accessories"
                     className="w-full h-[550px] object-cover transition duration-700"
                     />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-500">
                      <Link 
                         to="/products?category=accessories"
                         className="text-white text-lg tracking-wide border border-white px-8 py-2 hover:bg-white hover:text-black transition-all"
                         >
                    ACCESSORIES
                     </Link>
                    </div>

                  </div>

                </div>

            </section>

            {/* About Section */}
            <section className="bg-gray-50 py-20 px-6 text-center">
                <h2 className="text-4xl font-light mb-6 tracking-wide">About Zyra</h2>
                <p className="max-w-3xl mx-auto text-gray-600 text-lg leading-relaxed">

           ZYRA is a modern fashion destination offering refined essentials and
           contemporary pieces. Inspired by global trends and minimal elegance,
           our designs empower self-expression through effortless style.
           </p>
            </section>

  {/* Footer */}
  <footer className="bg-black text-gray-400 py-10 text-center">
    <div className="flex justify-center gap-8 mb-5 text-sm">
        <a href="#" className="hover:text-white">About</a>
        <a href="#" className="hover:text-white">Contact</a>
        <a href="#" className="hover:text-white">Privacy Policy</a>

    </div>

    <p className="text-sm tracking-wide">
      &copy; {new Date().getFullYear()} ZYRA. Crafted with purpose. 
      </p>
  </footer>

        </div>
    );
}


//----------------------------------------------------------


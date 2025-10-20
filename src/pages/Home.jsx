import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">

            {/* Hero Section */}
            <section className="relative flex flex-col items-center justify-center text-center bg-[url('https://images.unsplash.com/photo-1501127122-f385ca6ddd9d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=735')] bg-cover bg-center text-white h-[80vh]">
              <div className="absolute inset-0 bg-black/50"></div>
              <div className="relative z-10 max-w-2xl px-4">
                <h1 className="text-5xl font-extrabold mb-4 tracking-tight">
                    Discover Your Style

                </h1>
               <p className="text-lg mb-6 text-gray-200">
                            Premium fashion curated for you — explore the latest trends in clothing, shoes, and accessories.

               </p>
               <Link
                to="/products"
                className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
               >
               Shop Now
               </Link>
              </div>
            </section>

            {/* Featured Categories */}
            <section className="py-16 bg-white">
                <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
                       Trendings Categories
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto px-4">
                    <div className="rounded-2xl overflow-hidden shadow-md hover:scale-105 transition">
                      
                      <img
                        src="https://image.hm.com/assets/hm/49/3c/493cbca7a7a7ae09d603cc99a4bc963f5aec4b38.jpg?imwidth=564"
                        alt="Men"
                        className="w-full h-80 object-cover"
                        />
                        <div className="p-4 text-center font-semibold">Men's Collection</div>
                    </div>
                      
                  <div className="rounded-2xl overflow-hidden shadow-md hover:scale-105 transition">
                    <img src="https://image.hm.com/assets/hm/ba/ed/baedd636d96be39ec94e178ba57a5415263729c6.jpg?imwidth=564" 
                    alt="Women"
                    className="w-full h-80 object-cover"
                    />
                    <div className="p-4 text-center font-semibold">Women's Collection</div>

                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-md hover:scale-105 transition">
                    <img src="https://plus.unsplash.com/premium_photo-1670963025497-d6d582ea9319?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=880"
                     alt="Accessories"
                     className="w-full h-80 object-cover"

                     
                     />
                    <div className="p-4 text-center font-semibold">Accessories</div>

                  </div>

                </div>

            </section>

            {/* About Section */}
            <section className="bg-gray-100 py-14 px-6 text-center">
                <h2 className="text-3xl font-bold mb-4 text-gray-800">About Zyra</h2>
                <p className="max-w-3xl mx-auto text-gray-600 leading-relaxed">
       
           Zyra is your go-to online destination for chic, affordable, and quality fashion.
            We believe style is self-expression — and we’re here to help you express it effortlessly.
        
                </p>

            </section>

  {/* Footer */}
  <footer className="bg-gray-900 text-gray-300 py-6 text-center">
    <div className="flex justify-center gap-8 mb-3 text-sm">
        <a href="#" className="hover:text-white">About</a>
        <a href="#" className="hover:text-white">Contact</a>
        <a href="#" className="hover:text-white">Privacy Policy</a>

    </div>

    <p className="text-sm">&copy; {new Date().getFullYear()} Zyra. All Rights Reserved. </p>

  </footer>

        </div>
    );
}


//----------------------------------------------------------

// import { Link } from "react-router-dom";

// export default function Home() {
//   return (
//     <div className="text-center p-10 bg-gray-50 min-h-screen flex flex-col justify-between">
//       <main>
//         <h1 className="text-4xl font-bold mb-4 text-green-700">Welcome to Zyra 🛍</h1>
//         <p className="text-gray-600 max-w-xl mx-auto mb-6">
//           Discover the latest trends in clothing, shoes, and accessories.
//           Your one-stop fashion destination — quality meets style!
//         </p>

//         <div className="mt-8">
//           <Link
//             to="/products"
//             className="bg-green-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-green-700"
//           >
//             Explore Products
//           </Link>
//         </div>
//       </main>

//       <footer className="mt-16 text-gray-600 border-t pt-6">
//         <div className="flex justify-center gap-8 mb-2">
//           <a href="#" className="hover:text-green-600">About</a>
//           <a href="#" className="hover:text-green-600">Contact</a>
//           <a href="#" className="hover:text-green-600">Privacy Policy</a>
//         </div>
//         <p className="text-sm">&copy; {new Date().getFullYear()} Zyra. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// }

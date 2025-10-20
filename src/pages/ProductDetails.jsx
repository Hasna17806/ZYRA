import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);

  const product = items.find((p) => p.id === id || p.id === Number(id));

  if (!product) return <p className="text-center mt-10">Product not found!</p>;

  const handleAddToCart = () => {
    if (!user) {
      alert("You must login first!");
      navigate("/login");
      return;
    }
    dispatch(addToCart({ product, quantity: 1 }));
    alert("Item added to cart!");
    // optional: navigate("/cart");
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <button onClick={() => navigate(-1)} className="text-green-600 mb-4 hover:underline">
        ← Back to Products
      </button>

      <div className="flex flex-col md:flex-row items-start gap-8">
        <img src={product.image} alt={product.title} className="w-full md:w-64 h-auto object-cover rounded-lg shadow-md" />

        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-800 mb-1">{product.title}</h3>
          <p className="text-gray-500 mb-1 capitalize">{product.category}</p>
          <p className="text-xl text-green-700 font-semibold mb-3">₹{product.price}</p>
          <p className="text-gray-700 mb-4 leading-relaxed">{product.description}</p>
          <p className="mb-4">Stock: {product.stock ?? "Available"}</p>

          <div className="flex gap-3">
            <button onClick={handleAddToCart} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
              Add to Cart
            </button>
            <button onClick={() => navigate("/cart")} className="bg-gray-200 px-6 py-2 rounded-lg">
              Go to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}





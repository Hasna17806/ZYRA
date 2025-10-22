import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { useEffect } from "react";
import { fetchProducts } from "../redux/productSlice";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items, isLoading } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);

useEffect(() => {
  if (!items || items.length === 0) {
    dispatch(fetchProducts());
  }
}, [dispatch, items]);

  //Protect against undefined
  const product = items.find((p) => p.id.toString() === id);

  if (isLoading || !product) {
    return <p className="text-center mt-10 text-blue-600">Loading product...</p>;
  }

  const handleAddToCart = () => {
    if (!user) {
      alert("Please login before adding to cart!");
      navigate("/login");
      return;
    }


    dispatch(addToCart({ product, quantity: 1 }));
    alert("Item added to cart successfully!");
  };

  return (
      <div className="p-6 flex flex-col md:flex-row gap-6">
        <img
          src={product.image}
          alt={product.title}
          className="w-full md:w-1/3 rounded-lg shadow"
        />

        <div className="md:w-2/3">
         <h3 className="text-3xl font-bold mb-2">{product.title}</h3>
         <p className="text-gray-600 mb-3">{product.category}</p>
         <p className="text-lg mb-3"> {product.description}</p>
          <p className="text-2xl font-semibold text-blue-600 mb-3">
            ₹{product.price}
          </p>
          <p className="mb-4">Stock: {product.stock ?? "Available"}</p>

          
            <button
              onClick={handleAddToCart}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add to Cart
            </button>
            {/* <button
              onClick={() => navigate("/cart")}
              className="bg-gray-200 px-6 py-2 rounded-lg"
            >
              Go to Cart
            </button> */}
          </div>
        </div>
  );
}

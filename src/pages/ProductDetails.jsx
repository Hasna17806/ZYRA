import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { addToCart } from "../redux/cartSlice";

export default function ProductDetails () {
    const { id } = useParams();  //get id from url
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        axios.get(`http://localhost:4000/products/${id}`).then((res) => {
            setProduct(res.data);
        });
    }, [id]);

    if (!product) return <div className="text-center mt-10">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <button
              onClick={() => navigate(-1)}
              className="text-green-600 mb-4 hover:underline"
            >
          ← Back to Products
            </button>

            <div className="flex flex-col md:flex-row items-center gap-8">
              <img 
              src={product.image}
              alt={product.title}
              className="w-64 h-64 object-cover rounded-lg shadow-md"
              />

              <div>
              <h3 className="text-lg font-semibold text-gray-800">{product.title}</h3>
              <p className="text-gray-500">{product.category}</p>
              <p className="text-xl text-green-700 font-semibold mb-3"> ₹{product.price}</p>
              <p className="text-gray-700 mb-6">{product.description}</p>

              <button
              onClick={() => dispatch(addToCart(product))}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
              >
              Add to Cart
              </button>
            </div>
         </div>  
    </div>
    );
}
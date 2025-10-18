import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
    const navigate = useNavigate();

    return (
        <div
         onClick={() => navigate(`/products/${product.id}`)}
        className="cursor-pointer border rounded-lg p-4 hover:shadow-lg transition bg-white"
        >
         <img
           src={product.image}
           alt={product.title}
           className="w-full h-48 object-cover rounded-md mb-3"
         />
         <h3 className="text-lg font-semibold text-gray-800">{product.title}</h3>
         <p className="text-gray-500">{product.category}</p>
         <p className="text-green-700 font-bold mt-2">₹{product.price}</p>
        </div>
    );
}
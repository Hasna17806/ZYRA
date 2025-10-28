import { X } from "lucide-react";

export default function CartItem({ item, onRemove, onQuantityChange }) {
  const { product, quantity } = item;

  return (
    <div className="flex items-center gap-4 border border-gray-100 rounded-xl p-3 bg-white hover:shadow-md transition-all duration-300">
      {/* Product Image */}
      <div className="w-20 h-24 flex-shrink-0 overflow-hidden rounded-md bg-gray-50">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {product.title}
          </h3>
          <button
            onClick={onRemove}
            className="text-gray-400 hover:text-red-500 transition"
          >
            <X size={16} />
          </button>
        </div>

        <p className="text-gray-500 text-sm mt-1">₹{product.price}</p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-3 mt-3">
          <button
            className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 transition"
            onClick={() => onQuantityChange(Math.max(quantity - 1, 1))}
          >
            -
          </button>
          <span className="text-sm font-medium">{quantity}</span>
          <button
            className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 transition"
            onClick={() => onQuantityChange(quantity + 1)}
          >
            +
          </button>
        </div>

        {/* Subtotal */}
        <p className="text-sm font-semibold text-gray-800 mt-2">
          ₹{(product.price * quantity).toFixed(2)}
        </p>
      </div>
    </div>
  );
}

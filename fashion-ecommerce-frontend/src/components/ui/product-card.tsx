"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  id: number;
  name: string;
  price: string;
  originalPrice?: string | null;
  image: string;
  tag?: string;
  tagColor?: string;
  rating?: number;
  reviews?: number;
  brand?: string;
  category?: string;
  availableColors?: Array<{
    id: number;
    name: string;
    hex_code: string;
  }>;
  availableSizes?: Array<{
    id: number;
    name: string;
  }>;
}

export default function ProductCard({ 
  id, 
  name, 
  price, 
  originalPrice,
  image, 
  tag, 
  tagColor, 
  rating, 
  reviews,
  brand,
  category,
  availableColors = [],
  availableSizes = []
}: ProductCardProps) {
  const router = useRouter();

  const handleProductClick = () => {
    router.push(`/product/${id}`);
  };

  return (
    <div className="group">
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={handleProductClick}>
        <CardContent className="p-0">
          <div className="relative">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-64 flex items-center justify-center">
              {image && image !== "/api/placeholder/300/400" ? (
                <img 
                  src={image} 
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#8B0000] rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">TAD</span>
                  </div>
                  <span className="text-gray-500 text-xs">Product Image</span>
                </div>
              )}
            </div>
            {tag && (
              <Badge className={`absolute top-2 left-2 ${tagColor}`}>
                {tag}
              </Badge>
            )}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="flex space-x-1">
                <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50">
                  <Heart className="h-4 w-4 text-gray-600" />
                </button>
                <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50">
                  <ShoppingCart className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">{name}</h3>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-gray-900">{price}</span>
                {originalPrice && (
                  <span className="text-sm text-gray-500 line-through">{originalPrice}</span>
                )}
              </div>
              {rating && reviews && (
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <span className="text-xs text-gray-600">{rating}</span>
                  <span className="text-xs text-gray-400">({reviews})</span>
                </div>
              )}
            </div>
            {brand && (
              <p className="text-xs text-gray-500 mb-2">{brand}</p>
            )}
            
            {/* Show available colors */}
            {availableColors.length > 0 && (
              <div className="flex items-center space-x-1 mb-1">
                <span className="text-xs text-gray-500">Colors:</span>
                {availableColors.slice(0, 3).map((color, index) => (
                  <div
                    key={index}
                    className="w-3 h-3 rounded-full border border-gray-300"
                    style={{ backgroundColor: color.hex_code }}
                    title={color.name}
                  />
                ))}
                {availableColors.length > 3 && (
                  <span className="text-xs text-gray-400">+{availableColors.length - 3}</span>
                )}
              </div>
            )}
            
            {/* Show available sizes */}
            {availableSizes.length > 0 && (
              <div className="flex items-center space-x-1">
                <span className="text-xs text-gray-500">Sizes:</span>
                <span className="text-xs text-gray-600">
                  {availableSizes.map(s => s.name).join(', ')}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
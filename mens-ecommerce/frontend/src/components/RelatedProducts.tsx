import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import Loader from './Loader';

interface Product {
    _id: string;
    name: string;
    price: number;
    image: string;
    category: {
        _id: string;
        name: string;
    };
}

interface RelatedProductsProps {
    productId: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ productId }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRelated = async () => {
            try {
                setLoading(true);
                const { data } = await api.get(`/products/${productId}/related`);
                setProducts(data.data);
            } catch (error) {
                console.error("Failed to fetch related products", error);
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchRelated();
        }
    }, [productId]);

    if (loading) return <Loader />;

    if (products.length === 0) return null;

    return (
        <div className="mt-16 border-t pt-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">You may also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {products.map((product) => (
                    <Link key={product._id} to={`/product/${product._id}`} className="group relative block overflow-hidden rounded-xl bg-white border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md transition-all">
                        <div className="relative h-[250px] sm:h-[300px] w-full bg-gray-100 overflow-hidden">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                                loading="lazy"
                            />
                        </div>

                        <div className="relative p-4">
                            <h3 className="text-sm font-medium text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
                                {product.name}
                            </h3>

                            <div className="mt-2 flex items-center justify-between">
                                <p className="text-lg font-bold text-gray-900">
                                    ${product.price}
                                </p>
                                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                    {product.category?.name}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default RelatedProducts;

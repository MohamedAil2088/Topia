import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiArrowRight, FiClock, FiRotateCcw, FiPackage, FiUser, FiMapPin, FiChevronRight } from 'react-icons/fi';
import api from '../utils/api';
import Loader from '../components/Loader';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { addToCart } from '../redux/slices/cartSlice';
import Swal from 'sweetalert2';

interface PurchasedProduct {
    _id: string;
    name: string;
    image: string;
    price: number;
}

const PurchaseHistoryPage = () => {
    const { userInfo } = useAppSelector((state) => state.auth);
    const [products, setProducts] = useState<PurchasedProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [total, setTotal] = useState(0);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const fetchPurchasedProducts = async () => {
            setLoading(true);
            try {
                const { data } = await api.get(`/orders/myproducts?pageNumber=${currentPage}`);
                setProducts(data.data);
                setPages(data.pages);
                setTotal(data.total);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchPurchasedProducts();
    }, [currentPage]);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBuyAgain = (product: PurchasedProduct) => {
        dispatch(addToCart({
            _id: product._id,
            name: product.name,
            image: product.image,
            price: product.price,
            stock: 10,
            qty: 1
        }));

        Swal.fire({
            icon: 'success',
            title: 'Added to Cart',
            text: `${product.name} is ready for checkout!`,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        });
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                    <div>
                        <h1 className="text-4xl font-black font-display text-primary-900 tracking-tight">Purchase History</h1>
                        <p className="text-gray-500 font-medium mt-1">Showing {total} pieces in your signature collection</p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Sidebar Menu - Elite Design */}
                    <div className="lg:w-1/4">
                        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden sticky top-32">
                            <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-primary-900 text-white flex items-center justify-center text-xl font-black shadow-lg shadow-primary-900/20">
                                        {userInfo?.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="truncate">
                                        <p className="text-sm font-black text-gray-900 truncate">{userInfo?.name}</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Verified Member</p>
                                    </div>
                                </div>
                            </div>
                            <div className="py-4">
                                <Link to="/profile" className="flex items-center justify-between px-6 py-4 text-gray-500 hover:text-primary-900 hover:bg-gray-50 transition-all group">
                                    <span className="flex items-center gap-3 font-bold"><FiUser /> Profile Overview</span>
                                    <FiChevronRight className="opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                                </Link>
                                <Link to="/profile/orders" className="flex items-center justify-between px-6 py-4 text-gray-500 hover:text-primary-900 hover:bg-gray-50 transition-all group">
                                    <span className="flex items-center gap-3 font-bold"><FiPackage /> My Orders</span>
                                    <FiChevronRight className="opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                                </Link>
                                <Link to="/profile/history" className="flex items-center justify-between px-6 py-4 text-primary-700 bg-primary-50/50 border-r-4 border-primary-900 transition-all group">
                                    <span className="flex items-center gap-3 font-bold"><FiClock /> Purchase History</span>
                                    <FiChevronRight className="transition-transform group-hover:translate-x-1" />
                                </Link>
                                <Link to="/profile/addresses" className="flex items-center justify-between px-6 py-4 text-gray-500 hover:text-primary-900 hover:bg-gray-50 transition-all group">
                                    <span className="flex items-center gap-3 font-bold"><FiMapPin /> Saved Addresses</span>
                                    <FiChevronRight className="opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="lg:w-3/4">
                        {loading ? (
                            <div className="p-32 flex flex-col items-center justify-center bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
                                <Loader />
                                <p className="mt-8 text-gray-400 font-bold animate-pulse uppercase tracking-[0.3em] text-[10px]">Filtering History...</p>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-32 bg-white rounded-[3rem] border border-gray-100 shadow-sm px-10">
                                <div className="w-32 h-32 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 text-gray-200 transform -rotate-12">
                                    <FiRotateCcw size={64} />
                                </div>
                                <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">No History Yet</h2>
                                <p className="text-gray-500 mb-12 max-w-sm mx-auto font-medium leading-relaxed">You haven't purchased any items yet. Your favorite pieces will appear here after your first order.</p>
                                <Link to="/shop" className="inline-flex items-center gap-3 bg-primary-900 text-white px-10 py-5 rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-black hover:scale-105 transition-all shadow-xl shadow-primary-900/20 active:scale-95">
                                    Browse Shop <FiArrowRight />
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-12 animate-fade-in">
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {products.map((product) => (
                                        <div key={product._id} className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:border-primary-100 transition-all duration-500 overflow-hidden flex flex-col">
                                            <div className="relative aspect-[4/5] overflow-hidden">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <div className="absolute top-6 right-6">
                                                    <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-wider text-gray-900 shadow-xl">
                                                        Elite Asset
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-8 flex-grow flex flex-col">
                                                <Link to={`/product/${product._id}`} className="text-xl font-black text-gray-900 hover:text-primary-600 transition-colors mb-2 block truncate">
                                                    {product.name}
                                                </Link>
                                                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4">Original Purchase</p>

                                                <div className="flex items-end justify-between mt-auto">
                                                    <div>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Price</p>
                                                        <p className="text-2xl font-black text-primary-900 tabular-nums">{product.price.toLocaleString()} <span className="text-xs">EGP</span></p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleBuyAgain(product)}
                                                        className="bg-primary-900 text-white w-14 h-14 rounded-2xl flex items-center justify-center hover:bg-black transition-all shadow-lg shadow-primary-900/20 active:scale-90"
                                                        title="Buy Again"
                                                    >
                                                        <FiShoppingBag size={22} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination Controls */}
                                {pages > 1 && (
                                    <div className="flex justify-center mt-12 pb-8">
                                        <nav className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
                                            <button
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:text-primary-900 disabled:opacity-30 disabled:hover:text-gray-400 transition-all"
                                            >
                                                <FiChevronRight className="rotate-180" />
                                            </button>

                                            {[...Array(pages).keys()].map((p) => (
                                                <button
                                                    key={p + 1}
                                                    onClick={() => handlePageChange(p + 1)}
                                                    className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${currentPage === p + 1
                                                        ? 'bg-primary-900 text-white shadow-lg shadow-primary-900/20'
                                                        : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'
                                                        }`}
                                                >
                                                    {p + 1}
                                                </button>
                                            ))}

                                            <button
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === pages}
                                                className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:text-primary-900 disabled:opacity-30 disabled:hover:text-gray-400 transition-all"
                                            >
                                                <FiChevronRight />
                                            </button>
                                        </nav>
                                    </div>
                                )}

                                {/* Express Service Banner */}
                                <div className="bg-gradient-to-br from-primary-950 to-gray-900 rounded-[3rem] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl">
                                    <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
                                        <div>
                                            <div className="w-16 h-16 bg-accent-500/20 rounded-2xl flex items-center justify-center text-accent-400 mb-8 border border-accent-500/20">
                                                <FiRotateCcw size={32} />
                                            </div>
                                            <h3 className="text-4xl font-black mb-6 tracking-tight">Elite Re-ordering</h3>
                                            <p className="text-gray-400 font-medium leading-relaxed mb-8 max-w-sm">
                                                Your essentials are just a click away. Enjoy priority processing on all re-ordered items from your signature collection.
                                            </p>
                                            <div className="flex gap-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2 h-2 bg-accent-500 rounded-full animate-ping"></div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Fast Lane</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Priority Track</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="hidden md:flex justify-center">
                                            <div className="w-64 h-64 border-2 border-white/5 rounded-full flex items-center justify-center relative">
                                                <div className="w-48 h-48 border-2 border-white/10 rounded-full flex items-center justify-center">
                                                    <FiPackage size={80} className="text-white/20" />
                                                </div>
                                                <div className="absolute inset-0 animate-spin-slow">
                                                    <div className="absolute top-0 left-1/2 -ml-3 w-6 h-6 bg-accent-500 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.5)]"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Decorative Blur */}
                                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-accent-500/10 rounded-full blur-[120px]"></div>
                                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-primary-500/20 rounded-full blur-[120px]"></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchaseHistoryPage;

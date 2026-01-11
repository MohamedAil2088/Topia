import { useState, useEffect } from 'react';
import { FiSearch, FiFilter } from 'react-icons/fi';
import { Helmet } from 'react-helmet-async';
import api from '../utils/api';
import Loader from '../components/Loader';
import CustomDropdown from '../components/CustomDropdown';

interface Design {
    _id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    image: string;
    tags: string[];
    isActive: boolean;
}

const DesignGalleryPage = () => {
    const [designs, setDesigns] = useState<Design[]>([]);
    const [filteredDesigns, setFilteredDesigns] = useState<Design[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('newest');

    useEffect(() => {
        fetchDesigns();
    }, []);

    useEffect(() => {
        filterAndSortDesigns();
    }, [designs, searchQuery, selectedCategory, sortBy]);

    const fetchDesigns = async () => {
        try {
            // Fetch all designs (backend already filters active by default)
            const { data } = await api.get('/designs');
            console.log('Fetched designs:', data);

            if (data.success && data.data) {
                setDesigns(data.data);
            } else {
                setDesigns([]);
            }
        } catch (error) {
            console.error('Failed to fetch designs', error);
            setDesigns([]);
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortDesigns = () => {
        let filtered = [...designs];

        // Filter by search
        if (searchQuery) {
            filtered = filtered.filter(d =>
                d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                d.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                d.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(d => d.category === selectedCategory);
        }

        // Sort
        if (sortBy === 'newest') {
            filtered.reverse();
        } else if (sortBy === 'price-low') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-high') {
            filtered.sort((a, b) => b.price - a.price);
        }

        setFilteredDesigns(filtered);
    };

    const categories = ['all', ...Array.from(new Set(designs.map(d => d.category)))];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader size="lg" />
            </div>
        );
    }

    return (
        <div className="bg-gray-50 dark:bg-[#1a1a1a] min-h-screen transition-colors duration-300 pt-32">
            <Helmet>
                <title>Design Gallery | Topia</title>
                <meta name="description" content="Explore our exclusive collection of premium designs." />
            </Helmet>

            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-black text-gray-900 mb-4">
                        🎨 Design <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">Gallery</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Explore our exclusive collection of premium designs for your custom orders
                    </p>
                </div>

                {/* Filters & Search */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search designs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-600 outline-none transition-all"
                            />
                        </div>

                        {/* Category Filter */}
                        <CustomDropdown
                            value={selectedCategory}
                            onChange={(value) => setSelectedCategory(value)}
                            options={categories.map(cat => ({
                                value: cat,
                                label: cat === 'all' ? 'All Categories' : cat,
                                icon: cat === 'all' ? '📂' : '🎨'
                            }))}
                            icon={
                                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                                    <FiFilter className="text-white" size={18} />
                                </div>
                            }
                        />

                        {/* Sort */}
                        <CustomDropdown
                            value={sortBy}
                            onChange={(value) => setSortBy(value)}
                            options={[
                                { value: 'newest', label: 'Newest First', icon: '🆕' },
                                { value: 'price-low', label: 'Price: Low to High', icon: '💰' },
                                { value: 'price-high', label: 'Price: High to Low', icon: '💎' }
                            ]}
                        />
                    </div>

                    {/* Results Count */}
                    <div className="mt-4 text-sm text-gray-600 font-medium">
                        Showing <span className="font-black text-primary-600">{filteredDesigns.length}</span> of {designs.length} designs
                    </div>
                </div>

                {/* Empty State */}
                {
                    filteredDesigns.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="text-6xl mb-4">🎨</div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2">No Designs Found</h3>
                            <p className="text-gray-600">Try adjusting your filters or search query</p>
                        </div>
                    ) : (
                        /* Design Grid */
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredDesigns.map((design) => (
                                <div
                                    key={design._id}
                                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
                                >
                                    {/* Image */}
                                    <div className="relative h-64 bg-gray-100 overflow-hidden">
                                        <img
                                            src={design.image}
                                            alt={design.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />

                                        {/* Category Badge */}
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                                            <span className="text-xs font-black text-gray-900">{design.category}</span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        <h3 className="text-lg font-black text-gray-900 mb-2 line-clamp-1">
                                            {design.name}
                                        </h3>

                                        <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[2.5rem]">
                                            {design.description}
                                        </p>

                                        {/* Tags */}
                                        {design.tags && design.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {design.tags.slice(0, 3).map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg"
                                                    >
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Price */}
                                        <div className="pt-4 border-t border-gray-100">
                                            <p className="text-xs text-gray-500 font-medium">Starting at</p>
                                            <p className="text-2xl font-black text-primary-600">
                                                {design.price} <span className="text-sm">EGP</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default DesignGalleryPage;

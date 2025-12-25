import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/useRedux';
import { clearCart } from '../redux/slices/cartSlice';
import { createOrder } from '../redux/slices/orderSlice';
import Button from '../components/Button';
import Input from '../components/Input';
import api from '../utils/api';
import Swal from 'sweetalert2';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const { items, totalPrice } = useAppSelector((state: any) => state.cart);
    const { userInfo } = useAppSelector((state: any) => state.auth);

    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Shipping, 2: Payment

    // Shipping State
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('Egypt');

    // Payment State
    const [paymentMethod, setPaymentMethod] = useState('Card');
    const [transactionId, setTransactionId] = useState('');
    const [receiptImage, setReceiptImage] = useState('');

    // Card State
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvc, setCardCvc] = useState('');

    // Coupon State
    const [discount, setDiscount] = useState(0);
    const [isCouponApplied, setIsCouponApplied] = useState(false);
    const [isElitePackaging, setIsElitePackaging] = useState(false);

    // Effect to handle coupon from state
    useEffect(() => {
        const state = location.state as any;
        if (state?.coupon) {
            const discountAmount = Number(((totalPrice * state.coupon.discount) / 100).toFixed(2));
            setDiscount(discountAmount);
            setIsCouponApplied(true);
        }
    }, [location.state, totalPrice]);

    const calculateTotal = () => {
        const shipping = totalPrice > 1000 ? 0 : 50;
        const tax = Number((totalPrice * 0.14).toFixed(2));
        const packaging = isElitePackaging ? 100 : 0;
        const total = totalPrice + shipping + tax + packaging - discount;
        return Number(total.toFixed(2));
    };

    const handleReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            const { data } = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setReceiptImage(data);
            Swal.fire({
                icon: 'success',
                title: 'Receipt Uploaded',
                text: 'Image uploaded successfully!',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000
            });
        } catch (error) {
            Swal.fire('Error', 'Failed to upload image', 'error');
        }
    };

    const handlePlaceOrder = async () => {
        if (step === 1) {
            if (!address || !city || !postalCode || !country) {
                Swal.fire('Error', 'Please fill in all shipping details', 'error');
                return;
            }
            setStep(2);
            return;
        }

        if (paymentMethod === 'Card') {
            if (!cardNumber || !cardExpiry || !cardCvc) {
                Swal.fire('Error', 'Please fill in all card details', 'error');
                return;
            }
        }

        if (paymentMethod === 'Vodafone Cash' && !transactionId) {
            Swal.fire('Error', 'Please enter the transaction ID', 'error');
            return;
        }

        setLoading(true);

        try {
            // Separate custom orders from regular orders
            const customOrderItems = items.filter((item: any) => item.isCustomOrder);
            const regularOrderItems = items.filter((item: any) => !item.isCustomOrder);

            // Create custom orders first
            if (customOrderItems.length > 0) {
                for (const item of customOrderItems) {
                    const customOrderData = {
                        productId: item._id, // Correct field for backend
                        product: item._id,   // Legacy support
                        quantity: item.qty,
                        size: item.size || 'M', // Fallback to ensure validation passes
                        color: item.color || 'Black', // Fallback to ensure validation passes
                        customization: {
                            designImages: item.customization?.designImages || [],
                            selectedDesign: item.customization?.selectedDesign?._id || null,
                            printLocation: item.customization?.printLocation || 'front',
                            printSize: item.customization?.printSize || 'medium',
                            specialInstructions: item.customization?.specialInstructions || '',
                            designNotes: item.customization?.designNotes || ''
                        },
                        shippingAddress: {
                            street: address,
                            city: city,
                            state: city, // Fallback
                            zipCode: postalCode,
                            country: country,
                            fullName: userInfo?.name || 'Guest',
                            phone: userInfo?.phone || '0000000000'
                        },
                        // Payment info (though backend controller might ignore it for now, good to send)
                        paymentMethod: paymentMethod === 'Vodafone Cash' ? 'wallet' : (paymentMethod === 'Card' ? 'card' : 'cash'),
                        transactionId: paymentMethod === 'Vodafone Cash' ? transactionId : undefined,
                        isPaid: paymentMethod === 'Card',
                        paidAt: paymentMethod === 'Card' ? new Date().toISOString() : undefined
                    };

                    await api.post('/custom-orders', customOrderData);
                }
            }

            // Create regular order if there are regular items
            if (regularOrderItems.length > 0) {
                const orderData = {
                    orderItems: regularOrderItems.map((item: any) => ({
                        product: item._id,
                        name: item.name,
                        qty: item.qty,
                        image: item.image,
                        price: item.price,
                        size: item.size,
                        color: item.color
                    })),
                    shippingAddress: { address, city, postalCode, country },
                    paymentMethod,
                    paymentResult: paymentMethod === 'Vodafone Cash'
                        ? { id: transactionId, status: 'Pending Verification', receiptImage }
                        : (paymentMethod === 'Card' ? { id: `txn_${Date.now()}`, status: 'COMPLETED', update_time: new Date().toISOString() } : undefined),
                    itemsPrice: totalPrice,
                    taxPrice: Number((totalPrice * 0.14).toFixed(2)),
                    shippingPrice: totalPrice > 1000 ? 0 : 50,
                    isElitePackaging,
                    packagingPrice: isElitePackaging ? 100 : 0,
                    discountPrice: discount,
                    totalPrice: calculateTotal(),
                };

                await dispatch(createOrder(orderData));
            }

            // Clear cart and navigate to success
            dispatch(clearCart());

            Swal.fire({
                icon: 'success',
                title: 'Order Placed Successfully!',
                text: customOrderItems.length > 0
                    ? 'Your custom orders are being reviewed. We will contact you soon!'
                    : 'Your order has been confirmed!',
                confirmButtonText: 'View Orders'
            }).then(() => {
                navigate('/order-success');
            });

        } catch (error: any) {
            console.error(error);
            Swal.fire('Error', error.response?.data?.message || 'Failed to place order', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return <div className="p-8 text-center pt-32 font-black uppercase text-gray-400">Your cart is empty</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 pt-40">
            <h1 className="text-4xl font-black font-display mb-2 uppercase italic tracking-tighter">
                🔒 Secure <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">Checkout</span>
            </h1>
            <p className="text-gray-500 mb-12 uppercase text-[10px] font-bold tracking-[0.2em]">Complete your elite acquisition</p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8">
                    {/* Shipping Address */}
                    <div className={`mb-12 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 ${step === 1 ? 'ring-2 ring-primary-900/5' : 'opacity-50'}`}>
                        <h2 className="text-xl font-black mb-8 flex items-center gap-4 uppercase tracking-tighter">
                            <span className="w-10 h-10 bg-primary-900 text-white rounded-full flex items-center justify-center text-sm font-black">01</span>
                            Shipping Details
                        </h2>

                        <div className="space-y-6">
                            <Input label="Shipping Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
                            <div className="grid grid-cols-3 gap-4">
                                <Input label="City" value={city} onChange={(e) => setCity(e.target.value)} required />
                                <Input label="Postal Code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
                                <Input label="Country" value={country} onChange={(e) => setCountry(e.target.value)} required />
                            </div>

                            {step === 1 && (
                                <div className="pt-4">
                                    <Button onClick={() => setStep(2)} size="lg" className="px-12 rounded-2xl">
                                        Continue to Payment
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className={`mb-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 ${step === 2 ? 'ring-2 ring-primary-900/5' : 'opacity-50'}`}>
                        <h2 className="text-xl font-black mb-8 flex items-center gap-4 uppercase tracking-tighter">
                            <span className="w-10 h-10 bg-primary-900 text-white rounded-full flex items-center justify-center text-sm font-black">02</span>
                            Payment Method
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            {['Card', 'CashOnDelivery', 'Vodafone Cash'].map((method) => (
                                <label key={method} className={`flex flex-col items-center p-6 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === method ? 'border-primary-900 bg-primary-50/30' : 'border-gray-100 hover:border-gray-200'}`}>
                                    <input type="radio" name="paymentMethod" value={method} checked={paymentMethod === method} onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
                                    <span className="font-black text-[10px] uppercase tracking-widest text-gray-900">{method}</span>
                                </label>
                            ))}
                        </div>

                        {step === 2 && (
                            <div className="space-y-6 animate-fade-in">
                                {paymentMethod === 'Card' && (
                                    <div className="p-6 bg-gray-50 border border-gray-200 rounded-2xl space-y-4">
                                        <Input label="Card Number" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="0000 0000 0000 0000" required />
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input label="Expiry Date" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} placeholder="MM/YY" required />
                                            <Input label="CVC" value={cardCvc} onChange={(e) => setCardCvc(e.target.value)} type="password" placeholder="123" required />
                                        </div>
                                    </div>
                                )}

                                {paymentMethod === 'Vodafone Cash' && (
                                    <div className="p-6 bg-gray-50 border border-gray-200 rounded-2xl space-y-4">
                                        <p className="text-sm text-gray-600 font-medium">Please transfer <span className="font-black text-primary-900">{calculateTotal()} EGP</span> to <span className="underline font-black">010XXXXXXXX</span></p>
                                        <Input label="Transaction ID" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} required />
                                        <input type="file" accept="image/*" onChange={handleReceiptUpload} className="text-sm" />
                                    </div>
                                )}

                                <div className="flex gap-4 pt-4">
                                    <Button variant="outline" onClick={() => setStep(1)} className="rounded-2xl">Go Back</Button>
                                    <Button onClick={handlePlaceOrder} isLoading={loading} className="px-12 rounded-2xl shadow-xl shadow-primary-900/20">Finalize Order</Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-4">
                    <div className="bg-gray-900 p-8 rounded-[2rem] shadow-2xl text-white sticky top-24">
                        <h3 className="font-black text-xl uppercase tracking-tighter mb-8">Acquisition Summary</h3>

                        <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {items.map((item: any) => (
                                <div key={item._id} className="flex gap-4 items-center">
                                    <div className="w-12 h-16 bg-white/10 rounded-xl overflow-hidden flex-shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-grow">
                                        <h4 className="text-xs font-black uppercase tracking-tight">{item.name}</h4>
                                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{item.qty} × {item.size}</p>
                                        {item.isCustomOrder && (
                                            <span className="inline-block mt-1 px-2 py-0.5 bg-purple-500/20 text-purple-300 text-[8px] font-bold rounded">
                                                🎨 CUSTOM
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-xs font-black">{item.price.toFixed(2)}</div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3 pt-6 border-t border-white/10 text-xs font-bold uppercase tracking-widest text-white/60">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="text-white">{totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Handling</span>
                                <span className="text-white">{totalPrice > 1000 ? 'Free' : '50.00'}</span>
                            </div>

                            <label className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 cursor-pointer mt-4 hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-3">
                                    <input type="checkbox" checked={isElitePackaging} onChange={(e) => setIsElitePackaging(e.target.checked)} className="rounded bg-white/10 border-white/20" />
                                    <div>
                                        <p className="text-[10px] text-white font-black leading-none">Elite Packaging</p>
                                        <p className="text-[8px] opacity-40 mt-1">Scented Wax Seal</p>
                                    </div>
                                </div>
                                <span className="text-accent-400">+100</span>
                            </label>

                            {isCouponApplied && (
                                <div className="flex justify-between text-accent-400">
                                    <span>Discount Applied</span>
                                    <span>-{discount.toFixed(2)}</span>
                                </div>
                            )}

                            <div className="flex justify-between text-lg font-black text-white pt-6 border-t border-white/10 mt-6">
                                <span>Total</span>
                                <span>{calculateTotal()} EGP</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;

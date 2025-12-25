const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc    Create new review
// @route   POST /api/products/:productId/reviews
// @access  Private
exports.createReview = async (req, res) => {
    try {
        req.body.product = req.params.productId;
        req.body.user = req.user._id;

        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'المنتج غير موجود' });
        }

        // التحقق مما إذا كان المستخدم قد قيم المنتج مسبقاً
        const isReviewed = await Review.findOne({
            user: req.user._id,
            product: req.params.productId
        });

        if (isReviewed) {
            return res.status(400).json({ success: false, message: 'لقد قمت بتقييم هذا المنتج مسبقاً' });
        }

        const review = await Review.create(req.body);

        res.status(201).json({
            success: true,
            data: review
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get reviews for a product
// @route   GET /api/products/:productId/reviews
// @access  Public
exports.getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId })
            .populate('user', 'name'); // إظهار اسم صاحب التقييم

        res.json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private (Owner/Admin)
exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ success: false, message: 'التقييم غير موجود' });
        }

        // التأكد من أن المستخدم هو صاحب التقييم أو أدمن
        if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'غير مصرح لك بحذف هذا التقييم' });
        }

        await review.deleteOne();

        res.json({ success: true, message: 'تم حذف التقييم' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

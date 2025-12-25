const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'الرجاء إدخال اسم الفئة'],
        trim: true,
        unique: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        maxlength: [500, 'الوصف لا يجب أن يتعدى 500 حرف']
    },
    image: {
        type: String,
        default: 'default-category.jpg'
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// إنشاء slug تلقائياً من الاسم قبل الحفظ
categorySchema.pre('save', async function () {
    if (this.isModified('name')) {
        this.slug = this.name.split(' ').join('-').toLowerCase();
    }
});

module.exports = mongoose.model('Category', categorySchema);

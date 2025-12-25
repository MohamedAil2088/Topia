const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Password Validation
        if (!password || password.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
        }

        // التحقق من وجود المستخدم
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'البريد الإلكتروني مسجل بالفعل' });
        }

        // إنشاء مستخدم جديد
        const user = await User.create({
            name,
            email,
            password,
            phone
        });

        if (user) {
            // Send Welcome Email
            try {
                await sendEmail({
                    email: user.email,
                    subject: 'Welcome to Topia Store! 🎉',
                    message: `
                        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                            <h1 style="color: #4F46E5;">Welcome, ${user.name}!</h1>
                            <p>Thank you for joining <strong>Topia Mens Ecommerce</strong>.</p>
                            <p>We are thrilled to have you on board. Start shopping now for the best men's fashion.</p>
                            <p>Best Regards,<br/>Topia Team</p>
                        </div>
                    `
                });
            } catch (err) {
                console.error('Welcome Email Error:', err);
            }

            res.status(201).json({
                success: true,
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,  // إضافة role
                isAdmin: user.role === 'admin',
                points: user.points || 0,
                tier: user.tier || 'Bronze',
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ success: false, message: 'بيانات المستخدم غير صحيحة' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // التحقق من وجود المستخدم
        const user = await User.findOne({ email }).select('+password');

        console.log('---------------- LOGIN DEBUG ----------------');
        console.log('1. Attempting login for:', email);
        console.log('2. User found in DB:', user ? 'YES' : 'NO');

        if (user) {
            console.log('3. Stored Hash:', user.password ? (user.password.substring(0, 10) + '...') : 'NO PASSWORD');
            console.log('4. Input Password:', password);

            // Compare manually here
            const bcrypt = require('bcryptjs');
            const isMatchManual = await bcrypt.compare(password, user.password);
            console.log('5. Manual bcrypt.compare():', isMatchManual);

            if (!isMatchManual) {
                console.log('⚠️  MISMATCH! Hash likely invalid or input wrong.');
            }
        }
        console.log('---------------------------------------------');

        if (user && (await user.matchPassword(password))) {
            console.log('✅ Password matched!');
            const responseData = {
                success: true,
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,  // إضافة role
                isAdmin: user.role === 'admin',
                points: user.points || 0,
                tier: user.tier || 'Bronze',
                token: generateToken(user._id)
            };
            res.json(responseData);
        } else {
            console.log('❌ Password did NOT match');
            res.status(401).json({ success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
        }
    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Check if email exists
// @route   POST /api/auth/check-email
// @access  Public
exports.checkEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        res.json({
            success: true,
            exists: !!user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'البريد الإلكتروني غير مسجل' });
        }

        // Generate Code (6 digits)
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash code and save to DB
        user.resetPasswordToken = crypto.createHash('sha256').update(resetCode).digest('hex');
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

        await user.save({ validateBeforeSave: false });

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset Code - Topia',
                message: `
                    <h1>Password Reset Request</h1>
                    <p>Your password reset code is:</p>
                    <h2 style="color: #4F46E5; letter-spacing: 5px;">${resetCode}</h2>
                    <p>This code expires in 10 minutes.</p>
                `
            });
            res.status(200).json({ success: true, message: 'Email sent' });
        } catch (err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });
            return res.status(500).json({ success: false, message: 'Email could not be sent' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Verify Reset Code
// @route   POST /api/auth/verify-code
// @access  Public
exports.verifyCode = async (req, res) => {
    try {
        const { email, code } = req.body;
        const resetPasswordToken = crypto.createHash('sha256').update(code).digest('hex');

        const user = await User.findOne({
            email,
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired code' });
        }

        res.status(200).json({ success: true, message: 'Code verified' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Reset Password
// @route   PUT /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res) => {
    try {
        const { email, code, password } = req.body;
        const resetPasswordToken = crypto.createHash('sha256').update(code).digest('hex');

        const user = await User.findOne({
            email,
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired code' });
        }

        // Set new password
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Auth with Google
// @route   POST /api/auth/google
// @access  Public
exports.googleLogin = async (req, res) => {
    const { OAuth2Client } = require('google-auth-library');
    // Priority: .env > Hardcoded
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "1003836111670-33sgte6cjc5npj3hk140akl3otk4lubg.apps.googleusercontent.com";
    const client = new OAuth2Client(GOOGLE_CLIENT_ID);
    const { tokenId } = req.body;

    if (!tokenId) {
        return res.status(400).json({ success: false, message: 'Google token is missing' });
    }

    try {
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: GOOGLE_CLIENT_ID
        });

        const { name, email, picture, sub } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (!user) {
            // Create user with minimal requirements
            user = new User({
                name,
                email,
                password: require('crypto').randomBytes(16).toString('hex'),
                avatar: picture,
                googleId: sub,
                isVerified: true
            });
            // Bypass phone validation if it exists
            user.phone = "0000000000";
            await user.save({ validateBeforeSave: false });
        } else {
            user.googleId = sub;
            user.avatar = user.avatar || picture;
            await user.save({ validateBeforeSave: false });
        }

        res.json({
            success: true,
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isAdmin: user.role === 'admin',
            points: user.points || 0,
            tier: user.tier || 'Bronze',
            token: generateToken(user._id)
        });
    } catch (error) {
        console.error("GOOGLE AUTH ERROR:", error);
        res.status(401).json({ success: false, message: 'Google authentication failed: ' + error.message });
    }
};

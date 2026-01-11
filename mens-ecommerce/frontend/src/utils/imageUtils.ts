export const getImageUrl = (url: string | undefined | null): string => {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('blob:')) {
        return url;
    }
    // If it starts with /placeholder, we might want to leave it or prepend base url depending on where that asset lives.
    // Assuming backend serves uploads from public/uploads mapped to root or similar.
    // The previous code used localhost:5000 directly.
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    // Remove /api from the end to get the base URL for images
    const baseUrl = apiUrl.replace(/\/api\/?$/, '');

    return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

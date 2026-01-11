// Test API endpoint
fetch('http://localhost:3000/api/categories')
    .then(res => res.json())
    .then(data => {
        console.log('='.repeat(80));
        console.log('📂 Categories from API:');
        console.log('='.repeat(80));

        const categories = data.data || data;
        categories.forEach((cat, i) => {
            console.log(`${i + 1}. ${cat.name}`);
            console.log(`   Image: ${cat.image || 'NO IMAGE'}`);
            console.log(`   Slug: ${cat.slug}`);
            console.log('');
        });

        console.log('='.repeat(80));
    })
    .catch(err => console.error('Error:', err));

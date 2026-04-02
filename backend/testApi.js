async function test() {
    try {
        const loginRes = await fetch('http://localhost:5000/api/users/login', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@noura.com', password: 'adminpassword' })
        });
        const login = await loginRes.json();
        const token = login.token;

        const catsRes = await fetch('http://localhost:5000/api/categories');
        const cats = await catsRes.json();
        let catId = cats.length > 0 ? cats[0]._id : "507f1f77bcf86cd799439011";

        const res = await fetch('http://localhost:5000/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({
                name: 'Test', slug: 'test-' + Date.now(), price: 1500, category: catId,
                images: ['/uploads/test.jpg'], description: 'Test', inStock: true
            })
        });
        const data = await res.json();
        console.log('STATUS:', res.status);
        console.log('JSON:', JSON.stringify(data, null, 2));
    } catch (e) {
        console.log('EXCEPTION:', e.message);
    }
}
test();

const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testHistory() {
    try {
        console.log("1. Logging in...");
        const loginRes = await axios.post(`${API_URL}/auth/signin`, {
            username: 'admin',
            password: 'admin123'
        });
        const token = loginRes.data.accessToken;
        console.log("   Token received.");

        console.log("2. Finding Product...");
        const prodRes = await axios.get(`${API_URL}/products`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        let productId;
        if (prodRes.data.length > 0) {
            productId = prodRes.data[0].id;
            console.log(`   Found Product ID ${productId}: ${prodRes.data[0].name}`);
        } else {
            console.log("   No products found.");
            // Assuming seeded IDs
            productId = 1;
        }

        console.log("3. Adding Stock Movement...");
        try {
            await axios.post(`${API_URL}/stock/add`, {
                product_id: productId,
                quantity: 50,
                type: 'IN',
                unit_type: 'kg'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(`   Added 50kg to Product ID ${productId}`);
        } catch (e) {
            console.log("   Failed to add stock:", e.message);
            if (e.response) console.log(e.response.data);
        }

        console.log("4. Fetching History...");
        try {
            const histRes = await axios.get(`${API_URL}/stock/history`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log("   Response Data:", JSON.stringify(histRes.data, null, 2));

            if (histRes.data.length > 0) {
                console.log("SUCCESS: History data found.");
            } else {
                console.log("FAILURE: History data is empty.");
            }
        } catch (e) {
            console.log("   Failed to fetch history:", e.message);
            if (e.response) console.log(e.response.data);
        }

    } catch (error) {
        console.error("Test Failed:", error.response ? error.response.data : error.message);
    }
}

testHistory();

const axios = require('axios');

async function run() {
    try {
        const payload = {
            sampleId: "SAM-1234",
            batchId: "B-TEST",
            testType: "Chemical",
            labName: "SGS",
            mineralType: "Lithium",
            purity: "99%",
            userId: "699886bde414937dbb06d947" 
        };
        const res = await axios.post('http://localhost:5001/api/assaying-testing', payload);
        console.log("Success:", res.data);
    } catch (err) {
        console.error("Error:", err.response ? err.response.data : err.message);
    }
}
run();

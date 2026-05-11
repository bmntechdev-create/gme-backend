const http = require('http');

const data = JSON.stringify({
    sampleId: "SAM-" + Math.floor(Math.random() * 10000),
    batchId: "B-TEST2",
    testType: "Chemical",
    labName: "SGS",
    userId: "65b93d289945fc001f3abaaa" // random valid objectId
});

const options = {
    hostname: 'localhost',
    port: 5001,
    path: '/api/assaying-testing',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    let responseData = '';
    res.on('data', (chunk) => {
        responseData += chunk;
    });
    res.on('end', () => {
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`BODY: ${responseData}`);
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});

req.write(data);
req.end();

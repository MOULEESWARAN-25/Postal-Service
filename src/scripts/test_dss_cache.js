const axios = require('axios');
const mongoose = require('mongoose');

const MONGODB_URI = '[REDACTED_MONGODB_URI]';

async function testCache() {
  console.log("Connecting to database...");
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;

  // Clear previous cache entries for testing
  console.log("Clearing previous cache entries...");
  await db.collection('ai_response_cache').deleteMany({});

  const baseURL = 'http://127.0.0.1:3002';

  // Test Case 1: Scheme Information (Should bypass Gemini completely)
  console.log("\n--- TEST CASE 1: Scheme Information (Bypass Gemini) ---");
  try {
    const t0 = Date.now();
    const res = await axios.post(`${baseURL}/api/query-resolver`, {
      prompt: "What is SSA?"
    });
    const t1 = Date.now();
    console.log(`Response received in ${t1 - t0}ms`);
    console.log("Explanation Authority:", res.data.provenance?.explanationAuthority);
    console.log("Is Cached?", !!res.data.provenance?.cached);
    console.log("Snippet:\n", res.data.text.slice(0, 200), "...");
  } catch (err) {
    console.error("Test Case 1 failed:", err.message);
  }

  // Test Case 2: Village Analysis First Request (Should miss cache, call Gemini, and write cache)
  console.log("\n--- TEST CASE 2: Village Analysis (Cache Miss & Cache Write) ---");
  try {
    const t0 = Date.now();
    const res = await axios.post(`${baseURL}/api/query-resolver`, {
      prompt: "Analyze demographics of village Arasur"
    });
    const t1 = Date.now();
    console.log(`Response received in ${t1 - t0}ms`);
    console.log("Explanation Authority:", res.data.provenance?.explanationAuthority);
    console.log("Is Cached?", !!res.data.provenance?.cached);
    console.log("Snippet:\n", res.data.text.slice(0, 200), "...");

    // Check if cache collection has it
    const cacheCount = await db.collection('ai_response_cache').countDocuments({});
    console.log(`Total items in ai_response_cache collection: ${cacheCount}`);
  } catch (err) {
    console.error("Test Case 2 failed:", err.message);
  }

  // Test Case 3: Village Analysis Second Request (Should hit cache, bypass Gemini, sub-100ms response)
  console.log("\n--- TEST CASE 3: Village Analysis (Cache Hit) ---");
  try {
    const t0 = Date.now();
    const res = await axios.post(`${baseURL}/api/query-resolver`, {
      prompt: "Analyze demographics of village Arasur"
    });
    const t1 = Date.now();
    console.log(`Response received in ${t1 - t0}ms`);
    console.log("Explanation Authority:", res.data.provenance?.explanationAuthority);
    console.log("Is Cached?", !!res.data.provenance?.cached);
    console.log("Snippet:\n", res.data.text.slice(0, 200), "...");
  } catch (err) {
    console.error("Test Case 3 failed:", err.message);
  }

  // Test Case 4: Beneficiary Guidance (Should NOT cache)
  console.log("\n--- TEST CASE 4: Beneficiary Guidance (No Cache Policy) ---");
  try {
    const t0 = Date.now();
    const res = await axios.post(`${baseURL}/api/query-resolver`, {
      prompt: "Explain recommendation for Muthusamy K"
    });
    const t1 = Date.now();
    console.log(`Response received in ${t1 - t0}ms`);
    console.log("Explanation Authority:", res.data.provenance?.explanationAuthority);
    console.log("Is Cached?", !!res.data.provenance?.cached);

    // Verify cache count hasn't increased
    const cacheCount = await db.collection('ai_response_cache').countDocuments({});
    console.log(`Total items in ai_response_cache collection (should still be 1): ${cacheCount}`);
  } catch (err) {
    console.error("Test Case 4 failed:", err.message);
  }

  await mongoose.connection.close();
  console.log("\nDone!");
}

testCache();

import http from "http";
import mongoose from "mongoose";

const PORT = process.env.PORT || 5000;

// Health check function
const healthCheck = async () => {
  try {
    // Check if server is responding
    const serverCheck = await new Promise((resolve, reject) => {
      const req = http.request(
        {
          hostname: "localhost",
          port: PORT,
          path: "/api/health",
          method: "GET",
          timeout: 5000,
        },
        (res) => {
          if (res.statusCode === 200) {
            resolve(true);
          } else {
            reject(new Error(`Server returned status ${res.statusCode}`));
          }
        }
      );

      req.on("error", reject);
      req.on("timeout", () => reject(new Error("Request timeout")));
      req.end();
    });

    // Check database connection
    const dbCheck = mongoose.connection.readyState === 1;

    if (serverCheck && dbCheck) {
      console.log("✅ Health check passed");
      process.exit(0);
    } else {
      console.error("❌ Health check failed");
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Health check error:", error.message);
    process.exit(1);
  }
};

// Run health check
healthCheck();

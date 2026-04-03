import app from "@/app";
import { config } from "@/config";
import { prisma } from "@/utils/prisma";

const startServer = async () => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    console.log("✅ Database connection successful");

    // Start the server
    const server = app.listen(config.app.port, () => {
      console.log(`
╔════════════════════════════════════════╗
║     FinGuard API Server Started        ║
╠════════════════════════════════════════╣
║ Server: http://localhost:${config.app.port}           ║
║ Environment: ${config.app.env.padEnd(24)} ║
║ Health: http://localhost:${config.app.port}/health ║
╚════════════════════════════════════════╝
      `);
    });

    // Graceful shutdown
    process.on("SIGTERM", async () => {
      console.log("SIGTERM received, shutting down gracefully...");
      server.close(async () => {
        await prisma.$disconnect();
        process.exit(0);
      });
    });

    process.on("SIGINT", async () => {
      console.log("SIGINT received, shutting down gracefully...");
      server.close(async () => {
        await prisma.$disconnect();
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

startServer();

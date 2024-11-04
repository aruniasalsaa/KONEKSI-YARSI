// homepageController.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getHomepageData = async (req, res) => {
  try {
    // Ambil 3 berita terbaru berdasarkan createdAt
    const latestNews = await prisma.news.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
    });

    // Ambil 3 event terbaru berdasarkan createdAt
    const latestEvents = await prisma.event.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
    });

    res.status(200).json({
      status: "success",
      data: {
        news: latestNews,
        events: latestEvents,
      },
    });
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

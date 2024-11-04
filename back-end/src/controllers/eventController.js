const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.addEvent = async (req, res) => {
  try {
    // Gunakan data yang sudah tervalidasi dari middleware
    const { title, content, image, authorId, adminUniversitasId } =
      req.validatedData;

    // Cek apakah berita dengan judul yang sama sudah ada
    const existingEvent = await prisma.event.findFirst({
      where: { title: title },
    });

    if (existingEvent) {
      return res.status(400).json({
        status: "error",
        message:
          "Berita dengan judul yang sama sudah ada, silahkan masukkan judul lain",
      });
    }

    // Dapatkan nama file yang diupload
    const fileName = req.file.filename;

    // Bangun URL untuk gambar yang diupload
    const pathFile = `${req.protocol}://${req.get(
      "host"
    )}/public/uploads/${fileName}`;

    // Simpan berita baru ke database
    const newEvent = await prisma.event.create({
      data: {
        title,
        content,
        image: pathFile,
        authorId,
        adminUniversitasId: adminUniversitasId || null, // Gunakan nilai adminUniversitasId jika ada, jika tidak, null
        verified: adminUniversitasId ? true : false, // Jika admin universitas langsung menambahkan berita, maka verified = true
      },
    });

    res.status(201).json({
      status: "success",
      data: newEvent,
    });
  } catch (error) {
    console.log("error disini", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

exports.readEvent = async (req, res) => {
  try {
    const Events = await prisma.event.findMany();

    return res.status(200).json({
      data: Events,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

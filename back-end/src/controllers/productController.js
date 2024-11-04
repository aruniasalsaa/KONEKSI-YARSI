const { PrismaClient, Prisma } = require("@prisma/client"); // Import Prisma Client
const prisma = new PrismaClient(); // Inisialisasi Prisma Client

exports.addProduct = async (req, res) => {
  try {
    // Gunakan data yang sudah tervalidasi dari middleware
    const { name, description, categoryId, price, image, stock } =
      req.validatedData;

    // Cek apakah product dengan nama yang sama sudah ada
    const existingProduct = await prisma.product.findUnique({
      where: { name: name },
    });

    if (existingProduct) {
      return res.status(400).json({
        status: "error",
        message: "Name product sudah ada, silahkan masukkan product lain",
      });
    }

    // Cek apakah categoryId sudah terdaftar
    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId }, // Ganti dengan kolom yang sesuai
    });

    if (!existingCategory) {
      return res.status(400).json({
        status: "error",
        message:
          "Category tidak ditemukan, silahkan masukkan category yang valid",
      });
    }

    // Dapatkan nama file yang diupload
    const fileName = req.file.filename; // Ganti image.fileName dengan req.file.filename

    // Bangun URL untuk gambar yang diupload
    const pathFile = `${req.protocol}://${req.get(
      "host"
    )}/public/uploads/${fileName}`;

    // Simpan produk baru ke database
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        categoryId,
        price,
        image: pathFile,
        stock,
      },
    });

    res.status(201).json({
      status: "success",
      data: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

exports.readProduct = async (req, res) => {
  try {
    const products = await prisma.product.findMany();

    return res.status(200).json({
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

exports.detailProduct = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await prisma.product.findUnique({
      where: { id: id },
    });

    if (!product) {
      return res.status(404).json({
        status: "Fail",
        error: "Data id tidak ditemukan",
      });
    }

    return res.status(200).json({
      status: "success",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

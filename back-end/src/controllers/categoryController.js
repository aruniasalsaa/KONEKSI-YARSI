const { PrismaClient, Prisma } = require("@prisma/client"); // Import Prisma Client
const prisma = new PrismaClient(); // Inisialisasi Prisma Client

// Fungsi untuk mendapatkan semua kategori
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany(); // Ambil semua kategori dari database

    res.status(200).json({
      status: "success",
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

// Method untuk mendapatkan kategori tertentu
exports.detailCategory = async (req, res) => {
  try {
    const id = req.params.id;

    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
    });

    if (!category) {
      return res.status(404).json({
        status: "Fail",
        error: "Data id tidak ditemukan",
      });
    }

    return res.status(200).json({
      status: "success",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

// Method untuk menyimpan kategori
exports.storingCategory = async (req, res) => {
  try {
    // Gunakan data yang sudah tervalidasi dari middleware
    const { name, description } = req.validatedData;

    // Cek apakah kategori dengan nama yang sama sudah ada
    const existingCategory = await prisma.category.findUnique({
      where: { name: name },
    });

    if (existingCategory) {
      return res.status(400).json({
        status: "error",
        message: "Name category sudah ada, silahkan masukkan kategori lain",
      });
    }

    // Simpan kategori ke database
    const category = await prisma.category.create({
      data: {
        name,
        description,
      },
    });

    res.status(201).json({
      status: "success",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

// Method untuk update kategori
exports.updateCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, description } = req.validatedData;

    // Pastikan kategori dengan ID yang diberikan ada
    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
    });

    if (!category) {
      return res.status(404).json({
        status: "Fail",
        error: "Data id tidak ditemukan",
      });
    }

    // Update data kategori
    const updatedCategory = await prisma.category.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
      },
    });

    return res.status(200).json({
      status: "Success",
      data: updatedCategory,
    });
  } catch (error) {
    console.log("Error:", error); // Debugging
    return res.status(500).json({
      status: "Fail",
      message: "Server down",
    });
  }
};

// Method untuk delete kategori
exports.deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;

    const idCategory = await prisma.category.findUnique({
      where: { id: Number(id) },
    });

    if (!idCategory) {
      return res.status(404).json({
        status: "Fail",
        error: "Data id tidak ditemukan",
      });
    }

    await prisma.category.delete({
      where: { id: Number(id) },
    });

    return res.status(200).json({
      status: "success",
      message: `Data dengan id ${id} berhasil dihapus`,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

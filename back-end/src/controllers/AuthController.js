const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // Import JWT
const { z } = require("zod");

const prisma = new PrismaClient();

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRED_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);

  const cookieOption = {
    expire: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 14 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.cookie("jwt", token, cookieOption);

  user.password = undefined;

  res.status(statusCode).json({
    status: "Success",
    data: {
      user,
    },
  });
};

// Method untuk create user
exports.createUser = async (req, res) => {
  try {
    const { username, password, roleId } = req.validatedData;

    // Hash password sebelum menyimpannya ke database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan pengguna ke database menggunakan Prisma
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        roleId, // Simpan roleId yang valid
      },
    });

    createSendToken(user, 201, res);
  } catch (error) {
    console.error(error);
    res.status(400).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

// Method untuk login user
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.validatedData;

    // Cari pengguna berdasarkan username
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(404).json({
        status: "Fail",
        message: "Username tidak ada",
      });
    }

    // Bandingkan password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        status: "Fail",
        message: "Password salah",
      });
    }

    createSendToken(user, 200, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Method untuk logout user
exports.logoutUser = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    message: "Logout berhasil",
  });
};

// Method untuk melihat data user itu sendiri
exports.getMyUser = async (req, res) => {
  try {
    // Mengambil data pengguna berdasarkan id dari req.user
    console.log(req.user);
    const currentUser = await prisma.user.findUnique({
      where: { id: req.user.id }, // Memastikan query pada user spesifik
      select: {
        id: true,
        username: true,
        roleId: true,
      },
    });

    if (!currentUser) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    return res.status(200).json(currentUser); // Mengembalikan data user
  } catch (error) {
    console.log(req.user);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

// Method untuk mengubah password user
exports.changePassword = async (req, res) => {
  console.log("sampai");
  try {
    // const { username, password, roleId } = req.validatedData
    // // Validasi input data dengan Zod
    // const validatedData = ChangePasswordSchema.parse(req.validatedData.body);

    const { username, oldPassword, newPassword } = req.validatedData;

    // Cari user berdasarkan username
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: "Username tidak ditemukan" });
    }

    // Cek apakah oldPassword benar
    const isOldPasswordCorrect = await bcrypt.compare(
      oldPassword,
      user.password
    );
    if (!isOldPasswordCorrect) {
      return res.status(401).json({ message: "Password lama salah" });
    }

    // Hash password baru dan update di database
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { username },
      data: { password: hashedNewPassword },
    });

    res.status(200).json({ message: "Password berhasil diubah" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

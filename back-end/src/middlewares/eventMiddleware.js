const { z } = require("zod");

const EventPostSchema = z.object({
  id: z.string().uuid().optional(),
  title: z
    .string()
    .min(1, "Inputan data title berita tidak boleh kosong")
    .max(100, "Title must not exceed 100 characters"),
  description: z
    .string()
    .min(1, "description berita tidak boleh kosong")
    .max(5000, "description must not exceed 5000 characters"),
  image: z.string().min(1, "Image file is required"),
  authorId: z
    .string()
    .uuid("Author ID must be a valid UUID")
    .nonempty("Author ID is required"),
  adminProdiId: z
    .string()
    .uuid("Admin Prodi ID must be a valid UUID")
    .optional(), // Opsional, hanya diisi jika berita dibuat oleh admin prodi
  adminUniversitasId: z
    .string()
    .uuid("Admin Universitas ID must be a valid UUID")
    .optional(), // Opsional, hanya diisi jika diverifikasi oleh admin universitas
  verified: z
    .union([z.boolean(), z.string()])
    .transform((val) => (val === "true" ? true : val === "false" ? false : val))
    .optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Middleware untuk validasi berita saat create dan update
exports.validateEvent = (req, res, next) => {
  try {
    // Pastikan req.file ada sebelum validasi
    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }

    // Validasi berita
    const validatedData = EventPostSchema.parse({
      ...req.body,
      image: req.file.path, // Menyimpan path gambar yang diunggah
    });

    req.validatedData = validatedData; // Simpan data yang sudah tervalidasi
    next(); // Lanjutkan ke kontroler berikutnya
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

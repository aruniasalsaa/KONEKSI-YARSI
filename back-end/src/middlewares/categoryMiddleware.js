const { z } = require("zod");

// Skema validasi untuk kategori
const CategorySchema = z.object({
  name: z
    .string()
    .max(50, "Name must not exceed 50 characters")
    .optional() // Buat field name opsional
    .refine((val) => val !== "", {
      message: "Inputan data name kategori tidak boleh kosong",
    }),
  description: z.string().nullable().optional(), // Buat description opsional
});

// Skema validasi untuk kategori
const CategoryPostSchema = z.object({
  name: z
    .string()
    .min(1, "Inputan data name kategori tidak boleh kosong")
    .max(50, "Name must not exceed 50 characters"),
  description: z.string().nullable(),
});

// Middleware untuk validasi kategori saat update
exports.validateUpdateCategory = (req, res, next) => {
  try {
    const validatedData = CategorySchema.parse(req.body); // Validasi berdasarkan skema
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

// Middleware untuk validasi kategori
exports.validateCategory = (req, res, next) => {
  try {
    const validatedData = CategoryPostSchema.parse(req.body);
    req.validatedData = validatedData; // Simpan data yang sudah tervalidasi di req
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

const { z } = require("zod");

const ProductPostSchema = z.object({
  id: z.string().uuid().optional(),
  name: z
    .string()
    .min(1, "Inputan data name produk tidak boleh kosong")
    .max(50, "Name must not exceed 50 characters")
    .regex(/^[a-zA-Z0-9\s]*$/, "Name must only contain letters and numbers"),
  description: z.string().nullable().optional(),
  price: z
    .union([z.string(), z.array(z.string())]) // Menerima string atau array of strings
    .transform((val) => {
      // Jika val adalah array, ambil elemen pertama
      const value = Array.isArray(val) ? val[0] : val;
      const numberValue = Number(value); // Mengonversi string ke number
      if (isNaN(numberValue) || numberValue <= 0) {
        throw new z.ZodError([
          {
            message: "Price must be a valid positive number",
            path: ["price"],
          },
        ]);
      }
      return numberValue; // Mengembalikan nilai yang sudah dikonversi
    }),
  categoryId: z.union([z.number(), z.string()]).transform((val) => {
    const numberValue = typeof val === "string" ? Number(val) : val;
    if (isNaN(numberValue) || numberValue <= 0) {
      throw new z.ZodError([
        {
          message: "Category ID must be a valid positive number",
          path: ["categoryId"],
        },
      ]);
    }
    return numberValue;
  }),
  image: z.string().min(1, "Image file is required"),
  stock: z
    .union([z.number(), z.string()]) // Mengizinkan stock sebagai string atau number
    .transform((val) => {
      const numberValue = typeof val === "string" ? Number(val) : val; // Mengonversi ke number
      if (isNaN(numberValue) || numberValue < 0) {
        // Memastikan nilai tidak negatif
        throw new z.ZodError([
          {
            message: "Stock must be a valid non-negative number",
            path: ["stock"],
          },
        ]);
      }
      return numberValue; // Mengembalikan nilai yang sudah dikonversi
    }),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Middleware untuk validasi produk saat create dan update
exports.validateProduct = (req, res, next) => {
  try {
    // Pastikan req.file ada sebelum validasi
    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }

    // Validasi produk
    const validatedData = ProductPostSchema.parse({
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

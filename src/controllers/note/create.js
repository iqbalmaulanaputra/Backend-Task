const getFormattedTimestamp = () => {
  return new Date().toLocaleString("en-US", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};

const RESPONSE = {
  createSuccess: (data, message) => ({
    success: true,
    code: 201,
    message,
    data,
    pagination: {
      total: data ? data.length : 0,
      per_page: data ? data.length : 0,
      current_page: 1,
      total_pages: 1,
    },
    timestamp: getFormattedTimestamp(),
    errors: null,
  }),

  createError: (code, message, errors = null) => ({
    success: false,
    code,
    message,
    data: null,
    pagination: null,
    timestamp: getFormattedTimestamp(),
    errors,
  }),
};

const validateFields = {
  checkRequired: (data) => {
    const missingFields = Object.entries(data)
      .filter(([, value]) => !value)
      .map(([key]) => key);
    return missingFields.length > 0 ? missingFields : null;
  },

  validateData: (req) => {
    const { title, note } = req.body;
    const requireFields = { title, note };

    const missingFieldsResult = validateFields.checkRequired(requireFields);
    if (missingFieldsResult) {
      return {
        isValid: false,
        err: RESPONSE.createError(400, "Semua field harus diisi!", {
          missingFields: missingFieldsResult,
        }),
      };
    }

    return {
      isValid: true,
      data: requireFields,
    };
  },
};

module.exports = async (req, res) => {
  try {
    const validation = validateFields.validateData(req);
    if (!validation.isValid) {
      return res.status(validation.err.code).json(validation.err);
    }

    const dataToInsert = {
        ...validation.data,
        datetime: new Date() 
      };

      const [rows] = await req.db
      .promise()
      .query("INSERT INTO note SET ?", dataToInsert);

    if (rows.affectedRows > 0) {
      return res
        .status(201)
        .json(RESPONSE.createSuccess(rows, "Catatan berhasil ditambahkan!"));
    } else {
      return res
        .status(404)
        .json(RESPONSE.createError(404, "Catatan gagal ditambahkan!"));
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json(RESPONSE.createError(500, "Terjadi kesalahan pada server", err.message));
  }
};

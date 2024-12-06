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
  updateSuccess: (message) => ({
    success: true,
    code: 201,
    message,
    data: null,
    timestamp: getFormattedTimestamp(),
    errors: null,
  }),

  updateError: (code, message, errors = null) => ({
    success: false,
    code,
    message,
    data: null,
    timestamp: getFormattedTimestamp(),
    errors,
  }),
};

const updateNote = ["title", "note"];

const validateFields = {
  validateUpdateData: async (req) => {
    const data = {};

    updateNote.forEach((field) => {
      if (req.body[field]) {
        data[field] = req.body[field];
      }
    });

    return {
      isValid: true,
      data,
    };
  },
};

const UpdateNote = async (db, noteId, data) => {
  const updatedData = {
    ...data,
    datetime: new Date(getFormattedTimestamp()),
  };
  const [rows] = await db
    .promise()
    .query("UPDATE note SET ? WHERE id = ?", [updatedData, noteId]);
  return rows.affectedRows;
};

module.exports = async (req, res) => {
  try {
    const validation =await validateFields.validateUpdateData(req);

    if (!validation.isValid) {
      return res.status(validation.error.code).json(validation.error);
    }

    const affectedRows = await UpdateNote(
      req.db,
      req.params.id,
      validation.data
    );

    if (affectedRows > 0) {
      return res.status(200).json(RESPONSE.updateSuccess("Note behasil diperbarui!"));
    } else {
      return res
        .status(404)
        .json(RESPONSE.updateError(404, "Note tidak ditemukan"));
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json(RESPONSE.updateError(500, "Terjadi kesalahan pada server"));
  }
};

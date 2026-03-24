const errorHandler = (err, req, res, next) => {
  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: err.errors // Clean mapping from Zod
    });
  }

  // Log other errors for debugging
  console.error(err);

  res.status(500).json({
    success: false,
    message: 'Internal Server Error'
  });
};

module.exports = errorHandler;

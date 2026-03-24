const validate = (schema) => (req, res, next) => {
  try {
    const parsedData = schema.parse(req.body);
    req.body = parsedData;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = validate;

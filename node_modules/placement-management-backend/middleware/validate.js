const { ZodError } = require('zod');

const formatZodIssues = (err) => {
  const issues = err.issues || err.errors || [];
  return issues.map((e) => ({
    path: Array.isArray(e.path) ? e.path.join('.') : String(e.path ?? ''),
    message: e.message,
  }));
};

const validate =
  ({ body, params, query }) =>
  (req, res, next) => {
    try {
      if (body) req.body = body.parse(req.body);
      if (params) req.params = params.parse(req.params);
      if (query) req.query = query.parse(req.query);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = formatZodIssues(err);
        return res.status(400).json({
          message: errors[0]?.message || 'Validation failed',
          errors,
        });
      }
      next(err);
    }
  };

module.exports = validate;

/**
 * Wraps async route handlers to catch errors and pass to global error handler.
 * Eliminates try-catch boilerplate in every controller.
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

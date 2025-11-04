/**
 * 404 Not Found 中间件
 * 处理未匹配到任何路由的请求
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = notFound;
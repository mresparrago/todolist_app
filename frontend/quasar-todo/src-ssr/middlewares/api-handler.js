import { ssrMiddleware } from 'quasar/wrappers';
const { handleRequest } = require('src/server/api');

// more info on params: https://quasar.dev/quasar-cli/developing-ssr/ssr-middlewares
export default ssrMiddleware(({ app }) => {
  app.all(resolve.urlPath('*'), (req, res, next) => {
    if (req.url.substring(0, 4) === '/api') {
      handleRequest({
        app,
        req,
        res,
      });
    } else {
      next();
    }
  });
});

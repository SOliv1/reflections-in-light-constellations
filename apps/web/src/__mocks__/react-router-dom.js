const React = require('react');

const RouterWrapper = ({ children }) => React.createElement('div', null, children);

const mock = {
  Link: ({ children }) => React.createElement('div', null, children),
  BrowserRouter: RouterWrapper,
  Router: RouterWrapper,
};

module.exports = mock;
module.exports.default = mock;
module.exports.__esModule = true;

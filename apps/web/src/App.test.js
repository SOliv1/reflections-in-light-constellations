// 1. Mock FIRST — before imports
jest.mock('react-router-dom', () => ({
  Link: ({ children }) => <div>{children}</div>,
  BrowserRouter: ({ children }) => <div>{children}</div>,
  // expose Router too in case code imports it directly
  Router: ({ children }) => <div>{children}</div>,
  useLocation: () => ({ pathname: '/' }),
  useNavigate: () => () => {},
  useParams: () => ({}),
  Routes: ({ children }) => <div>{children}</div>,
  Route: ({ element }) => <div>{element}</div>,
  Navigate: ({ to }) => <div />,
}));

// 2. Then imports
import { render, screen } from '@testing-library/react';
import App from './App';

// 3. Then your test
test('renders app without crashing', () => {
  render(<App />);
  expect(screen.getByText(/reflections/i)).toBeInTheDocument();
});

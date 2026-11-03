import { useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  const { pathname } = useLocation();
  if (pathname.startsWith('/admin')) return <AppRoutes />;
  return (
    <Layout>
      <AppRoutes />
    </Layout>
  );
}

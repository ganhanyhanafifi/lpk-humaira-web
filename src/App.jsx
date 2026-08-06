import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import GenericPage from './pages/GenericPage';
import Pendaftaran from './pages/Pendaftaran';
import SuksesPendaftaran from './pages/SuksesPendaftaran';
import ScrollToTop from './components/common/ScrollToTop';
import ProtectedRoute from './components/common/ProtectedRoute';

// Quiz System Pages
import QuizModePage from './pages/quiz/QuizModePage';
import DaftarSiswaPage from './pages/quiz/DaftarSiswaPage';
import LoginSiswaPage from './pages/quiz/LoginSiswaPage';
import LoginSenseiPage from './pages/quiz/LoginSenseiPage';
import DashboardSiswaPage from './pages/quiz/DashboardSiswaPage';
import DashboardSenseiPage from './pages/quiz/DashboardSenseiPage';
import KerjakanQuizPage from './pages/quiz/KerjakanQuizPage';
import HasilQuizPage from './pages/quiz/HasilQuizPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="pendaftaran" element={<Pendaftaran />} />
            <Route path="pendaftaran/sukses" element={<SuksesPendaftaran />} />

            {/* Quiz System Routes */}
            <Route path="quiz" element={<QuizModePage />} />
            <Route path="quiz/daftar" element={<DaftarSiswaPage />} />
            <Route path="quiz/login-siswa" element={<LoginSiswaPage />} />
            <Route path="quiz/login-sensei" element={<LoginSenseiPage />} />
            <Route path="quiz/dashboard-siswa" element={
              <ProtectedRoute requiredRole="siswa">
                <DashboardSiswaPage />
              </ProtectedRoute>
            } />
            <Route path="quiz/dashboard-sensei" element={
              <ProtectedRoute requiredRole="sensei">
                <DashboardSenseiPage />
              </ProtectedRoute>
            } />
            <Route path="quiz/kerjakan/:quizId" element={
              <ProtectedRoute requiredRole="siswa">
                <KerjakanQuizPage />
              </ProtectedRoute>
            } />
            <Route path="quiz/hasil/:hasilId" element={
              <ProtectedRoute requiredRole="siswa">
                <HasilQuizPage />
              </ProtectedRoute>
            } />

            {/* Catch-all for generic content pages */}
            <Route path="*" element={<GenericPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

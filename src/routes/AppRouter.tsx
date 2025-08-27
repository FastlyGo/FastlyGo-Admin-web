import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { DashBoardRouter } from './DashBoardRouter';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { AuthRouter } from './AuthRouter';

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rutas públicas (no autenticadas) */}
                <Route path="/auth/*" element={
                    <ProtectedRoute requireAuth={false}>
                        <AuthRouter />
                    </ProtectedRoute>
                } />
                
                {/* Todas las demás rutas son protegidas y van al dashboard */}
                <Route path="/*" element={
                    <ProtectedRoute requireAuth={true}>
                        <DashBoardRouter />
                    </ProtectedRoute>
                } />
            </Routes>
        </BrowserRouter>
    )
}

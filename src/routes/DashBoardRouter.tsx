import { Route, Routes } from 'react-router-dom';
import NavBarHeader from '../components/NavBarHeader';
import { Dashboard } from '../pages/Dashboard';
import { Profile } from '../pages/Profile';
import  FranchiseManagement  from '../pages/FranchiseManagement';
import { SalesReport } from '../pages/SalesReport';
import { Promotions } from '../pages/Promotions';
import { ActivityLog } from '../pages/ActivityLog';
import { SalaryTransfers } from '../pages/SalaryTransfers';
import { UserManagement } from '../pages/UserManagement';
import { NoticesCommunications } from '../pages/NoticesCommunications';
import { SupportReports } from '../pages/SupportReports';

const ErrorPage = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-foreground mb-4">404</h1>
      <p className="text-muted-foreground">Página no encontrada</p>
    </div>
  </div>
);

export const DashBoardRouter = () => {
    return (
        <>
            <NavBarHeader>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/franchise-management" element={<FranchiseManagement />} />
                    <Route path="/sales-report" element={<SalesReport />} />
                    <Route path="/promotions" element={<Promotions />} />
                    <Route path="/activity-log" element={<ActivityLog />} />
                    <Route path="/salary-transfers" element={<SalaryTransfers />} />
                    <Route path="/user-management" element={<UserManagement />} />
                    <Route path="/notices-communications" element={<NoticesCommunications />} />
                    <Route path="/support-reports" element={<SupportReports />} />
                    <Route path='*' element={<ErrorPage />} />
                </Routes>
            </NavBarHeader >
        </>
    )
}

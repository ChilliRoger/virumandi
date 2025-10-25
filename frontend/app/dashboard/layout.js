import { Suspense } from "react";

export const metadata = {
  title: "Dashboard - Virumandi",
  description: "Analyze GitHub repositories with detailed insights",
};

export default function DashboardLayout({ children }) {
  return (
    <Suspense fallback={
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        color: '#999',
        fontSize: '1.2rem'
      }}>
        Loading dashboard...
      </div>
    }>
      {children}
    </Suspense>
  );
}

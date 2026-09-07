import { useState } from 'react';
import type { User, Page } from './types';
import { mockNotifications, mockServiceCenters } from './mockData';

import LoginPage from './pages/LoginPage';
import Sidebar from './components/Sidebar';

import CustomerDashboard from './pages/CustomerDashboard';
import VehiclesPage from './pages/VehiclesPage';
import BookingsPage from './pages/BookingsPage';
import HistoryPage from './pages/HistoryPage';
import AIHealthPage from './pages/AIHealthPage';
import PaymentsPage from './pages/PaymentsPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';

import OwnerDashboard from './pages/OwnerDashboard';
import AnalyticsPage from './pages/AnalyticsPage';

import MechanicDashboard from './pages/MechanicDashboard';

import AdminDashboard from './pages/AdminDashboard';

function PageHeader({ title }: { title: string }) {
  return (
    <div style={{ height: '52px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 32px', background: 'var(--card)', flexShrink: 0 }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 600, color: 'var(--muted-foreground)', letterSpacing: '0.04em' }}>{title}</h2>
    </div>
  );
}

const PAGE_TITLES: Partial<Record<Page, string>> = {
  dashboard: 'Dashboard',
  vehicles: 'My Vehicles',
  bookings: 'Service Booking',
  history: 'Service History',
  'ai-health': 'AI Health Score',
  payments: 'Payments',
  notifications: 'Notifications',
  profile: 'My Profile',
  'service-centers': 'Service Centers',
  mechanics: 'Mechanics',
  analytics: 'Revenue & Analytics',
  users: 'User Management',
  complaints: 'Complaints',
  jobs: 'My Jobs',
  repairs: 'Repair Notes',
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [page, setPage] = useState<Page>('dashboard');

  const unreadNotifCount = user
    ? mockNotifications.filter(n => n.userId === user.id && !n.read).length
    : 0;

  if (!user) return <LoginPage onLogin={(u) => { setUser(u); setPage('dashboard'); }} />;

  function renderPage() {
    if (!user) return null;

    if (user.role === 'customer') {
      switch (page) {
        case 'dashboard': return <CustomerDashboard user={user} onPageChange={setPage} />;
        case 'vehicles': return <VehiclesPage user={user} />;
        case 'bookings': return <BookingsPage user={user} />;
        case 'history': return <HistoryPage user={user} />;
        case 'ai-health': return <AIHealthPage user={user} />;
        case 'payments': return <PaymentsPage user={user} />;
        case 'notifications': return <NotificationsPage user={user} />;
        case 'profile': return <ProfilePage user={user} />;
        default: return <CustomerDashboard user={user} onPageChange={setPage} />;
      }
    }

    if (user.role === 'owner') {
      switch (page) {
        case 'dashboard': return <OwnerDashboard user={user} onPageChange={setPage} />;
        case 'bookings': return <HistoryPage user={user} />;
        case 'analytics': return <AnalyticsPage user={user} />;
        case 'payments': return <PaymentsPage user={user} />;
        case 'notifications': return <NotificationsPage user={user} />;
        case 'profile': return <ProfilePage user={user} />;
        case 'service-centers':
          return (
            <div style={{ padding: '28px 32px', maxWidth: '900px' }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '20px' }}>My Service Centers</h1>
              <ServiceCentersPanel />
            </div>
          );
        default: return <OwnerDashboard user={user} onPageChange={setPage} />;
      }
    }

    if (user.role === 'mechanic') {
      switch (page) {
        case 'dashboard': return <MechanicDashboard user={user} />;
        case 'jobs': return <MechanicDashboard user={user} />;
        case 'history': return <HistoryPage user={user} />;
        case 'notifications': return <NotificationsPage user={user} />;
        case 'profile': return <ProfilePage user={user} />;
        default: return <MechanicDashboard user={user} />;
      }
    }

    if (user.role === 'admin') {
      switch (page) {
        case 'dashboard': return <AdminDashboard user={user} onPageChange={setPage} />;
        case 'users': return <AdminDashboard user={user} onPageChange={setPage} />;
        case 'service-centers': return <AdminDashboard user={user} onPageChange={setPage} />;
        case 'complaints': return <AdminDashboard user={user} onPageChange={setPage} />;
        case 'analytics': return <AnalyticsPage user={user} />;
        case 'payments': return <PaymentsPage user={user} />;
        case 'notifications': return <NotificationsPage user={user} />;
        case 'profile': return <ProfilePage user={user} />;
        default: return <AdminDashboard user={user} onPageChange={setPage} />;
      }
    }

    return null;
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--background)', overflow: 'hidden' }}>
      <Sidebar
        role={user.role}
        currentPage={page}
        onPageChange={setPage}
        userName={user.name}
        userAvatar={user.avatar ?? user.name.slice(0, 2).toUpperCase()}
        onLogout={() => { setUser(null); setPage('dashboard'); }}
        notificationCount={unreadNotifCount}
      />
      <main style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <PageHeader title={PAGE_TITLES[page] ?? 'VehicleCare Pro'} />
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

function ServiceCentersPanel() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {mockServiceCenters.map((sc) => (
        <div key={sc.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px', display: 'flex', gap: '14px', alignItems: 'center' }}>
          <div style={{ width: '80px', height: '60px', borderRadius: '8px', overflow: 'hidden', background: 'var(--muted)', flexShrink: 0 }}>
            <img src={sc.image} alt={sc.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600, color: 'var(--foreground)' }}>{sc.name}</div>
            <div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>{sc.address}, {sc.city}</div>
            <div style={{ fontSize: '12px', color: '#f59e0b', marginTop: '2px' }}>★ {sc.rating} ({sc.totalReviews} reviews)</div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{ padding: '7px 14px', background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Edit</button>
            <button style={{ padding: '7px 14px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>View Bookings</button>
          </div>
        </div>
      ))}
    </div>
  );
}

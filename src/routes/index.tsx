import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { useDrawerContext } from '../shared/contexts';
import {
  Dashboard,
  DetailedCustomer,
  CustomersList,
  DetailedBook,
  BooksList,
  TrackingList,
  DetailedTracking
} from '../pages';

export const AppRoutes = () => {
  const { setDrawerOptions } = useDrawerContext();

  useEffect(() => {
    setDrawerOptions([
      {
        icon: 'home',
        path: '/home',
        label: 'Home',
      },
      {
        icon: 'library_books',
        path: '/books',
        label: 'Books',
      },
      {
        icon: 'people',
        path: '/customers',
        label: 'Customers',
      },
      {
        icon: 'analytics',
        path: '/reports',
        label: 'Reports',
      },
    ]);
  }, []);

  return (
    <Routes>
      <Route path="/home" element={<Dashboard />} />

      <Route path="/customers" element={<CustomersList />} />
      <Route path="/customers/:id" element={<DetailedCustomer />} />

      <Route path="/books" element={<BooksList />} />
      <Route path="/books/:id" element={<DetailedBook />} />

      <Route path="/books/:bookId/tracking" element={<TrackingList />} />
      <Route path="/books/:bookId/tracking/:id" element={<DetailedTracking />} />

      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  );
};

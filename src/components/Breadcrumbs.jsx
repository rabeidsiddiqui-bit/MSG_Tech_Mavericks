import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import marketsData from '../data/markets.json';

export default function Breadcrumbs() {
  const location = useLocation();
  const path = location.pathname;

 
  if (path === '/' || path === '') {
    return null;
  }

  const getBreadcrumbs = () => {
    const crumbs = [{ label: 'Home', path: '/' }];

    if (path.startsWith('/market/')) {
      const marketId = path.replace('/market/', '');
      const market = marketsData.find((m) => m.id === marketId || m.slug === marketId);
      crumbs.push({ label: 'Market Directory', path: '/directory' });
      crumbs.push({
        label: market ? market.name : 'Market Details',
        path,
        isCurrent: true
      });
    } else if (path === '/find-market') {
      crumbs.push({ label: 'Find Market', path: '/find-market', isCurrent: true });
    } else if (path === '/directory') {
      crumbs.push({ label: 'Market Directory', path: '/directory', isCurrent: true });
    } else if (path === '/produce') {
      crumbs.push({ label: 'Product Guide', path: '/produce', isCurrent: true });
    } else if (path === '/seasonal-recommendations') {
      crumbs.push({ label: 'Seasonal Recommendations', path: '/seasonal-recommendations', isCurrent: true });
    } else if (path === '/bookmarks') {
      crumbs.push({ label: 'Bookmarks', path: '/bookmarks', isCurrent: true });
    } else if (path === '/about') {
      crumbs.push({ label: 'About Us', path: '/about', isCurrent: true });
    } else if (path === '/contact') {
      crumbs.push({ label: 'Contact Us', path: '/contact', isCurrent: true });
    } else {
      crumbs.push({ label: 'Page', path, isCurrent: true });
    }

    return crumbs;
  };

  const crumbs = getBreadcrumbs();

  return (
    <nav
      aria-label="Breadcrumb"
      className="bg-[#f6f2e8] border-b border-[#e7e1d5] py-2.5 px-4 sm:px-6 lg:px-8 text-xs text-[#526357]"
    >
      <div className="max-w-7xl mx-auto flex items-center flex-wrap gap-1.5">
        {crumbs.map((crumb, idx) => (
          <React.Fragment key={crumb.path + idx}>
            {idx > 0 && (
              <ChevronRight className="w-3.5 h-3.5 text-[#98a89c] shrink-0" />
            )}
            {crumb.isCurrent ? (
              <span className="font-semibold text-[#153e25] truncate max-w-xs sm:max-w-md">
                {crumb.label}
              </span>
            ) : (
              <Link
                to={crumb.path}
                className="hover:text-[#153e25] transition-colors flex items-center gap-1 hover:underline cursor-pointer"
              >
                {idx === 0 && <Home className="w-3 h-3 text-[#236338]" />}
                <span>{crumb.label}</span>
              </Link>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
}

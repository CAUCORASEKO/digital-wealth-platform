//import { Typography } from '@e-burgos/tucu-ui';

// apps/web/src/components/layout/AppSidebar.tsx

import { NavLink } from 'react-router-dom';
import { useRouterConfig } from '../../router/RouterConfig';

export function AppSidebar() {
  const routes = useRouterConfig();

  return (
    <aside className="w-64 border-r border-[#1f2630] bg-[#0b0f14] px-6 py-8">
      {/* ============================================
         APP NAME (TEXT ONLY – BANK STYLE)
         ============================================ */}
      <div className="mb-10">
        <div className="text-sm font-semibold tracking-wide text-[#e6ebf2]">
          Digital Banking
        </div>
        <div className="text-xs text-[#8a94a6]">
          Private Wealth
        </div>
      </div>

      {/* ============================================
         NAVIGATION
         ============================================ */}
      <nav className="space-y-1">
        {routes.map((route) => (
          <NavLink
            key={route.href}
            to={route.href}
            className={({ isActive }) =>
              [
                'flex items-center rounded-md px-3 py-2 text-sm transition',
                isActive
                  ? 'bg-[#141a22] text-[#e6ebf2]'
                  : 'text-[#8a94a6] hover:bg-[#141a22] hover:text-[#e6ebf2]',
              ].join(' ')
            }
          >
            <span className="mr-3 opacity-80">
              {route.icon}
            </span>
            {route.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
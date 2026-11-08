
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Activity, Menu, X, LogOut, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Navbar({ userName }: { userName?: string }) {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  const path = usePathname();
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('advstat-theme');
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;

    const initialDark = saved
      ? saved === 'dark'
      : prefersDark;

    document.documentElement.dataset.theme =
      initialDark ? 'dark' : 'light';

    setDark(initialDark);
    setMounted(true);
  }, []);

  function toggleTheme() {
    const next = !dark;

    setDark(next);

    document.documentElement.dataset.theme =
      next ? 'dark' : 'light';

    localStorage.setItem(
      'advstat-theme',
      next ? 'dark' : 'light'
    );
  }

  const links = [
    { href: '/', label: 'Home' },
    { href: '/regression', label: 'Regression' },
    { href: '/hypothesis', label: 'Hypothesis Testing' },
    { href: '/about', label: 'About' },
  ];

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  }

  return (
    <header className="navbar">
      <Link href="/" className="brand">
        <span className="brand-icon">
          <Activity size={21} />
        </span>

        <span>
          ADVSTAT<span className="brand-dot">.</span>
          <small>STATISTICAL TOOLKIT</small>
        </span>
      </Link>

      <button
        className="mobile-toggle"
        onClick={() => setOpen(!open)}
        aria-label="Toggle navigation"
      >
        {open ? <X /> : <Menu />}
      </button>

      <nav className={open ? 'nav-links open' : 'nav-links'}>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className={
              path === link.href
                ? 'nav-link active'
                : 'nav-link'
            }
          >
            {link.label}
          </Link>
        ))}

        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={
            dark ? 'Switch to light mode' : 'Switch to dark mode'
          }
          title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {mounted && (dark ? <Sun size={17} /> : <Moon size={17} />)}
          <span>
            {mounted ? (dark ? 'Light Mode' : 'Dark Mode') : 'Theme'}
          </span>
        </button>

        {userName ? (
          <>
            <Link className="nav-user" href="/dashboard">
              Hi, {userName.split(' ')[0]}
            </Link>

            <button className="nav-logout" onClick={logout}>
              <LogOut size={15} />
              Log out
            </button>
          </>
        ) : (
          <>
            <Link className="nav-link" href="/login">
              Log in
            </Link>

            <Link className="nav-cta" href="/register">
              Get started <span>↗</span>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

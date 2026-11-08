import type { Metadata } from 'next';
import './globals.css';
import AppShell from '@/components/layout/AppShell';
export const metadata: Metadata = { title: 'ADVSTAT | Statistical Toolkit', description: 'Simple linear regression and Z-test hypothesis testing for your Advanced Statistics project.' };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><AppShell>{children}</AppShell></body></html>}

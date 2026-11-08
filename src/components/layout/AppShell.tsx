import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
import { getSession } from '@/lib/session';
export default async function AppShell({children}:{children:React.ReactNode}){const user=await getSession();return <><Navbar userName={user?.name}/><main className="main-shell">{children}</main><Footer/></>}

import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/sidebar/Sidebar'
import TopBar from '@/components/topbar/TopBar'

const Layout = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 ml-64">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout
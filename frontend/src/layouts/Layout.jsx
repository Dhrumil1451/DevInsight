import Navbar from '../components/Navbar';

/**
 * Layout — wraps all pages with Navbar + content area.
 */
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-surface transition-colors duration-300">
      <Navbar />

      {/* Page content */}
      <main className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-surface-border mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            © {new Date().getFullYear()} DevInsight — GitHub Analytics Platform
          </p>
          
        </div>
      </footer>
    </div>
  );
};

export default Layout;

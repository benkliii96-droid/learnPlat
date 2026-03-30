import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-gray-900">
                CodeLearn
              </Link>
              <nav className="ml-10 flex space-x-4">
                <Link to="/courses" className="text-gray-600 hover:text-gray-900">
                  Курсы
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="text-gray-600 hover:text-gray-900">
                    Админ-панель
                  </Link>
                )}
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link to="/profile" className="text-gray-600 hover:text-gray-900">
                    {user.name}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Выйти
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-600 hover:text-gray-900">
                    Вход
                  </Link>
                  <Link
                    to="/register"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Регистрация
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}

import { useNavigate, useLocation } from 'react-router-dom';
import { getCurrentDate } from '../lib/utils';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname.replace('/', '');

  const getTitle = () => {
    switch (currentPath) {
      case 'login':
        return 'Staff Login (Admin / Surgical Team)';
      case 'status':
        return 'Patient Status';
      case 'admin':
        return 'Patient Information';
      case 'surgery':
        return 'Patient Status Update';
      default:
        return '';
    }
  };

  return (
    <div className="flex items-center justify-between mt-10 h-16">
      {/* Home icon on the left */}
      {currentPath !== '' &&
        <div
          className="flex items-center justify-center gap-2 cursor-pointer font-bold"
          onClick={() => navigate('/')}
        >
          <img src="/home.png" className="size-12 ml-4" />
          <span>HOME</span>
        </div>
      }
      <div className="font-bold text-2xl">{getTitle()}</div>
      <div>{getCurrentDate()}</div>
    </div>
  );
};

export default Header;

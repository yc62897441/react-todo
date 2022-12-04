import { useAuth } from 'contexts/authContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { isAuthenticated } = useAuth;
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/todos');
    } else {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
};

export default HomePage;

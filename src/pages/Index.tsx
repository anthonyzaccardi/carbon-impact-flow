
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  
  // Redirect to the main dashboard
  useEffect(() => {
    navigate('/');
  }, [navigate]);
  
  return null;
};

export default Index;

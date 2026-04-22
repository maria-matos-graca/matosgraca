import { useState, useEffect } from 'react';

const MobileWarning = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('mobileWarningDismissed', 'true');
  };

  useEffect(() => {
    const saved = localStorage.getItem('mobileWarningDismissed');
    if (saved === 'true') {
      setDismissed(true);
    }
  }, []);

  if (!isMobile || dismissed) return null;

  return (
    <div className="mobile-warning" style={{
      backgroundColor: '#ff9800',
      color: '#fff',
      padding: '10px 20px',
      textAlign: 'center',
      position: 'sticky',
      top: '0',
      zIndex: '1000',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '15px',
      flexWrap: 'wrap'
    }}>
      <span style={{ flex: 1, textAlign: 'center' }}>
        Best viewed on your desktop or latop computer
      </span>
      <button 
        onClick={handleDismiss}
        style={{
          backgroundColor: '#fff',
          border: 'none',
          padding: '5px 15px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold',
          color: '#ff9800'
        }}
      >
        OK
      </button>
    </div>
  );
};

export default MobileWarning;
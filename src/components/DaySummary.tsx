import { formatMoney } from '../utils/money';
import type { Transaction } from '../utils/money';

interface DaySummaryProps {
  totalEarnings: number;
  transactions: Transaction[];
  onRestart: () => void;
}

const DaySummary = ({ totalEarnings, transactions, onRestart }: DaySummaryProps) => {
  const customersServed = transactions.length;
  const averageScore = transactions.length > 0 
    ? Math.round(transactions.reduce((sum, t) => sum + t.score, 0) / transactions.length)
    : 0;
  const totalTips = transactions.reduce((sum, t) => sum + t.tip, 0);
  const perfectOrders = transactions.filter(t => t.score === 100).length;

  const getPerformanceMessage = () => {
    if (averageScore >= 90) return "✰ ✰ ✰ ✰ ✰ ";
    if (averageScore >= 80) return "✰ ✰ ✰ ✰ ";
    if (averageScore >= 70) return "✰ ✰ ✰  ";
    if (averageScore >= 60) return "✰ ✰ ";
    return "✰";
  };

  const getPerformanceColor = () => {
    if (averageScore >= 90) return "#c16767ff";
    if (averageScore >= 75) return "#4c8cafff";
    if (averageScore >= 60) return "#a268d5ff";
    return "#82b59aff";
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      animation: 'fadeIn 0.5s ease-out'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        border: '4px solid #4cafa7ff',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '500px',
        width: '90%',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        animation: 'slideIn 0.5s ease-out'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '30px',
          paddingBottom: '20px',
          borderBottom: '3px dashed #4c95afff'
        }}>
          <h1 style={{
            margin: '0 0 10px 0',
            fontSize: '36px',
            color: '#2e7d32',
            fontFamily: 'Georgia, serif'
          }}>
            Day Complete! ⋆⁺₊⋆ ☀︎ ⋆⁺₊⋆
          </h1>
          <p style={{
            margin: 0,
            fontSize: '18px',
            color: '#666',
            fontStyle: 'italic'
          }}>
            Time to close up the café ◡̈
          </p>
        </div>

        {/* Performance Badge */}
        <div style={{
          backgroundColor: getPerformanceColor(),
          padding: '20px',
          borderRadius: '15px',
          marginBottom: '25px',
          textAlign: 'center',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
        }}>
          <p style={{
            margin: 0,
            fontSize: '28px',
            fontWeight: 'bold',
            color: 'white',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            {getPerformanceMessage()}
          </p>
        </div>

        {/* Stats */}
        <div style={{
          backgroundColor: '#f5f5f5',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '25px'
        }}>
          {/* Total Earnings */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px',
            padding: '12px',
            backgroundColor: '#fff9e6',
            borderRadius: '8px',
            border: '2px solid #f4c430'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '28px' }}>💰</span>
              <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#8b7355' }}>
                Total Earnings
              </span>
            </div>
            <span style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#2d5016',
              fontFamily: 'Georgia, serif'
            }}>
              {formatMoney(totalEarnings)}
            </span>
          </div>

          {/* Other Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px' }}>
              <span style={{ fontSize: '14px', color: '#666' }}> Customers Served</span>
              <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#2e7d32' }}>
                {customersServed}
              </span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px' }}>
              <span style={{ fontSize: '14px', color: '#666' }}> Average Score</span>
              <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#2e7d32' }}>
                {averageScore}%
              </span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px' }}>
              <span style={{ fontSize: '14px', color: '#666' }}> Perfect Orders</span>
              <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#2e7d32' }}>
                {perfectOrders}
              </span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px' }}>
              <span style={{ fontSize: '14px', color: '#666' }}> Tips Earned</span>
              <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#2e7d32' }}>
                {formatMoney(totalTips)}
              </span>
            </div>
          </div>
        </div>

        {/* Restart Button */}
        <button
          onClick={onRestart}
          style={{
            width: '100%',
            padding: '18px',
            fontSize: '20px',
            fontWeight: 'bold',
            backgroundColor: '#026902ff',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            transition: 'all 0.3s',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#4c9550ff';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#325933ff';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          Start New Day ☼
        </button>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideIn {
          from {
            transform: translateY(-50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default DaySummary;
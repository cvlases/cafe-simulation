interface ScorecardProps {
  score: number;
  customerName: string;
  earnings: {
    amount: number;
    tip: number;
    refunded: boolean;
  };
  onContinue: () => void;
}

const Scorecard = ({ score, customerName, earnings, onContinue }: ScorecardProps) => {
  const getReaction = (score: number) => {
    if (score >= 90) return "😍 Amazing! This is perfect!";
    if (score >= 75) return "😊 Pretty good, thanks!";
    if (score >= 60) return "😐 It's... okay I guess.";
    if (score >= 40) return "😕 This isn't quite right...";
    return "😡 This is terrible!";
  };

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'black',
      padding: '40px',
      borderRadius: '15px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      textAlign: 'center',
      zIndex: 1000
    }}>
      <h2>{customerName}'s Review</h2>
      
      <div style={{ fontSize: '48px', margin: '20px 0' }}>
        {score}%
      </div>
      
      <p style={{ fontSize: '20px', margin: '20px 0' }}>
        {getReaction(score)}
      </p>
      
      <div style={{
        margin: '20px 0',
        padding: '15px',
        backgroundColor: '#363434ff',
        borderRadius: '10px'
      }}>
        {earnings.refunded ? (
          <p style={{ fontSize: '18px', fontWeight: 'bold', color: 'red' }}>
            Refunded: -${earnings.amount.toFixed(2)}
          </p>
        ) : (
          <>
            <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
              Payment: ${earnings.amount.toFixed(2)}
            </p>
            <p style={{ fontSize: '18px', fontWeight: 'bold', color: 'green' }}>
              Tip: ${earnings.tip.toFixed(2)}
            </p>
            <p style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '10px' }}>
              Total: ${(earnings.amount + earnings.tip).toFixed(2)}
            </p>
          </>
        )}
      </div>
      
      <button 
        onClick={onContinue}
        style={{
          padding: '15px 30px',
          fontSize: '18px',
          backgroundColor: '#4c77afff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Next Customer
      </button>
    </div>
  );
};

export default Scorecard;
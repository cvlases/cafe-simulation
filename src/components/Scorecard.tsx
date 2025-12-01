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
    if (score >= 90) return "Thank you, this is perfect! ٩(ˊᗜˋ*)و ♡ ";
    if (score >= 75) return "Pretty good, thanks!  ˙ᵕ˙";
    if (score >= 60) return "um you call urself a barista????? (⊙ _ ⊙ ) ";
    if (score >= 40) return "Yuck i hate it 𓉸";
    return " ABSOLUTELY NOT (𓌻‸𓌻) ᴜɢʜ. ";
  };

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#449086ff',
      padding: '20px',
      borderRadius: '15px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      textAlign: 'center',
      zIndex: 1000
    }}>
      <h2>{customerName}'s Review</h2>
      
      <div style={{ fontSize: '18px', margin: '10px 0' }}>
        {score}%
      </div>
      
      <p style={{ fontSize: '20px', margin: '20px 0' }}>
        {getReaction(score)}
      </p>
      
      <div style={{
        margin: '20px 0',
        padding: '15px',
        backgroundColor: '#82f7ffff',
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
          backgroundColor: '#21696cff',
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
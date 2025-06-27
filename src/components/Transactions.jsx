import "../App.css";

function Transactions({ transactionDetails }) {
  return (
    <>
      <div id="transactions">
        <h3>Transactions</h3>
        {transactionDetails.map((t) => (
          <div className="transaction">
            <p>{t.title}</p>
            <p>{t.amount}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default Transactions;

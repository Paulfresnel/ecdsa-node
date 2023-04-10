import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useEffect, useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [isSigned, setIsSigned] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const balances = [
  "04222ea46e71c339dde22e1165cd1833ffbe7a079a5cc591115e1f68a2d281ab4146ec612897945b93e77e2da0b69f84ac0d4067f730856d04554bf6d5baa2437a",
  "042eaf8ed8d03c0c3beefb4bc1ae0151d8bc5af17807073927ff5ba6117f805fab4254bbaf4e6f02d354311009d24a4ac7643119f728e24f2b2eb25d3f8518ed81",
  "049ecaed38d00a0cd4641fec01bfc9af8f98cc5c53c2c9187a1e8c54d7598e0fa5d163912d969fc762636a22ee35f849fb706670b9f71854a1524babaef082fe53",
]

  useEffect(()=>{
    setIsSigned(false);
  },[address])

  return (
    <header>
    <container className="header">
    <h1>Experimental Purpose App</h1>
    <p>For testing purposes please use one of the following Public Addresses to transfer funds to one another</p>
    <ul>
      <li>{`0x${balances[0].slice(-20)}`}</li>
      <li>{`0x${balances[1].slice(-20)}`}</li>
      <li>{`0x${balances[2].slice(-20)}`}</li>
    </ul>
    <div className="app">
    
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
      />
      <Transfer transactions={transactions} setTransactions={setTransactions} isSigned={isSigned} setIsSigned={setIsSigned} setBalance={setBalance} address={address} />
    </div>
    </container>
    {transactions.length !==0 && <div className="centered">
      <h2>Recent transactions:</h2>
     <table>
      <thead>
        <tr>
          <td>From:</td>
          <td>To:</td>
          <td>Amount:</td>
        </tr>
      </thead>
      <tbody>
        {transactions.map((transaction,index)=>{
          return <tr key={index}>
            <td>{transaction.sender}</td>
            <td>{transaction.recipient}</td>
            <td>{transaction.amount}</td>
          </tr>
        })}
      </tbody>
    </table>
    </div>}
    </header>
  );
}

export default App;

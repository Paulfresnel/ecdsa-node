import { useState } from "react";
import server from "./server";

function Wallet({ address, setAddress, balance, setBalance }) {


  async function onChange(evt) {
    let inputedAddress = evt.target.value;
    
    if (inputedAddress) {
      const {
        data: { balance },
      } = await server.get(`balance/${inputedAddress}`);
      setBalance(balance);
      setAddress(inputedAddress);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Your Public Address
        <input placeholder="Type an address, for example: 0x6d04554bf6d5baa2437a" onChange={onChange}></input>
      </label>
      <div>
        ETH Address: {`0x${address.slice(-20)}`}
      </div>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;

import { useState } from "react";
import server from "./server";


function Transfer({ address, setBalance, isSigned, setIsSigned }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");


  const setValue = (setter) => (evt) => setter(evt.target.value);

  const setApproval = async (e) =>{
    e.preventDefault();
    let data = {address, recipient, amount: parseInt(sendAmount)};
    try{
      const isSigned = await server.post('approve', data);
      const signedState = isSigned.data.isSigned;
      setIsSigned(signedState);
    } catch(err){
      console.log(err);
    }
  }

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        isSigned
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" >
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x6d04554bf6d5baa2437a"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>
      
      {isSigned ? <input type="submit" onClick={transfer} className="button" value="Transfer" /> : 
                  <button onClick={(e)=>setApproval(e)}>Set Approval</button>
      }
    </form>
  );
}

export default Transfer;

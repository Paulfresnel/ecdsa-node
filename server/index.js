const express = require("express");
const app = express();
const cors = require("cors");
const secp = require("ethereum-cryptography/secp256k1");
const {sha256} = require("ethereum-cryptography/sha256");
const {utf8ToBytes} = require("ethereum-cryptography/utils");
const { toHex } = require("ethereum-cryptography/utils");



const port = 3042;


app.use(cors());
app.use(express.json());

const balances = {
  "0x1": 100,
  "0x2": 50,
  "0x3": 75,
};

const privateKey0 = secp.utils.randomPrivateKey();
const privateKey1 = secp.utils.randomPrivateKey();
const privateKey2 = secp.utils.randomPrivateKey();

console.log(privateKey1);

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", async (req, res) => {
  const { sender, recipient, amount } = req.body;
  let privateKey;


  if (sender.includes('0')){
    privateKey = privateKey0;
  }
  else if (sender.includes('1')){
    privateKey = privateKey1;
  }
  else {
    privateKey = privateKey2;
  }

  let data = {sender, recipient, amount};
  setInitialBalance(sender);
  setInitialBalance(recipient);
  
  let messagedHashed = hashMessage(data);
  


  const publicKey = secp.getPublicKey(privateKey);
  console.log("publicKey:", publicKey);
  const signature = await secp.signSync(messagedHashed, privateKey);
  console.log("signature:", signature);

  const isSigned = secp.verify(signature, messagedHashed, publicKey);
  console.log("verified?:", isSigned);

  if(!isSigned){
    res.status(400).send({ message: "Not authorized!" });
  }
  else if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } 
  else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

function hashMessage(data){
  let dataStringified = data.toString();
  let dataToBytes = utf8ToBytes(dataStringified);
  let dataHashed = sha256(dataToBytes);
  return dataHashed;  
}

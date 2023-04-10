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
  "04222ea46e71c339dde22e1165cd1833ffbe7a079a5cc591115e1f68a2d281ab4146ec612897945b93e77e2da0b69f84ac0d4067f730856d04554bf6d5baa2437a": 100,
  "042eaf8ed8d03c0c3beefb4bc1ae0151d8bc5af17807073927ff5ba6117f805fab4254bbaf4e6f02d354311009d24a4ac7643119f728e24f2b2eb25d3f8518ed81": 50,
  "049ecaed38d00a0cd4641fec01bfc9af8f98cc5c53c2c9187a1e8c54d7598e0fa5d163912d969fc762636a22ee35f849fb706670b9f71854a1524babaef082fe53": 75,
};

const privateKeys = [
  "8ef2f5ff23cc24f7272e59c5b65243bda8cbb695d7256e229f56d3ca84914868",
  "93d10ba23d04597c1eb22b154ee70a7d640fc0b62fb09a4ee2ef1d7626d306cc",
  "94468d60439d7581ff30131f96cabefbab80742656203b07c6d3525871335686"
]


app.get("/balance/:address", (req, res) => {
  let { address } = req.params;
  for (const balance in balances){
    if (address.length>=20 && balance.includes(address.slice(2))){
      address = balance
    }
  }

  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", async (req, res) => {
  let { sender, recipient, amount, isSigned } = req.body;
  setInitialBalance(sender);
  setInitialBalance(recipient); 
  let addressIndex;

  const addresesArray = Object.keys(balances);

    addresesArray.filter(address => {
      if (recipient.length>=20  && address.includes(sender.slice(2))){
        sender = address;
      }
      if (recipient.length>=20 && address.includes(recipient.slice(2))){
        recipient = address;
      }
    });


  
  if(!isSigned){
    res.status(400).send({ message: "Not authorized!" });
  }
  else if(recipient.length < 20){
    res.status(400).send({ message: "Please input a valid recipient Address" });
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

app.post('/approve', async (req,res)=>{
  let data = req.body;
  try{
    let sender = "";
    let addressIndex = 0;
    const dataStringified = data.toString();
    const dataToBytes = utf8ToBytes(dataStringified);
    const dataHashed = sha256(dataToBytes);
    const dataHexed = toHex(dataHashed);
    const addresesArray = Object.keys(balances);

    addresesArray.filter((address,index) => {
      if (address.includes(data.address.slice(2))){
        addressIndex = index;
        sender = address;
        return sender, addressIndex;
      }
    });

    const privateKey = privateKeys[addressIndex];
    const signature = await secp.signSync(dataHexed, privateKey);
    const isSigned = await secp.verify(signature, dataHexed, sender);
    res.json({isSigned: isSigned});
  } catch(err){
    console.log(err)
  }
})

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

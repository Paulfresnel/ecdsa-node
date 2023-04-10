const secp = require("ethereum-cryptography/secp256k1");
const {sha256} = require("ethereum-cryptography/sha256");
const {utf8ToBytes} = require("ethereum-cryptography/utils");
const { toHex } = require("ethereum-cryptography/utils");

const privateKey = secp.utils.randomPrivateKey();
console.log("private Key:", toHex(privateKey));

const message = "random text";
const messageToBytes = utf8ToBytes(message);
const messageHash = sha256(messageToBytes);

const publicKey = toHex(secp.getPublicKey(privateKey));
const publicKeyETH = `0x${publicKey}`;

console.log("public Key:", `0x${publicKey}`);
console.log(publicKeyETH.slice(2));

const signature = secp.signSync(messageHash, privateKey);
console.log("signature:", signature);

const isSigned = secp.verify(signature, messageHash, publicKey)
console.log("is Signed?:", isSigned)


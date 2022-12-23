const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(process.env.URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
  const bin = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.bin", "utf8");
  const contractFactory = new ethers.ContractFactory(abi, bin, wallet);
  console.log("Depploying-----");
  const contract = await contractFactory.deploy();
  await contract.deployTransaction.wait(1);
  console.log("contract address: " + contract.address);
  //transaction receipt is given only when you wait for the block confirmation
  // otherwise you get response
  //send Transaction function first signs then sends.
  const currentfav = await contract.retrieve();
  console.log("current fav is: " + currentfav);
  const transactionresponse = await contract.store("7");
  const transactionreceipt = await transactionresponse.wait(1);
  const updatednum = await contract.retrieve();
  console.log("updated fav is: " + updatednum);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

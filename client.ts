const { Provider, clusterApiUrl, web3 } = require('@project-serum/anchor');
const { Borsh } = require('@project-serum/borsh');
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

class CertificateRecord {
  constructor(properties) {
    this.certificate_issued_to = properties.certificate_issued_to;
    this.certificate_issued_by = properties.certificate_issued_by;
    this.certificate_type = properties.certificate_type;
    this.certificate_filehash = properties.certificate_filehash;
    this.timestamp = properties.timestamp;
  }
}

const CertificateRecordSchema = new Borsh.Schema([
  ["certificate_issued_to", "string"],
  ["certificate_issued_by", "string"],
  ["certificate_type", "string"],
  ["certificate_filehash", "string"],
  ["timestamp", "u64"],
]);

function initializeSignerKeypair() {
  if (!process.env.PRIVATE_KEY) {
    console.log("Creating .env file");
    const signer = web3.Keypair.generate();
    fs.writeFileSync(".env", "PRIVATE_KEY=" + signer.secretKey.toString());
    return signer;
  }

  const secret = JSON.parse(process.env.PRIVATE_KEY);
  const secretKey = Uint8Array.from(secret.data);
  const keypairFromSecretKey = web3.Keypair.fromSecretKey(secretKey);
  return keypairFromSecretKey;
}

async function airdropSolIfNeeded(signer, connection) {
  const balance = await connection.getBalance(signer.publicKey);
  console.log("Current balance is", balance / web3.LAMPORTS_PER_SOL);
  if (balance < web3.LAMPORTS_PER_SOL) {
    console.log("Airdropping 1 SOL...");
    await connection.requestAirdrop(signer.publicKey, web3.LAMPORTS_PER_SOL);
    console.log("Airdrop successful");
  }
}

async function sendCertificateRecord(signer, programId, connection) {
  const certificateRecord = new CertificateRecord({
    certificate_issued_to: "Recipient Name",
    certificate_issued_by: "Issuer Name",
    certificate_type: "Certificate Type",
    certificate_filehash: "File Hash",
    timestamp: Date.now(),
  });

  const instructionData = Borsh.serialize(CertificateRecordSchema, certificateRecord);

  const transaction = new web3.Transaction().add(
    web3.SystemProgram.createAccount({
      fromPubkey: signer.publicKey,
      newAccountPubkey: web3.PublicKey.default,
      lamports: 1000000,
      space: CertificateRecordSchema.span,
      programId,
    }),
    new web3.TransactionInstruction({
      keys: [
        { pubkey: signer.publicKey, isSigner: true, isWritable: false },
        { pubkey: web3.PublicKey.default, isSigner: false, isWritable: true },
      ],
      programId,
      data: instructionData,
    })
  );

  const signature = await web3.sendAndConfirmTransaction(connection, transaction, [signer]);
  console.log("Transaction successful with signature:", signature);
}

async function main() {
  const provider = new Provider(
    clusterApiUrl("devnet"), // Or use 'testnet' or 'mainnet-beta' basis your network
    {
      wallet: initializeSignerKeypair(),
      // Remove this line if you don't want to use a provider wallet
    }
  );

  const connection = provider.connection;
  const wallet = provider.wallet;

  await airdropSolIfNeeded(wallet, connection);

  const programId = new web3.PublicKey("Your_Program_ID");
  // Replace 'Your_Program_ID' with the actual program ID of your deployed smart contract

  await sendCertificateRecord(wallet, programId, connection);
}

main()
  .then(() => {
    console.log("Finished successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

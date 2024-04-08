const { Provider, clusterApiUrl, web3 } = require('@project-serum/anchor');
const { BorshSchema } = require('@project-serum/borsh');
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

const CertificateRecordSchema = new BorshSchema([
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
    fs.writeFileSync(".env", "PRIVATE_KEY=[" + signer.secretKey.toString() + "]");
    return signer;
  }

  const secret = JSON.parse(process.env.PRIVATE_KEY || "");
  const secretKey = Uint8Array.from(secret);
  const keypairFromSecretKey = web3.Keypair.fromSecretKey(secretKey);
  return keypairFromSecretKey;
}

function airdropSolIfNeeded(signer, connection) {
  return connection.getBalance(signer.publicKey).then((balance) => {
    console.log("Current balance is", balance / web3.LAMPORTS_PER_SOL);
    if (balance < web3.LAMPORTS_PER_SOL) {
      console.log("Airdropping 1 SOL...");
      return connection.requestAirdrop(signer.publicKey, web3.LAMPORTS_PER_SOL);
    }
    return Promise.resolve();
  });
}

function sendCertificateRecord(signer, programId, connection) {
  const certificateRecord = new CertificateRecord({
    certificate_issued_to: "Recipient Name",
    certificate_issued_by: "Issuer Name",
    certificate_type: "Certificate Type",
    certificate_filehash: "File Hash",
    timestamp: Date.now(),
  });

  const instructionData = Buffer.from(CertificateRecordSchema.serialize(certificateRecord));

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

  return web3.sendAndConfirmTransaction(connection, transaction, [signer]);
}

async function main() {
  const provider = new Provider(
    clusterApiUrl("devnet"), // Or use 'testnet' or 'mainnet-beta' basis your network
    {
      wallet: initializeSignerKeypair(),
    }
  );

  const connection = provider.connection;
  const wallet = provider.wallet;

  await airdropSolIfNeeded(wallet, connection);

  const programId = new web3.PublicKey(
    "BSx5tNZfF8yA3UkXDPPgKHBcxJ4izQtaQCJukoLwVckt"
  );
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

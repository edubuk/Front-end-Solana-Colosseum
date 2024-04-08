We have created a decentralized Application to Digitally Record & e-Seal Educational and Work-Experience Certificates on the Solana Blockchain 
making it significantly cheaper and faster for Universities and Employers to conduct background verification process of Students and Employees

There are 2 components of the dApp : **eSealing and Verification** 

**eSealing Tab**: is used to register the file on the Blockchain after signing the transaction using web3 wallet. 
While registering any certificate on the e-Sealer section, we enter 3 metadata field : Certificate Issued to (Certificate Beneficiary), Certificate Issued by (Issuing Authority) and Certificate Type (about the Certificate).
We then upload the digital certificate copy on the blockchain from your local computer/desktop.
Then we click on "Register File Hash" button, a cryptographic wallet opens up, we sign the transaction on chain and pay the gas fees. 
This registers a unique cryptographic hash of the file and generates a transaction-hash and block-hash on the chain.
This also records time stamp (when the certifcate was recorded on the chain, in UTC time and date format: YYYY-MM-DD) and records the Unique wallet address which registered the certificate and signed the transaction on the chain.

Since, it is a B2B solution, we will issue: 1 Unique Wallet Address for 1 Education Institute, 1 Wallet address for 1 Employer and 1 Unique Wallet Address for each of the Study Abroad Consultant.

Presently we have created the first part of the dApp (recording any certificate individually on the blockchain and getting it verified) on the Blockchain

Here, during the e-Sealing of the Certificate: we generate Unique File Hash, TimeStamp (when the certificate was recorded) of each Certificate, and record 6 fields on the chain: 

a.) Who the certificate was issued to (Certificate Beneficiary) 

b.) Who is it issued by (Certifying Authority) 

c.) What is the certificate about (Details of the Certificate)

d.) Unique file hash (cryptographic hash) of the certificate 

e.) Time stamp of the certificate (when the certificate was recorded on the chain, in UTC time) 

f.) Who recorded the certificate on the chain (witness’: Certifying Authority’s wallet address)

**Verification Tab**: is used to upload a digital certificate and click on "Verify Certificate" tab on the dapp.
It then displays the 6 fields as retrieved from the Blockchain and verified with the previously generated information during e-Sealing (that can be stored off chain in a database).

Once all 6 fields are completely checked and matching is 100%, the dApp shows this message: "Certificate Verified with green color and right tick mark"
On the contrary, if there is any change in the certificate, i.e. it has been tampered with, its hash will change, 
Hence the information will Not be 100% verified or in the case, if any certificate was Never recorded on the chain using the dApp, 
then the dApp shows this message: "Error! Certificate Not Verified" with red color and cross mark.






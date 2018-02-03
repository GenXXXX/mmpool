# Entries (WIP)
A smart contract is responsible for accepting entries and storing the proof of brackets being entered at a given time.

In order to scale, the smart contract could not store the brackets themselves. *Only the proof of entry time*.

[Ethereum](https://www.ethereum.org) is currently assumed to be the smart contract platform.

## Smart Contract Overview
Each Ethereum account can have a single entry. **There is no limit to the number of brackets in an entry**. Reputation of accounts is not needed and users may use multiple accounts. However, users are incentivized to use a single account to minimize transaction fees.

An entry is submitted by sending a transaction to the smart contract with an IPFS object hash of the entry along with the number of brackets in the entry. See [storage](../storage).

The smart contract saves the pairing of the `Ethereum account, entry hash, number of brackets` to the blockchain. The blockchain can be used as a proof of entry time.

Entries can be submitted and resubmitted up until the tournament start time. Users must pay the transaction fee for each submission, so they are incentivized to submit their entry once and from a single account.

## Entry fees
Along with all the costs from all modules that need to be paid at entry submission time, there is also the actual *entry fee* that goes towards the reward pool that must also be paid at submission time.

There is a fee associated with each bracket. However, the smart contract does not know about brackets, only entries. The submission must contain the **number of brackets** along with the entry hash and entry fee. The smart contract uses this to determine if the entry fee is sufficient.

## TODO
  - Smart contract implementation
  - Processing costs
  - Storage structure
  - Alternative entry protocol? Not using smart contracts?

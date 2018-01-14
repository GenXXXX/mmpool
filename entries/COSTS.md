# Costs
These costs are paid for by the user via gas fees at submission time.

## Cost per entry
The entry is submitted as an IPFS hash, so the cost to submit is constant regardless of the number of brackets being submitted. There *are* other costs per bracket. But the entry transaction and storage cost is per entry, not per bracket.

Each entry has a single 32 byte IPFS hash. There is cost to submit, process, and store the hash. Also the fixed cost per transaction. Costs in gas:
	* Fixed cost
		* 21000
	* Submit hash
		* 32 bytes*68 = 2176
	* Process
		* TODO
	* Store
		* 20000

43176 gas
```
Gas price of 20 Gwei = 863520 = 0.00086352 ETH = $0.86
on 1/6/18
```

## Cost per bracket
None

# Rewards (WIP)
**Scorers** are responsible for calculating the score of each bracket and rewards for each entry. They must reach consensus with other scorers before the rewards are paid out. The smart contract is responsible for setting consensus rules and paying out rewards.

- [Calculating rewards](#calculating-rewards)
- [Rewards consensus](#rewards-consensus)
- [Paying out Rewards](#paying-out-rewards)

## Calculating rewards
What is the most interesting game mechanic when there are millions or billions of brackets?

### Percentile Scoring
In order to calculate the percentile of a bracket, we need to know:
	- Total number of brackets
	- Score of *all* brackets

In order to calculate a function:

	Rank of bracket -> Payout amount

We need:
	- Total number of brackets (N)
	- Total prize money (P)
	- A curve (C)

For example:
```
C = x^3
P = 100
N = 100

# f is percentage of prize money for given rank (x)
f(x) = (x-(0.9*N))^3
f(x) = (x-90)^3

S = sum f(x) x=90 to 100

# h is prize money for given rank (x)
h(x) = (f(x) / S) * P
```

#### Payout per entry
The payout that the smart contract needs to know is **payout per entry, not per bracket.**

This could be calculated by just taking the sum of payouts of all brackets in an entry. Or entries can be ranked and the function is applied for entries and not brackets. This may change payouts if people submit more than one entry. Paying out per bracket means it doesn’t matter how many entries someone submits. Also, someone who submits only one bracket that ends up being the best could potentially not win anything if other people have lots of brackets. Maybe rank by average bracket score?

#### Ties
Let’s say there are 100 brackets. 1 is in first and the rest are tied.
	- Tied brackets are all “tied for last” and receive nothing
		- Not all rewards are paid out
	- Tied brackets are all “tied for second” and all receive second place reward
		- Too much rewards are paid
	- Tied brackets are all “tied for second” and split the second place reward
		- Function above is not compatible
		- After applying function, check for ties and divide
	- Use a tiebreaker that will always settle ties
		- Submission time? Block? Final score? Coin flip? Least number of brackets in entry?


## Rewards consensus
Assuming a scorer has calculated the rewards for each entry, they now need to reach consensus with other scorers. There are a few ways this can be done.

### Multi-sig wallet
A multi-sig wallet can be setup ahead of time among the scorers. It can require 2/3 of scorers to agree on rewards before submitting a single transaction to the smart contract. The smart contract only accepts rewards from this predetermined wallet. This has the advantage of using existing multi-sig wallets, but requires coordination ahead of time among scorers.

### Predetermined Voting
The smart contract itself can accept "votes" from predetermined accounts. Once 2/3 is reached, the entry reward is marked as finalized. This requires coordination ahead of time, and does not require the use of existing multi-sig wallets.

### Entrants Voting
Entrants can also become scorers. The smart contract could require 2/3 of all entrants to submit rewards. This requires no coordination ahead of time, but has a high risk of low participation and thus stuck rewards since there is no incentive structure setup for scorers.

## Paying out Rewards
Once consensus is reached, entrants must send a transaction to the smart contract to receive their reward. This is similar to "cashing-out" a lottery ticket. Entrants can see their winnings ahead of time and determine if it is profitable to cash out their reward. Perhaps they could wait until the following year to cash out.

## TODO
 - More decentralized way of reaching consensus [TrueBit](https://truebit.io)?
 - Scorer incentive structure
 - Choose reward consensus
 - Costs
 - Reward calculation

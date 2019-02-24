# Rewards (WIP)
**Scorers** are responsible for calculating the score of each bracket and rewards for each entry. They must reach consensus with other scorers before the rewards are paid out. The smart contract is responsible for setting consensus rules and paying out rewards.

- [Calculating rewards](#calculating-rewards)
- [Rewards consensus](#rewards-consensus)
- [Paying out Rewards](#paying-out-rewards)

## Calculating rewards
What is the most interesting game mechanic when there are millions or billions of brackets?

### Max of Entry
e = # of entries
b = # of brackets

```
max_bracket_by_entry = {}												# space O(e)
for e in entries 														# time O(e)
	max_bracket_by_entry[e] = max_score(e)
end

rewards = {}															# space O(e)

rank = 1
while reward = calculate_reward(rank), reward >= 1 wei 				# time O(b)
	e = entry with best bracket
	rewards[e] += reward
	max_bracket_by_entry[e] = max_score(e - best bracket)
	rank++
end
```

## calculate_reward
Each rank gets a percentage `p` of the remaining pot. For example, if `p = 0.1`
```
for rank x
f is percentage of total pot
f(x) = p*(1.0-p)^x


rank 1 -> 0.1
rank 2 -> 0.09
rank 3 -> 0.081
```

The difficult part is calculating `p`. It cannot be constant and still work with different amount of total brackets. It must correlate with the number of brackets.
```
N = total number of brackets

e = log_10(N)
p = 10^(2-e)
```

This works out to approximately
	* Top 5% of brackets break even
	* Top 25% of brackets get some reward
	* Top bracket gets ~100x entry fee

### Ties (WIP)
Let’s say there are 100 brackets. 1 is in first and the rest are tied.
- Tied brackets are all “tied for last” and receive nothing
	- Not all rewards are paid out
- Tied brackets are all “tied for second” and all receive second place reward
	- Too much rewards are paid
- Tied brackets are all “tied for second” and split the second place reward
- Use a tiebreaker that will always settle ties
	- Submission time? Block? Final score? Coin flip? Least number of brackets in entry?

What if brackets within an entry are tied?
- Submission time and block tiebreakers don't work
- Final score requires more storage

Tiebreaker
- Submission block number
- String comparison of entry cid hash

### Validating Bracket Count
The smart contract cannot validate if the number of brackets in the entry is correct. **Scorers** must do this. What happens if the number of brackets is invalid?
- If too low
	- Only score the first specified number of brackets
- If too high
	- Score all brackets and add refund to reward

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
 - Choose bracket count validation strategy
 - Costs
 - Reward calculation

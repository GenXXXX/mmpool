# Storage (WIP)
This module is about how brackets are stored. This includes the format of a single bracket and the mechanism used to persist the brackets.

## Format
A bracket is stored using 8 bytes. Each bit represents the result of a single game.

Since brackets can be represented in many different ways, the semantics need to be clear. A bracket can be represented as a binary search tree, with the root being the result of the championship game. A `0` means the team from the left branch won and a `1` means the team from the right branch won. The left branch has the higher precedence teams and the right branch is lower precedence. The "precedence" of teams depends on the team's seed and region.

The NCAA Tournament bracket is always separated into four regions, each with teams seeded 1 to 16. So there are four 1 seeds, four 2 seeds, etc. The regions must be given a precedence order, which will need to be set each year.

```
P(s, r) - Precedence value of team seeded `s` from region `r`

Each region `r` is given a numeric value each year. For example, for the year 2017:
East    = 1
West    = 2
Midwest = 3
South   = 4

P(1, 1), P(16, 1), P(8, 1), P(8, 1) ... P(2, 1), P(15, 1), P(1, 2), P(16, 2) ... P(15, 4)
```

Given this BST of size 63 and depth 6, it can be store as a bitstream with the most significant bit being the root and the least significant bit being the result of the game with the right-most or team with least precedence.

See [region precedence](./REGION_PRECEDENCE.md) for more examples.

### Example

Here is an example bracket with four teams and two "regions". Brackets can be represented using 3 bits. The most significant bit is on the left.

```
Blank bracket
Team precedence - A(1), A(2), B(1), B(2)

1
––––––––
Region A | ––––––––
––––––––          |
2                 |
                  | ––––––––
1                 |
––––––––          |
Region B | ––––––––
––––––––          
2  


"111" result

1
––––––––
Region A | A(1)––––
––––––––          |
2                 |
                  | A(1)–––––––
1                 |
––––––––          |
Region B | B(1)––––
––––––––          
2  

"010" result

1
––––––––
Region A | A(1)––––
––––––––          |
2                 |
                  | B(2)–––––––
1                 |
––––––––          |
Region B | B(2)––––
––––––––          
2  

"001" result

1
––––––––
Region A | A(2)––––
––––––––          |
2                 |
                  | B(1)–––––––
1                 |
––––––––          |
Region B | B(1)––––
––––––––          
2   
```

### Entry Format

Most people want to submit multiple brackets as an entry. Each entry is stored as a bytestream, with each 8 byte bracket coming one after the other.

See the [examples](../examples) folder for example entries and a script that can be used to create random entries.

## Persistence
[IPFS](https://ipfs.io) is a content-addressable, peer-to-peer filesystem that is used to persist the storage of brackets. It gives the following properties:
  - Fixed sized references
    - A reference to a block in IPFS is a hash of that data
  - Data authentication
    - Once a block is fetched, it can be verified using the reference that was used to fetch it
  - Immutability
    - IPFS blocks are immutable. If the data changes, it's reference changes
  - Incentive structures
    - There are many existing tools built around IPFS. [Filecoin](https://filecoin.io) is one that is used to pay people to save IPFS objects. This can be used to enhance the redundancy of persisting brackets

Each entry is stored as an IPFS object.

Everyone is responsible for persisting their own brackets. Anyone can contribute to persisting other's brackets by obtaining their entry's IPFS hash. There is currently no incentive structure setup for persisting brackets.

## TODO
  - Most/least significant + endianness?

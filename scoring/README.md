# Scoring (WIP)
There are many ways to score march madness brackets. Here is a [great statistical approach](http://www.jellyjuke.com/march-madness-bracket-scoring.html) for determining the best scoring strategy.

The scoring is as follows

Round               | Points Per Game
------------------- | ----------------
Round of 64         | 2
Round of 32         | 3
Sweet Sixteen       | 5  
Elite Eight         | 8
Final Four          | 13
Championship        | 21

This module contains scoring implementations in various languages and platforms. These are to be used by **Scorers** when determining scores and rewards. A Scorer can use any implementation they like, even ones not listed here, as long as they follow the above scoring strategy.

## Performance
The main challenge is scoring a large amount of brackets in a realistic amount of time. The initial python implementation is fairly simple, but takes quite a long time with a large amount of brackets as it scales linearly.

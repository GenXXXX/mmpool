import numpy as np
from bitstream import BitStream

results = np.fromfile('../../examples/2017_results.bin', dtype=np.uint64)[0]

ROUND_SCORES = [np.uint8(21), np.uint8(13), np.uint8(8), np.uint8(5), np.uint8(3), np.uint8(2)]
MASKS = [dict(), dict(), dict(), dict(), dict(), dict(), dict()]

def calculateMask(rnd, game):
    memo_rnd = MASKS[rnd]
    if game in memo_rnd:
        return memo_rnd[game]

    mask = np.uint64(0)
    if rnd > 5 or rnd < 0:
        return mask

    rnd_count = (2**rnd)
    if game > rnd_count or game < 0:
        return mask

    i = rnd_count + game
    if i > 64 or i < 1:
        return mask

    mask = np.uint64(2**63) >> np.uint64(i)
    next_game = 1 if (results & mask) > 0 else 0
    res = mask | calculateMask(rnd+1, next_game)
    MASKS[rnd][game] = res
    return res

def scoreEntry(filename):
    brackets = np.fromfile(filename, dtype=np.uint64)
    total_score = 0
    for bracket in brackets:
        score = np.uint8(0)
        for rnd in range(6):
            round_score = ROUND_SCORES[rnd]
            for game in range(2**rnd):
                mask = calculateMask(rnd, game)
                res = np.bool_((results & mask) == (bracket & mask))
                score += res * round_score
        total_score += score
    print(total_score/len(brackets))

scoreEntry('../../examples/100_brackets.bin')

const IPFS = require('ipfs')

const pull = require('pull-stream')
const map = require('pull-stream/throughs/map')
const reduce = require('pull-stream/sinks/reduce')
const fs = require('fs')
const bignum = require('bignum')

let results = bignum.fromBuffer(fs.readFileSync('../../examples/2017_results.bin'))
const INITIAL_RND_MASK = bignum.fromBuffer(Buffer.alloc(4, 0xff)).shiftLeft(32)
const FULL_SET_MASK = bignum.fromBuffer(Buffer.alloc(8, 0xff))
const ZERO_MASK = bignum.fromBuffer(Buffer.alloc(8, 0x00))
const RND_WEIGHTS = {
  32: 2,
  16: 3,
  8: 5,
  4: 8,
  2: 13,
  1: 21
}

var BIT_MASKS = []
for (var i = 0; i < 64; i++) {
  BIT_MASKS[i] = bignum.fromBuffer(Buffer.alloc(1, 0x01)).shiftLeft(i)
}

const ipfs = new IPFS()

ipfs.on('ready', () => {
  console.log('Node is ready to use!')

  let stream = ipfs.files.catPullStream("/ipfs/QmXk5bC2kdYeVShjGcZhSxPgTb548dVSrjxsUnc9TPQkgz")

  pull(
    stream,
    map((data) => {
      var t = 0
      var max_score = 0
      for (var i = 0; i < data.length/8; i++) {
        var start = new Date()

        let first_bracket = bignum.fromBuffer(data.slice(i, i+8))
        let score = score_bracket(first_bracket)

        t += new Date() - start
        max_score = Math.max(score, max_score)
      }
      console.log(`average time: ${t / (data.length/8)}`)
      console.log(`max_score: ${max_score}`)
      return max_score
    }),
    reduce((acc, cur) => {
      return Math.max(acc, cur)
    }, 0, (err, res) => {
      console.log(`END: ${res}`)
      ipfs.stop(error => {
        if (error) {
          return console.error('Node failed to stop cleanly!', error)
        }
        console.log('Node stopped!')
        process.exit()
      })
    })
  )
})

function score_bracket(bracket) {
  let correct_game_mask = bracket.xor(results)
    .xor(FULL_SET_MASK)

  return _score_bracket(correct_game_mask, bracket, INITIAL_RND_MASK, 32)
}

function _score_bracket(correct_game_mask, bracket, rnd_mask, num_games_in_rnd) {
  if (num_games_in_rnd < 1) {
    return 0
  }

  let correct_games_in_rnd_mask = correct_game_mask.and(rnd_mask)
  let rnd_start_bit = (num_games_in_rnd*2)-1
  let next_rnd_start_bit = rnd_start_bit-num_games_in_rnd

  var correct_game_count = 0
  var next_rnd_mask = ZERO_MASK
  for (var i = 0; i < num_games_in_rnd; i++) {
    let mask = BIT_MASKS[rnd_start_bit-i]
    if (correct_games_in_rnd_mask.and(mask) > 0) {
      correct_game_count += 1

      let next_rnd_game = BIT_MASKS[next_rnd_start_bit-Math.ceil((i-1) / 2)]
      next_rnd_mask = next_rnd_mask.or(next_rnd_game)
    }
  }

  let rnd_score = RND_WEIGHTS[num_games_in_rnd] * correct_game_count
  return rnd_score + _score_bracket(correct_game_mask, bracket, next_rnd_mask, num_games_in_rnd / 2)
}

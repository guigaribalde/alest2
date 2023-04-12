/*
 * Desafio: Macacos e cocos
 *
 * Regras:
 * Todos os macacos passam todos os seus cocos a diante
 * O macaco que terminar com mais cocos é o vencedor
 *
 * Entrada:
 * Macaco 5 par -> 1 impar -> 3 : 2 : 8 9
 *
 * A entrada acima significa que o macaco 5 passa cocos contendo numeros pares para o macaco 1 e
 * numeros impares para o macaco 3.
 * Alem disso, o macaco 5 possui 2 cocos, o primeiro contendo 8 e o segundo contendo 9.
 */

const fs = require("fs")
const INPUT_FILES = ["./src/casos/caso0100.txt"]

function readInputFile(inputFile: string) {
  const file = fs.readFileSync(inputFile, "utf8")
  return file
}

function parseInputFile(input: string): {
  monkeys: any
  numberOfRounds: number
} {
  const lines = input.split("\n")
  const monkeys = {} as any
  let numberOfRounds = 0

  lines.forEach((line, index) => {
    if (index === lines.length - 1) return

    if (index === 0) {
      const [_, numberOfRoundsString] = line.split(" ")
      numberOfRounds = parseInt(numberOfRoundsString)
      return
    }
    const splitted_line = line.split(" ")
    const coconut_amount = parseInt(splitted_line[9])
    monkeys[splitted_line[1]] = {
      name: splitted_line[1],
      even_to: splitted_line[4],
      odd_to: splitted_line[7],
      odd_coconuts: splitted_line
        .slice(11, 11 + coconut_amount)
        .map((coconut) => parseInt(coconut))
        .filter((coconut) => coconut % 2 !== 0),
      even_coconuts: splitted_line
        .slice(11, 11 + coconut_amount)
        .map((coconut) => parseInt(coconut))
        .filter((coconut) => coconut % 2 === 0),
    }
  })

  return { monkeys, numberOfRounds }
}

function distributeCoconuts(monkeys: any) {
  Object.keys(monkeys).forEach((monkey) => {
    if (
      monkeys[monkey].even_coconuts.length === 0 &&
      monkeys[monkey].odd_coconuts.length === 0
    ) {
      return
    }

    monkeys[monkeys[monkey].even_to].even_coconuts.push(
      ...monkeys[monkey].even_coconuts
    )
    monkeys[monkey].even_coconuts = []
    monkeys[monkeys[monkey].odd_to].odd_coconuts.push(
      ...monkeys[monkey].odd_coconuts
    )
    monkeys[monkey].odd_coconuts = []
  })
}

function getWinner(monkeys: any) {
  let winner = monkeys[0]
  Object.keys(monkeys).forEach((monkey) => {
    if (
      monkeys[monkey].odd_coconuts.length +
      monkeys[monkey].even_coconuts.length >
      winner.odd_coconuts.length + winner.even_coconuts.length
    ) {
      winner = monkeys[monkey]
    }
  })
  return winner
}

function run() {
  const { monkeys, numberOfRounds } = parseInputFile(
    readInputFile(INPUT_FILES[0])
  )

  for (let i = 0; i < numberOfRounds; i++) {
    console.clear()
    console.log(`${((i / numberOfRounds) * 100).toFixed(2)}%`)
    distributeCoconuts(monkeys)
  }
  const winner = getWinner(monkeys)

  console.log("Leaderboard:")
  Object.keys(monkeys).forEach((monkey, index) => {
    console.log(
      `Macaco ${monkey} -> ${monkeys[monkey].even_coconuts.length +
      monkeys[monkey].odd_coconuts.length
      } cocos`
    )
  })

  console.log("____________________________________________________")
  console.log(
    `O macaco vencedor foi o ${winner.name} com ${winner.even_coconuts.length + winner.odd_coconuts.length
    } cocos`
  )
}

run()

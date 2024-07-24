/**
 * Parses the user's input and returns an array of arrays, where each sub-array represents a level in the graph.
 * Each element in a sub-array is a parent node of the elements in the subsequent sub-arrays.
 *
 * Example Input:
 *    ==Level 1==
 *    A --> B
 *    C --> D
 *    ==Level 2==
 *    B --> E
 *    D --> F
 *    ==Level 3==
 *    E
 *    F
 *
 * Example Result:
 *   [[A, C], [B, D], [E, F]]
 *
 * @param {string} input - The user's input string representing the levels and nodes.
 * @returns {Array<Array<string>>} - An array of arrays, where each sub-array represents a level and contains the nodes within.
 */
export const nodesAtEachLevel = input => {
  const regex = /==\s*Level\s*\d+\s*==/
  return input
    .split(regex)
    .map(line => line.trim().split('\n'))
    .filter(arr => arr.length && !arr.includes(''))
    .map(arr => arr.map(line => line.split(' --> ')))
    .map(level => level.map((nodes, index, level) => level[index][0]))
}

export const parseInput = input => {
  const nodes = new Set()
  const edges = new Set()
  input
    .split('\n')
    .filter(line => line !== '' && line !== ' ')
    .forEach(line => {
      if (!line.includes('==')) {
        const edge = line
          .trim()
          .split(' --> ')
          .filter(edge => edge !== ' ')
        nodes.add(edge[0])
        if (edge[1] !== undefined) {
          nodes.add(edge[1])
          edges.add(edge)
        }
      }
    })
  return [nodes, edges]
}

// ------------------------------------------------------
// formatting methods for react flow
// ------------------------------------------------------
const initialPostions = nodesInLevels => {
  let y = -25
  return nodesInLevels.map(() => {
    const x = 100
    y += 100
    return { x, y }
  })
}

export const formatNodes = nodesInLevels => {
  if (!nodesInLevels) return

  let initialLevelPositions = initialPostions(nodesInLevels)
  return nodesInLevels.flatMap((level, levelIndex) =>
    level.map((node, index) => {
      // at root level
      if (levelIndex === 0) {
        const id = node
        const type = 'input'
        const data = { label: node }
        initialLevelPositions[levelIndex].x += (initialLevelPositions[levelIndex].x % 2) + 200
        const position = {
          x: initialLevelPositions[levelIndex].x,
          y: initialLevelPositions[levelIndex].y,
        }
        return { id, type, data, position }
      }
      // at last level
      if (levelIndex === nodesInLevels.length - 1) {
        const id = node
        const type = 'output'
        const data = { label: node }
        initialLevelPositions[levelIndex].x += (initialLevelPositions[levelIndex].x % 2) + 200
        const position = {
          x: initialLevelPositions[levelIndex].x,
          y: initialLevelPositions[levelIndex].y,
        }
        return { id, type, data, position }
      }
      // at other levels
      const id = node
      const data = { label: node }
      initialLevelPositions[levelIndex].x += (initialLevelPositions[levelIndex].x % 2) + 200
      const position = {
        x: initialLevelPositions[levelIndex].x,
        y: initialLevelPositions[levelIndex].y,
      }
      return { id, data, position }
    })
  )
}

export const formatEdges = edges => {
  if (edges) {
    return edges.map(edge => {
      const id = `e${edge[0]}-${edge[1]}`
      const source = `${edge[0]}`
      const target = `${edge[1]}`
      return { id, source, target, animated: true }
    })
  }
}

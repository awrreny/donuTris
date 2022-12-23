// this file contains technical game info e.g piece orientations, kick tables


const piece_orientation = [
    [  // i piece [index 0]
        [[0, 1], [1, 1], [2, 1], [3, 1]],
        [[2, -1], [2, 0], [2, 1], [2, 2]],
        [[0, 0], [1, 0], [2, 0], [3, 0]],
        [[1, -1], [1, 0], [1, 1], [1, 2]]
    ],
    [  // o piece [index 1]
        [[1, 1], [2, 1], [1, 2], [2, 2]],  // o spin :oyes:
        [[1, 1], [2, 1], [1, 2], [2, 2]],
        [[1, 1], [2, 1], [1, 2], [2, 2]],
        [[1, 1], [2, 1], [1, 2], [2, 2]]
    ],
    [  // t piece [index 2]
        [[0, 1], [1, 1], [1, 2], [2, 1]],
        [[1, 0], [1, 1], [1, 2], [2, 1]],
        [[0, 1], [1, 0], [1, 1], [2, 1]],
        [[1, 2], [1, 0], [0, 1], [1, 1]]
    ],
    [  // s piece [index 3]
        [[0, 1], [1, 1], [1, 2], [2, 2]],
        [[1, 1], [1, 2], [2, 1], [2, 0]],
        [[0, 0], [1, 0], [1, 1], [2, 1]],
        [[0, 2], [1, 0], [0, 1], [1, 1]]
    ],
    [  // z piece [index 4]
        [[0, 2], [1, 2], [2, 1], [1, 1]],
        [[2, 2], [1, 0], [2, 1], [1, 1]],
        [[2, 0], [1, 0], [0, 1], [1, 1]],
        [[0, 0], [1, 2], [0, 1], [1, 1]]
    ],
    [  // j piece [index 5]
        [[0, 2], [2, 1], [0, 1], [1, 1]],
        [[1, 2], [1, 0], [2, 2], [1, 1]],
        [[2, 0], [2, 1], [0, 1], [1, 1]],
        [[0, 0], [1, 0], [1, 2], [1, 1]]
    ],
    [  // l piece [index 6]
        [[2, 2], [2, 1], [0, 1], [1, 1]],
        [[1, 2], [1, 0], [2, 0], [1, 1]],
        [[0, 0], [2, 1], [0, 1], [1, 1]],
        [[0, 2], [1, 0], [1, 2], [1, 1]]
    ],
]

const kick_table_normal = [
    [  // 90 clockwise [SRS]
        [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],  // orientation 0 to 1
        [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],  // orientation 1 to 2
        [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],  // orientation 2 to 3
        [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]]  // orientation 3 to 0
    ],
    [  // 180 [tetrio]
        [[0, 0], [0, 1], [1, 1], [-1, 1], [1, 0], [-1, 0]],  // orientation 0 to 2
        [[0, 0], [1, 0], [1, 2], [1, 1], [0, 2], [0, 1]],  // orientation 1 to 3
        [[0, 0], [0, -1], [-1, -1], [1, -1], [-1, 0], [1, 0]],  // orientation 2 to 0
        [[0, 0], [-1, 0], [-1, 2], [-1, 1], [0, 2], [0, 1]]  // orientation 3 to 1
    ],
    [  // 90 anticlockwise [SRS]
        [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],  // orientation 0 to 3
        [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],  // orientation 1 to 0
        [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],  // orientation 2 to 1
        [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]]  // orientation 3 to 2
    ]
]
const kick_table_I = [
    [  // 90 clockwise [SRS]
        [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],  // orientation 0 to 1
        [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]],  // orientation 1 to 2
        [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],  // orientation 2 to 3
        [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]]  // orientation 3 to 0
    ],
    [  // 180 [common sense]
        [[0, 0], [0, 1]],
        [[0, 0], [1, 0]],
        [[0, 0], [0, -1]],
        [[0, 0], [-1, 0]]
    ],
    [  // 90 anticlockwise [SRS]
        [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]],  // orientation 0 to 3
        [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],  // orientation 1 to 0
        [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]],  // orientation 2 to 1
        [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]]  // orientation 3 to 2
    ]
]
const pieceMirrors = {
    "I": "I",
    "J": "L",
    "L": "J",
    "O": "O",
    "T": "T",
    "S": "Z",
    "Z": "S"
}
const pieceToIndex = {
    "I": 0,
    "O": 1,
    "T": 2,
    "S": 3,
    "Z": 4,
    "J": 5,
    "L": 6
}

export function getKickOffsets(piece, rotationDirection, currentOrientation) {  // returns array [x, y]
    const rotationIndex = rotationDirection - 1
    //  rotationDirection is numerical change in orientation number
    //  rotationIndex  90 clockwise is 0, 180 is 1, 90 anticlockwise is 2
    return (piece === "I") ? kick_table_I[rotationIndex][currentOrientation]
    : kick_table_normal[rotationIndex][currentOrientation]
}

export function getMinoLocations(piece, orientation) {
    return piece_orientation[pieceToIndex[piece]][orientation]
}
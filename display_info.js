// const red = "#ff4020"
// const orange = "#ff8020"
// const yellow = "#ffe020"
// const green = "#40d040"
// const cyan = "#00d0ff"
// const blue = "#4080ff"
// const purple = "#a040f0"
// const grey = "#bbbbbb"

// dark, light, main
const red_3d = ["#cf3319", "#ff6950", "#ff4020"]
const orange_3d = ["#da6d1b", "#ff9c51", "#ff8020"]
const yellow_3d = ["#dcc11c", "#ffec73", "#ffe020"]
const green_3d = ["#34ae34", "#73d173", "#40d040"]
const cyan_3d = ["#00afd8", "#5ee1ff", "#00d0ff"]
const blue_3d = ["#3060c0", "#6397ff", "#4080ff"]
const purple_3d = ["#8332c7", "#b161f4", "#a040f0"]
const grey_3d = ["#9a9a9a", "#cbcbcb", "#000000"] // "#bbbbbb" last value for filled-in ghost block
const black_3d = ["#000000", "#181818", "#000000"]

export const pieceToColour = {
    "_":black_3d,
    "T":purple_3d,
    "I":cyan_3d,
    "L":orange_3d,
    "J":blue_3d,
    "S":green_3d,
    "Z":red_3d,
    "O":yellow_3d,
    "X":grey_3d
}

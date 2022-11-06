import {bubblePosition} from "./discoverHelpers";

const menuObject = [
    { id: -2, name: 'favourites', bubble_type: 'favourites', scale: 0.9, radian: 5.6, ...bubblePosition(5.6, 400) },
    { id: -1, name: 'popular', bubble_type: 'popular', scale: 0.9, radian: 3.8, ...bubblePosition(3.8, 400) },
    { id: 1, name: 'discover', bubble_type: 'discover', scale: 0.9, radian: 0.9, ...bubblePosition(0.9, 400) },
    { id: 0, name: 'search', bubble_type: 'search', scale: 1.2, posX: 0, posY: 0 },
]

export default menuObject

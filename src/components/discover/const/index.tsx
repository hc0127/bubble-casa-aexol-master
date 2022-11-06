const windowWidth = window.innerWidth
const windowHeight = window.innerHeight

const calcDistanceRadius = () => {
    if (windowHeight < windowWidth) return windowHeight / 2.5
    return windowWidth / 2.5
}

export const DISTANCE = calcDistanceRadius()

export const CLOSE_ENOUGH = 100;
export const RADIUS = 200;

export const BASE_RADIUS_MULTIPLIER = 0.3;
export const PER_CHILDREN_NUM_MULTIPLIER = 0.04;

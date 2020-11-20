import getShips from './get-ships.js';

const shipsUserCopy = JSON.parse(JSON.stringify(getShips()));
const shipsAICopy = JSON.parse(JSON.stringify(getShips()));

const user = {
    ships: shipsUserCopy,
    getAllTilePositions: () => {
        return user.ships.map(ship => ship.tilePositions).flat()
    }
};

const ai = {
    ships: shipsAICopy,
    getAllTilePositions: () => {
        return user.ships.map(ship => ship.tilePositions).flat()
    }
};

export { ai, user };
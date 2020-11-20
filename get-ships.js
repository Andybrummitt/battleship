const getShips = () => {
    class Ship {
        constructor(name, numTiles){
            this.name = name,
            this.numTiles = numTiles,
            this.sunk = false;
            this.holes = 0;
            this.horizontal = false;
            this.tilePositions = [];
        }
        toggleDirection(){
            this.horizontal = !this.horizontal;
        }
      };
      
      const Destroyer = new Ship('Destroyer', 2);
      const Submarine = new Ship('Submarine', 3);
      const Cruiser = new Ship('Cruiser', 3);
      const Battleship = new Ship('Battleship', 4);
      const Carrier = new Ship('Carrier', 5);
      
      const ships = [Destroyer, Submarine, Cruiser, Battleship, Carrier];
      return ships;
}

export default getShips;
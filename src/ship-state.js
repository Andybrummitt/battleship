const shipState = {
    ship: null,
    shipSelectText: document.querySelector('#ship-select-text'),
    changeShip: function(newShip){
        this.ship = newShip;
        this.shipsSelectText = newShip.name;
    }
};

export default shipState;
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d")

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0,0,canvas.width,canvas.height);

class Sprite{
    constructor( {position, velocity, width, height} ) {
        this.position = position;
        this.velocity = velocity
        this.width = width;
        this.height = height
    }

    draw() {
        c.fillStyle = "red";
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

const player = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    velocity:{
        x: 0,
        y: 0
    },
    width: 50,
    height:120
})

player.draw()
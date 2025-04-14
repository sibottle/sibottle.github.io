import { FRUITS } from "./fruits.js";

const loadTexture = async () => {

    const textureList = [
    'image/00_cherry.png',
    'image/01_strawberry.png',
    'image/02_grape.png',
    'image/03_gyool.png',
    'image/04_orange.png',
    'image/05_apple.png',
    'image/06_pear.png',
    'image/07_peach.png',
    'image/08_pineapple.png',
    'image/09_melon.png',
    'image/10_watermelon.png',
    ]
    
    const load = textureUrl => {
    const reader = new FileReader()
    
    return new Promise( resolve => {
    reader.onloadend = ev => {
    resolve(ev.target.result)
    }
    fetch(textureUrl).then( res => {
    res.blob().then( blob => {
    reader.readAsDataURL(blob)
    })
    })
    })
    }
    
    const ret = {}
    
    for ( let i = 0; i < textureList.length; i++ ) {
    ret[textureList[i]] = await load(`${textureList[i]}`)
    }
    
    return ret
    }
    
    const textureMap = await loadTexture()

var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    World = Matter.World,
    Body = Matter.Body,
    Events = Matter.Events

const engine = Engine.create();

const render = Render.create({
    engine,
    element: document.body,
    options: {
        wireframes: false,
        background: "#F7F4C8",
        width: 620,
        height: 850
    }
})

const runner = Runner.create();

const world = engine.world;

const topLine = Bodies.rectangle(310, 150, 620, 2, {
    isStatic: true,
    name: "topLine",
    isSensor: true,
    render: {fillStyle: "#e5d9ac"}
})

const leftWall = Bodies.rectangle(15, 395, 30, 790, {
    isStatic: true,
    render: {fillStyle: "#cc7e30"}
})

const rightWall = Bodies.rectangle(605, 395, 30, 790, {
    isStatic: true,
    render: {fillStyle: "#cc7e30"}
})

const ground = Bodies.rectangle(310, 820, 620, 60, {
    isStatic: true,
    render: {fillStyle: "#cc7e30"}
})

World.add(world, [topLine,leftWall, rightWall, ground]);

Render.run(render);
Runner.run(engine);

let currentBody = null;
let currentFruit = null;
let disableAction = false;

function addFruit(i) {
    const fruit = FRUITS[i]
    const body = Bodies.circle(300,50,fruit.radius, {
        isStatic: false,
        index: i,
        isSleeping: true,
        restitution: 0.6,
        render: {
            sprite: {texture: `${fruit.name}.png`},
        }
    }
    )
    World.add(world, body)

    currentBody = body
    currentFruit = fruit

    return body;
}

Events.on(engine, "collisionStart", (event) => {
    event.pairs.forEach((c) => {
        if (c.bodyA.index == c.bodyB.index) {
            const index = c.bodyA.index;
            const newFruit = FRUITS[index+1];
            const newBody = Bodies.circle(
                c.collision.supports[0].x,
                c.collision.supports[0].y,
                newFruit.radius,
                {
                    index : index + 1,
                    render : { sprite: {texture: `${newFruit.name}.png`}}
                }
            )

            if (index == 9) {
                setTimeout(() => {
                    alert("Congrats! You have made a Watermelon!")
                    disableAction = true
                }, 1000)
            }

            Body.applyForce(newBody,c.collision.supports[0], c.bodyA.force)

            World.remove(world,[c.bodyA,c.bodyB]);

            World.add(world, newBody);
        }
        if ((c.bodyA.name === "topLine" || c.bodyB.name === "topLine") && !disableAction) {
            alert("Game Over");
            disableAction = true;
        }
    })
});

addFruit(Math.floor(Math.random()*5))

let keys = {
    "a": false,
    "d": false
};

onkeydown = (event) => {
    switch (event.code) {
        case "KeyA":
            keys["a"] = true;
            break;
        case "KeyD":
            keys["d"] = true;
            break;
        case "KeyS":
            if (disableAction)
                return
            placeFruit()
            disableAction = true;
            break;
    }
};

onkeyup = (event) => {
    switch (event.code) {
        case "KeyA":
            keys["a"] = false;
            break;
        case "KeyD":
            keys["d"] = false;
            break;
    }
};

function placeFruit() {
    currentBody.isSleeping = false;
    setTimeout(() => {
        disableAction = false;
        addFruit(Math.floor(Math.random()*5))
    }, 1000)
}

Events.on(engine, "afterUpdate", () => {
    if (disableAction)
        return
    Body.setPosition(currentBody, {
        x: currentBody.position.x - ((keys["a"] - keys["d"]) * 3),
        y: currentBody.position.y
    })
    if (currentBody.position.x + currentBody.radius > 590) {
        Body.setPosition(currentBody, {
            x: 590,
            y: currentBody.position.y
        })
    }
    if (currentBody.position.x - currentBody.radius < 30) {
        Body.setPosition(currentBody, {
            x: 30,
            y: currentBody.position.y
        })
    }
})
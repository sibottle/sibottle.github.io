import { FRUITS } from "./fruits.js";

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
            World.remove(world,[c.bodyA,c.bodyB]);
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

            World.add(world, newBody);
        }
        if ((c.bodyA.name === "topLine" || c.bodyB.name === "topLine") && !disableAction) {
            alert("Game Over");
            disableAction = true;
        }
    })
});

addFruit(Math.floor(Math.random()*10))

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
        addFruit(Math.floor(Math.random()*10))
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
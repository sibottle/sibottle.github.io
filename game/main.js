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

World.add(world, [leftWall, rightWall, ground]);

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
    })
});

addFruit(Math.floor(Math.random()*10))

let keys = {
    "horizontal": 0
};

onkeydown = (event) => {
    switch (event.code) {
        case "KeyA":
            keys["horizontal"] += 1;
            break;
        case "KeyD":
            keys["horizontal"] += -1;
            break;
        case "KeyS":
            placeFruit()
            disableAction = true;
            break;
    }
};

onkeyup = (event) => {
    switch (event.code) {
        case "KeyA":
            keys["horizontal"] -= 1;
            break;
        case "KeyD":
            keys["horizontal"] -= -1;
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

Events.on(Runner, "afterUpdate", () => {
    if (disableAction)
        return
    Body.setPosition(currentBody, {
        x: currentBody.position.x + keys["horizontal"] * 10,
        y: currentBody.position.y
    })
    print(keys["horizontal"])
})
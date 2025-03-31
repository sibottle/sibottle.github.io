import { FRUITS } from "./fruits.js";

var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    World = Matter.World

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

function addFruit(i) {
    const fruit = FRUITS[i]
    const body = Bodies.circle(300,50,fruit.radius, {
        isStatic: false,
        render: {
            index: i,
            isSleeping: true,
            sprite: {texture: `${fruit.name}.png`},
            restitution: 0.4
        }
    }
    )
    World.add(world, body)

    currentBody = body
    currentFruit = fruit

    return body;
}

let currentBody = null;
let currentFruit = null;

addFruit(0)

addEventListener("keydown", (event) => {});

onkeydown = (event) => {addFruit(Math.floor(Math.random()*10))};
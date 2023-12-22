let canvas = document.querySelector('canvas');
let scoreboard = document.querySelector('h1');
let context = canvas.getContext('2d');

context.scale(30,30);


const blocks = [
    [
        [0,1,0,0],
        [0,1,0,0],
        [0,1,0,0],
        [0,1,0,0]
    ],
    [
        [0,1,0],  
        [0,1,0],  
        [1,1,0]   
    ],
    [
        [0,1,0],
        [0,1,0],
        [0,1,1]
    ],
    [
        [1,1,0],
        [0,1,1],
        [0,0,0]
    ],
    [
        [0,1,1],
        [1,1,0],
        [0,0,0]
    ],
    [
        [1,1,1],
        [0,1,0],
        [0,0,0]
    ],
    [
        [1,1],
        [1,1],
    ]
]

const colors = [
    "#fff",
    "#9b5fe0",
    "#16a4d8",
    "#60dbe8",
    "#8bd346",
    "#efdf48",
    "#f9a52c",
    "#d64e12"
]

const rowNum = 20;
const colNum = 10;

let grid = createGrid();
let newBlock = null;
let score = 0;

let speed = setInterval(newGame, gameSpeed());

function gameSpeed() {
    if (score <= 50) {
        return 500;
    } else if (score > 100 && score < 500) {
        return 300;
    } else {
        return 100;
    }
}

function updateSpeed() {
    clearInterval(speed);
    speed = setInterval(newGame, gameSpeed());
}

function newGame(){
    checkGrid();
    if(!newBlock){
        newBlock = createBlock();
        paintBlock();
    }
    moveDown();
}

function createGrid(){
    let grid = [];
    for(let i = 0; i < rowNum; i++){
        grid.push([]);
        for(let j = 0; j < colNum; j++){
            grid[i].push(0)
        }
    }
    return grid;
}

function checkGrid(){
    let count = 0;
    for(let i = 0; i < grid.length; i++){
        let allFilled = true;
        for(let j = 0; j < grid[0].length; j++){
            if(grid[i][j] == 0){
                allFilled = false
            }
        }
        if(allFilled){
            count++;
            grid.splice(i, 1);
            grid.unshift([0,0,0,0,0,0,0,0,0,0]);
        }
    }
    if(count == 1){
        score += 50;
    } else if(count == 2){
        score += 100;
    } else if(count == 3){
        score += 300;
    } else if(count > 3){
        score += 500
    }
    scoreboard.innerHTML = 'Score: ' + score;
    updateSpeed();
}

function paintGrid(){
    for(let i = 0; i < grid.length;i++){
        for(let j = 0;j < grid[i].length;j++){
            context.fillStyle = colors[grid[i][j]];
            context.fillRect(j, i, 1, 1)
            context.strokeStyle = 'grey';
            context.lineWidth = 0.01;
            context.strokeRect(j, i, 1, 1);
        }
    }
    paintBlock();
}

function createBlock(){
    let random = Math.floor(Math.random() * 7);
    let block = blocks[random];
    let colorIndex = random + 1;
    let x = 4;
    let y = 0;
    return {block, colorIndex, x, y}
}

function paintBlock(){
    let block = newBlock.block;
    for(let i = 0; i<block.length; i++){
        for(let j = 0; j<block[i].length; j++){
            if(block[i][j] == 1){
            context.fillStyle = colors[newBlock.colorIndex];
            context.fillRect(newBlock.x + j,newBlock.y + i, 1, 1);

            context.strokeStyle = 'grey';
            context.lineWidth = 0.01;
            context.strokeRect(newBlock.x + j,newBlock.y + i, 1, 1)
        }
        }
    }
}

function moveDown(){
    if(!collision(newBlock.x, newBlock.y + 1))
        newBlock.y += 1;
    else {
        let block = newBlock.block
        for(let i = 0; i < block.length; i++){
            for(let j = 0; j < block[i].length; j++){
                if(block[i][j] == 1){
                    let a = newBlock.x + j;
                    let b = newBlock.y + i;
                    grid[b][a] = newBlock.colorIndex;
                }
            }
        }
        if(newBlock.y == 0){
            alert('Game Over!');
            grid = createGrid();
            score = 0;
        }
        newBlock = null;
    }
    paintGrid();
}

function moveLeft(){
    if(!collision(newBlock.x - 1, newBlock.y))
        newBlock.x -= 1;
    paintGrid();
}

function moveRight(){
    if(!collision(newBlock.x + 1, newBlock.y))
        newBlock.x += 1;
    paintGrid();
}

function rotate(){
    let rotatedBlock = [];
    let block = newBlock.block;
    for(let i = 0; i < block.length; i++){
        rotatedBlock.push([]);
        for(let j = 0; j < block[i].length; j++){
            rotatedBlock[i].push(0);
        }
    }
    for(let i = 0; i < block.length; i++){
        for(let j = 0; j < block[i].length; j++){
            rotatedBlock[i][j] = block[j][i]
        }
    }
    for(let i = 0; i < rotatedBlock.length; i++){
        rotatedBlock[i] = rotatedBlock[i].reverse();
    }
    if(!collision(newBlock.x, newBlock.y, rotatedBlock))
        newBlock.block = rotatedBlock
    paintGrid()
}

document.addEventListener('keydown', function(e){
    let key = e.key;
    if(key == 'ArrowDown'){
        moveDown();
    } else if(key == 'ArrowLeft'){
        moveLeft();
    } else if(key == 'ArrowRight'){
        moveRight();
    } else if(key == 'ArrowUp'){
        rotate();
    }
})

window.addEventListener('error', (e) => {
    e.preventDefault();
    console.log('Everything is fine :)');
}) 


function collision(x, y, rotatedBlock){
    let block = rotatedBlock || newBlock.block
    for(let i = 0; i < block.length; i++){
        for(let j = 0; j < block[i].length; j++){
            if(block[i][j] == 1){
            let a = x + j;
            let b = y + i;
            if(a >= 0 && a < colNum && b >= 0 && b < rowNum){
                if(grid[b][a] > 0){
                    return true;
                }
            } else {
                return true;
            }}
        }
    }
    return false;
}

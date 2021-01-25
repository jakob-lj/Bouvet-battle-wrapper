const ROTATE_LEFT = 'rotate-left';
const ROTATE_RIGHT = 'rotate-right';
const ADVANCE = 'advance';
const RETREAT = 'retreat';
const SHOOT = 'shoot';
const PASS = 'pass';

const MOVE_UP = { top: ADVANCE, bottom: ROTATE_LEFT, right: ROTATE_LEFT, left: ROTATE_RIGHT };
const MOVE_DOWN = { top: ROTATE_LEFT, bottom: ADVANCE, right: ROTATE_RIGHT, left: ROTATE_LEFT };
const MOVE_RIGHT = { top: ROTATE_RIGHT, bottom: ROTATE_LEFT, right: ADVANCE, left: ROTATE_LEFT };
const MOVE_LEFT = { top: ROTATE_LEFT, bottom: ROTATE_RIGHT, right: ROTATE_RIGHT, left: ADVANCE };

// module.exports = function (context, req) {
//     this.context = context;
//     context.log('JavaScript HTTP trigger function processed a request.');
//     let response = action(req);
//     context.res = {
//         headers: { 'Content-Type': 'application/json' },
//         body: response
//     };
//     context.done();
// };

module.exports = function action(req) {
    let response = {};
    if (req.params.query == 'command') {
        this.body = req.body;
        this.context.log('Return command.');
        this.context.log(this.body); // Remove if slow.
        response = !!this.body ? getCommand() : {};
    } else if (req.params.query == 'info') {
        this.context.log('Return info.');
        response = getInfo();
    }
    return response;
}

function getInfo() {
    const penguinName = 'Pingu';
    const teamName = 'TeamB Est';

    return { name: penguinName, team: teamName };
}

function getCommand() {
    let response = moveTowardsCenterOfMap();
    if (canIseeEnemy()) {
        if (isEnemyInFront()) {
            response = SHOOT;
        } else {
            response = rotateTowardsEnemy();
        }
    }
    return { command: response };
}

function isEnemyInFront() {

    let myX = this.body.you.x;
    let myY = this.body.you.y;
    let enemyX = this.body.enemies[0].x;
    let enemyY = this.body.enemies[0].y;

    if (myX == enemyX) {
        if (myY > enemyY && this.body.you.direction == 'top') {
            this.context.log("fiende over, skyter");
            return true;
        }
        else if (myY < enemyY && this.body.you.direction == 'bottom') {
            this.context.log("fiende under, skyter");
            return true;
        }
    }
    else if (myY == enemyY) {
        if (myX > enemyX && this.body.you.direction == 'left') {
            this.context.log("fiende over, skyter");
            return true;
        }
        else if (myX < enemyX && this.body.you.direction == 'bottom') {
            this.context.log("fiende under, skyter");
            return true;
        }
    }

    return false;
}

function rotateTowardsEnemy() {
    return RETREAT;
}

function canIseeEnemy() {
    return this.body.enemies[0].x !== undefined
}

function moveTowardsCenterOfMap() {
    const centerPointX = Math.floor(this.body.mapWidth / 2);
    const centerPointY = Math.floor(this.body.mapHeight / 2);

    return moveTowardsPoint(centerPointX, centerPointY);
}

function moveTowardsPoint(pointX, pointY) {
    const penguinPositionX = this.body.you.x;
    const penguinPositionY = this.body.you.y;
    const direction = this.body.you.direction;

    let plannedAction = PASS;

    if (penguinPositionX < pointX) {
        plannedAction = MOVE_RIGHT[direction];
    } else if (penguinPositionX > pointX) {
        plannedAction = MOVE_LEFT[direction];
    } else if (penguinPositionY < pointY) {
        plannedAction = MOVE_DOWN[direction];
    } else if (penguinPositionY > pointY) {
        plannedAction = MOVE_UP[direction];
    }

    if (plannedAction === ADVANCE && wallInFrontOfPenguin()) {
        plannedAction = SHOOT;
    }
    return plannedAction;
}

function doesCellContainWall(x, y) {
    return this.body.walls.some((wall) => wall.x == x && wall.y == y);
}

function wallInFrontOfPenguin() {
    const you = this.body.you;

    switch (this.body.you.direction) {
        case 'top':
            return doesCellContainWall(you.x, --you.y);
        case 'bottom':
            return doesCellContainWall(you.x, ++you.y);
        case 'left':
            return doesCellContainWall(--you.x, you.y);
        case 'right':
            return doesCellContainWall(++you.x, you.y);
        default:
            return true;
    }
}

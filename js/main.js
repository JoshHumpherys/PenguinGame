var container, paused, menu, last, buttons, buttonNames, buttonIndex, menuControlledbyMouse, expertLocked, expertButton, alternateMenu, alternateMenuDiv, introScreen, introScreenIndex, introScreenText, introScreenTextDiv, room, level, levels, penguin, right, left, px, py, dx, y0, a, v0, inAir, mapData, mapReferences, jumpCount, jumpStartTime, pauseStartTime, msSinceJump, pw, ps, up, down;
//var alternateMenuTextDiv;
var step = false; // TODO remove this
var stepping = false; // TODO remove this also

var initMenu = function() {
    container = initContainer();
    container.style.backgroundColor = '#000';
    container.style.backgroundImage = 'url(img/clouds.jpg)';
    document.body.appendChild(container);
    paused = false;
    menu = true;
    last = Date.now();
    buttons = {};
    buttonNames = ['story', 'options', 'help', 'about'];
    expertLocked = true;
    for(var i = 0; i < buttonNames.length; i++) {
        buttons[buttonNames[i]] = new Button(buttonNames[i], 50, 50 + 100 * (i + (expertLocked && i >= 1 ? 1 : 0)));
    }
    if(expertLocked) {
        expertButton = new ButtonLocked('expert', 50, 150);
    }
    buttonIndex = -1;
    menuControlledByMouse = true;
    alternateMenu = false;
    alternateMenuDiv = document.createElement('div');
    alternateMenuDiv.style.position = 'absolute';
    alternateMenuDiv.style.left = '300px';
    alternateMenuDiv.style.top = '200px';
    alternateMenuDiv.style.width = (800 - 300 - 50) + "px";
    alternateMenuDiv.style.height = '100px';
    //alternateMenuDiv.style.backgroundColor = '#f0f';
    //alternateMenuTextDiv = document.createElement('div');
    //alternateMenuTextDiv.style.padding = '10px';
    //alternateMenuTextDiv.innerHTML = 'hello world';
    //alternateMenuDiv.innerHTML = alternateMenuTextDiv.outerHTML;
    //container.appendChild(alternateMenuDiv);
    
    //alternateMenuDiv.innerHTML = 'hello world';
    container.appendChild(alternateMenuDiv);
}

var initIntroScreen = function() {
    menu = false;
    document.getElementById('container').remove();
    container = initContainer();
    document.body.appendChild(container);
    introScreenText = ['screen1text', 'screen2text', 'screen3text'];
    introScreenTextDiv = document.createElement('div');
    introScreenTextDiv.style.backgroundColor = '#000';
    introScreenTextDiv.style.width = '100%';
    introScreenTextDiv.style.height = '100px';
    introScreenTextDiv.style.textAlign = 'center';
    introScreenTextDivChild = document.createElement('div');
    introScreenTextDivChild.style.color = '#fff';
    introScreenTextDivChild.style.padding = '10px';
    introScreenTextDivChild.style.margin = '0 auto';
    introScreenTextDiv.appendChild(introScreenTextDivChild);
    container.appendChild(introScreenTextDiv);
    introScreenIndex = 0;
    setIntroScreen(0);
}

var setIntroScreen = function(i) {
    introScreen = true;
    if(i >= introScreenText.length) {
        initGame();
        return;
    }
    container.style.backgroundImage = 'url(img/intro'+i+'.jpg)';
    introScreenTextDivChild.innerHTML = introScreenText[i];
}

var nextIntroScreen = function() {
    setIntroScreen(++introScreenIndex);
}

var initGame = function() {
    introScreen = false;
    right = left = false;
    up = down = false;

    // init main container
    document.getElementById('container').remove();
    container = initContainer();
    document.body.appendChild(container);
    container.style.backgroundImage = 'url(img/bg.jpg)';
    
    // init penguin and add to container
    penguin = document.createElement('div');
    penguin.style.position = 'absolute';
    pw = 14;
    ps = (20 - pw) / 2;
    px = 100 + ps;
    py = 200;
    dx = 180;
    a = 12;
    v0 = -5;
    y0 = py;
    inAir = false;
    jumpCount = 0;
    penguin.style.left = (px - ps) + 'px';
    penguin.style.top = py + 'px';
    penguin.style.width = '20px';
    penguin.style.height = '20px';
    var penguinImg = document.createElement('img');
    penguinImg.setAttribute('src','img/penguin.png');
    penguinImg.style.height = penguin.style.height;
    penguinImg.style.display = 'block';
    penguinImg.style.margin = 'auto';
    penguin.innerHTML = penguinImg.outerHTML;
    container.appendChild(penguin);
    
    // init room, level vars
    room = 0;
    levels = [0, 2, 4, 6];
//    for(var i = 0; i < levels.length; i++) {
//        if(room < levels[i]) {
//            room = levels[i - 1];
//        }
//    }
    
    // init all blocks
    initBlocks(room);
}

var initContainer = function() {
    var container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = (document.body.clientWidth-800)/2 + 'px';
    container.style.top = 50 + 'px';
    container.style.width = '800px';
    container.style.height = '600px';
    container.style.cursor = 'initial';
    container.setAttribute('id','container');
    return container;
}

var initBlocks = function(map) {
    switch(map) {
    case 0:
        mapData = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                   [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [2,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
                   [1,1,1,1,1,1,1,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1],
                   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                   [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];
        break;
    default:
        console.log('This is not good');
        return;
    }
    mapReferences = new Array(30);
    for(var i = 0; i < 30; i++) {
        mapReferences[i] = new Array(40);
    }
    for(var i = 0; i < mapData.length; i++) {
        for(var j = 0; j < mapData[i].length; j++) {
            var block;
            if(mapData[i][j] == 1) {
                container.appendChild((block = new Block(j, i, 20, true)).block);
            }
            else if(mapData[i][j] == 2) {
                container.appendChild((block = new Block(j, i, 20, false)).block);
            }
            mapReferences[i][j] = block;
        }
    }

/*
    //var blob = new Blob(["This is my blob content"], {type : "text/plain"});
    var blob;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'maps/map' + map); // add .txt?
    xhr.responseType = 'blob';
    xhr.onload = function() {
        blob = xhr.response;
        var reader = new FileReader();
        reader.onload = function(e) {
            alert('success');
            console.log(e.target.result);
        }
        reader.onerror = function(e) {
            alert(e.target.error);
        }
        reader.readAsText(blob);
    }
    xhr.send();
//    reader.readAsText(new File('/maps/map'+map+'.txt'));
*/
}

var loop = function() {
    setTimeout(loop, 17);
    if(!paused) {
        var now = Date.now();
        update(now - last);
//        if(step || stepping) {
//            step = false;
//            update(17); // TODO not this
//        }
        last = now;
    }
}

var update = function(delta) {
    if(!menu && !introScreen) {
        /*
        // store updated x and y
        
        // check if new coordinates cause x collision
        // check if new coordinates cause y collision
        
        // if no collisions, set x and y to updated
        // else if only x collision, adjust x, set y to updated
        // else if only y collision, adjust y, set x to updated
        // else if both x and y collisions
            // if x collision with (old x, old y) AND (old x, new y)
                // adjust y, set x to updated
            // else if y collision with (old x, old y) AND (new x, old y)
                // adjust x, set y to update
            // else if BOTH above are true, adjust both (corner)
            // else if NEITHER above are true, adjust whichever hit first, set the other to updated
        */
    
        // store updated x and y
        var npx = px;
        var npy = py;
        
        // calculate new x
        if(right && !left) {
            npx += dx * delta / 1000;
        }
        else if(left && !right) {
            npx -= dx * delta / 1000;
        }
        
        if(up && !down) {
            npy -= dx * delta / 1000;
        }
        else if(down && !up) {
            npy += dx * delta / 1000;
        }
        
        // calculate new y, dy
        msSinceJump += delta;
        // dy/dt = a * t + v0
        var dy = a * msSinceJump / 1000 + v0;
        if(inAir) {
            npy += dy;
        }
        
        var blockTopLeft = true;
        var blockDownLeft = npy % 20 != 0;
        var blockTopRight = Math.floor((npx + pw)/20) > Math.floor(npx/20);
        var blockDownRight = blockDownLeft && blockTopRight;
        
//        console.log("1 tl = " + blockTopLeft);
//        console.log("1 dl = " + blockDownLeft);
//        console.log("1 tr = " + blockTopRight);
//        console.log("1 dr = " + blockDownRight);
        
        if(blockTopLeft) {
            blockTopLeft = checkCollision(npx, npy, pw, 0, 0);
        }
        if(blockDownLeft) {
            blockDownLeft = checkCollision(npx, npy, pw, 0, 1);
        }
        if(blockTopRight) {
            blockTopRight = checkCollision(npx, npy, pw, 1, 0);
        }
        if(blockDownRight) {
            blockDownRight = checkCollision(npx, npy, pw, 1, 1);
        }
        
//        console.log("2 tl = " + blockTopLeft);
//        console.log("2 dl = " + blockDownLeft);
//        console.log("2 tr = " + blockTopRight);
//        console.log("2 dr = " + blockDownRight);

        if(!blockDownLeft && !blockDownRight && !blockTopLeft && !blockTopRight) {
//            console.log('case 1');
            px = npx;
            py = npy;
        }
        else if(blockDownLeft && blockDownRight && !blockTopLeft && !blockTopRight) {
//            console.log('case 2');
            px = npx;
            shiftYUp(npy);
        }
        else if(blockTopLeft && blockTopRight && !blockDownLeft && !blockDownRight) {
//            console.log('case 3');
            px = npx;
            shiftYDown(npy);
        }
        else if(blockTopLeft && blockDownLeft && !blockTopRight && !blockDownRight) {
//            console.log('case 4');
            shiftXRight(npx);
            py = npy;
        }
        else if(blockTopRight && blockDownRight && !blockTopLeft && !blockDownLeft) {
//            console.log('case 5');
            shiftXLeft(npx);
            py = npy;
        }
        else if(blockDownLeft && blockDownRight && blockTopLeft && !blockTopRight) {
//            console.log('case 6');
            shiftXRight(npx);
            shiftYUp(npy);
        }
        else if(blockDownLeft && blockDownRight && blockTopRight && !blockTopLeft) {
//            console.log('case 7');
            shiftXLeft(npx);
            shiftYUp(npy);
        }
        else if(blockDownLeft && blockTopLeft && blockTopRight && !blockDownRight) {
//            console.log('case 8');
            shiftXRight(npx);
            shiftYDown(npy);
        }
        else if(blockDownRight && blockTopLeft && blockTopRight && !blockDownLeft) {
//            console.log('case 9');
            shiftXLeft(npx);
            shiftYDown(npy);
        }
        else if(blockDownRight && blockTopLeft) {
//            console.log('case 14');
            if(dy > 0) {
                shiftXRight(npx);
                shiftYUp(npy);
            }
            else {
                shiftXLeft(npx);
                shiftYDown(npy);
            }
        }
        else if(blockDownLeft && blockTopRight) {
//            console.log('case 15');
            if(dy > 0) {
                shiftXLeft(npx);
                shiftYUp(npy);
            }
            else {
                shiftXRight(npx);
                shiftYDown(npy);
            }
        }
        else {
            var xCollisionBefore = checkXCollisionBefore(npx, npy, pw, (blockTopRight || blockDownRight) ? 1 : 0, (blockDownRight || blockDownLeft) ? 1 : 0);
            var yCollisionBefore = checkYCollisionBefore(npx, npy, pw, (blockTopRight || blockDownRight) ? 1 : 0, (blockDownRight || blockDownLeft) ? 1 : 0);
            if(blockDownLeft) {
                if(xCollisionBefore && !yCollisionBefore) {
//                    console.log('case 10a');
                    px = npx;
                    shiftYUp(npy);
                }
                else if(yCollisionBefore && !xCollisionBefore) {
//                    console.log('case 10b');
                    shiftXRight(npx);
                    py = npy;
                }
                else {
//                    console.log('case 10c');
                    adjustAdvanced(npx, npy, dy);
                }
            }
            else if(blockDownRight) {
                if(xCollisionBefore && !yCollisionBefore) {
//                    console.log('case 11a');
                    px = npx;
                    shiftYUp(npy);
                }
                else if(yCollisionBefore && !xCollisionBefore) {
//                    console.log('case 11b');
                    shiftXLeft(npx);
                    py = npy;
                }
                else {
//                    console.log('case 11c');
                    adjustAdvanced(npx, npy, dy);
                }
            }
            else if(blockTopLeft) {
                if(xCollisionBefore && !yCollisionBefore) {
//                    console.log('case 12a');
                    px = npx;
                    shiftYDown(npy);
                }
                else if(yCollisionBefore && !xCollisionBefore) {
//                    console.log('case 12b');
                    shiftXRight(npx);
                    py = npy;
                }
                else {
//                    console.log('case 12c');
                    adjustAdvanced(npx, npy, dy);
                }
            }
            else if(blockTopRight) {
                if(xCollisionBefore && !yCollisionBefore) {
//                    console.log('case 13a');
                    px = npx;
                    shiftYDown(npy);
                }
                else if(yCollisionBefore && !xCollisionBefore) {
//                    console.log('case 13b');
                    shiftXLeft(npx);
                    py = npy;
                }
                else {
//                    console.log('case 13c');
                    adjustAdvanced(npx, npy, dy);
                }
            }
        }
        
        /*
        //var newXCollisionTop, newXCollisionDown, oldXCollisionTop, oldXCollisionDown, newYCollisionLeft, newYCollisionRight, oldYCollisionLeft, oldYCollisionRight;
        var newXCollisionTop = checkXCollision(npx, npy, pw, right ? 1 : 0, 0);
        var newXCollisionDown = inAir ? checkXCollision(npx, npy, pw, right ? 1 : 0, 1) : false;
        var oldXCollisionTop = (left == right) ? newXCollisionTop : checkXCollision(px, npy, pw, right ? 1 : 0, 0);
        var oldXCollisionDown = inAir ? ((left == right) ? newXCollisionDown : checkXCollision(px, npy, pw, right ? 1 : 0, 1)) : false;
        var newYCollisionLeft = checkYCollision(npx, npy, pw, 0, (!inAir || dy > 0) ? 1 : 0);
        var newYCollisionRight = (px % 20 == 0) ? false : checkYCollision(npx, npy, pw, 1, (!inAir || dy > 0) ? 1 : 0);
        var oldYCollisionLeft = !inAir ? newYCollisionLeft : checkYCollision(npx, py, pw, 0, (!inAir || dy > 0) ? 1 : 0);
        var oldYCollisionRight = (px % 20 == 0) ? false : (!inAir ? newYCollisionRight : checkYCollision(npx, py, pw, 1, (!inAir || dy > 0) ? 1 : 0));
        
        var blockUnderneathLeft = (!(!inAir || dy > 0)) ? newYCollisionLeft : checkYCollision(npx, npy, pw, 0, 1);
        var blockUnderneathRight = (px % 20 == 0) ? false : ((!(!inAir || dy > 0)) ? newYCollisionRight : checkYCollision(npx, npy, pw, 1, 1));
        
//        if(newXCollisionTop) {
//            mapReferences[Math.floor(py/20)][Math.floor(px/20) + right ? 1 : 0];
//        }
//        if(newXCollisionDown) {
//            mapReferences[Math.floor(py/20)+1][Math.floor(px/20) + right ? 1 : 0];
//        }
//        if(newYCollisionLeft) {
//            mapReferences[Mmath.floor(py/20) + !inAir
//        }
//        if(newYCollisionRight) {
//        
//        }        

        
        //console.log('');
        //console.log("newXCollisionTop = " + newXCollisionTop);
        //console.log("newXCollisionDown = " + newXCollisionDown);
        //console.log("oldXCollisionTop = " + oldXCollisionTop);
        //console.log("oldXCollisionDown = " + oldXCollisionDown);
        //console.log("newYColilsionLeft = " + newYCollisionLeft);
        //console.log("newYCollisionRight = " + newYCollisionRight);
        //console.log("oldYCollisionLeft = " + oldYCollisionLeft);
        //console.log("oldYCollisionRight = " + oldYCollisionRight);
        
        if(!newXCollisionTop && !newXCollisionDown && !newYCollisionLeft && !newYCollisionRight) {
            px = npx;
            //if(!blockUnderneathLeft && !blockUnderneathRight) {
            //    if(!inAir) {
            //        fall();
            //    }
            //}
//            else {
//                mapReferences[Math.floor(npy/20)][Math.floor(npx/20)].block.style.backgroundColor = '#f0f';
//            }
            py = npy;
        }
        else if(!inAir && left != right) {
            if(newXCollisionTop && !oldXCollisionTop) {
                if(left) {
                    px = (Math.ceil(npx / 20)) * 20;
                }
                else {
                    px = Math.floor((npx + pw) / 20) * 20 - pw;
                }
            }
            else {
                px = npx;
            }
        }
        else if(inAir && left == right) {
            if((newYCollisionLeft || newYCollisionRight) && (!oldYCollisionLeft || !oldYCollisionRight)) {
                if(dy < 0) {
                    py = Math.ceil(npy / 20) * 20;
                    hitCeiling();
                }
                else {
                    py = Math.floor((npy / 20)) * 20;
                    land();
                }
            }
            else {
                py = npy;
            }
        }
        
        var newXCollision;
        var newYCollision;
        // check if new coordinates cause x or y collisions
        //var xCollision = (left != right) ? checkCollision(npx, npy, nw, right ? 1 : 0, 0) || checkCollision(npx, npy, nw, right ? 1 : 0, 1) : false;
        //var yCollision = (inAir) ? checkCollision(npx, npy, nw, 0, dy > 0 ? 1 : 0) || checkCollision(npx, npy, nw, 1, dy > 0 ? 1 : 0) : false;
        
//        console.log(xCollision + ", " + yCollision);
        
        // if no collisions, set x and y to updated
        // else if only x collision, adjust x, set y to updated
        // else if only y collision, adjust y, set x to updated
        // else if both x and y collisions
            // if x collision with (old x, old y) AND (old x, new y)
                // adjust y, set x to updated
            // else if y collision with (old x, old y) AND (new x, old y)
                // adjust x, set y to update
            // else if BOTH above are true, adjust both (corner)
            // else if NEITHER above are true, adjust whichever hit first, set the other to updated
        */
        
        movePenguinDiv();
    }
}

// h = 0 for right blocks, h = 1 for left blocks
// v = 0 for top blocks, v = 1 for down blocks
var checkCollision = function(x, y, w, h, v) {
    // 00 10
    // 01 11
    var blockType = mapData[Math.floor(y/20) + v][Math.floor(x/20) + h];
    if(blockType == 0) {
        return false;
    }
    var bx = 20 * (Math.floor(x/20) + h);
    var by = 20 * (Math.floor(y/20) + v);
    return x < bx + 20 && x + w > bx && y < by + 20 && y + 20 > by;
}

// h = 0 for right blocks, h = 1 for left blocks
// v = 0 for top blocks, v = 1 for down blocks
var checkXCollision = function(x, y, w, h, v) {
    // 00 10
    // 01 11
    var blockType = mapData[Math.floor(y/20) + v][Math.floor(x/20) + h];
    if(blockType == 0) {
        return false;
    }
    var bx = 20 * (Math.floor(x/20) + h);
    return x < bx + 20 && x + w > bx;
}

// h = 0 for right blocks, h = 1 for left blocks
// v = 0 for top blocks, v = 1 for down blocks
var checkYCollision = function(x, y, w, h, v) {
    // 00 10
    // 01 11
    var blockType = mapData[Math.floor(y/20) + v][Math.floor(x/20) + h];
    if(blockType == 0) {
        return false;
    }
    var by = 20 * (Math.floor(y/20) + v);
    return y < by + 20 && y + 20 > by;
}

// h = 0 for right blocks, h = 1 for left blocks
// v = 0 for top blocks, v = 1 for down blocks
var checkXCollisionBefore = function(x, y, w, h, v) {
    // 00 10
    // 01 11
    var blockType = mapData[Math.floor(y/20) + v][Math.floor(x/20) + h];
    if(blockType == 0) {
        return false;
    }
    var bx = 20 * (Math.floor(x/20) + h);
    return px < bx + 20 && px + w > bx;
}

// h = 0 for right blocks, h = 1 for left blocks
// v = 0 for top blocks, v = 1 for down blocks
var checkYCollisionBefore = function(x, y, w, h, v) {
    // 00 10
    // 01 11
    var blockType = mapData[Math.floor(y/20) + v][Math.floor(x/20) + h];
    if(blockType == 0) {
        return false;
    }
    var by = 20 * (Math.floor(y/20) + v);
    return py < by + 20 && py + 20 > by;
}

var shiftXLeft = function(npx) {
    px = 20 * Math.ceil(npx / 20) - pw;
}

var shiftXRight = function(npx) {
    px = 20 * Math.ceil(npx / 20);
}

var shiftYUp = function(npy) {
    py = 20 * Math.ceil(npy / 20 - 1);
    land();
}

var shiftYDown = function(npy) {
    py = 20 * Math.ceil(npy / 20);
    hitCeiling();
}

var adjustAdvanced = function(npx, npy, dy) {
    console.log('advanced');
}

var pause = function() {
    paused = true;
    pauseStartTime = Date.now();
}

var unpause = function() {
    paused = false;
    last = Date.now();
}

var jump = function() {
    if(jumpCount < 2) {
        msSinceJump = 0;
        jumpCount++;
        inAir = true;
    }
}

var land = function() {
    jumpCount = 0;
    inAir = false;
}

var fall = function() {
    inAir = true;
    jumpCount++;
    // y = 1/2 * a * t^2 + v0 * t + y0
    // dy/dt  = a * t + v0
    // dy/dt = 0 = a * t + v0
    // t = -v0 / a
    msSinceJump = -1000 * v0 / a;
}

var hitCeiling = function() {
    fall();
    jumpCount--;
}

var movePenguinDiv = function() {
    penguin.style.left = px - ps + 'px';
    penguin.style.top = py + 'px';
}

var removeAllButtons = function() {
    for(var i = 0; i < buttonNames.length; i++) {
        buttons[buttonNames[i]].hide();
    }
    if(expertLocked) {
        expertButton.button.style.display = 'none';
        expertButton.isShowing = false;
    }
}

var showAllButtons = function() {
    for(var i = 0; i < buttonNames.length; i++) {
        buttons[buttonNames[i]].show();
    }
    if(expertLocked) {
        expertButton.button.style.display = 'block';
        expertButton.isShowing = true;
    }
}

function Block(x, y, w, visible) {
    var block = this.block = document.createElement('div');
    this.visible = visible;
    this.initVisible = visible;
    block.style.position = 'absolute';
    block.style.left = x * w + 'px';
    block.style.top = y * w + 'px';
    block.style.width = block.style.height = w + 'px';
//    block.style.backgroundColor = '#008080';
    block.style.backgroundColor = '#7ec0ee';
    block.style.display = visible ? 'block' : 'none';
}

Block.prototype.show = function() {
    this.visible = true;
    this.block.style.display = 'block';
}

Block.prototype.hide = function() {
    this.visible = false;
    this.block.style.display = 'none';
}

function ButtonLocked(name, x, y) {
    this.isShowing = true;
    this.name = name;
    var button = this.button = document.createElement('div');
    button.style.position = 'absolute';
    button.style.left = x + 'px';
    button.style.top = y + 'px';
    button.style.width = '200px';
    button.style.height = '50px';
    button.style.backgroundColor = '#555';
    container.appendChild(button);
}

function Button(name, x, y) {
    this.isShowing = true;
    this.name = name;
    this.mouseOver = false;
    var button = this.button = document.createElement('div');
    button.style.position = 'absolute';
    button.style.left = x + 'px';
    button.style.top = y + 'px';
    button.style.width = '200px';
    button.style.height = '50px';
    button.style.backgroundColor = this.defaultColor;
    button.setAttribute('onmouseenter', 'buttonIndex=buttonNames.indexOf(\''+name+'\');buttons[\''+name+'\'].mouseOver = true;buttons[\''+name+'\'].highlight()');
    button.setAttribute('onmouseout', 'buttonIndex=buttonNames.indexOf(\''+name+'\');buttons[\''+name+'\'].mouseOver = false;buttons[\''+name+'\'].unhighlight()');
    button.setAttribute('onmousedown', 'menuControlledByMouse = true;buttonIndex=buttonNames.indexOf(\''+name+'\');buttons[\''+name+'\'].mouseOver = true;buttons[\''+name+'\'].select()');
    
//    var inner = document.createElement('div');
//    inner.style.width = '180px';
//    inner.style.height = '30px';
//    inner.style.display = 'block';
//    inner.style.margin = 'auto';
//    inner.style.backgroundColor = this.innerColor;
//    inner.innerHTML = name.toUpperCase();
//    button.innerHTML = inner.outerHTML;

    button.style.cursor = 'pointer';
    button.style.color = '#fff';
    button.style.fontSize = '30px';
    button.style.textAlign = 'center';
    button.style.fontFamily = 'Verdana, Geneva, sans-serif';
    button.style.lineHeight = '50px';
    button.innerHTML = name.toUpperCase();
    container.appendChild(button);
}

Button.prototype.highlightColor = '#008080';
Button.prototype.defaultColor = '#7ec0ee';

Button.prototype.hide = function() {
    this.button.style.display = 'none';
    this.isShowing = false;
}

Button.prototype.show = function() {
    this.button.style.display = 'block';
    this.isShowing = true;
    if(menuControlledByMouse) {
        this.unhighlight();
    }
}

Button.prototype.highlight = function() {
    this.button.style.backgroundColor = this.highlightColor;
}

Button.prototype.unhighlight = function() {
    this.button.style.backgroundColor = this.defaultColor;
}

Button.prototype.select = function() {
    if(this.isShowing) {
        if(buttonNames.indexOf(this.name) == -1) {
            console.log('We\'ve got a bit of an issue here');
            return;
        }
        if(menuControlledByMouse) {
            buttonIndex = -1;
        }
        switch(this.name) {
        case 'story':
            initIntroScreen();
            break;
        case 'expert':
            switchMenuAlternate('Entering expert mode');
            break;
        case 'options':
            switchMenuAlternate('Here are your options');
            break;
        case 'help':
            switchMenuAlternate('Here is help');
            break;
        case 'about':
            switchMenuAlternate('Coded by Josh Humpherys in Janurary/February of 2016<br />Why? Play story mode to find out!');
            break;
        }
    }
}
Button.prototype.containsMouse = function() {
    return this.mouseOver;
}

var switchMenuAlternate = function(s) {
    alternateMenu = true;
    removeAllButtons();
    alternateMenuDiv.innerHTML = s + '<br /><br />Press any key to return to the main menu';
}

var switchMenuMain = function() {
    alternateMenu = false;
    showAllButtons();
    alternateMenuDiv.innerHTML = '';
}

window.onmousedown = function(e) {
//    if(introScreen) {
//        nextIntroScreen();
//    }
//    else if(alternateMenu) {
//        switchMenuMain();
//    }
}

window.onmousemove = function(e) {
    if(menu && !menuControlledByMouse) {
        menuControlledByMouse = true;
        var indexChanged = false;
        for(var i = 0; i < buttonNames.length; i++) {
            if(buttons[buttonNames[i]].containsMouse()) {
                buttons[buttonNames[i]].highlight();
                indexChanged = true;
            }
            else {
                buttons[buttonNames[buttonIndex]].unhighlight();
            }
        }
        if(!indexChanged) {
            buttonIndex = -1;
        }
    }
}

window.onkeydown = function(e) {
    var key = e.keyCode ? e.keyCode : e.which;
    if(key == 32) {
        e.preventDefault();
    }
    if(key == 83) { // TODO remove this
        step = true;
    }
    if(key == 65) {
        stepping = !stepping;
    }
    if([37,38,39,40].indexOf(key) != -1) {
        e.preventDefault();
        if(menu) {
            menuControlledByMouse = false;
            for(var i = 0; i < buttonNames.length; i++) {
                buttons[buttonNames[i]].unhighlight();
            }
        }
    }
    var menuSelector = function(i) {
        if(buttonIndex == -1) {
            if(i == 1) {
                buttonIndex = -1;
            }
            else {
                buttonIndex = 0;
            }
        }
        else {
            buttons[buttonNames[buttonIndex]].unhighlight();
        }
        buttonIndex += i;
        buttonIndex = ((buttonIndex%buttonNames.length)+buttonNames.length)%buttonNames.length;
        buttons[buttonNames[buttonIndex]].highlight();
    }
    
    //alert(key);
    if(introScreen) {
        if(key == 83) {
            initGame();
        }
        else {
            nextIntroScreen();
        }
    }
    else if(menu && alternateMenu) {
        switchMenuMain();
    }
    else if(menu) {
        switch(key) {
        case 37:
            menuSelector(-1);
            break;
        case 38:
            menuSelector(-1);
            break;
        case 39:
            menuSelector(1);
            break;
        case 40:
            menuSelector(1);
            break;
        case 13:
            if(!menuControlledByMouse) {
                buttons[buttonNames[buttonIndex]].select();
            }
            break;
        }
    }
    else { // game
        if(key == 37) {
            left = true;
        }
        else if(key == 39) {
            right = true;
        }
        else if(key == 32) {
            jump();
        }
        else if(key == 38) {
            up = true;
        }
        else if(key == 40) {
            down = true;
        }
    }
}

window.onkeyup = function(e) {
    var key = e.keyCode ? e.keyCode : e.which;    
    if(!menu && !introScreen) { // game
        if(key == 37) {
            left = false;
        }
        else if(key == 39) {
            right = false;
        }
        else if(key == 38) {
            up = false;
        }
        else if(key == 40) {
            down = false;
        }
    }
}

initMenu();
loop();

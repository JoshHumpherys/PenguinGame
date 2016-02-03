var container, paused, menu, last, buttons, buttonNames, buttonIndex, menuControlledbyMouse, expertLocked, expertButton, alternateMenu, alternateMenuDiv, introScreen, introScreenIndex, introScreenText, introScreenTextDiv, room, level, levels, penguin, right, left, px, py, dx, y0, a, v0, inAir, mapData, mapReferences, jumpCount, jumpStartTime, pauseStartTime;
//var alternateMenuTextDiv;

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

    // init main container
    document.getElementById('container').remove();
    container = initContainer();
    document.body.appendChild(container);
    container.style.backgroundImage = 'url(img/bg.jpg)';
    
    // init penguin and add to container
    penguin = document.createElement('div');
    penguin.style.position = 'absolute';
    px = 100;
    py = 200;
    dx = 180;
    a = 12;
    v0 = -5;
    y0 = py;
    inAir = false;
    jumpCount = 0;
    //jump(); // TODO don't jump on start
    penguin.style.left = px + 'px';
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
                   [1,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [2,0,0,0,2,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
                   [1,0,0,0,0,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1],
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
        console.log('This is not good');i
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
        last = now;
    }
}

var update = function(delta) {
    if(!menu && !introScreen) {
        var npx = px + 3;
        var nw = 20 - 3 * 2;
        var npy = py;
        var nnpy, nnpx;
        
        // calculate new x
        if(right && !left) {
            npx += dx * delta / 1000;
        }
        else if(left && !right) {
            npx -= dx * delta / 1000;
        }
        
        // calculate new y, dy
        var dy = a * (Date.now() - jumpStartTime) / 1000 + v0;
        if(inAir) {
            // dy/dt = a * t + v0
            npy += dy;
        }
        
        var xCollision = false;
        if(right != left) {
            if(right) {
                var blockRightTop = mapData[Math.floor(npy/20)][Math.ceil(npx/20)];
                var blockRightBottom = mapData[Math.ceil(npy/20)][Math.ceil(npx/20)];
                if((blockRightTop == '1' || blockRightTop == '2') && npx + nw > Math.ceil(npx/20)*20) {
                    nnpx = Math.ceil(npx/20)*20 - nw;
                    xCollision = true;
                    mapReferences[Math.floor(npy/20)][Math.ceil(npx/20)].show();
                }
                if((blockRightBottom == '1' || blockRightBottom == '2') && npx + nw > Math.ceil(npx/20)*20) {
                    nnpx = Math.ceil(npx/20)*20 - nw;
                    xCollision = true;
                    mapReferences[Math.ceil(npy/20)][Math.ceil(npx/20)].show();
                }
            }
            else if(left) {
                var blockLeftTop = mapData[Math.floor(npy/20)][Math.floor(npx/20)];
                var blockLeftBottom = mapData[Math.ceil(npy/20)][Math.floor(npx/20)];
                if((blockLeftTop == '1' || blockLeftTop == '2') && npx < (Math.floor(npx/20) + 1)*20) {
                    nnpx = (Math.floor(npx/20) + 1)*20;
                    xCollision = true;
                    mapReferences[Math.floor(npy/20)][Math.floor(npx/20)].show();
                }
                if((blockLeftBottom == '1' || blockLeftBottom == '2') && npx < (Math.floor(npx/20) + 1)*20) {
                    nnpx = (Math.floor(npx/20) + 1)*20;
                    xCollision = true;
                    mapReferences[Math.ceil(npy/20)][Math.floor(npx/20)].show();
                }
            }
        }
        
        
        var yCollision = false;
        var potentialLand = false;
        var potentialHitCeiling = false;
        var needsToFall = false;
        if(inAir) { // if stopped by block, then adjust and land            
            if(dy > 0) {
                var blockDownLeft = mapData[Math.ceil(npy/20)][Math.floor(npx/20)];
                var blockDownRight = mapData[Math.ceil(npy/20)][Math.ceil(npx/20)];
                if((blockDownLeft == '1' || blockDownLeft == '2') && npy + 20 > Math.ceil(npy/20)*20) {
                    nnpy = Math.ceil(npy/20)*20 - 20;
                    yCollision = true;
                    mapReferences[Math.ceil(npy/20)][Math.floor(npx/20)].show();
                    potentialLand = true;
                }
                if((blockDownRight == '1' || blockDownRight == '2') && npy + 20 > Math.ceil(npy/20)*20) {
                    nnpy = Math.ceil(npy/20)*20 - 20;
                    yCollision = true;
                    mapReferences[Math.ceil(npy/20)][Math.ceil(npx/20)].show();
                    potentialLand = true;
                }
            }
            else if(dy < 0) {
                var blockUpLeft = mapData[Math.floor(npy/20)][Math.floor(npx/20)];
                var blockUpRight = mapData[Math.floor(npy/20)][Math.ceil(npx/20)];
                if((blockUpLeft == '1' || blockUpLeft == '2') && npy < (Math.floor(npy/20) + 1)*20) {
                    console.log('asdf');
                    nnpy = Math.floor(npy/20 + 1)*20;
                    yCollision = true;
                    mapReferences[Math.floor(npy/20)][Math.floor(npx/20)].show();
                    potentialHitCeiling = true;
                }
                if((blockUpRight == '1' || blockUpRight == '2') && npy < (Math.floor(npy/20) + 1)*20) {
                    console.log('asdf2');
                    nnpy = Math.floor(npy/20 + 1)*20;
                    yCollision = true;
                    mapReferences[Math.floor(npy/20)][Math.ceil(npx/20)].show();
                    potentialHitCeiling = true;
                }
            }
        }
        else { // if needs to fall, then fall, else show
//            console.log('testing for fall' + Date.now() +", y = " + Math.ceil(npy/20) + ", xLeft = " + Math.floor(npx/20) + ", xRight = " + Math.ceil(npx/20));
            var blockDownLeft = mapData[Math.ceil(npy/20) + 1][Math.floor(npx/20)];
            var blockDownRight = mapData[Math.ceil(npy/20) + 1][Math.ceil(npx/20)];
            if((blockDownLeft == '1' || blockDownLeft == '2') && npy + 20 > Math.ceil(npy/20)*20) {
                nnpy = (Math.ceil(npy/20) + 1)*20 - 20;
                yCollision = true;
                mapReferences[Math.ceil(npy/20) + 1][Math.floor(npx/20)].show();
            }
            if((blockDownRight == '1' || blockDownRight == '2') && npy + 20 > Math.ceil(npy/20)*20) {
                nnpy = (Math.ceil(npy/20) + 1)*20 - 20;
                yCollision = true;
                mapReferences[Math.ceil(npy/20) + 1][Math.ceil(npx/20)].show();
            }
            if(!yCollision) {
                needsToFall = true;
            }
        }
        
        if(xCollision && yCollision) {
            // this is where it gets complicated
            // we need to use one of nnpx and nnpy and one of npx and npy (one adjusted, one non-adjusted)... or both if corner
//            console.log('both x and y collisions');
            console.log("inAir = " + inAir + "\npotentialLand = " + potentialLand + "\npotentialHitCeling = " + potentialHitCeiling + "\nneedsToFall = " + needsToFall);
        }
        else {
            var date = Date.now();
            if(xCollision) {
            //    console.log("xCollision, " + date);
            }
            if(yCollision) {
            //    console.log("yCollision, " + date);
            }
            if(!yCollision) {
                nnpy = npy;
            }
            if(!xCollision) {
                nnpx = npx;
            }
//            if(!yCollision) {
                px = nnpx - 3;
                penguin.style.left = px + 'px';
//                console.log('no y collision. changing x');
//            }
//            if(!xCollision) {
            if(needsToFall) {
                fall();
            }
            else if(potentialLand) {
                land();
            }
            else if(potentialHitCeiling) {
                hitCeiling();
            }
            py = nnpy;
            penguin.style.top = py + 'px';
//                console.log('no x collision. changing y');
//            }
        }
        
        if(py > container.style.height) {
            alert('We\'ve encountered a bit of a problem. Please refresh the page to restart the game.');
            pause();
        }
    }
}

var pause = function() {
    paused = true;
    pauseStartTime = Date.now();
}

var unpause = function() {
    paused = false;
    last = Date.now();
    jumpStartTime += pauseStartTime;
}

var jump = function() {
    if(jumpCount < 2) {
        jumpStartTime = Date.now();
        jumpCount++;
        inAir = true;
    }
}

var land = function() {
    jumpCount = 0;
    inAir = false;
}

var fall = function() {
    console.log('starting fall');
    inAir = true;
    jumpCount++;
    // y = 1/2 * a * t^2 + v0 * t + y0
    // dy/dt  = a * t + v0
    // dy/dt = 0 = a * t + v0
    // t = -v0 / a
    // jumpStartTime = now - t;
    jumpStartTime = Date.now() + 1000 * v0 / a;
}

var hitCeiling = function() {
    fall();
    jumpCount--;
    console.log('but not actually a fall');
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
    }
}

initMenu();
loop();

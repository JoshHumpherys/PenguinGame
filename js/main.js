var container, paused, menu, last, buttons, buttonNames, buttonIndex, menuControlledbyMouse, expertLocked, expertButton, alternateMenu, alternateMenuDiv, introScreen, introScreenIndex, introScreenText, introScreenTextDiv, room, level, levels;
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
    // init main container
    document.getElementById('container').remove();
    container = initContainer();
    document.body.appendChild(container);
    container.style.backgroundImage = 'url(img/bg.jpg)';
    
    // init penguin and add to container
    var penguin = document.createElement('div');
    penguin.style.position = 'absolute';
    penguin.style.left = '100px';
    penguin.style.top = '200px';
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
    container.setAttribute('id','container');
    return container;
}

var initBlocks = function(map) {
    var mapData;
    switch(map) {
    case 0:
        mapData = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
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
                   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];
        break;
    default:
        console.log('This is not good');
        return;
    }
    for(var i = 0; i < mapData.length; i++) {
        for(var j = 0; j < mapData[i].length; j++) {
            if(mapData[i][j] == 1) {
                container.appendChild(new Block(j, i, 20, true));
            }
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
    setTimeout(loop, 40);
    if(!paused) {
        var now = Date.now();
        update(now - last);
        last = now;
    }
}

var update = function(delta) {
    if(menu) {
    
    }	
    else {
        //console.log(delta / 1000);        
    }
}

var pause = function() {
    paused = true;
}

var unpause = function() {
    paused = false;
    last = Date.now();
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
    block.style.position = 'absolute';
    block.style.left = x * w + 'px';
    block.style.top = y * w + 'px';
    block.style.width = block.style.height = w + 'px';
//    block.style.backgroundColor = '#008080';
    block.style.backgroundColor = '#7ec0ee';
    block.style.display = visible ? 'block' : 'none';
    return block;
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
    container.appendChild(button);
}

Button.prototype.highlightColor = '#ff0';
Button.prototype.defaultColor = '#f0f';
Button.prototype.mainColor = '#f0f';

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
}

initMenu();
loop();

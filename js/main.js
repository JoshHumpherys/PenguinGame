var container, paused, menu, last, buttons, buttonNames, buttonIndex, menuControlledbyMouse, expertLocked, expertButton, alternateMenu, alternateMenuDiv, introScreen, introScreenIndex, introScreenText, introScreenTextDiv, room, level, levels, penguin, right, left, px, py, dx, y0, a, v0, inAir, mapData, mapReferences, jumpCount, jumpStartTime, pauseStartTime, msSinceJump, pw, ps, jumpKeyDown, roomChangeQueued, forward, icicles, alertBox, innerBox, shade, alertShowing, helpTriggers, tutorial, iciclesUp, letters, lettersCurrent, lettersFinal, lettersTopDiv, lettersOrder;
var step = false; // TODO remove this
var stepping = false; // TODO remove this also

var initMenu = function() {
    container = document.getElementById('container');
    if(container != null) {
        container.remove();
    }
    container = initContainer();
    container.style.backgroundColor = '#000';
    container.style.backgroundImage = 'url(img/clouds.jpg)';
    document.body.appendChild(container);
    paused = false;
    menu = true;
    game = false;
    introScreen = false;
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
    alternateMenuDiv.style.left = '100px';
    alternateMenuDiv.style.top = '200px';
    alternateMenuDiv.style.width = '400px';
    alternateMenuDiv.style.height = '100px';
    container.appendChild(alternateMenuDiv);
    
    lettersTopDiv = document.createElement('div');
    lettersTopDiv.style.position = 'absolute';
    lettersTopDiv.style.top = '0px';
    lettersTopDiv.style.left = (document.body.clientWidth-800)/2 + 'px';
    lettersTopDiv.style.width = '800px';
    lettersTopDiv.style.height = '50px';
    lettersTopDiv.style.textAlign = 'center';
//    lettersTopDiv.style.lineHeight = '50px';
    lettersTopDiv.style.fontSize = '40px';
    lettersTopDiv.style.color = '#fff';
    
    //    letters = [{i:13,c:'S'},{i:14,c:'P'},{i:15,c:'R'},{i:16,c:'I'},{i:17,c:'N'},{i:18,c:'G'},{i:19,c:' '},{i:20,c:'F'},{i:21,c:'O'},{i:22,c:'R'},{i:23,c:'M'},{i:24,c:'A'},{i:25,c:'L'},{i:26,c:'?'}];
    lettersFinal = ['S','p','r','i','n','g',' ','F','o','r','m','a','l','?'];
    lettersOrder = [6,4,11,13,5,8,1,10,7,0,9,3,12,2];
    lettersCurrent = [false,false,false,false,false,false,false,false,false,false,false,false,false,false];
    
    addLetter();
    
    document.body.appendChild(lettersTopDiv);
}

var initIntroScreen = function() {
    menu = false;
    game = false;
    introScreen = true;
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
        preInitGame(true);
        return;
    }
    container.style.backgroundImage = 'url(img/intro'+i+'.jpg)';
    introScreenTextDivChild.innerHTML = introScreenText[i];
}

var nextIntroScreen = function() {
    setIntroScreen(++introScreenIndex);
}

var preInitGame = function(forward) {
//var preInitGame = function() {
    menu = false;
    introScreen = false;
    changingRooms = true;
    right = left = jumpKeyDown = false;
    icicles = new Array(40);
    iciclesUp = [];

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
//    px = 100 + ps;
//    py = 200;

//    dx = 180;
//    a = 12;
//    v0 = -5;

//    dx = 97;
//    v0 = -145/1000;
//    a = 263/1000;

    dx = 180;
    a = 1000;
    v0 = -375;

    y0 = py;

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
    if(room == undefined) {
        room = 0; // TODO retrieve from cookie.. and set cookie for that matter
    }
//    levels = [0, 2, 4, 6];
//    for(var i = 0; i < levels.length; i++) {
//        if(room < levels[i]) {
//            room = levels[i - 1];
//        }
//    }

//    initGame(true);
    initGame(forward);
}

var initGame = function(forward) {
    inAir = false;
    jumpCount = 0;
    jumpKeyDown = false;
    icicles = new Array(40);
    
    // init main container
    document.getElementById('container').remove();
    container = initContainer();
    document.body.appendChild(container);
    container.style.backgroundImage = 'url(img/bg.jpg)';
    container.appendChild(penguin);
    
    // init all blocks
    initBlocks(room, forward);

    var firstTime = helpTriggers == null;
    var continueString = '<br /><br />(enter to continue)';
    if(!firstTime) {
        helpTriggers[0].text = 'Oops! You hit an icicle!'+continueString;
        helpTriggers[0].alreadyShown = false;
        for(var i = 0; i < helpTriggers.length; i++) {
            helpTriggers[i].alreadyShown = false;
        }
    }
    else {
        helpTriggers = [{text:'Welcome! Press LEFT and RIGHT to move'+continueString,x:20*20,y:7*20,w:20,h:20,displayX:200,displayY:200,displayW:400,displayH:100},
                        {text:'Press SPACE or UP to jump'+continueString,x:34*20,y:(14+1)*20,w:5*20,h:20,land:true,displayX:200,displayY:200,displayW:400,displayH:100},
                        {text:'This next wall is a little too high to jump on,<br />but you can jump while in the air to double jump!'+continueString,x:13*20,y:(13+1)*20,w:8*20,h:20,land:true,displayX:(800-440)/2,displayY:50,displayW:440,displayH:120},
                        {text:'Beware of icicles falling from above!'+continueString,x:1*20,y:(28+1)*20,w:4*20,h:20,land:true,displayX:200,displayY:200,displayW:400,displayH:100},
                        {text:'Some blocks are invisible until you touch them!<br />Try walking forwards! It\'s safe!'+continueString,x:17*20,y:(23+1)*20,w:2*20,h:20,land:true,displayX:(800-440)/2,displayY:50,displayW:440,displayH:120}];
    }

    movePenguinDiv();
    
    unpause();
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

var initBlocks = function(map, forward) {
    switch(map) {
    case 0:
        mapData = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,3,3,3,3,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,1,7,7,7,7,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,1,0,0,0,0,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,1],
                   [1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1],
                   [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,7,7,7,7,1],
                   [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,1],
                   [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
                   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
                   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
                   [1,0,0,0,0,0,0,0,0,0,0,0,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,0,0,0,0,1,1,0,0,0,0,0,0,6],
                   [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];
        break;
    case 1:
        mapData = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                   [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,0,1],
                   [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,2,2,1,1,1,1,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
                   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,1],
                   [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
                   [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
                   [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
                   [5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6],
                   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,0,0,0,0,8,8,8,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,1,1,1,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
                   [1,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
                   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,0,0,0,0,0,0,0,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
                   [1,0,0,0,0,0,0,0,0,0,1,1,2,2,2,2,2,2,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,8,0,0,0,1],
                   [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];
        break;
    default:
        if(map < 0) {
            alert('We\'re sorry. Something went wrong.\nLevel will restart.');
            room = 0;
            preInitGame(true);
        }
        else {
            alert('Congratulations! You completed the last level!\nRedirecting to main menu.');
            initMenu();
        }
        return;
    }
    mapReferences = new Array(30);
    for(var i = 0; i < 30; i++) {
        mapReferences[i] = new Array(40);
    }
    for(var i = 0; i < mapData.length; i++) {
        for(var j = 0; j < mapData[i].length; j++) {
            var obj;
            switch(mapData[i][j]) {
            case 0:
                // empty
                break;
            case 1:
                // visible block
                container.appendChild((obj = new Block(j, i, 20, true)).block);
                break;
            case 2:
                // invisible block
                container.appendChild((obj = new Block(j, i, 20, false)).block);
                break;
            case 3:
                // previous room
                break;
            case 4:
                // next room
                break;
            case 5:
                // initial penguin position for next level or game start
                if(forward) {
                    px = j * 20 + ps;
                    py = i * 20;
                }
                break;
            case 6:
                // initial penguin position for previous level
                if(!forward) {
                    px = j * 20 + ps;
                    py = i * 20;
                }
                break;
            case 7:
                obj = new Icicle(j, i);
                icicles[j] = obj; // WARNING: assumes only one icicle per column
                container.appendChild(obj.icicle);
                break;
            case 8:
                container.appendChild((obj = new IcicleUp(j, i)).icicle);
                break;
            }
            mapReferences[i][j] = obj;
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
    if(!paused) {
        var now = Date.now();

        for(var i = 0; i < Math.floor((now-last)/17); i++) {
            update((now-last)/Math.floor((now-last)/17));
        }

//        if(step || stepping) {
//            step = false;
//            update(17); // TODO not this
//        }
        last = now;
    }
    if(roomChangeQueued) {
        roomChangeQueued = false;
        initGame(forward);
    }
    setTimeout(loop, 17);
}

var update = function(delta) {
    if(menu) {
        if(menuControlledByMouse) {
            for(var i = 0; i < buttonNames.length; i++) {
                if(buttons[buttonNames[i]].containsMouse()) {
                    buttons[buttonNames[i]].highlight();
                    buttonIndex = i;
                }
                else {
                    buttons[buttonNames[i]].unhighlight();
                }
            }
        }
        else {
            for(var i = 0; i < buttonNames.length; i++) {
                if(i == buttonIndex) {
                    buttons[buttonNames[i]].highlight();
                }
                else {
                    buttons[buttonNames[i]].unhighlight();
                }
            }
        }
    }
    else if(!menu && !introScreen) {
        for(var i = 0; i < icicles.length; i++) {
            if(icicles[i] != null) {
                if(icicles[i].falling) {
                    icicles[i].update(delta);
                    if(icicles[i].y + 20 >= mapData.length * 20) {
//                        icicles[i].falling = false;
//                        icicles[i].y = (mapData.length - 1) * 20;
                        icicles[i].icicle.remove();
                        icicles[i] = null;
                    }
                }
            }
        }
    
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
        
        // calculate new y, dy
        msSinceJump += delta;
        // dy/dt = a * t + v0
        var dy = a * msSinceJump / 1000 + v0;
        if(inAir) {
            npy += dy * (delta / 1000);
        }
        
        var blockTopLeft = true;
        var blockDownLeft = npy % 20 != 0;
        var blockTopRight = Math.floor((npx + pw)/20) > Math.floor(npx/20);
        var blockDownRight = blockDownLeft && blockTopRight;

        // check if collides with blocks
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

        if(!blockDownLeft && !blockDownRight && !blockTopLeft && !blockTopRight) {
            px = npx;
            py = npy;
        }
        else if(blockDownLeft && blockDownRight && !blockTopLeft && !blockTopRight) {
            px = npx;
            shiftYUp(npy);
        }
        else if(blockTopLeft && blockTopRight && !blockDownLeft && !blockDownRight) {
            px = npx;
            shiftYDown(npy);
        }
        else if(blockTopLeft && blockDownLeft && !blockTopRight && !blockDownRight) {
            shiftXRight(npx);
            py = npy;
        }
        else if(blockTopRight && blockDownRight && !blockTopLeft && !blockDownLeft) {
            shiftXLeft(npx);
            py = npy;
        }
        else if(blockDownLeft && blockDownRight && blockTopLeft && !blockTopRight) {
            shiftXRight(npx);
            shiftYUp(npy);
        }
        else if(blockDownLeft && blockDownRight && blockTopRight && !blockTopLeft) {
            shiftXLeft(npx);
            shiftYUp(npy);
        }
        else if(blockDownLeft && blockTopLeft && blockTopRight && !blockDownRight) {
            shiftXRight(npx);
            shiftYDown(npy);
        }
        else if(blockDownRight && blockTopLeft && blockTopRight && !blockDownLeft) {
            shiftXLeft(npx);
            shiftYDown(npy);
        }
        else if(blockDownRight && blockTopLeft) {
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
                    px = npx;
                    shiftYUp(npy);
                }
                else if(yCollisionBefore && !xCollisionBefore) {
                    shiftXRight(npx);
                    py = npy;
                }
                else {
                    adjustAdvanced(npx, npy, dy, 1, -1);
                }
            }
            else if(blockDownRight) {
                if(xCollisionBefore && !yCollisionBefore) {
                    px = npx;
                    shiftYUp(npy);
                }
                else if(yCollisionBefore && !xCollisionBefore) {
                    shiftXLeft(npx);
                    py = npy;
                }
                else {
                    adjustAdvanced(npx, npy, dy, -1, -1);
                }
            }
            else if(blockTopLeft) {
                if(xCollisionBefore && !yCollisionBefore) {
                    px = npx;
                    shiftYDown(npy);
                }
                else if(yCollisionBefore && !xCollisionBefore) {
                    shiftXRight(npx);
                    py = npy;
                }
                else {
                    adjustAdvanced(npx, npy, dy, 1, 1);
                }
            }
            else if(blockTopRight) {
                if(xCollisionBefore && !yCollisionBefore) {
                    px = npx;
                    shiftYDown(npy);
                }
                else if(yCollisionBefore && !xCollisionBefore) {
                    shiftXLeft(npx);
                    py = npy;
                }
                else {
                    adjustAdvanced(npx, npy, dy, -1, 1);
                }
            }
        }

        if(!inAir) {
            var blockUnderneathLeft = collision(getMapData(Math.floor(py/20) + 1, Math.floor(px/20)));
            if(Math.floor((px+pw)/20) == Math.floor(px/20)) {
                if(blockUnderneathLeft) {
                    mapReferences[Math.floor(npy/20) + 1][Math.floor(npx/20)].show();
                }
                else {
                    fall();
                }
            }
            else {
                var blockUnderneathRight = collision(getMapData(Math.floor(py/20) + 1, Math.floor(px/20) + 1));
                if(!blockUnderneathLeft && !blockUnderneathRight) {
                    fall();
                }
                else {
                    if(blockUnderneathLeft) {
                        mapReferences[Math.floor(npy/20) + 1][Math.floor(npx/20)].show();
                    }
                    if(blockUnderneathRight) {
                        mapReferences[Math.floor(npy/20) + 1][Math.floor(npx/20) + 1].show();
                    }
                }
            }
            
            if(collision(getMapData(Math.floor(py/20) - 1, Math.floor(px/20)))) {
                mapReferences[Math.floor(py/20) - 1][Math.floor(px/20)].show();
            }
            if(Math.floor((px+pw)/20) > Math.floor(px/20)) {
                if(collision(getMapData(Math.floor(py/20) - 1, Math.floor(px/20) + 1))) {
                    mapReferences[Math.floor(py/20) - 1][Math.floor(px/20) + 1].show();
                }
            }
        }
        
        if(blockTopLeft) {
            mapReferences[Math.floor(npy/20)][Math.floor(npx/20)].show();
        }
        if(blockDownLeft) {
            mapReferences[Math.floor(npy/20) + 1][Math.floor(npx/20)].show();
        }
        if(blockTopRight) {
            mapReferences[Math.floor(npy/20)][Math.floor(npx/20) + 1].show();
        }
        if(blockDownRight) {
            mapReferences[Math.floor(npy/20) + 1][Math.floor(npx/20) + 1].show();
        }
        
        if(px % 20 == 0) {
            if(collision(getMapData(Math.floor(py/20), Math.floor(px/20) - 1))) {
                mapReferences[Math.floor(py/20)][Math.floor(px/20) - 1].show();
            }
            if(inAir) {
                if(collision(getMapData(Math.floor(py/20) + 1, Math.floor(px/20) - 1))) {
                    mapReferences[Math.floor(py/20) + 1][Math.floor(px/20) - 1].show();
                }
            }
        }
        if((npx + pw) % 20 == 0) {
            if(collision(getMapData(Math.floor(py/20), Math.floor(px/20) + 1))) {
                mapReferences[Math.floor(py/20)][Math.floor(px/20) + 1].show();
            }
            if(inAir) {
                if(collision(getMapData(Math.floor(py/20) + 1, Math.floor(px/20) + 1))) {
                    mapReferences[Math.floor(py/20) + 1][Math.floor(px/20) + 1].show();
                }
            }
        }
        
        movePenguinDiv();

        // check if they're up icicles, if so kill

        var blockTopLeft = true;
        var blockDownLeft = npy % 20 != 0;
        var blockTopRight = Math.floor((npx + pw)/20) > Math.floor(npx/20);
        var blockDownRight = blockDownLeft && blockTopRight;

        if(blockTopLeft) {
            if(getMapData(Math.floor(npy/20),Math.floor(npx/20)) == 8) {
                if(mapReferences[Math.floor(npy/20)][Math.floor(npx/20)].collision(npx, npy, pw)) {
                    kill();
                    return;
                }
            }
        }
        if(blockDownLeft) {
            if(getMapData(Math.floor(npy/20)+1,Math.floor(npx/20)) == 8) {
                if(mapReferences[Math.floor(npy/20)+1][Math.floor(npx/20)].collision(npx, npy, pw)) {
                    kill();
                    return;
                }
            }
        }
        if(blockTopRight) {
            if(getMapData(Math.floor(npy/20),Math.floor(npx/20)+1) == 8) {
                if(mapReferences[Math.floor(npy/20)][Math.floor(npx/20)+1].collision(npx, npy, pw)) {
                    kill();
                    return;
                }
            }
        }
        if(blockDownRight) {
            if(getMapData(Math.floor(npy/20)+1,Math.floor(npx/20)+1) == 8) {
                if(mapReferences[Math.floor(npy/20)+1][Math.floor(npx/20)+1].collision(npx, npy, pw)) {
                    kill();
                    return;
                }
            }
        }

        // check for down icicles in columns penguin is in, check collision, if no collision then fall
        var icicleLeft = icicles[Math.floor(npx/20)];
        var icicleRight = null;
        if((Math.floor((npx + pw)/20) > Math.floor(npx/20)) && Math.floor(npx/20) < icicles.length) {
            icicles[Math.floor(npx/20)];
        }
        if(icicleLeft != null) {
            if(icicleLeft.collision(npx, npy, pw)) {
                kill();
                return;
            }
            else if(icicleLeft.y < npy) {
                icicleLeft.fall();
            }
        }
        if(icicleRight != null) {
            if(icicleRight.collision(npx, npy, pw)) {
                kill();
                return;
            }
            else if(icicleright.y < npy) {
                icicleRight.fall();
            }
        }
        
        moveIcicleDivs();

        if(room == 0) {
            for(var i = 0; i < helpTriggers.length; i++) {
                if(!helpTriggers[i].alreadyShown && !helpTriggers[i].removed) {
                    if(!helpTriggers[i].land) {
                        if(px < helpTriggers[i].x + helpTriggers[i].w && px + pw > helpTriggers[i].x && py < helpTriggers[i].y + helpTriggers[i].h && py + 20 > helpTriggers[i].y) {
                            helpTriggers[i].alreadyShown = true;
                            pause();
                            showAlert(helpTriggers[i].text, helpTriggers[i].displayX, helpTriggers[i].displayY, helpTriggers[i].displayW, helpTriggers[i].displayH);
                            tutorial = true;
                            while(i > 1) {
                                helpTriggers[--i].removed = true;
                            }
                        }
                    }
                    else {
                        if(px < helpTriggers[i].x + helpTriggers[i].w && px + pw > helpTriggers[i].x && py + 20 == helpTriggers[i].y) {
                            helpTriggers[i].alreadyShown = true;
                            pause();
                            showAlert(helpTriggers[i].text, helpTriggers[i].displayX, helpTriggers[i].displayY, helpTriggers[i].displayW, helpTriggers[i].displayH);
                            tutorial = true;
                            while(i > 1) {
                                helpTriggers[--i].removed = true;
                            }
                        }
                    }
                }
            }
        }
    }
}

// h = 0 for right blocks, h = 1 for left blocks
// v = 0 for top blocks, v = 1 for down blocks
var checkCollision = function(x, y, w, h, v) {
    // 00 10
    // 01 11
    var blockType = getMapData(Math.floor(y/20) + v, Math.floor(x/20) + h);
    if(!collision(blockType)) {
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
    var blockType = getMapData(Math.floor(y/20) + v, Math.floor(x/20) + h);
    if(!collision(blockType)) {
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
    var blockType = getMapData(Math.floor(y/20) + v, Math.floor(x/20) + h);
    if(!collision(blockType)) {
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
    var blockType = getMapData(Math.floor(y/20) + v, Math.floor(x/20) + h);
    if(!collision(blockType)) {
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
    var blockType = getMapData(Math.floor(y/20) + v, Math.floor(x/20) + h);
    if(!collision(blockType)) {
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

// xDir == 1 for right, xDir == -1 for left
// yDir == 1 for down, yDir == -1 for up
var adjustAdvanced = function(npx, npy, dy, xDir, yDir) {
    // v = dx/dt
    // x = vt
    // t = x / v
    // approximation with constant velocity in y direction for small dt
    if(Math.abs((px - npx) / dx) < Math.abs((py - npy) / dy)) {
        py = npy;
        if(xDir > 0) {
            shiftXRight(npx);
        }
        else {
            shiftXLeft(npx);
        }
    }
    else {
        px = npx;
        if(yDir > 0) {
            shiftYDown(npy);
        }
        else {
            shiftYUp(npy);
        }
    }
}

var getMapData = function(y, x) {
    if(y >= mapData.length) {
        outOfBoundsY(y, x);
        return -1;
    }
    else if(y < 0) {
        outOfBoundsY(y, x);
        return -1;
    }
    if(x >= mapData[y].length) {
        outOfBoundsX(y, x);
        return -1;
    }
    else if(x < 0) {
        outOfBoundsX(y, x);
        return -1;
    }
    return mapData[y][x];
}

var outOfBoundsX = function(y, x) {
    var type = mapData[y][x < 0 ? x + 1 : x - 1];
    if(type == 3 || type == 5) {
        previousRoom();
    }
    else if(type == 4) {
        nextRoom();
    }
}

var outOfBoundsY = function(y, x) {
    var type = mapData[y < 0 ? y + 1 : y - 1][x];
    if(type == 3 || type == 5) {
        previousRoom();
    }
    else if(type == 4) {
        nextRoom();
    }
}

// warning: ensure first room has no exit or no way of accessing exit
var previousRoom = function() {
    if(!roomChangeQueued) {
        pause();
        room--;
    //    initGame(false);
        roomChangeQueued = true;
        forward = false;
    }
}

var nextRoom = function() {
    if(!roomChangeQueued) {
        pause();
        room++;
    //    initGame(true);
    //    preInitGame(true);
        roomChangeQueued = true;
        forward = true;
    }
}

var collision = function(i) {
    return i == 1 || i == 2;
}

var pause = function() {
    if(!paused) {
        paused = true;
        pauseStartTime = Date.now();
    }
}

var unpause = function() {
    if(paused) {
        paused = false;
        last = Date.now();
    }
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

var kill = function() {
    initGame(true);
}

var movePenguinDiv = function() {
    penguin.style.left = px - ps + 'px';
    penguin.style.top = py + 'px';
}

var moveIcicleDivs = function() {
    for(var i = 0; i < icicles.length; i++) {
        if(icicles[i] != null) {
            if(icicles[i].falling) {
                icicles[i].icicle.style.top = icicles[i].y + 'px';
            }
        }
    }
}

/*
// WARNING: c must be in letters
var addLetter = function(c) {
    for(var i = 0; i < letters.length; i++) {
        if(letters[i].c == c) {
            var letterDiv = document.createElement('div');
            letterDiv.innerHTML = c;
            mapData[0][letters[i].i].block.appendChild(letterDiv);
        }
    }
}
*/

var addLetter = function() {
    var won = false;
    for(var i = 0; i < lettersOrder.length; i++) {
        if(!lettersCurrent[lettersOrder[i]]) {
            lettersCurrent[lettersOrder[i]] = true;
            if(i == lettersOrder.length - 1) {
                won = true;
            }
            break;
        }
    }

    var lettersString = '';
    for(var i = 0; i < lettersFinal.length; i++) {
        if(lettersCurrent[i]) {
            lettersString += lettersFinal[i];
        }
        else {
            lettersString += '&nbsp;';
        }
    }

    lettersTopDiv.innerHTML = lettersString;
    
    if(won) {
        youWin();
    }
}

var youWin = function() {
    alert('congrats');
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

function Icicle(x, y) {
    var icicle = this.icicle = document.createElement('div');
    this.x = x * 20;
    this.y = y * 20;
    this.falling = false;
    icicle.style.position = 'absolute';
    icicle.style.left = x * 20 + 'px';
    icicle.style.top = y * 20 + 'px';
    icicle.style.width = icicle.style.height = '20px';
    icicle.style.zIndex = '1';
    var icicleImg = document.createElement('img');
    icicleImg.setAttribute('src','img/icicle.png');
    icicleImg.style.height = penguin.style.height;
    icicleImg.style.display = 'block';
    icicleImg.style.margin = 'auto';
    icicle.innerHTML = icicleImg.outerHTML;
}

function IcicleUp(x, y) {
    var icicle = this.icicle = document.createElement('div');
    this.x = x * 20;
    this.y = y * 20;
    icicle.style.position = 'absolute';
    icicle.style.left = x * 20 + 'px';
    icicle.style.top = y * 20 + 'px';
    icicle.style.width = icicle.style.height = '20px';
    var icicleImg = document.createElement('img');
    icicleImg.setAttribute('src','img/icicleUp.png');
    icicleImg.style.height = penguin.style.height;
    icicleImg.style.display = 'block';
    icicleImg.style.margin = 'auto';
    icicle.innerHTML = icicleImg.outerHTML;
}

Icicle.prototype.fall = function() {
    this.falling = true;
}

Icicle.prototype.update = function(delta) {
    if(this.falling) {
        this.y += 500 * delta / 1000;
    }
}

Icicle.prototype.w = IcicleUp.prototype.w = 9;
Icicle.prototype.shift = IcicleUp.prototype.shift = (20 - IcicleUp.prototype.w) / 2;

Icicle.prototype.collision = IcicleUp.prototype.collision = function(x, y, w) {
    return x < this.x + this.shift + this.w && x + w > this.x + this.shift && y < this.y + 20 && y + 20 > this.y;
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
//    block.style.backgroundColor = '#7ec0ee';
    block.style.backgroundImage = 'url(img/glass_light_blue.png)';
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
    button.style.borderRadius = '10px';

    button.style.color = '#fff';
    button.style.fontSize = '30px';
    button.style.textAlign = 'center';
    button.style.fontFamily = 'Verdana, Geneva, sans-serif';
    button.style.lineHeight = '50px';
    button.innerHTML = name.toUpperCase();
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
    button.style.borderRadius = '10px';
    button.style.transition = 'background-color 0.25s ease';
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
            switchMenuAlternate('Coded by Josh Humpherys in February of 2016<br />Why? Play story mode to find out!');
            break;
        }
    }
}
Button.prototype.containsMouse = function() {
    return this.mouseOver;
}

var showAlert = function(text, x, y, w, h) {
    if(alertShowing) {
        return;
    }
    alertShowing = true;
    pause();
    if(alertBox == null) {
        alertBox = document.createElement('div');
        alertBox.style.position = 'absolute';
        alertBox.style.backgroundColor = Button.prototype.highlightColor;
        alertBox.style.display = 'block';
        alertBox.style.color = "#fff";
        alertBox.style.textAlign = 'center';
        alertBox.style.fontFamily = 'Verdana, Geneva, sans-serif';
        //alertBox.style.lineHeight = '50px';
        alertBox.style.borderRadius = '10px';
        alertBox.style.zIndex = '3';
        innerBox = document.createElement('div');
        innerBox.style.position = 'absolute';
        innerBox.style.backgroundColor = Button.prototype.defaultColor;
        innerBox.style.display = 'block';
        innerBox.style.borderRadius = '10px';

//showAlert('hello world', 200, 100, 200, 100);
    }
    shade = document.createElement('div');
    shade.style.position = 'absolute';
    shade.style.width = '100%';
    shade.style.height = '100%';
    shade.style.overflow = 'hidden';
    shade.style.zIndex = '2';
    shade.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
    container.appendChild(shade);
    
    alertBox.style.width = w + 'px';
    alertBox.style.height = h + 'px';
    alertBox.style.left = x + 'px';
    alertBox.style.top = y + 'px';
    innerBox.style.width = (w - 10) + 'px';
    innerBox.style.height = (h - 10) + 'px';
    innerBox.style.top = '5px';
    innerBox.style.left = '5px';
    innerBox.innerHTML = '<p>'+text+'</p>';
    alertBox.innerHTML = innerBox.outerHTML;
    container.appendChild(alertBox);
}

var hideAlert = function() {
    if(alertBox != null && alertShowing) {
        alertShowing = false;
        alertBox.remove();
        shade.remove();
        unpause();
        tutorial = false;
    }
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
        for(var i = 0; i < buttonNames.length; i++) {
            if(buttons[buttonNames[i]].containsMouse()) {
                buttons[buttonNames[i]].highlight();
            }
            else {
                buttons[buttonNames[buttonIndex]].unhighlight();
            }
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

    if(introScreen) {
        if(key == 83) {
            preInitGame(true);
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
            buttons[buttonNames[buttonIndex]].select();
            break;
        }
    }
    else { // game
        if(!paused && key == 80) {
            pause();
            showAlert('Game paused<br /><br />Press any key to continue', 200, 200, 400, 100);
        }
//        else if(paused && (((key == 37) == !left) || ((key == 39) == !right))) {
        else if(paused && (tutorial == (key == 13))) {
            tutorial = false;
            hideAlert();
            unpause();
        }

        if(key == 37) {
            left = true;
        }
        else if(key == 39) {
            right = true;
        }
        else if(key == 32 || key == 38) {
            // won't work for up held and space press or space held and up press
            // don't really care though, that's not gonna happen
            if(!jumpKeyDown) {
                jumpKeyDown = true;
                jump();
            }
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
        else if(key == 32 || key == 38) {
            jumpKeyDown = false;
        }
    }
}

window.onfocus = function(e) {
    if(!alertShowing) {
        unpause();
        left = right = false;
    }
}

window.onblur = function(e) {
    pause();
}

initMenu();
loop();

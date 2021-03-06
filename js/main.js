var container, paused, menu, last, buttons, buttonNames, buttonIndex, menuControlledbyMouse, expertLocked, expertButton, alternateMenu, alternateMenuDiv, introScreen, introScreenIndex, introScreenText, introScreenTextDiv, room, level, levels, penguin, right, left, px, py, dx, y0, a, v0, inAir, mapData, mapReferences, jumpCount, jumpStartTime, pauseStartTime, msSinceJump, pw, ps, jumpKeyDown, roomChangeQueued, forward, icicles, alertBox, innerBox, shade, alertShowing, helpTriggers, tutorial, iciclesUp, letters, lettersCurrent, lettersFinal, lettersTopDiv, lettersOrder, letterPlaces, killFade, mouseDown, instructionsDiv, alternateMenuHeadingDiv, leftAndRightReleased, maxRoom, lastMap, dy, changeX, changeY, introPenguinDiv, introPresentDiv, containerIntroBG1, containerIntroBG2, permContainerX, permContainerY, lastBlockUnderneathLeft, lastBlockUnderneathRight, lastBlockDownRight, lastBlockDownLeft, lastBlockTopRight, lastBlockTopLeft, forward, lastExpertMap, maxRoomExpert, roomExpert, playingExpert, justStartedFalling, loopComplete, finishedChangingRooms, finishedChangingRooms2, fileLoading, options, initMenuQueued, lettersExpert, lettersCurrentExpert, lettersExpertThisRoom, expertNoRestart, oneUpdate, twoUdates, skipReadFile, listOfBlocks, listOfIcicles, listOfUpIcicles;
var step = false; // TODO remove this
var stepping = false; // TODO remove this also

var initMenu = function() {
    cacheImages();

    permContainerX = (document.body.clientWidth-800)/2 + 'px';
    permContainerY = '50px';
    container = document.getElementById('container');
    if(container != null) {
        container.remove();
    }
    container = initContainer();
    container.style.backgroundColor = '#000';
    container.style.backgroundImage = 'url(img/clouds.jpg)';
    document.body.appendChild(container);
    if(containerIntroBG1 != null) {
        containerIntroBG1.remove();
    }
    containerIntroBG1 = initContainer();
    containerIntroBG1.style.backgroundImage = 'url(img/intro0.jpg)';
    if(containerIntroBG2 != null) {
        containerIntroBG2.remove();
    }
    containerIntroBG2= initContainer();
    containerIntroBG2.style.backgroundImage = 'url(img/icecave.jpg)';
    paused = false;
    oneUpdate = twoUpdates = true;
    mouseDown = false;
    menu = true;
    introScreen = false;
    game = false;
    changingRooms = true;
    changeX = changeY = true;
    lastMap = 8;
    lastExpertMap = 8;
    skipReadFile = false;
    last = Date.now();
    buttons = {};
    listOfBlocks = [];
    listOfIcicles = [];
    listOfUpIcicles = [];
    var expertLockedCookie = getCookie('expertLocked');
    if(expertLockedCookie == undefined) {
        setCookie('expertLocked','0');
        expertLocked = true;
    }
    else {
        if(expertLockedCookie == '0') {
            expertLocked = false;
        }
        else {
            expertLocked = true;
        }
    }
    if(expertLocked) {
        buttonNames = ['story', 'options', 'help', 'about'];
    }
    else {
        buttonNames = ['story', 'expert', 'options', 'help', 'about'];
    }
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
    alternateMenuDiv.style.top = '150px';
    alternateMenuDiv.style.width = '450px';
    alternateMenuDiv.style.height = '100px';
    alternateMenuDiv.style.color = '#fff';
    alternateMenuDiv.style.WebkitTouchCallout =  'none'; /* iOS Safari */
    alternateMenuDiv.style.WebkitUserSelect = 'none';   /* Chrome/Safari/Opera */
    alternateMenuDiv.style.KhtmlUserSelect = 'none';    /* Konqueror */
    alternateMenuDiv.style.MozUserSelect = 'none';      /* Firefox */
    alternateMenuDiv.style.MsUserSelect = 'none';       /* IE/Edge */
    alternateMenuDiv.style.userSelect = 'none';
    alternateMenuDiv.style.cursor = 'default';
    alternateMenuDiv.style.fontFamily = 'Verdana, Geneva, sans-serif';
    container.appendChild(alternateMenuDiv);
    alternateMenuHeadingDiv = document.createElement('div');
    alternateMenuHeadingDiv.style.position = 'absolute';
    alternateMenuHeadingDiv.style.left = '100px';
    alternateMenuHeadingDiv.style.top = '25px';
    alternateMenuHeadingDiv.style.width = '450px';
    alternateMenuHeadingDiv.style.height = '100px';
    alternateMenuHeadingDiv.style.color = '#fff';
    alternateMenuHeadingDiv.style.WebkitTouchCallout =  'none'; /* iOS Safari */
    alternateMenuHeadingDiv.style.WebkitUserSelect = 'none';   /* Chrome/Safari/Opera */
    alternateMenuHeadingDiv.style.KhtmlUserSelect = 'none';    /* Konqueror */
    alternateMenuHeadingDiv.style.MozUserSelect = 'none';      /* Firefox */
    alternateMenuHeadingDiv.style.MsUserSelect = 'none';       /* IE/Edge */
    alternateMenuHeadingDiv.style.userSelect = 'none';
    alternateMenuHeadingDiv.style.cursor = 'default';
    alternateMenuHeadingDiv.style.fontFamily = 'Verdana, Geneva, sans-serif';
    alternateMenuHeadingDiv.style.fontSize = '100px';
    container.appendChild(alternateMenuHeadingDiv);
    
    if(lettersTopDiv != null) {
        lettersTopDiv.remove();
    }
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
    lettersTopDiv.style.WebkitTouchCallout =  'none'; /* iOS Safari */
    lettersTopDiv.style.WebkitUserSelect = 'none';   /* Chrome/Safari/Opera */
    lettersTopDiv.style.KhtmlUserSelect = 'none';    /* Konqueror */
    lettersTopDiv.style.MozUserSelect = 'none';      /* Firefox */
    lettersTopDiv.style.MsUserSelect = 'none';       /* IE/Edge */
    lettersTopDiv.style.userSelect = 'none';
    lettersTopDiv.style.cursor = 'default';
    lettersTopDiv.style.fontFamily = 'Verdana, Geneva, sans-serif';
    
    lettersFinal = ['S','p','r','i','n','g',' ','F','o','r','m','a','l','?'];
    lettersOrder = [6,4,11,13,5,8,1,10,7,0,9,3,12,2];
    letters = [[{x:36,y:17}],[{x:6,y:7},{x:36,y:26}],[{x:15,y:7},{x:22,y:3}],[{x:8,y:3}],[{x:9,y:2}],[{x:19,y:5},{x:35,y:9}],[{x:5,y:2},{x:33,y:23}],[{x:33,y:12}],[{x:16,y:2}]];
    lettersExpert = [[{x:36,y:17}],[{x:6,y:7},{x:36,y:26}],[{x:15,y:7},{x:22,y:3}],[{x:8,y:3}],[{x:9,y:2}],[{x:19,y:5},{x:35,y:9}],[{x:5,y:2},{x:33,y:23}],[{x:33,y:12}],[{x:16,y:2}]];
    var lettersCurrentCookie = getCookie('lettersCurrent');
    if(lettersCurrentCookie == '') {
        lettersCurrent = [false,false,false,false,false,false,false,false,false,false,false,false,false,false];
        addLetter(0);
        setLettersCurrentCookie();
    }
    else {
        // store cookie as example: "0,0,0,1,1,1,0,0,1,0,1,0,"
        // note comma at the end cuz lazy
        // and 0 and 1 not true false cuz lazy
        lettersCurrent = [];
        for(var i = 0; i < lettersCurrentCookie.length / 2; i++) {
            lettersCurrent[i] = lettersCurrentCookie.charAt(i * 2) == '0' ? false : true;
        }
        updateLettersCurrentString();
    }
    var lettersCurrentExpertCookie = getCookie('lettersCurrentExpert');
    if(lettersCurrentExpertCookie == '') {
        lettersCurrentExpert = 0;
        setLettersCurrentExpertCookie();
    }
    else {
        lettersCurrent = parseInt(lettersCurrentExpertCookie);
        updateLettersCurrentString();
    }
    
    var elapsedIndex = 1; // don't count first letter, it's a space
    for(var i = 0; i < letters.length; i++) {
        for(var j = 0; j < letters[i].length; j++) {
            letters[i][j].achieved = lettersCurrent[lettersOrder[elapsedIndex++]];
        }
    }
    
    document.body.appendChild(lettersTopDiv);
    
    killFade = document.createElement('div');
    killFade.style.position = 'absolute';
    killFade.style.overflow = 'hidden';
    killFade.style.left = container.style.left;
    killFade.style.top = container.style.top;
    killFade.style.width = container.style.width;
    killFade.style.height = container.style.height;
    killFade.style.zIndex = '2';
    killFade.style.pointerEvents = 'none';
    killFade.style.backgroundColor = 'rgba(0,0,0,0.0)';
    killFade.style.WebkitTransition = 'background-color 1s ease';
    killFade.style.MozTransition = 'background-color 1s ease';
    killFade.style.OTransition = 'background-color 1s ease';
    killFade.style.transition = 'background-color 1s ease';
    document.body.appendChild(killFade);
    
    if(instructionsDiv != null) {
        instructionsDiv.remove();
    }
    instructionsDiv = document.createElement('div');
    instructionsDiv.style.position = 'absolute';
    instructionsDiv.style.left = (document.body.clientWidth-800)/2+820+'px';
    instructionsDiv.style.top = container.style.top;
    instructionsDiv.style.width = '200px';
    instructionsDiv.style.height = '600px';
    instructionsDiv.style.color = '#fff';
    instructionsDiv.style.fontFamily = 'Verdana, Geneva, sans-serif';
    instructionsDiv.style.cursor = 'default';
    instructionsDiv.style.WebkitTouchCallout =  'none'; /* iOS Safari */
    instructionsDiv.style.WebkitUserSelect = 'none';   /* Chrome/Safari/Opera */
    instructionsDiv.style.KhtmlUserSelect = 'none';    /* Konqueror */
    instructionsDiv.style.MozUserSelect = 'none';      /* Firefox */
    instructionsDiv.style.MsUserSelect = 'none';       /* IE/Edge */
    instructionsDiv.style.userSelect = 'none';
    setInstructionsDivText();
    document.body.appendChild(instructionsDiv);
    
    if(introPenguinDiv != null) {
        introPenguinDiv.remove();
    }
    introPenguinDiv = document.createElement('div');
    introPenguinDiv.style.position = 'absolute';
    introPenguinDiv.style.left = container.style.left;
    introPenguinDiv.style.top = 50+(600 - 200)/2 + 'px';
    introPenguinDiv.style.width = '200px';
    introPenguinDiv.style.height = '200px';
    introPenguinDiv.style.zIndex = '1';
    introPenguinDiv.style.opacity = '0';
    introPenguinDiv.style.pointerEvents = 'none';
    introPenguinDiv.style.WebkitTouchCallout =  'none'; /* iOS Safari */
    introPenguinDiv.style.WebkitUserSelect = 'none';   /* Chrome/Safari/Opera */
    introPenguinDiv.style.KhtmlUserSelect = 'none';    /* Konqueror */
    introPenguinDiv.style.MozUserSelect = 'none';      /* Firefox */
    introPenguinDiv.style.MsUserSelect = 'none';       /* IE/Edge */
    introPenguinDiv.style.userSelect = 'none';
    var introPenguinImgDiv = document.createElement('img');
    introPenguinImgDiv.setAttribute('src','img/penguin.png');
    introPenguinImgDiv.style.height = introPenguinDiv.style.height;
    introPenguinImgDiv.style.display = 'block';
    introPenguinImgDiv.style.margin = 'auto';
    introPenguinDiv.innerHTML = introPenguinImgDiv.outerHTML;
    document.body.appendChild(introPenguinDiv);
    
    if(introPresentDiv != null) {
        introPresentDiv.remove();
    }
    introPresentDiv = document.createElement('div');
    introPresentDiv.style.position = 'absolute';
    introPresentDiv.style.left = 300+(document.body.clientWidth-800)/2+'px';
    introPresentDiv.style.top = 50+(600 - 200)/2 + 'px';
    introPresentDiv.style.width = '200px';
    introPresentDiv.style.height = '200px';
    introPresentDiv.style.zIndex = '1';
    introPresentDiv.style.opacity = '0';
    introPresentDiv.style.pointerEvents = 'none';
    introPresentDiv.style.transition = 'opacity 1s linear';
    introPresentDiv.style.WebkitTouchCallout =  'none'; /* iOS Safari */
    introPresentDiv.style.WebkitUserSelect = 'none';   /* Chrome/Safari/Opera */
    introPresentDiv.style.KhtmlUserSelect = 'none';    /* Konqueror */
    introPresentDiv.style.MozUserSelect = 'none';      /* Firefox */
    introPresentDiv.style.MsUserSelect = 'none';       /* IE/Edge */
    introPresentDiv.style.userSelect = 'none';
    var introPresentImgDiv = document.createElement('img');
    introPresentImgDiv.setAttribute('src','img/letter.png');
    introPresentImgDiv.style.height = introPenguinDiv.style.height;
    introPresentImgDiv.style.display = 'block';
    introPresentImgDiv.style.margin = 'auto';
    introPresentDiv.innerHTML = introPresentImgDiv.outerHTML;
    document.body.appendChild(introPresentDiv);
    
    changingRooms = false;
}

var cacheImages = function() {
    new Image().src = 'img/bg.jpg';
    new Image().src = 'img/clouds.jpg';
    new Image().src = 'img/glass_light_blue.png';
    new Image().src = 'img/icecave.jpg';
    new Image().src = 'img/icicle.png';
    new Image().src = 'img/icicleUp.png';
    new Image().src = 'img/intro0.jpg';
    new Image().src = 'img/letter.png';
    new Image().src = 'img/letter6.png';
    new Image().src = 'img/penguin.png';
}

var setInstructionsDivText = function() {
    if(menu) {
        instructionsDiv.innerHTML = 'Use mouse or keyboard to select a menu button.<br /><br />Complete story mode to unlock expert!';
    }
    else if(introScreen) {
        instructionsDiv.innerHTML = 'Click or press any key to go to the next screen';
    }
    else { // game
        if(!playingExpert) {
            instructionsDiv.innerHTML = '<h2>Instructions:</h2>Left/right to move<br /><br />Up or space to jump<br />(Twice to double jump)<br /><br />P to pause<br /><br />X to go to the next room<br /><br />Z to go to the previous room<br /><br />M to return to the main menu<br /><br />R to restart room';
        }
        else {
           instructionsDiv.innerHTML = '<h2>Instructions:</h2>Left/right to move<br /><br />Up or space to jump<br />(Twice to double jump)<br /><br />P to pause<br /><br />M to return to the main menu<br /><br />R to restart room';
        }
    }
}

var setIntroScreen = function(i) {
    changingRooms = true;
    
    if(i == 0) {
        introPenguinDiv.style.opacity = '0';
    }
    else if(i == 1) {
        introPenguinDiv.style.opacity = '1';
    }
    else if(i == 2) {
        introPenguinDiv.removeAttribute('class');
        introPenguinDiv.style.opacity = '1';
        introPenguinDiv.style.left = 300 + (document.body.clientWidth-800)/2 + 'px';
        introPenguinDiv.style.transition = 'top 1s ease-in';
    }
    else if(i == 3) {
        introPenguinDiv.style.opacity = '0';
        introPresentDiv.style.top = 50+(600 - 200)/2 + 'px';
    }
    killFade.style.backgroundColor = 'rgba(0,0,0,1.0)';
    setTimeout(function() {
            if(i == 0) {
                menu = false;
                introScreen = true;
                game = false;
                setInstructionsDivText();
                document.getElementById('container').remove();
                container = initContainer();
                document.body.appendChild(container);
                introScreenText = ['This is Penguin. He\'s a penguin.', 'One day Penguin saw an ice cave and thought he would explore.', 'But when Penguin entered the cave he fell in and couldn\'t jump out!<br />He had to look for another exit!', 'He found some presents in the cave and decided to get them.'];
                introScreenTextDiv = document.createElement('div');
                introScreenTextDiv.style.display = 'table';
                introScreenTextDiv.style.backgroundColor = '#000';
                introScreenTextDiv.style.width = '100%';
                introScreenTextDiv.style.height = '100px';
                introScreenTextDiv.style.textAlign = 'center';
                introScreenTextDiv.style.WebkitTouchCallout =  'none'; /* iOS Safari */
                introScreenTextDiv.style.WebkitUserSelect = 'none';   /* Chrome/Safari/Opera */
                introScreenTextDiv.style.KhtmlUserSelect = 'none';    /* Konqueror */
                introScreenTextDiv.style.MozUserSelect = 'none';      /* Firefox */
                introScreenTextDiv.style.MsUserSelect = 'none';       /* IE/Edge */
                introScreenTextDiv.style.userSelect = 'none';
                introScreenTextDiv.style.cursor = 'default';
                introScreenTextDiv.style.fontFamily = 'Verdana, Geneva, sans-serif';
                introScreenTextDivChild = document.createElement('div');
                introScreenTextDivChild.style.color = '#fff';
                introScreenTextDivChild.style.display = 'table-cell';
                introScreenTextDivChild.style.verticalAlign = 'middle';
                introScreenTextDivChild.style.paddingLeft = '100px';
                introScreenTextDivChild.style.paddingRight = '100px';
                introScreenTextDivChild.style.margin = '0 auto';
                introScreenTextDiv.appendChild(introScreenTextDivChild);
                container.appendChild(introScreenTextDiv);
                introScreenIndex = 0;
            }
            if(i == 0) {
                container.remove();
                container = containerIntroBG1;
                container.appendChild(introScreenTextDiv);
                document.body.appendChild(container);
            }
            if(i == 1) {
                container.remove();
                container = containerIntroBG2;
                container.appendChild(introScreenTextDiv);
                document.body.appendChild(container);
                introPenguinDiv.style.top = 120+50+(600 - 200)/2 + 'px';
            }
            killFade.style.backgroundColor = 'rgba(0,0,0,0.0)';
            introScreen = true;
            if(i >= introScreenText.length) {
                introPresentDiv.style.display = 'none';
                forward = true;
                preInitGame();
                return;
            }
            introScreenTextDivChild.innerHTML = introScreenText[i];
            setTimeout(function() {
                if(i == 0) {
                    // penguin slide in
                    introPenguinDiv.setAttribute('class','fadeInLeft');
                }
                else if(i == 1) {
                    // penguin slide in
                }
                else if(i == 2) {
                    // penguin zoomOutDown
                    introPenguinDiv.setAttribute('class','spinFadeOutDown');
                    introPenguinDiv.style.top = 200+120+50+(600 - 200)/2 + 'px';
                }
                else if(i == 3) {
                    // penguin slide in
                    // present fade in
//                    introPenguinDiv.setAttribute('class','fadeInLeft');
                    introPresentDiv.style.opacity = '1';
                }
            },1000);
            setTimeout(function() {changingRooms = false;},1200);
    },1000);
}

var nextIntroScreen = function() {
    setIntroScreen(++introScreenIndex);
}

var preInitGame = function() {
//var preInitGame = function() {
    menu = false;
    introScreen = false;
    game = true;
    setInstructionsDivText();
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
    penguin.style.zIndex = '1';
    penguin.style.position = 'absolute';
    penguin.style.WebkitTouchCallout =  'none'; /* iOS Safari */
    penguin.style.WebkitUserSelect = 'none';   /* Chrome/Safari/Opera */
    penguin.style.KhtmlUserSelect = 'none';    /* Konqueror */
    penguin.style.MozUserSelect = 'none';      /* Firefox */
    penguin.style.MsUserSelect = 'none';       /* IE/Edge */
    penguin.style.userSelect = 'none';
    pw = 14; // warning set less than 20
//    pw = 18; // warning set less than 20
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

    penguin.style.zIndex = '1';
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
//    if(room == undefined) {
        var roomCookie = getCookie('room');
        if(roomCookie == '') {
            room = 0;
            setCookie('room','0');
        }
        else {
            room = parseInt(roomCookie);
        }
//    }
//    if(maxRoom == undefined) {
        var maxRoomCookie = getCookie('maxRoom');
        if(maxRoomCookie == '') {
            maxRoom = room;
        }
        else {
            maxRoom = parseInt(maxRoomCookie);
        }
//    }
//    if(roomExpert == undefined) {
        var roomExpertCookie = getCookie('roomExpert');
        if(roomExpertCookie == '') {
            roomExpert = 0;
            setCookie('roomExpert','0');
        }
        else {
            roomExpert = parseInt(roomExpertCookie);
        }
//    }
//    if(maxRoomExpert == undefined) {
        var maxRoomExpertCookie = getCookie('maxRoomExpert');
        if(maxRoomExpertCookie == '') {
            maxRoomExpert = roomExpert;
        }
        else {
            maxRoomExpert = parseInt(maxRoomExpertCookie);
        }
//    }
//    levels = [0, 2, 4, 6];
//    for(var i = 0; i < levels.length; i++) {
//        if(room < levels[i]) {
//            room = levels[i - 1];
//        }
//    }

//    initGame(true);
    forward = true;
    initGame();
}

var initGame = function() {
    game = true;
    inAir = false;
    jumpCount = 0;
    jumpKeyDown = false;
    icicles = new Array(40);
    iciclesUp = [];
    lettersExpertThisRoom = 0;

    lettersCurrentExpert = 0;
    for(i = 0; i <= Math.min(roomExpert, lettersExpert.length); i++) {
        if(lettersExpert[i] != null) {
            for(j = 0; j < lettersExpert[i].length; j++) {
                if(i != roomExpert) {
                    lettersExpert[i][j].achieved = true;
                    lettersCurrentExpert++;
                }
                else {
                    lettersExpert[i][j].achieved = false;
                }
            }
        }
    }

    updateLettersCurrentString();

    var firstTime = helpTriggers == null;
    var continueString = '<br /><br />Press C to continue';
    if(maxRoom > 0) {
        helpTriggers = [];
    }
//    if(helpTriggers != null) {
//        for(var i = 0; i < helpTriggers.length; i++) {
//            helpTriggers[i].alreadyShown = false;
//        }
//    }{x:36,y:17}
    helpTriggers = [{text:'Welcome! Press LEFT and RIGHT to move.<br />Try to get all the presents!'+continueString,x:20*20,y:7*20,w:20,h:20,displayX:200,displayY:200,displayW:400,displayH:120},
                    {text:'Press SPACE or UP to jump'+continueString,x:34*20,y:(14+1)*20,w:5*20,h:20,land:true,displayX:200,displayY:200,displayW:400,displayH:100},
                    {text:'You can jump while in the air to double jump!<br /><br />Tip: To jump really high, use your second jump when<br />you reach the maximum height from your first jump.<br /><br />Note: If you fall off a block, you lose your first jump.'+continueString,x:13*20,y:(13+1)*20,w:8*20,h:20,land:true,displayX:(800-460)/2,displayY:320,displayW:460,displayH:190},
                    {text:'Beware of icicles falling from above!'+continueString,x:1*20,y:(28+1)*20,w:4*20,h:20,land:true,displayX:200,displayY:200,displayW:400,displayH:100},
                    {text:'Some blocks are invisible until you touch them!<br />Try walking forwards! It\'s safe!'+continueString,x:17*20,y:(23+1)*20,w:10*20,h:20,land:true,displayX:(800-440)/2,displayY:200,displayW:440,displayH:120},
                    {text:'Whenever you get a present you unlock a letter at the top of the screen!'+continueString,x:36*20,y:17*20,w:2*20,h:2*20,land:false,displayX:(800-410)/2,displayY:200,displayW:410,displayH:120},
                    {text:'Nice work! You\'re almost done with the first room!<br /><br />Keep getting all the presents!<br />If you get stuck, try reading the instructions on the right.'+continueString,x:28*20,y:(28+1)*20,w:11*20,h:20,land:true,displayX:(800-500)/2,displayY:200,displayW:500,displayH:150}];
    var helpTriggersPassed = getCookie('helpTriggersPassed');
    if(helpTriggersPassed == '') {
        setCookie('helpTriggersPassed', '0');
    }
    else {
        for(var i = 0; i < Math.min(parseInt(helpTriggersPassed), helpTriggers.length); i++) {
            helpTriggers[i].alreadyShown = true;
        }
    }

    // init all blocks
    // AND init main container after file load
    initBlocks(playingExpert ? roomExpert : room, forward);
}

var initContainer = function() {
    if(killFade == null) {
        var container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.left = permContainerX;
        container.style.top = permContainerY;
        container.style.width = '800px';
        container.style.height = '600px';
        container.style.cursor = 'initial';
        container.style.transition = 'backgroundImage 2s ease';
        container.setAttribute('id','container');
        return container;
    }
    else {
        var container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.left = killFade.style.left;
        container.style.top = killFade.style.top;
        container.style.width = killFade.style.width;
        container.style.height = killFade.style.height;
        container.style.cursor = 'initial';
        container.style.transition = 'backgroundImage 2s ease';
        container.setAttribute('id','container');
        return container;
    }
}

var initBlocks = function(map, forward) {
    fileLoading = true;
    if(map == 1) {
        setCookie('helpTriggersPassed', helpTriggers.length);
    }
    var mapString;
    if(!playingExpert) {
        if(letters[map] != null) {
            for(var i = 0; i < letters[map].length; i++) {
                if(letters[map][i].ref != null) {
                    letters[map][i].ref.letter.remove();
                }
            }
        }
    }
    else {
        if(lettersExpert[map] != null) {
            for(var i = 0; i < lettersExpert[map].length; i++) {
                if(lettersExpert[map][i].ref != null) {
                    lettersExpert[map][i].ref.letter.remove();
                }
            }
        }
    }
    if(!playingExpert) {
        if(map > lastMap) { // should probably catch 404 instead of breaking out before and hardcoding last map value
            if(forward) {
        //        initMenu();
        //        return;
                mapString = 'formal';
                map = room = lastMap + 1;
                setCookie('room',room+'');
                setCookie('expertLocked','0');
                expertLocked = false;
            }
            else {
                map = lastMap;
                mapString = 'map'+map;
            }
        }
        else if(map == lastMap) {
            map = lastMap;
            mapString = 'map'+map;
            //changeY = false;
            //changeX = true;
        }
        else {
            mapString = 'map'+map;
        }
    }
    else {
        if(map > lastExpertMap) {
            pause();
            showAlert('Nice job!! You completed expert mode!<br /><br />Press C to continue', (800-400)/2, 200, 400, 100);
            initMenuQueued = true;
            roomExpert = 0;
            setCookie('roomExpert','0');
            return;
        }
        mapString = 'expertMap'+map;
    }
    if(!skipReadFile) {
        listOfBlocks = [];
        listOfIcicles = [];
        listOfUpIcicles = [];
        mapData = new Array(30);
        for(var i = 0; i < 30; i++) {
            mapData[i] = new Array(40);
        }
        var blob;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'maps/'+mapString);
        xhr.responseType = 'blob';
        xhr.onload = function() {
            // read file
            blob = xhr.response;
            var reader = new FileReader();
            reader.onload = function(e) {
                array = e.target.result.split('n');
                for(var i = 0; i < array.length; i++) {
                    mapData[i] = array[i].split('');
                }
                mapReferences = new Array(30);
                for(var i = 0; i < 30; i++) {
                    mapReferences[i] = new Array(40);
                }
                populateLevelFromMapData();
            }
            reader.onerror = function(e) {
                alert('We\re sorry, there was an error!\nReturning to main menu.');
                initMenu();
                return;
            }
            reader.readAsText(blob);
        }
        xhr.send();
    }
    else {
        skipReadFile = false;

        for(i = 0; i < listOfBlocks.length; i++) {
            listOfBlocks[i].refresh();
        }
        for(i = 0; i < listOfIcicles.length; i++) {
            listOfIcicles[i].refresh();
            icicles[listOfIcicles[i].x/20] = listOfIcicles[i];
        }
        for(i = 0; i < listOfUpIcicles.length; i++) {
            listOfUpIcicles[i].refresh();
        }

        for(i = 0; i < mapData.length; i++) {
            for(j = 0; j < mapData[i].length; j++) {
                switch(parseInt(mapData[i][j])) {
                case 5:
                    // initial penguin position for next level or game start
                    if(forward) {
                        if(changeX) {
                            px = j * 20 + ps;
                        }
                        if(changeY) {
                            if(i == 0) {
                                py = 1;
                            }
                            else {
                                py = i * 20;
                            }
                        }
                    }
                    break;
                case 6:
                    // initial penguin position for previous level
                    if(!forward) {
                        if(changeX) {
                            px = j * 20 + ps;
                        }
                        if(changeY) {
                            if(i == 0) {
                                py = 1;
                            }
                            else {
                                py = i * 20;
                            }
                        }
                    }
                    break;
                case 9:
                    if(!playingExpert) {
                        if(letters[map] != null) {
                            for(var k = 0; k < letters[map].length; k++) {
                                if(letters[map][k].x == j && letters[map][k].y == i) {
                                    if(!letters[map][k].achieved) {
                                        obj = new Letter(j, i, false);
                                    }
                                    else {
                                        obj = new Letter(j, i, true);
                                    }
                                    container.appendChild(obj.letter);
                                    letters[map][k].ref = obj;
                                    break;
                                }
                            }
                        }
                        break;
                    }
                    else {
                        if(lettersExpert[map] != null) {
                            for(var k = 0; k < lettersExpert[map].length; k++) {
                                if(lettersExpert[map][k].x == j && lettersExpert[map][k].y == i) {
                                    if(!lettersExpert[map][k].achieved) {
                                        obj = new Letter(j, i, false);
                                    }
                                    else {
                                        obj = new Letter(j, i, true);
                                    }
                                    container.appendChild(obj.letter);
                                    lettersExpert[map][k].ref = obj;
                                    break;
                                }
                            }
                        }
                        break;
                    }
                }
            }
        }

        movePenguinDiv();
        unpause();
        changingRooms = false;
        finishedChangingRooms = true;
        fileLoading = false;
    }
}

var populateLevelFromMapData = function() {
    // init main container
    document.getElementById('container').remove();
    container = initContainer();
    document.body.appendChild(container);
    container.style.backgroundImage = 'url(img/bg.jpg)';
    container.appendChild(penguin);

    for(var i = 0; i < mapData.length; i++) {
        for(var j = 0; j < mapData[i].length; j++) {
            var obj;
            switch(parseInt(mapData[i][j])) {
            case 0:
                // empty
                break;
            case 1:
                // visible block
                container.appendChild((obj = new Block(j, i, 20, true)).block);
                listOfBlocks[listOfBlocks.length] = obj;
                break;
            case 2:
                // invisible block
                container.appendChild((obj = new Block(j, i, 20, false)).block);
                listOfBlocks[listOfBlocks.length] = obj;
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
                    if(changeX) {
                        px = j * 20 + ps;
                    }
                    if(changeY) {
                        if(i == 0) {
                            py = 1;
                        }
                        else {
                            py = i * 20;
                        }
                    }
                }
                break;
            case 6:
                // initial penguin position for previous level
                if(!forward) {
                    if(changeX) {
                        px = j * 20 + ps;
                    }
                    if(changeY) {
                        if(i == 0) {
                            py = 1;
                        }
                        else {
                            py = i * 20;
                        }
                    }
                }
                break;
            case 7:
                obj = new Icicle(j, i);
                icicles[j] = obj; // WARNING: assumes only one icicle per column
                container.appendChild(obj.icicle);
                listOfIcicles[listOfIcicles.length] = obj;
                break;
            case 8:
                container.appendChild((obj = new IcicleUp(j, i)).icicle);
                listOfUpIcicles[listOfUpIcicles.length] = obj;
                break;
            case 9:
                if(!playingExpert) {
                    if(letters[room] == null) {
                        break;
                    }
                    for(var k = 0; k < letters[room].length; k++) {
                        if(letters[room][k].x == j && letters[room][k].y == i) {
                            if(!letters[room][k].achieved) {
                                obj = new Letter(j, i, false);
                            }
                            else {
                                obj = new Letter(j, i, true);
                            }
                            container.appendChild(obj.letter);
                            letters[room][k].ref = obj;
                            break;
                        }
                    }
                    break;
                }
                else {
                    if(lettersExpert[roomExpert] == null) {
                        break;
                    }
                    for(var k = 0; k < lettersExpert[roomExpert].length; k++) {
                        if(lettersExpert[roomExpert][k].x == j && lettersExpert[roomExpert][k].y == i) {
                            if(!lettersExpert[roomExpert][k].achieved) {
                                obj = new Letter(j, i, false);
                            }
                            else {
                                obj = new Letter(j, i, true);
                            }
                            container.appendChild(obj.letter);
                            lettersExpert[roomExpert][k].ref = obj;
                            break;
                        }
                    }
                    break;
                }
            }
            mapReferences[i][j] = obj;
        }
    }
    movePenguinDiv();
    unpause();
    changingRooms = false;
    finishedChangingRooms = true;
    fileLoading = false;
}

var loop = function() {
    setTimeout(nextLoop, 17);
    loopComplete = false;
    if(!paused && initMenuQueued) {
        initMenuQueued = false;
        initMenu();
    }
    else if(!paused && !changingRooms && !roomChangeQueued) {
        var now = Date.now();

//        for(var i = 0; i < Math.floor((now-last)/17); i++) {
//            update((now-last)/Math.floor((now-last)/17));
//        }

        var nowMinusLast = now - last;
        for(var i = 0; i < Math.ceil((nowMinusLast)/20); i++) {
            update((nowMinusLast)/Math.ceil((nowMinusLast)/20));
        }

        /*
        if(step || stepping) {
            step = false;
            var nowMinusLast = 17;
            for(var i = 0; i < Math.ceil((nowMinusLast)/20); i++) {
                update((nowMinusLast)/Math.ceil((nowMinusLast)/20));
            }
        }
        */
        last = now;
    }
    else {
        last = Date.now();
    }
    if(roomChangeQueued && !tutorial) {
        pause();
        oneUpdate = false;
        twoUpdates = false;
        roomChangeQueued = false;
        initGame();
    }
    loopComplete = true;
}

var nextLoop = function() {
    if(loopComplete) {
        loop();
    }
    else {
        if(!paused) {
            setTimeout(nextLoop, 1);
        }
        else {
            setTimeout(nextLoop, 100);
        }
    }
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
        if(roomChangeQueued) {
            return;
        }
        if(!finishedChangingRooms) {
            return;
        }
        if(finishedChangingRooms && !finishedChangingRooms2) {
            finishedChangingRooms2 = true;
            return;
        }
        if(fileLoading) {
            return;
        }
        for(var i = 0; i < icicles.length; i++) {
            if(icicles[i] != null) {
                if(icicles[i].falling) {
                    icicles[i].update(delta);
                }
            }
        }

        if(!oneUpdate) {
            oneUpdate = true;
            if(npy < 0) {
                npy = 0;
            }
        }
        else {
            twoUpdates = true;
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
        dy = a * msSinceJump / 1000 + v0;
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

        var blockUnderneathLeft = collision(getMapData(Math.floor(npy/20) + 1, Math.floor(npx/20)));
        var blockUnderneathRight = (Math.floor((npx + pw)/20) > Math.floor(npx/20)) ? collision(getMapData(Math.floor(npy/20) + 1, Math.floor(npx/20) + 1)) : blockUnderneathLeft;

        var alreadyAdjusted = false;

        // check if on block with icicle, if so kill
        if(blockUnderneathLeft && !inAir && !blockUnderneathRight) {
            if(isIcicleUp(getMapData(Math.floor(npy/20), Math.floor(npx/20)))) {
                kill();
                alreadyAdjusted = true;
            }
        }
        if(blockUnderneathRight && !inAir && !blockUnderneathLeft) {
            if(isIcicleUp(getMapData(Math.floor(npy/20), Math.floor(npx/20) + 1))) {
                kill();
                alreadyAdjusted = true;
            }
        }

        if(!inAir && !alreadyAdjusted) {
            if(right && !left && lastBlockUnderneathLeft && !blockUnderneathLeft) {
                fall();
                if(blockUnderneathRight || blockTopRight) {
                    shiftXLeft(npx);
                }
                else {
                    px = npx;
                }
                alreadyAdjusted = true;
            }
            if(left && !right && lastBlockUnderneathRight && !blockUnderneathRight) {
                fall();
                if(blockUnderneathLeft || blockTopLeft) {
                    shiftXRight(npx);
                }
                else {
                    px = npx;
                }
                alreadyAdjusted = true;
            }
            lastBlockUnderneathLeft = blockUnderneathLeft;
            lastBlockUnderneathRight = blockUnderneathRight;
        }
        else {
            lastBlockUnderneathLeft = lastBlockUnderneathRight = false;
        }

///*
        if(!alreadyAdjusted) {
            if(!blockDownLeft && !blockDownRight && !blockTopLeft && !blockTopRight) {
//                console.log('case 1');
                px = npx;
                py = npy;
            }
            else if(blockDownLeft && blockDownRight && !blockTopLeft && !blockTopRight) {
//                console.log('case 2');
                px = npx;
                shiftYUp(npy);
            }
            else if(blockTopLeft && blockTopRight && !blockDownLeft && !blockDownRight) {
//                console.log('case 3');
                px = npx;
                shiftYDown(npy);
            }
            else if(blockTopLeft && blockDownLeft && !blockTopRight && !blockDownRight) {
//                console.log('case 4');
                shiftXRight(npx);
                py = npy;
            }
            else if(blockTopRight && blockDownRight && !blockTopLeft && !blockDownLeft) {
//                console.log('case 5');
                shiftXLeft(npx);
                py = npy;
            }
            else if(blockDownLeft && blockDownRight && blockTopLeft && !blockTopRight) {
//                console.log('case 6');
                shiftXRight(npx);
                shiftYUp(npy);
            }
            else if(blockDownLeft && blockDownRight && blockTopRight && !blockTopLeft) {
//                console.log('case 7');
                shiftXLeft(npx);
                shiftYUp(npy);
            }
            else if(blockDownLeft && blockTopLeft && blockTopRight && !blockDownRight) {
//                console.log('case 8');
                shiftXRight(npx);
                shiftYDown(npy);
            }
            else if(blockDownRight && blockTopLeft && blockTopRight && !blockDownLeft) {
//                console.log('case 9');
                shiftXLeft(npx);
                shiftYDown(npy);
            }
            else if(blockDownRight && blockTopLeft) {
//                console.log('case 10');
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
//                console.log('case 11');
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
                    if(lastBlockTopLeft && dy > 0) {
//                        console.log('case 12a0');
                        px = npx;
                        shiftYUp(npy);
                    }
                    else if(xCollisionBefore && !yCollisionBefore) {
//                        console.log('case 12a1');
                        px = npx;
                        shiftYUp(npy);
                    }
                    else if(yCollisionBefore && !xCollisionBefore) {
//                        console.log('case 12a2');
                        shiftXRight(npx);
                        py = npy;
                    }
                    else {
//                        console.log('case 12a3');
                        adjustAdvanced(npx, npy, dy, 1, -1);
                    }
                }
                else if(blockDownRight) {
                    if(lastBlockTopRight && dy > 0) {
//                        console.log('case 12b0');
                        px = npx;
                        shiftYUp(npy);
                    }
                    else if(xCollisionBefore && !yCollisionBefore) {
//                        console.log('case 12b1');
                        px = npx;
                        shiftYUp(npy);
                    }
                    else if(yCollisionBefore && !xCollisionBefore) {
//                        console.log('case 12b2');
                        shiftXLeft(npx);
                        py = npy;
                    }
                    else {
//                        console.log('case 12b3');
                        adjustAdvanced(npx, npy, dy, -1, -1);
                    }
                }
                else if(blockTopLeft) {
                    if(lastBlockDownLeft && dy < 0) {
//                        console.log('case 12c0');
                        px = npx;
                        shiftYDown(npy);
                    }
                    else if(xCollisionBefore && !yCollisionBefore) {
//                        console.log('case 12c1');
                        px = npx;
                        shiftYDown(npy);
                    }
                    else if(yCollisionBefore && !xCollisionBefore) {
//                        console.log('case 12c2');
                        shiftXRight(npx);
                        py = npy;
                    }
                    else {
//                        console.log('case 12c3');
                        adjustAdvanced(npx, npy, dy, 1, 1);
                    }
                }
                else if(blockTopRight) {
                    if(lastBlockDownRight && dy < 0) {
//                        console.log('case 12d0');
                        px = npx;
                        shiftYDown(npy);
                    }
                    else if(xCollisionBefore && !yCollisionBefore) {
//                        console.log('case 12d1');
                        px = npx;
                        shiftYDown(npy);
                    }
                    else if(yCollisionBefore && !xCollisionBefore) {
//                        console.log('case 12d2');
                        shiftXLeft(npx);
                        py = npy;
                    }
                    else {
//                        console.log('case 12d3');
                        adjustAdvanced(npx, npy, dy, -1, 1);
                    }
                }
            }
        }
//*/

/*
        if(!alreadyAdjusted) {
            if(!blockDownLeft && !blockDownRight && !blockTopLeft && !blockTopRight) {
                console.log('case 1');
                px = npx;
                py = npy;
            }
            else if(blockDownLeft && blockDownRight && !blockTopLeft && !blockTopRight) {
                console.log('case 2');
                px = npx;
                shiftYUp(npy);
            }
            else if(blockTopLeft && blockTopRight && !blockDownLeft && !blockDownRight) {
                console.log('case 3');
                px = npx;
                shiftYDown(npy);
            }
            else if(blockTopLeft && blockDownLeft && !blockTopRight && !blockDownRight) {
                console.log('case 4');
                shiftXRight(npx);
                py = npy;
            }
            else if(blockTopRight && blockDownRight && !blockTopLeft && !blockDownLeft) {
                console.log('case 5');
                shiftXLeft(npx);
                py = npy;
            }
            else if(blockDownLeft && blockDownRight && blockTopLeft && !blockTopRight) {
                console.log('case 6');
                shiftXRight(npx);
                shiftYUp(npy);
            }
            else if(blockDownLeft && blockDownRight && blockTopRight && !blockTopLeft) {
                console.log('case 7');
                shiftXLeft(npx);
                shiftYUp(npy);
            }
            else if(blockDownLeft && blockTopLeft && blockTopRight && !blockDownRight) {
                console.log('case 8');
                shiftXRight(npx);
                shiftYDown(npy);
            }
            else if(blockDownRight && blockTopLeft && blockTopRight && !blockDownLeft) {
                console.log('case 9');
                shiftXLeft(npx);
                shiftYDown(npy);
            }
            else if(blockDownRight && blockTopLeft) {
                console.log('case 10');
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
                console.log('case 11');
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
                    if(lastBlockTopLeft && dy > 0) {
                        console.log('case 12a0');
                        px = npx;
                        shiftYUp(npy);
                    }
                    else if(xCollisionBefore && !yCollisionBefore) {
                        console.log('case 12a1');
                        px = npx;
                        shiftYUp(npy);
                    }
                    else if(yCollisionBefore && !xCollisionBefore) {
                        console.log('case 12a2');
                        shiftXRight(npx);
                        py = npy;
                    }
                    else {
                        console.log('case 12a3');
                        adjustAdvanced(npx, npy, dy, 1, -1);
                    }
                }
                else if(blockDownRight) {
                    if(lastBlockTopRight && dy > 0) {
                        console.log('case 12b0');
                        px = npx;
                        shiftYUp(npy);
                    }
                    else if(xCollisionBefore && !yCollisionBefore) {
                        console.log('case 12b1');
                        px = npx;
                        shiftYUp(npy);
                    }
                    else if(yCollisionBefore && !xCollisionBefore) {
                        console.log('case 12b2');
                        shiftXLeft(npx);
                        py = npy;
                    }
                    else {
                        console.log('case 12b3');
                        adjustAdvanced(npx, npy, dy, -1, -1);
                    }
                }
                else if(blockTopLeft) {
                    if(lastBlockDownLeft && dy < 0) {
                        console.log('case 12c0');
                        px = npx;
                        shiftYDown(npy);
                    }
                    else if(xCollisionBefore && !yCollisionBefore) {
                        console.log('case 12c1');
                        px = npx;
                        shiftYDown(npy);
                    }
                    else if(yCollisionBefore && !xCollisionBefore) {
                        console.log('case 12c2');
                        shiftXRight(npx);
                        py = npy;
                    }
                    else {
                        console.log('case 12c3');
                        adjustAdvanced(npx, npy, dy, 1, 1);
                    }
                }
                else if(blockTopRight) {
                    if(lastBlockDownRight && dy < 0) {
                        console.log('case 12d0');
                        px = npx;
                        shiftYDown(npy);
                    }
                    else if(xCollisionBefore && !yCollisionBefore) {
                        console.log('case 12d1');
                        px = npx;
                        shiftYDown(npy);
                    }
                    else if(yCollisionBefore && !xCollisionBefore) {
                        console.log('case 12d2');
                        shiftXLeft(npx);
                        py = npy;
                    }
                    else {
                        console.log('case 12d3');
                        adjustAdvanced(npx, npy, dy, -1, 1);
                    }
                }
            }
        }
*/

        if(!alreadyAdjusted) {
            justStartedFalling = false;
        }

        lastBlockDownRight = blockDownRight;
        lastBlockDownLeft = blockDownLeft;
        lastBlockTopRight = blockTopRight;
        lastBlockTopLeft = blockTopLeft;

        if(!inAir) {
            // WARNING: blockUnderneathLeft and blockUnderneathRight are also declared above, and calculated differently.
            // Make sure to only use their values here if you set them to the new, calculated value, and don't try to use the original values
            // NOTE: too lazy to change the variable names to something else
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
            
            if(py >= 20) {
                if(collision(getMapData(Math.floor(py/20) - 1, Math.floor(px/20)))) {
                    mapReferences[Math.floor(py/20) - 1][Math.floor(px/20)].show();
                }
                if(Math.floor((px+pw)/20) > Math.floor(px/20)) {
                    if(collision(getMapData(Math.floor(py/20) - 1, Math.floor(px/20) + 1))) {
                        mapReferences[Math.floor(py/20) - 1][Math.floor(px/20) + 1].show();
                    }
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

        var blockTopLeft = npy >= 0;
        var blockDownLeft = npy % 20 != 0;
        var blockTopRight = blockTopLeft && Math.floor((npx + pw)/20) > Math.floor(npx/20);
        var blockDownRight = blockDownLeft && blockTopRight;

/*
//        if(blockTopLeft && !blockTopRight && !blockDownLeft) {
        if(blockTopLeft) {
//            if(isIcicleUp(getMapData(Math.floor(npy/20),Math.floor(npx/20))) && (blockTopRight && !collision(getMapData(Math.floor(npy/20),Math.floor(npx/20)+1))) && !collision(getMapData(Math.floor(npy/20)+1,Math.floor(npx/20)))) {
            if(isIcicleUp(getMapData(Math.floor(npy/20),Math.floor(npx/20))) && !(!blockTopRight && collision(getMapData(Math.floor(npy/20),Math.floor(npx/20)+1)))) {
                if(mapReferences[Math.floor(npy/20)][Math.floor(npx/20)].collision(npx, npy, pw)) {
                    kill();
                    return;
                }
            }
        }
//        if(blockDownLeft && !blockDownRight && !blockTopLeft) {
        if(blockDownLeft) {
//            if(isIcicleUp(getMapData(Math.floor(npy/20)+1,Math.floor(npx/20))) && (blockDownRight && !collision(getMapData(Math.floor(npy/20)+1,Math.floor(npx/20)+1))) && !collision(getMapData(Math.floor(npy/20),Math.floor(npx/20)))) {
            if(isIcicleUp(getMapData(Math.floor(npy/20)+1,Math.floor(npx/20))) && !(!blockDownRight && collision(getMapData(Math.floor(npy/20)+1,Math.floor(npx/20)+1)))) {
                if(mapReferences[Math.floor(npy/20)+1][Math.floor(npx/20)].collision(npx, npy, pw)) {
                    kill();
                    return;
                }
            }
        }
//        if(blockTopRight && !blockTopLeft && !blockDownRight) {
        if(blockTopRight) {
//            if(isIcicleUp(getMapData(Math.floor(npy/20),Math.floor(npx/20)+1)) && !collision(getMapData(Math.floor(npy/20),Math.floor(npx/20))) && (blockDownRight && !collision(getMapData(Math.floor(npy/20)+1,Math.floor(npx/20)+1)))) {
            if(isIcicleUp(getMapData(Math.floor(npy/20),Math.floor(npx/20)+1)) && !collision(getMapData(Math.floor(npy/20),Math.floor(npx/20)))) {
                if(mapReferences[Math.floor(npy/20)][Math.floor(npx/20)+1].collision(npx, npy, pw)) {
                    kill();
                    return;
                }
            }
        }
//        if(blockDownRight && !blockDownLeft && !blockTopRight) {
        if(blockDownRight) {
//            if(isIcicleUp(getMapData(Math.floor(npy/20)+1,Math.floor(npx/20)+1)) && !collision(getMapData(Math.floor(npy/20)+1,Math.floor(npx/20))) && (blockTopRight && !collision(getMapData(Math.floor(npy/20),Math.floor(npx/20)+1)))) {
            if(isIcicleUp(getMapData(Math.floor(npy/20)+1,Math.floor(npx/20)+1)) && !collision(getMapData(Math.floor(npy/20)+1,Math.floor(npx/20)))) {
                if(mapReferences[Math.floor(npy/20)+1][Math.floor(npx/20)+1].collision(npx, npy, pw)) {
                    kill();
                    return;
                }
            }
        }
*/

        if(blockTopLeft) {
            if(isIcicleUp(getMapData(Math.floor(py/20),Math.floor(px/20))) && !(!blockTopRight && collision(getMapData(Math.floor(py/20),Math.floor(px/20)+1)))) {
                if(mapReferences[Math.floor(py/20)][Math.floor(px/20)].collision(px, py, pw)) {
                    kill();
                    return;
                }
            }
        }
        if(blockDownLeft) {
            if(isIcicleUp(getMapData(Math.floor(py/20)+1,Math.floor(px/20))) && !(!blockDownRight && collision(getMapData(Math.floor(py/20)+1,Math.floor(px/20)+1)))) {
                if(mapReferences[Math.floor(py/20)+1][Math.floor(px/20)].collision(npx, npy, pw)) {
                    kill();
                    return;
                }
            }
        }
        if(blockTopRight) {
            if(isIcicleUp(getMapData(Math.floor(py/20),Math.floor(px/20)+1)) && !collision(getMapData(Math.floor(py/20),Math.floor(px/20)))) {
                if(mapReferences[Math.floor(py/20)][Math.floor(px/20)+1].collision(npx, npy, pw)) {
                    kill();
                    return;
                }
            }
        }
        if(blockDownRight) {
            if(isIcicleUp(getMapData(Math.floor(py/20)+1,Math.floor(px/20)+1)) && !collision(getMapData(Math.floor(py/20)+1,Math.floor(px/20)))) {
                if(mapReferences[Math.floor(py/20)+1][Math.floor(px/20)+1].collision(npx, npy, pw)) {
                    kill();
                    return;
                }
            }
        }

        // check for down icicles in columns penguin is in, check collision, if no collision then fall
        var icicleLeft = icicles[Math.floor(npx/20)];
        var icicleRight = null;
        if((Math.floor((npx + pw)/20) > Math.floor(npx/20)) && Math.floor(npx/20) < icicles.length) {
            icicleRight = icicles[Math.floor(npx/20)+1];
        }
        if(icicleLeft != null) {
            if(icicleLeft.collision(npx, npy, pw)) {
                moveIcicleDivs();
                kill();
                return;
            }
            else if(icicleLeft.shouldFall(npx, npy, pw)) {
                icicleLeft.fall();
            }
        }
        if(icicleRight != null) {
            if(icicleRight.collision(npx, npy, pw)) {
                moveIcicleDivs();
                kill();
                return;
            }
            else if(icicleRight.shouldFall(npx, npy, pw)) {
                icicleRight.fall();
            }
        }
        
        moveIcicleDivs();
        
        // Check if we got a letter
        if(!playingExpert) {
            if(letters[room] != null) {
                for(var i = 0; i < letters[room].length; i++) {
                    if(letters[room][i].ref != null) {
                        if(letters[room][i].ref.collision(npx, npy, pw)) {
    //                        letters[room][i].ref.letter.style.display = 'none';
                            if(!letters[room][i].achieved) {
    //                            letters[room][i].ref.letterImg.setAttribute('src','img/letter6.png');
    //                            letters[room][i].ref.letter.innerHTML = letters[room][i].ref.letterImg.outerHTML;
                                letters[room][i].ref.animatePresent();
    //                            animatePresent(letters[room][i].ref.x, letters[room][i].ref.y);
    //                            console.log(letters[room][i].ref.letterImg);
    //                            console.log(letters[room][i].ref.letter);
                                letters[room][i].achieved = true;
                                addLetter(getLetterIndex(room, i));
                                break;
                            }
                        }
                    }
                }
            }
        }
        else {
            if(lettersExpert[roomExpert] != null) {
                for(var i = 0; i < lettersExpert[roomExpert].length; i++) {
                    if(lettersExpert[roomExpert][i].ref != null) {
                        if(lettersExpert[roomExpert][i].ref.collision(npx, npy, pw)) {
                            if(!lettersExpert[roomExpert][i].achieved) {
                                lettersExpert[roomExpert][i].ref.animatePresent();
                                lettersExpert[roomExpert][i].achieved = true;
                                lettersExpertThisRoom++;
                                updateLettersCurrentString();
                                break;
                            }
                        }
                    }
                }
            }
        }

        if(room == 0) {
            for(var i = 0; i < helpTriggers.length; i++) {
                if(!helpTriggers[i].alreadyShown && !helpTriggers[i].removed) {
                    if(!helpTriggers[i].land) {
                        if(px < helpTriggers[i].x + helpTriggers[i].w && px + pw > helpTriggers[i].x && py < helpTriggers[i].y + helpTriggers[i].h && py + 20 > helpTriggers[i].y) {
                            helpTriggers[i].alreadyShown = true;
                            pause();
                            showAlert(helpTriggers[i].text, helpTriggers[i].displayX, helpTriggers[i].displayY, helpTriggers[i].displayW, helpTriggers[i].displayH);
                            tutorial = true;
//                            setCookie('helpTriggersPassed', (i == 0 ? 0 : (i-1)) + '');
                            setCookie('helpTriggersPassed', i+'');
                            while(i > 0) {
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
//                            setCookie('helpTriggersPassed', (i == 0 ? 0 : (i-1)) + '');
                            setCookie('helpTriggersPassed', i+'');
                            while(i > 0) {
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
    if(Math.abs((px - npx) / dx) < Math.abs((py - npy) / dy) || justStartedFalling) {
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
        if(dy > 0) {
            outOfBoundsY(y, x);
        }
        return -1;
    }
    else if(y < 0) {
        if(dy < 0) {
            outOfBoundsY(y, x);
        }
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
    if(!roomChangeQueued) {
        changeX = true;
        changeY = false;
        var type = mapData[y][x < 0 ? x + 1 : x - 1];
        if(type == 3 || type == 5) {
            previousRoom(true);
        }
        else if(type == 4) {
            nextRoom(true);
        }
    }
}

var outOfBoundsY = function(y, x) {
    if(!roomChangeQueued) {
        changeX = false;
        changeY = true;
        var type = mapData[y < 0 ? y + 1 : y - 1][x];
        if(type == 3 || type == 5) {
            previousRoom(false);
        }
        else if(type == 4) {
            nextRoom(false);
        }
    }
}

// warning: ensure first room has no exit or no way of accessing exit
var previousRoom = function(adjustX) {
    if(!roomChangeQueued && !paused) {
        if(playingExpert && twoUpdates) {
            roomChangeQueued = true;
            pause();
            if(adjustX) {
                changeX = true;
                changeY = false;
                px = 0;
            }
            else {
                changeX = false;
                changeY = true;
                py = 10;
            }
            forward = true;
            movePenguinDiv();
            showAlert('Sorry!<br />You can\'t go backwards in expert mode!<br /><br />Press C to continue', (800-400)/2, 180, 400, 120);
            tutorial = true;
            restart();
            return;
        }
    }
    finishedChangeRooms = finishedChangingRooms2 = false;
    if(!roomChangeQueued) {
        roomChangeQueued = true;
        forward = false;
        pause();
//        changeX = changeY = true;
        if(!playingExpert) {
            room--;
            setCookie('room',room+'');
        }
        else if(twoUpdates) {
            roomExpert--;
            setCookie('roomExpert',roomExpert);
        }
    }
}

var nextRoom = function(adjustX) {
    finishedChangeRooms = finishedChangingRooms2 = false;
    if(!roomChangeQueued) {
        forward = true;
        pause();
        if(!playingExpert) {
            if(room == lastMap) {
                var allLetters = hasAllLetters();
                if(!allLetters) {
                    needToGetLettersAlert(true);
                    return;
                }
                else {
                    roomChangeQueued = true;
                }
            }
            else {
                roomChangeQueued = true;
            }
        }
        else {
            if(lettersExpertThisRoom < lettersExpert[roomExpert].length) {
                needToGetLettersExpertAlert(adjustX);
                if(!adjustX) {
                    expertNoRestart = true;
//                    restart();
//                    return;
                    for(i = 0; i < mapData.length; i++) {
                        for(j = 0; j < mapData[i].length; j++) {
                            if(mapData[i][j] == '6') {
                                px = j * 20;
                                py = i * 20;
                                return;
                            }
                        }
                    }
                }
                return;
            }
            else {
                roomChangeQueued = true;
            }
        }
//        changeX = changeY = true;
        if(!playingExpert) {
            room++;
            setCookie('room',room+'');
            if(room > maxRoom) {
                maxRoom = room;
            }
            setCookie('maxRoom',maxRoom+'');
        }
        else {
            roomExpert++;
            setCookie('roomExpert',roomExpert+'');
            if(roomExpert > maxRoomExpert) {
                maxRoomExpert = roomExpert;
            }
            setCookie('maxRoomExpert',maxRoomExpert+'');
        }
    }
}

var goToRoom = function(roomToGoTo) {
    if(!roomChangeQueued && !paused) {
        if(roomToGoTo <= (playingExpert ? maxRoomExpert : maxRoom) && roomToGoTo >= 0) {
            roomChangeQueued = true;
            finishedChangeRooms = finishedChangingRooms2 = false;
            forward = true;
            changeX = changeY = true;
            if(!playingExpert) {
                room = roomToGoTo;
                setCookie('room',room+'');
                setCookie('maxRoom',maxRoom+'');
            }
            else {
                roomExpert = roomToGoTo;
                setCookie('roomExpert',roomExpert+'');
                setCookie('maxRoomExpert',maxRoomExpert+'');
            }
        }
        else if(roomToGoTo < 0) {
            if(!playingExpert) {
                room = 0;
                setCookie('room',room+'');
            }
            else {
                roomExpert = 0;
                setCookie('roomExpert',roomExpert+'');
            }
            restart();
        }
        else if((!playingExpert && roomToGoTo == lastMap + 1) || (playingExpert && roomToGoTo == lastExpertMap + 1)) {
            if(!playingExpert) {
                needToGetLettersAlert(false);
                return;
            }
            else {
                // do nothing
            }
        }
        else {
            pause();
            showAlert('Sorry! You can only skip to a room if you\'ve been there before!<br /><br />Press C to continue', (800-420)/2, 200, 420, 120);
        }
    }
}

var needToGetLettersAlert = function(adjustX) {
    pause();
    if(!hasAllLetters()) {
        showAlert('Sorry!<br />You can\'t enter this room until you have all the presents!<br /><br />Press Z to go to the previous room<br />Press X to go to the next room<br /><br />Go get all the presents!<br /><br />Press C to continue.', (800-500)/2, 180, 500, 220);
        tutorial = true;
        if(adjustX) {
            px = 800 - pw - 1;
        }
        movePenguinDiv();
        roomChangeQueued = false;
    }
    else {
        showAlert('Sorry! You can only skip to a room if you\'ve been there before!<br /><br />Press C to continue', (800-420)/2, 200, 420, 120);
    }
}

var needToGetLettersExpertAlert = function(adjustX) {
    pause();
    showAlert('Sorry!<br /><br />In expert mode you have to get all the presents<br />to enter the next room!<br /><br />Press C to continue', (800-420)/2, 180, 420, 160);
    tutorial = true;
    if(adjustX) {
        px = 800 - pw - 1;
    }
    else {
        py = 600 - 20 - 1;
        changeX = changeY = true;
    }
    movePenguinDiv();
    roomChangeQueued = false;
}

var hasAllLetters = function() {
    for(i = 0; i < lettersCurrent.length; i++) {
        if(!lettersCurrent[i]) {
            return false;
        }
    }
    return true;
}

var getAllLetters = function() {
    for(i = 0; i < lettersCurrent.length; i++) {
        addLetter(i);
    }
}

var restart = function() {
    skipReadFile = true;
//    if(expertNoRestart) {
//        expertNoRestart = false;
//        forward = false;
//    }
//    else if(playingExpert) {
    if(playingExpert) {
        forward = true;
    }
    else {
        changeX = changeY = true;
    }
    roomChangeQueued = true;
}

var collision = function(i) {
    return i == 1 || i == 2;
}

var isIcicleUp = function(i) {
    return i == 8;
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
    justStartedFalling = true;
}

var hitCeiling = function() {
    fall();
    jumpCount--;
}

var kill = function() {
    if(!changingRooms) {
        skipReadFile = true;
        changingRooms = true;
        if(playingExpert) {
            forward = true;
        }
        changeX = changeY = true;
        movePenguinDiv();
        pause();

        killFade.style.backgroundColor = 'rgba(0,0,0,1.0)';
        setTimeout(function() {
            killFade.style.backgroundColor = 'rgba(0,0,0,0.0)';
            roomChangeQueued = true;
        },1000);
    }
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

var addLetter = function(i) {
    lettersCurrent[lettersOrder[i]] = true;
    
    var won = true;
    for(var i = 0; i < lettersCurrent.length; i++) {
        if(!lettersCurrent[i]) {
            won = false;
            break;
        }
    }

    updateLettersCurrentString();
    
    setLettersCurrentCookie();
    
    if(won) {
        youWin();
    }
}

// WARNING: does not check if valid room
var getLetterIndex = function(room, di) {
    var count = 1;
    for(var i = 0; i < room; i++) {
        for(var j = 0; j < letters[i].length; j++) {
            count++;
        }
    }
    return count + di;
}

var updateLettersCurrentString = function() {
    /*
    var lettersString = '';
    for(var i = 0; i < lettersFinal.length; i++) {
        if(lettersCurrent[i]) {
            lettersString += '<div style="float:left"><b>'+lettersFinal[i]+'</b></div>';
        }
        else {
            lettersString += '<div style="float:left"><b>&nbsp;</b></div>';
        }
    }

    lettersTopDiv.innerHTML = lettersString;
    */

    if(!playingExpert) {
        var lettersString = '';
        for(var i = 0; i < lettersFinal.length; i++) {
            if(lettersCurrent[i]) {
                lettersString += lettersFinal[i];
            }
            else {
                lettersString += '&nbsp;';
            }
        }

        lettersTopDiv.innerHTML = '<b>'+lettersString+'</b>';
    }
    else {
        lettersTopDiv.innerHTML = '<b>'+(lettersCurrentExpert+lettersExpertThisRoom)+' of '+(lettersOrder.length-1)+'</b>';
    }
}

var youWin = function() {
    // maybe do something with this later
}

var getCookie = function(name) {
    name += '=';
    array = document.cookie.split(';');
    for(var i = 0; i < array.length; i++) {
        var current = array[i];
        while(current.charAt(0) == ' ') {
            current = current.substring(1);
        }
        if(current.indexOf(name) == 0) {
            return current.substring(name.length, current.length);
        }
    }
    return '';
}

// sets cookies to expire 10 years from now
var setCookie = function(name, value) {
    var expDate = new Date();
    expDate.setYear(expDate.getFullYear() + 10);
    document.cookie = name+'='+value+'; expires='+expDate.toUTCString();
}

var eraseCookie = function(name) {
    document.cookie = name+'=;expires=Thu, 01 Jan 1970 00:00:00 UTC';
}

var eraseAllCookies = function() {
    array = document.cookie.split(';');
    for(var i = 0; i < array.length; i++) {
        eraseCookie(array[i].substring(0, array[i].indexOf('=')));
    }
}

var setLettersCurrentCookie = function() {
    var s = '';
    for(var i = 0; i < lettersCurrent.length; i++) {
        s += lettersCurrent[i] ? '1,' : '0,';
    }
    setCookie('lettersCurrent',s);
}

var setLettersCurrentExpertCookie = function() {
    var s = '';
    for(var i = 0; i < lettersCurrentExpert.length; i++) {
        s += lettersCurrentExpert[i] ? '1,' : '0,';
    }
    setCookie('lettersCurrentExpert',s);
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

var showAllBlocks = function() {
    var blocks = document.getElementById('container').getElementsByTagName('div');
    for(i = 0; i < blocks.length; i++) {
        blocks[i].style.display = 'block';
    }
}

function Letter(x, y, shaded) {
    var letter = this.letter = document.createElement('div');
    this.x = x * 20;
    this.y = y * 20;
    this.w = this.h = 40;
    letter.style.position = 'absolute';
    letter.style.left = this.x + 'px';
    letter.style.top = this.y + 'px';
    letter.style.width = letter.style.height = this.w + 'px';
    letter.style.transition = 'width 1s ease-out, height 1s ease-out, opacity 1s ease-out, left 1s ease-out, top 1s ease-out';
    var letterImg = this.letterImg = document.createElement('img');
    letterImg.setAttribute('src','img/letter.png');
    if(shaded) {
        letter.style.display = 'none';
    }
    letterImg.style.height = letter.style.height;
    letterImg.style.display = 'block';
    letterImg.style.margin = 'auto';
    letter.innerHTML = letterImg.outerHTML;
    container.appendChild(letter);

    var letter2 = this.letter2 = document.createElement('div');
    this.x = x * 20;
    this.y = y * 20;
    this.w = this.h = 40;
    letter2.style.position = 'absolute';
    letter2.style.left = this.x + 'px';
    letter2.style.top = this.y + 'px';
    letter2.style.width = letter2.style.height = this.w + 'px';
    var letter2Img = this.letter2Img = document.createElement('img');
    letter2Img.setAttribute('src','img/letter6.png');
    if(!shaded) {
        letter2Img.style.display = 'none';
    }
    letter2Img.style.height = letter.style.height;
    letter2Img.style.display = 'block';
    letter2Img.style.margin = 'auto';
    letter2.innerHTML = letter2Img.outerHTML;
    container.appendChild(letter2);

/*
    var animation = this.animation = document.createElement('div');
    animation.style.display = 'none';
    animation.style.zIndex = '1';
    animation.style.position = 'absolute';
    animation.style.left = this.x + 'px';
    animation.style.top = this.y + 'px';
    animation.style.width = animation.style.height = this.w + 'px';
    animation.style.transition = 'width 1s ease-out, height 1s ease-out, opacity 1s ease-out';
    var animationImg = document.createElement('img');
    animationImg.setAttribute('src','img/letter.png');
    animationImg.style.height = animation.style.height;
    animationImg.style.display = 'block';
    animationImg.style.margin = 'auto';
    animation.innerHTML = animationImg.outerHTML;
    container.appendChild(animation);
*/
}

Letter.prototype.collision = function(x, y, w) {
    return x < this.x + this.w && x + w > this.x && y < this.y + this.h && y + 20 > this.y;
}

Letter.prototype.animatePresent = function() {
    this.letter2.style.display = 'block';
    this.letter.style.left = (this.x - this.w / 2) + 'px';
    this.letter.style.top = (this.y - this.h / 2) + 'px';
    this.letter.style.width = this.letter.style.height = (2 * this.w) + 'px';
    this.letter.style.opacity = '0';
//    setTimeout(function() {animation.remove();}, 1000);
}

function Icicle(x, y) {
    var icicle = this.icicle = document.createElement('div');
    this.x = x * 20;
    this.y = y * 20;
    this.initY = y * 20;
    this.falling = false;
    icicle.style.position = 'absolute';
    icicle.style.left = this.x + 'px';
    icicle.style.top = this.y + 'px';
    icicle.style.width = icicle.style.height = '20px';
    icicle.style.zIndex = '1';
    icicle.style.WebkitTouchCallout =  'none'; /* iOS Safari */
    icicle.style.WebkitUserSelect = 'none';   /* Chrome/Safari/Opera */
    icicle.style.KhtmlUserSelect = 'none';    /* Konqueror */
    icicle.style.MozUserSelect = 'none';      /* Firefox */
    icicle.style.MsUserSelect = 'none';       /* IE/Edge */
    icicle.style.userSelect = 'none';
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
    this.initY = y * 20;
    icicle.style.position = 'absolute';
    icicle.style.left = x * 20 + 'px';
    icicle.style.top = y * 20 + 'px';
    icicle.style.width = icicle.style.height = '20px';
    icicle.style.WebkitTouchCallout =  'none'; /* iOS Safari */
    icicle.style.WebkitUserSelect = 'none';   /* Chrome/Safari/Opera */
    icicle.style.KhtmlUserSelect = 'none';    /* Konqueror */
    icicle.style.MozUserSelect = 'none';      /* Firefox */
    icicle.style.MsUserSelect = 'none';       /* IE/Edge */
    icicle.style.userSelect = 'none';
    var icicleImg = document.createElement('img');
    icicleImg.setAttribute('src','img/icicleUp.png');
    icicleImg.style.height = penguin.style.height;
    icicleImg.style.display = 'block';
    icicleImg.style.margin = 'auto';
    icicle.innerHTML = icicleImg.outerHTML;
}

IcicleUp.prototype.refresh = function() {
    // do nothing
}

IcicleUp.prototype.refreshNew = function(x, y) {
    this.x = x * 20;
    this.y = y * 20;
    this.icicle.style.left = x * 20 + 'px';
    this.icicle.style.top = y * 20 + 'px';
}

Icicle.prototype.fall = function() {
    this.falling = true;
}

Icicle.prototype.update = function(delta) {
    if(this.falling) {
        if(collision(getMapData(Math.floor(this.y/20)+1, Math.floor(this.x/20)))) {
            //icicles[Math.floor(this.x/20)].icicle.remove();
            icicles[Math.floor(this.x/20)].icicle.style.display = 'none';
            this.falling = false;
            this.y = this.initY;
            icicles[Math.floor(this.x/20)] = null;
        }
        else {
            this.y += 500 * delta / 1000;
        }
    }
}

Icicle.prototype.w = IcicleUp.prototype.w = 9;
Icicle.prototype.shift = IcicleUp.prototype.shift = (20 - IcicleUp.prototype.w) / 2;

Icicle.prototype.collision = IcicleUp.prototype.collision = function(x, y, w) {
    return x < this.x + this.shift + this.w && x + w > this.x + this.shift && y < this.y + 20 && y + 20 > this.y;
}

// should fall even if not collides in x direction, fall if penguin is anywhere in block that contains icicle
Icicle.prototype.shouldFall = function(x, y, w) {
    return x < this.x + 20 && x + w > this.x && y > this.y;
}

Icicle.prototype.refresh = function() {
    this.falling = false;
    this.y = this.initY;
    this.icicle.style.top = this.y + 'px';
    this.icicle.style.display = 'block';
}

Icicle.prototype.refreshNew = function(x, y) {
    this.falling = false;
    this.x = x * 20;
    this.y = y * 20;
    this.icicle.style.left = x * 20 + 'px';
    this.icicle.style.top = y * 20 + 'px';
    this.icicle.style.display = 'block';
}

function Block(x, y, w, visible) {
    var block = this.block = document.createElement('div');
    this.visible = visible;
    this.initVisible = visible;
    block.style.position = 'absolute';
    block.style.left = x * w + 'px';
    block.style.top = y * w + 'px';
    block.style.width = block.style.height = w + 'px';
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

Block.prototype.refresh = function() {
    if(this.initVisible && !this.visible) {
        this.show();
    }
    else if(!this.initVisible && this.visible) {
        this.hide();
    }
}

Block.prototype.refreshNew = function(x, y) {
    this.x = x;
    this.y = y;
    this.block.style.left = x * this.w + 'px';
    this.block.style.top = y * this.w + 'px';
    this.refresh();
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
    button.style.zIndex = '1';
    button.style.WebkitTouchCallout =  'none'; /* iOS Safari */
    button.style.WebkitUserSelect = 'none';   /* Chrome/Safari/Opera */
    button.style.KhtmlUserSelect = 'none';    /* Konqueror */
    button.style.MozUserSelect = 'none';      /* Firefox */
    button.style.MsUserSelect = 'none';       /* IE/Edge */
    button.style.userSelect = 'none';
    button.style.cursor = 'default';

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
    button.style.zIndex = '1';
    button.style.WebkitTransition = 'background-color 0.25s ease';
    button.style.MozTransition = 'background-color 0.25s ease';
    button.style.OTransition = 'background-color 0.25s ease';
    button.style.transition = 'background-color 0.25s ease';
    button.style.MozUserSelect = 'none';
    button.style.WebkitTouchCallout =  'none'; /* iOS Safari */
    button.style.WebkitUserSelect = 'none';   /* Chrome/Safari/Opera */
    button.style.KhtmlUserSelect = 'none';    /* Konqueror */
    button.style.MozUserSelect = 'none';      /* Firefox */
    button.style.MsUserSelect = 'none';       /* IE/Edge */
    button.style.userSelect = 'none';
    button.setAttribute('onmouseenter', 'buttonIndex=buttonNames.indexOf(\''+name+'\');buttons[\''+name+'\'].mouseOver = true;buttons[\''+name+'\'].highlight()');
    button.setAttribute('onmouseout', 'buttonIndex=buttonNames.indexOf(\''+name+'\');buttons[\''+name+'\'].mouseOver = false;buttons[\''+name+'\'].unhighlight()');
    button.setAttribute('onmousedown', 'mouseDown = true;menuControlledByMouse = true;buttonIndex=buttonNames.indexOf(\''+name+'\');buttons[\''+name+'\'].mouseOver = true;buttons[\''+name+'\'].select()');
    
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
            playingExpert = false;
            updateLettersCurrentString();
            setIntroScreen(0);
            break;
        case 'expert':
            playingExpert = true;
            preInitGame();
            break;
        case 'options':
            options = true;
            switchMenuAlternate('Press R to clear all save data.<br />WARNING: This clears all save data!', 'Options');
            break;
        case 'help':
            switchMenuAlternate('Use the left and right arrow keys to move left and right.<br />Press the up key or the spacebar to jump.<br /><br />Tip: To jump really high, use your second jump when<br />you reach the maximum height from your first jump.<br /><br />Note: If you fall off a block, you lose your first jump.<br /><br />', 'Help');
            break;
        case 'about':
            switchMenuAlternate('Coded by Josh Humpherys in February of 2016.<br />Why? Play story mode to find out!<br /><br />Special thanks to Nathan Bierema for help with<br />graphics and to everyone who did beta testing.', 'About');
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
    leftAndRightReleased = !left && !right;
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
        alertBox.style.WebkitTouchCallout =  'none'; /* iOS Safari */
        alertBox.style.WebkitUserSelect = 'none';   /* Chrome/Safari/Opera */
        alertBox.style.KhtmlUserSelect = 'none';    /* Konqueror */
        alertBox.style.MozUserSelect = 'none';      /* Firefox */
        alertBox.style.MsUserSelect = 'none';       /* IE/Edge */
        alertBox.style.userSelect = 'none';
        alertBox.style.cursor = 'default';
        innerBox = document.createElement('div');
        innerBox.style.position = 'absolute';
        innerBox.style.backgroundColor = Button.prototype.defaultColor;
        innerBox.style.display = 'block';
        innerBox.style.borderRadius = '10px';

//showAlert('hello world', 200, 100, 200, 100);
    }
    if(shade != null) {
        shade.remove();
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
        if(tutorial) {
            land();
        }
        unpause();
        tutorial = false;
    }
}

var switchMenuAlternate = function(s, h) {
    alternateMenu = true;
    removeAllButtons();
    alternateMenuHeadingDiv.innerHTML = h;
    alternateMenuDiv.innerHTML = s + '<br /><br />(press any key to continue)';
}

var switchMenuMain = function() {
    options = false;
    alternateMenu = false;
    showAllButtons();
    alternateMenuDiv.innerHTML = '';
    alternateMenuHeadingDiv.innerHTML = '';
}

window.onmousedown = function(e) {
    if(!mouseDown) {
        if(!changingRooms) {
            if(introScreen) {
                nextIntroScreen();
            }
            else if(alternateMenu) {
                switchMenuMain();
            }
            else if(game) {
                hideAlert();
                unpause();
            }
        }
    }
    mouseDown = true;
}

window.onmouseup = function(e) {
    mouseDown = false;
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
    if(changingRooms) {
        return;
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
        nextIntroScreen();
    }
    else if(menu && alternateMenu) {
        if(key == 82 && options) {
            eraseAllCookies();
            initMenu();
        }
        else {
            switchMenuMain();
        }
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
        if(key == 18) { // alt
            if(paused) {
                left = right = false;
                container.focus();
                paused = false;
                last = Date.now();
            }
            else {
                pause();
            }
            return;
        }
        else if(key == 80) { // p
            if(!paused) {
                pause();
                showAlert('Game paused<br /><br />Press P to unpause', 200, 200, 400, 100);
            }
            else {
                hideAlert();
                unpause();
            }
        }
//        else if(paused && (tutorial == (key == 13))) {
        else if(paused && leftAndRightReleased && key == 67) { // c
            hideAlert();
            unpause();
        }
        else if(key == 37) {
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
        else if(key == 90) { // z
            if(!playingExpert) {
                goToRoom((playingExpert ? roomExpert : room)-1);
            }
        }
        else if(key == 88) { // x
            if(!playingExpert) {
                goToRoom((playingExpert ? roomExpert : room)+1);
            }
        }
        else if(key == 77) { // m
            initMenu();
        }
        else if(key == 82) { // r
            restart();
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
        
        if(!left && !right) {
            leftAndRightReleased = true;
        }
    }
}

window.onfocus = function(e) {
    if(!alertShowing) {
        unpause();
    }
}

window.onblur = function(e) {
    pause();
//    right = left = false;
}

initMenu();
loop();

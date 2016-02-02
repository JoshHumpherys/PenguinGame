var container, paused, menu, last, buttons, buttonNames, buttonIndex, menuControlledbyMouse, expertLocked, expertButton;

var initMenu = function() {
    container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = (document.body.clientWidth-820)/2 + 'px';
    container.style.top = 50 + 'px';
    container.style.width = '820px';
    container.style.height = '640px';
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
    button.setAttribute('onmousedown', 'buttonIndex=buttonNames.indexOf(\''+name+'\');buttons[\''+name+'\'].mouseOver = true;buttons[\''+name+'\'].select()');
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
}

Button.prototype.highlight = function() {
    this.button.style.backgroundColor = this.highlightColor;
}

Button.prototype.unhighlight = function() {
    this.button.style.backgroundColor = this.defaultColor;
}

Button.prototype.select = function() {
    if(this.isShowing) {
        console.log("select name = " + this.name);
    }
}
Button.prototype.containsMouse = function() {
    return this.mouseOver;
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
        menuControlledByMouse = false;
        for(var i = 0; i < buttonNames.length; i++) {
            buttons[buttonNames[i]].unhighlight();
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
    
    if(menu) {
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

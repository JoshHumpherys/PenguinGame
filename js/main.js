var container, paused, menu, last, buttons;

var initMenu = function() {
    container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = (document.body.clientWidth-820)/2 + 'px';
    container.style.top = 50 + 'px';
    container.style.width = '820px';
    container.style.height = '640px';
    container.style.backgroundColor = '#000';
    document.body.appendChild(container);
    paused = false;
    menu = true;
    last = Date.now();
    buttons = {};
    var buttonNames = ['play', 'options', 'help', 'about'];
    for(var i = 0; i < buttonNames.length; i++) {
        buttons[buttonNames[i]] = new Button(buttonNames[i], 50, 50 + 100 * i);
    }
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

function Button(name, x, y) {
    var button = this.button = document.createElement('div');
    button.style.position = 'absolute';
    button.style.left = x + 'px';
    button.style.top = y + 'px';
    button.style.width = '200px';
    button.style.height = '50px';
    button.style.backgroundColor = '#f0f';
    button.setAttribute('onmouseenter', 'buttons[\''+name+'\'].mouseEnter()');
    button.setAttribute('onmouseout', 'buttons[\''+name+'\'].mouseOut()');
    button.setAttribute('onmousedown', 'buttons[\''+name+'\'].mouseDown()');
    container.appendChild(button);
}

Button.prototype.mouseEnter = function() {
    this.button.style.backgroundColor = '#ff0';
}

Button.prototype.mouseOut = function() {
    this.button.style.backgroundColor = '#f0f';
}

Button.prototype.mouseDown = function() {
    alert("click");
}

initMenu();
loop();

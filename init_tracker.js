var initiative, current_round, current_turn;
initiative = [];
current_round = 1;
current_turn = 0;

if(typeof(String.prototype.trim) === "undefined"){
    String.prototype.trim = function(){
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}

function addHTMLButton(label, function_and_input){
    var button_HTML;
    button_HTML = '<input type="button" value="' + label + '" onClick="' + function_and_input + '">';
    return button_HTML;
}

function nextRound(){
    current_round++;
    document.getElementById("round_num").innerHTML = "<b/>Round " + current_round + "</b>";
}

function nextTurn(){
    updateConDuration(initiative[current_turn]);
    if (current_turn >= initiative.length - 1){
        current_turn = 0;
        nextRound();
    } else {
        current_turn++;
    }
    updateInitDisplay(initiative);
}

function Character(name, init){
    var name, init, conditions;
    this.name = name;
    this.init = init;
    this.conditions = [];
    this.addCondition = function(condition_text, duration){
        this.conditions.push([condition_text, duration]);
    };
    this.removeCondition = function(index){
        if (index > -1) {
            this.conditions.splice(index, 1);
        }
    };
}

function updateConDuration(char){
        if (char.conditions.length !== 0){
            for (var i = 0; i < char.conditions.length; i++){
                char.conditions[i][1]--;
                if (char.conditions[i][1] === 0){
                    char.removeCondition(i);
                }
            }
        }
    }

function displayConditions(char_index){
    var display_con, char;
    char = initiative[char_index];
    display_con = "";
    if (char.conditions.length !== 0){
        for (var i = 0; i < char.conditions.length; i++){
            display_con =  display_con + "<i>" + char.conditions[i][0] + "</i>" + ", <b>" + char.conditions[i][1] + " round(s)</b> " + addHTMLButton("x", "removeConAndDisplay(" + char_index + ", " + i + ")") + "<br>";
        }
    }
    return display_con;
}

function removeConAndDisplay(char_index, con_index){
    initiative[char_index].removeCondition(con_index);
    updateInitDisplay(initiative);
}

function showConditionField(index){
    document.getElementById("condition_field").innerHTML = 'Add condition to ' + initiative[index].name + ':' + '<br><b>Condition:</b> <input id="condition" type="text"><br><b>Duration:</b>  <input id="duration" type="number"> <input type="button" value="Add" onClick="applyCondition(' + index + ')"> <input type="button" value="x" onClick="clearConditionField()">';
}

function clearConditionField(){
    document.getElementById("condition_field").innerHTML = "";
}

function applyCondition(index){
    var condition, duration;
    condition = document.getElementById('condition').value;
    duration = document.getElementById('duration').value;
    initiative[index].addCondition(condition, duration);
    clearConditionField();
    updateInitDisplay(initiative);
}

function sortInit(init_list){
    return init_list.sort(function(a, b){return b.init - a.init;});
}

function createDisplayInit(init_list){
    var display_init;
    display_init = "";
    init_list = sortInit(init_list);
    for (var i = 0; i < init_list.length; i++){
        if (i === current_turn){
            display_init = display_init + "<b>" + init_list[i].name + " " + init_list[i].init + "**</b>" + addHTMLButton("x", "removeCharacterAndDisplay(" + i + ")") + " " + addHTMLButton("Add Condition", "showConditionField(" + i + ")") + "<br>";
            display_init = display_init + displayConditions(i);
        } else{
            display_init = display_init + init_list[i].name + " " + init_list[i].init + addHTMLButton("x", "removeCharacterAndDisplay(" + i + ")") + " " + addHTMLButton("Add Condition", "showConditionField(" + i + ")") + "<br>";
            display_init = display_init + displayConditions(i);
        }
    }
    return display_init;
}

function addCharacterAndDisplay(){
    var char_name, char_init;
    char_name = document.getElementById('character_name').value;
    char_init = document.getElementById('character_init').value;
    clearInputField();
    if (validateName(char_name) === true && validateInit(char_init) === true){
        initiative.push(new Character(char_name, char_init));
        displayAddedCharacter(initiative[initiative.length - 1]);
        updateInitDisplay(initiative);
    }
}

function removeCharacterAndDisplay(index){
    displayRemovedCharacter(index);
    if (index > -1){
        initiative.splice(index, 1);
    }
    updateInitDisplay(initiative);
}

function clearInputField(){
    document.getElementById('character_name').value = "";
    document.getElementById('character_init').value = "";
}

function displayAddedCharacter(char){
    document.getElementById("added_character").innerHTML = char.name + " at initiative " + char.init + " added!";
};

function displayRemovedCharacter(index){
    document.getElementById("added_character").innerHTML = initiative[index].name + " at initiative " + initiative[index].init + " removed!";
};

function updateInitDisplay(init_list){
    var display_init;
    display_init = createDisplayInit(init_list);
    document.getElementById("init_content").innerHTML = display_init;
};

function reSet(){
    initiative = [];
    current_round = 1;
    current_turn = 0;
    updateInitDisplay(initiative);
    document.getElementById("added_character").innerHTML = "<br>";
    document.getElementById("round_num").innerHTML = "<b/>Round " + current_round + "</b>";
    document.getElementById("condition_field").innerHTML = "";
};

function validateName(test){
    var error_message;
    if (test.trim() === "" || test.trim() === undefined){
        error_message = "Please enter a Name and Initiative.";
        displayError(error_message);
        return false;
    } else {
        return true;
    };
}

function validateInit(test){
    var error_message;
    if (test.trim() === undefined){
        error_message = "Please enter an Initiative.";
        displayError(error_message);
        return false;
    } else if (test > 0){
        return true;
    } else {
        error_message = "Invalid Initiative.";
        displayError(error_message);
        return false;
    };
};

function displayError(error){
    document.getElementById("added_character").innerHTML = error;
};
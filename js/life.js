var run_game = false; //Boolean that tracks whether the game is running or not

var currently_alive = {}; //A "set" containing the IDs for all currently live nodes
var currently_alive_timestep = {}; //A snapshot of the current board updated at each timestep
var total_height = 0; //The total number of rows for this game
var total_width = 0; //The total number of columns for this game
var round = 0; //Tracks the current round of the game
var game_interval = {}; //Empty object that is populated by a setInterval(..) object to control game pace

var mouse_down = false;

var game_array = {};

var snd1 = new Audio("sounds2/c_sharp1.wav");
var snd2 = new Audio("sounds2/d_sharp1.wav");
var snd3 = new Audio("sounds2/f_sharp1.wav");
var snd4 = new Audio("sounds2/g_sharp1.wav");
var snd5 = new Audio("sounds2/a_sharp1.wav");
var snd6 = new Audio("sounds2/c_sharp2.wav");
var snd7 = new Audio("sounds2/d_sharp2.wav");
var snd8 = new Audio("sounds2/f_sharp2.wav");
var snd9 = new Audio("sounds2/g_sharp2.wav");
var snd10 = new Audio("sounds2/a_sharp2.wav");
var snd11 = new Audio("sounds2/c_sharp3.wav");
var snd12 = new Audio("sounds2/d_sharp3.wav");

var sound_array = [snd12, snd11, snd10, snd9, snd8, snd7, snd6, snd5, snd4, snd3, snd2, snd1];

var live_color = "#474747";
var dead_color = "#e0e0e0";
var music_color = "#9ed8e8";

/**
 * Takes in a DOM object (i.e. a node in the game) and brings it to life
 *
 * @param node      DOM object      The node to make live
 */
function makeLive(node){
    var xy_array = node.id.split('-');
    var x = parseInt(xy_array[0])-1;
    var y = parseInt(xy_array[1])-1;
    game_array[x][y] = true;
    $(node).animate({
        backgroundColor: live_color
    });
    node.className = "alive";
    currently_alive[node.id] = true;
}

/**
 * Takes in a DOM object (i.e. a node in the game) and kills it
 *
 * @param node      DOM object      The node to kill
 */
function makeDead(node){
    var xy_array = node.id.split('-');
    var x = parseInt(xy_array[0])-1;
    var y = parseInt(xy_array[1])-1;
    game_array[x][y] = false;
    $(node).animate({
        backgroundColor: dead_color
    });
    node.className = "dead";
    delete currently_alive[node.id];

}

function animatePlay(node){
    console.log("OMG HERE");
    console.log(node.id);
    $(node).animate({
        backgroundColor: music_color
    }, 100);
    $(node).animate({
        backgroundColor: live_color
    });
}


/**
 * Returns an array containing which nodes are alive in the given column
 * @param column
 */
function findNotesToPlay(column){
    var notes_to_play = [];
    for(var i=0; i<total_height; i++){
        if(game_array[column][i]){
            notes_to_play.push(i);
        }
    }
    return notes_to_play;
}

/**
 * A timestep of the game, which
 * 1) populates the currently_alive_timestep with all live nodes in this timestep
 * 2) Finds every node that should be checked this timestep
 * 3) Iterates through those nodes, counting the number of surround live nodes for each
 * 4) Follows the rules of the game, killing or bringing to life the current node based on the above value
 */
function timestep(){
    console.log("Round..." + round);
    if(run_game){
        var notes_to_play = findNotesToPlay(round%16);
        for(var note_index = 0; note_index<notes_to_play.length; note_index++){
            sound_array[notes_to_play[note_index]].play();
            var music_node_id = ((round%16)+1) + "-" + (notes_to_play[note_index]+1);
            console.log(music_node_id);
            var music_node = document.getElementById(music_node_id);
            animatePlay(music_node);

        }

        if(((round+1)%16)===0){
            currently_alive_timestep = {};
            for(var node_id in currently_alive){
                currently_alive_timestep[node_id] = true;
            }

            var nodes_to_check = compileNodesToCheck();

            for (var node_id in nodes_to_check){

                var surrounding_live_count = countSurroundingLiveNodes(node_id);
                var node = document.getElementById(node_id);
                var is_alive = node.className == "alive";

                if (is_alive && surrounding_live_count<2){
                    makeDead(node);
                }
                else if (is_alive && (surrounding_live_count==2 || surrounding_live_count==3)){
                    makeLive(node);
                }
                else if (is_alive &&surrounding_live_count > 3){
                    makeDead(node);
                }
                else if(!is_alive && surrounding_live_count == 3) {
                    makeLive(node);
                }
                else {}

                delete nodes_to_check[node_id];
            }
        }
        round++;

    }
    else{
       window.clearInterval(game_interval);
    }
}
/**
 * Takes in the ID of a node and returns the number of surrounding live nodes
 *
 * @param   node_id         string      The ID of the node being checked
 * @returns live_counter    int         The total number of live nodes surrounding the given node
 */
function countSurroundingLiveNodes(node_id){

    var xy_array = node_id.split('-');
    var x = parseInt(xy_array[0]);
    var y = parseInt(xy_array[1]);
    var live_counter = 0;

    for(col=(x-1); col<=(x+1); col++){
        for(row=(y-1); row<=(y+1); row++){
            if(col>0 && col<=total_width && row>0 && row<=total_height){

                var check_node_id = col + "-" + row;
                var is_alive = (check_node_id in currently_alive_timestep);

                if(check_node_id != node_id && is_alive){
                    live_counter = live_counter+1;
                }
            }
        }
    }
    return live_counter;
}

/**
 * Iterates through all currently live nodes and populates the to_check object with the surrounding
 * nodes of each live node (i.e. the only nodes that could potentially change state this timestep)
 */
function compileNodesToCheck(){
    var nodes_to_check = {};
    for(var node in currently_alive_timestep){
        var node_id = node;

        var xy_array = node_id.split('-');
        var x = parseInt(xy_array[0]);
        var y = parseInt(xy_array[1]);

        for(col=(x-1); col<=(x+1); col++){
            for(row=(y-1); row<=(y+1); row++){
                if(col>0 && col<=total_width && row>0 && row<=total_height){

                    var check_node_id = col + "-" + row;
                    nodes_to_check[check_node_id] = true;
                }
            }
        }
    }
    return nodes_to_check;
}



$("body").mousedown(function(event){
    node = event.target;
    console.log(node.id);
    if (node.className == "dead"){
        makeLive(node);
    }
    else if (node.className == "alive"){
        makeDead(node);
    }
    mouse_down = true;
});

$("body").mouseup(function(event){
    mouse_down = false;
});

$("body").mouseover(function(event){
   if(mouse_down){
       node = event.target;
       if (node.className == "dead"){
           makeLive(node);
       }
   else if (node.className == "alive"){
           makeDead(node);
       }
   }
});



/**
 * Creates a 2D array of the board, allowing for easy access during music checking
 */
function create2DArray(width, height, default_val){
    var b = [];
    for(var j=0; j<width; j++){
        var a2 = createColumn(height, default_val);
        b.push(a2);
    }
    return b;
}

function createColumn(size, default_val){
    var a = [];
    for(var i=0; i<size; i++){
        a.push(default_val);
    }
    return a;
}

/**
 * Creates a new board, based on the input of # of rows and # of columns
 */
$(document).ready(function(){
    var width = 16;
    total_width = width;
    var height = 12;
    total_height = height;
    var board = document.getElementById("board");
    $("#board").html("");
    currently_alive = {};
    for(var row_num = 1; row_num <= height; row_num++){
        var row = document.createElement("div");
        row.className = "row";
        for(var col_num = 1; col_num <= width; col_num++){
            var cell = document.createElement("div");
            cell.className = "dead";
            var cell_id = col_num + "-" + row_num;
            cell.id = cell_id;

            row.appendChild(cell);
        }
        board.appendChild(row);
    }

    game_array = create2DArray(width, height, false);
});


/**
 * Changes whether the game is currently running or not
 */
function startGame(){
    button = document.getElementById("gameToggle");
    if (run_game){
        console.log("Game stopped");
        button.value = "Start Game"
        run_game = false;
        round = 0;
    }
    else{
        console.log("Game started");
        button.value = "Stop Game"
        run_game = true;
        game_interval = setInterval(function(){timestep()},200);
    }
}
/*
Don't worry about this. It's basically a frame that says "don't try to do any of this inner stuff until the HTML
is finished loading
 */
$(document).ready(function(){


/*
Here are some sample trigger functions. There are a lot of different triggers, not just click. Pretty easy to google
for. I also use the jQuery syntax, but if you find something on w3schools or anywhere else that uses Javascript
syntax, that's pretty much the same thing.

$('#button1') refers to the HTML object with the id='button1'.

console.log('words here') will print to the javascript log. If you're using Chrome, you can check this by right
clicking on any page and selecting Inspect Element, then going to Console. From here, you can see all of the console
logs, and you can also enter in javascript code like a command prompt.

i.e.
2+2
> 4
"test" == "test"
> true
alert("hello world!");
> creates a popup window that says "hello world!"
 */
    var snd1 = new Audio("sounds/c_sharp1.wav");
    var snd2 = new Audio("sounds/d_sharp1.wav");
    var snd3 = new Audio("sounds/f_sharp1.wav");
    var snd4 = new Audio("sounds/g_sharp1.wav");
    var snd5 = new Audio("sounds/a_sharp1.wav");
    var snd6 = new Audio("sounds/c_sharp2.wav");
    var snd7 = new Audio("sounds/d_sharp2.wav");
    var snd8 = new Audio("sounds/f_sharp2.wav");
    var snd9 = new Audio("sounds/g_sharp1.wav");
    var snd10 = new Audio("sounds/a_sharp1.wav");
    var snd11 = new Audio("sounds/c_sharp1.wav");
    var snd12 = new Audio("sounds/d_sharp1.wav");

    var sound_array = [snd12, snd11, snd10, snd9, snd8, snd7, snd6, snd5, snd4, snd3, snd2, snd1];
    $("#button1").click(function(){
        var rand = sound_array[Math.floor(Math.random() * sound_array.length)];
    rand.play();

});

$("#button2").click(function(){
    var test_string = "this is a test string!";
    console.log("clicked button 2! " + test_string);
    snd2.play();
});

$("#button3").click(function(){
    var test_num = 5;
    test_num++;
    console.log("clicked button 3! " + testFunction(test_num, 4));
});

});

/*
Standard format for a function. begin with the function keyword, include whatever variables you need
(don't need to declare type in advance). return a value as you would in Java.
 */
function testFunction(var1, var2){
    return var1+var2;

}
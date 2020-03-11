const button1 = document.querySelectorAll('.button1'); 
const button2 = document.querySelectorAll('.button2');
const button3 = document.querySelectorAll('.button3'); 
const button4 = document.querySelectorAll('.button4');
const buttonE = document.querySelectorAll('.buttonE');


const allbuttons = document.querySelectorAll('.dashing');
const GCDButtons = document.querySelectorAll('.dancer_button');

var Message = document.getElementById('message');
var progressBar = document.querySelector('.healthbar');
//Player stats
var player = {name: 'Player', Mainstat: 20, CriticalHitChance: 30, DirectHitChance: 20, SkillSpeed: 0, Feathers: 0}
//Target
var target = {name: 'Tataru', Health: 100};
//Cascade
var skills = 
[{id: 1, name:'Cascade', keybind: '1', potency: 250, comboPotency: 0, onGCD: true, recast: 2500, instant: false, comboSkill: 'Fountain', comboActive: false, canProc:true, procOnly: false, procced: false, procName: 'Reverse Cascade', procChance: 50},
 {id: 2, name:'Fountain', keybind: '2', potency: 100, comboPotency: 200, onGCD: true, recast: 2500, instant: false, comboSkill: null, comboActive: false, canProc:true, procOnly: false, procced: false, procName: 'Fountainfall', procChance: 50},
 {id: 3, name:'Reverse Cascade', keybind: '3', potency: 350, comboPotency: 0,onGCD: true, recast: 2500, instant: false, comboSkill: null, comboActive: false, canProc: true, procOnly: true, procced: false, procName: 'Fan Dance', procChance: 50},
 {id: 4, name:'Foutainfall', keybind: '4', potency: 400, comboPotency: 0,onGCD: true, recast: 2500, instant: false, comboSkill: null, comboActive: false, canProc: true, procOnly: true, procced: false, procName: 'Fan Dance', procChance: 50},
 {id: 5, name:'Fan Dance', keybind: 'e', potency: 150, comboPotency: 0,onGCD: false, recast: 2500, instant: true, comboSkill: null, comboActive: false, canProc: true, procOnly: true,  procced: false, procName: 'Fan Dance', procChance: 50}];
var skill = null;
var proccedSkill = null;
var comboSkill = null;
var comboSkillName = null;
var reverseCascadeProc = false;
//Reverse Cascade


var criticalHit = false;
var directHit = false;
var proc = false;
var damage = 0;
var damagePercentage = 0;
var recast = 2500;
var GCD = false;
var didItProc = true;


//Listen for keypresses and use skills
window.addEventListener('keydown', logKey, false);

function logKey(e) {

    keyPressed = e.key;
    skill = skills.find(x => {return x.keybind===keyPressed});
    Message.classList.remove('hit');

    if (window.event.key == keyPressed && GCD === true && skill.instant === false ){
        return false;
    } 
    else if(GCD === true && skill.onGCD === true) {
        return false;
    }
    else if(skill == undefined){
        return false;
    }
    else if(skill.procOnly === true && skill.procced === false)
    {
        return false;
    }
    else if (skill.procOnly === true && skill.onGCD === false && skill.instant === true && skill.procced === true){
            skill.procced = false;
            showButtonBorder(skill.keybind,'hide');
            Instant(skill.name);
    }
    else {
        GCD=true;
        setTimeout(function() {
            for (var i = 0; i < GCDButtons.length; i++) {
                GCDButtons[i].classList.remove('GCD');
            }
            GCD=false;
        }, 2500);
    }

    //Check for proc and combo

    if(proc === true){
        console.log(skill.procName+' Procced!');
        skillProc(skill.procName);
    }
    if (skill.procced === true)
    {
        skill.procced = false;
        showButtonBorder(skill.keybind,'hide');
    }
    if(skill.instant === false) {
    //Calculate damage and print the result to combat log. Trigger GCD.
    Damage(skill.name);
    combatLogMessage(skill.name,criticalHit,directHit);
    //GCD=true;
    }
}
//Instant skills
function Instant(skillname){
        Damage(skill.name);
        combatLogMessage(skill.name,criticalHit,directHit);
}

//Calculate damage, check for proc and set GCD time
function Damage(skillName)
{
    if(skill.instant === false) {
        for (var i = 0; i < GCDButtons.length; i++) {
            GCDButtons[i].classList.add('GCD');
        }
    }
    damage = (skill.potency+skill.comboPotency) * player.Mainstat + Math.floor(Math.random() * 1000);
    //check for Critcal hit
    if(critRoll(player.CriticalHitChance) === true) {
        damage = damage * 2;
        criticalHit = true;
        Message.classList.add('hit');
    }
    //check for Direct hit
    if(critRoll(player.DirectHitChance) === true) {
        damage = damage * 1.5;
        directHit = true;
        Message.classList.add('hit');
    }
    //Check for proc
    var procCheck = Math.floor(Math.random() * 100);
    if(procCheck < skill.procChance && skill.canProc === true)
    {   
        skill.procced = true;
        proc = true;
    }
    else {
        proc = false;
    }
    if(skill.comboSkill) {
        comboSkillName = skill.comboSkill;
        comboSkill = skills.find(x => {return x.name===comboSkillName});
        console.log(comboSkill.keybind);
        showButtonBorder(comboSkill.keybind, 'show');
        comboSkillName = null;
    }
    else {
        comboSkillName = null;
    }
    damage = parseInt(damage, 0);
    return damage;
}

//Check for Critical and Direct hits
var critRoll = function(a) {
    var x = Math.floor(Math.random() * 100);
    var y = a;
    if(x < a){
        return true;
    }
    else {
        return false;
    }
}

//Skill procs, Highlight procced skill with skill border
function skillProc(trigger){
    proccedSkill = skills.find(x => {return x.name===trigger});
    if(proccedSkill.procOnly == true){
        proccedSkill.procced = true;
        console.log(proccedSkill.keybind);
        showButtonBorder(proccedSkill.keybind,'show');
    }
}

//Print message to combat log
function combatLogMessage(SN,CH,DH) {
    
    Message.textContent += 'You hit '+target.name+' with '+SN+'.\r\n';
    Message.scrollTop = Message.scrollHeight;
    if(CH === true && CH === true) {
        Message.textContent += 'Critical direct hit!!! '+target.name+' takes '+damage+' damage.\r\n';
        Message.scrollTop = Message.scrollHeight;
        criticalHit = false;
        directHit = false;
    }
    else if(CH === true) {
        Message.textContent += 'Critical hit! '+target.name+' takes '+damage+' damage.\r\n';
        Message.scrollTop = Message.scrollHeight;
        criticalHit = false;
    }
    else if(DH === true) {
        Message.textContent += 'Direct hit! '+target.name+' takes '+damage+' damage.\r\n';
        Message.scrollTop = Message.scrollHeight;
        directHit = false;
    }
    else {
        Message.textContent += ''+target.name+' takes '+damage+' damage.\r\n';
        Message.scrollTop = Message.scrollHeight;
    }
    damagePercentage = damage / 2000;
    damagePercentage = damagePercentage.toFixed(1);
    damagePercentage = parseInt(damagePercentage, 10);
    target.Health = target.Health - damagePercentage
    progressBar.setAttribute('style','width:'+target.Health+'%');
    
    if (target.Health < 10)
            {
                target.Health = 100;
                Message.textContent += "Tataru casts Benediction.\r\nTataru is healed to full health!\r\n";
                progressBar.setAttribute('style','width:100%');
                Message.scrollTop = Message.scrollHeight;
            }
}

//Show / Hide proc effect
function showButtonBorder(key,toggle){
    switch(key)
    {
        
        case '1':
            if(toggle == 'show') {
                for(var i = 0; i < button1.length; i++) {
                    button1[i].classList.remove('hidden');
                    button1[i].classList.add('visible');
                }
            }
            else {
                for(var i = 0; i < button1.length; i++) {
                    button1[i].classList.add('hidden');
                    button1[i].classList.remove('visible');
                }
            }
        break;
            
        case '2':
            if(toggle == 'show') {
                for(var i = 0; i < button2.length; i++) {
                    button2[i].classList.remove('hidden');
                    button2[i].classList.add('visible');
                }
            }
            else {
                for(var i = 0; i < button1.length; i++) {
                    button2[i].classList.add('hidden');
                    button2[i].classList.remove('visible');
                }
            }
        break;

        case '3':
            if(toggle == 'show') {
                for(var i = 0; i < button3.length; i++) {
                    button3[i].classList.remove('hidden');
                    button3[i].classList.add('visible');
                }
            }
            else {
                for(var i = 0; i < button3.length; i++) {
                    button3[i].classList.add('hidden');
                    button3[i].classList.remove('visible');
                }
            }
        break;

        case '4':
            if(toggle == 'show') {
                for(var i = 0; i < button4.length; i++) {
                    button4[i].classList.remove('hidden');
                    button4[i].classList.add('visible');
                }
            }
            else {
                for(var i = 0; i < button4.length; i++) {
                    button4[i].classList.add('hidden');
                    button4[i].classList.remove('visible');
                }
            }
        break;

        case 'e':
            if(toggle == 'show') {
                for(var i = 0; i < buttonE.length; i++) {
                    buttonE[i].classList.remove('hidden');
                    buttonE[i].classList.add('visible');
                }
            }
            else {
                for(var i = 0; i < buttonE.length; i++) {
                    buttonE[i].classList.add('hidden');
                    buttonE[i].classList.remove('visible');
                }
            }
            break;
    }
    return;
}
    


/*

if(reverseCascade.proc === true){
        Damage(reverseCascade);
        combatLogMessage(reverseCascade.name,criticalHit,directHit);
        GCD = true;
        recast = recast;
        reverseCascade.proc = false;
        }
        else{
            return false;
        }

const redButton = document.querySelector('.red_button');
const greenButton = document.querySelector('.green_button');
const blueButton = document.querySelector('.blue_button');
const yellowButton = document.querySelector('.yellow_button');
const startButton = document.querySelector('.finish_button');
const GCDButtons = document.querySelectorAll('.dancer_button');
const allbuttons = document.querySelectorAll('.dashing');
const button1 = document.querySelectorAll('.button1border');
const button2 = document.querySelectorAll('.button2border');
const button3 = document.querySelectorAll('.button3border');
const button4 = document.querySelectorAll('.button4border');
const buttonE = document.querySelectorAll('.buttonEborder');
var Message = document.getElementById('message');
var progressBar = document.querySelector('.healthbar');
var GCD = false;
var buttonPresses=0;
var fails=0;
var damage=0;
var damagepenalty=0;
var EmboiteUsed = false;
var JeteUsed = false;
var EntrechatUsed = false;
var Pirouetteused = false;
var danceFinished = false;
var health = 100;
var criticalHit = 0;
var dancing = false;

function chooseActiveButton(){

    if(danceFinished === true) {
        showButtonEBorder();
        return false;
    }
    Message.scrollTop = Message.scrollHeight;
    removeActive();
    ActiveButton = Math.floor(Math.random() * 4+1);
    if (buttonPresses >= 4){
        showButtonEBorder();
        return false;
    }
    if (button_pressed == '1' && ActiveButton == 1){
        chooseActiveButton();
    }
    else if (button_pressed == '2' && ActiveButton == 2){
        chooseActiveButton();
    }
    else if (button_pressed == '3' && ActiveButton == 3){
        chooseActiveButton();
    }
    else if (button_pressed == '4' && ActiveButton == 4){
        chooseActiveButton();
    }
    else {        
        switch(ActiveButton) {
            case 1:
                    if (EmboiteUsed === true) {
                        chooseActiveButton();
                    }
                    else {
                    showButton1Border();
                    }
            break;

            case 2:
                    if (JeteUsed === true) {
                        chooseActiveButton();
                    }
                    else {
                    showButton2Border();
                    }
            break;

            case 3:
                    if (EntrechatUsed === true) {
                        chooseActiveButton();
                    }
                    else {
                    showButton3Border();
                    }
            break;

            case 4:
                    if (Pirouetteused === true) {
                        chooseActiveButton();
                    }
                    else {
                    showButton4Border();
                    }
            break;
            
        }     
    }

}

window.addEventListener('keydown', logKey, false);

function logKey(e) {

    if(GCD === true ) {
        return false;
    }
    GCD = true;
    setTimeout(function() {
        for (var i = 0; i < GCDButtons.length; i++) {
            GCDButtons[i].classList.remove('GCD');
        }
        Message.classList.remove('hit');
        GCD = false;
        buttonPresses++; 
    }, 1000);


    button_pressed = e.key;
    if(button_pressed == '1' && button1[1].classList.contains('visible')){
        Message.textContent += "You perform Emboite.\r\n";
        EmboiteUsed = true;
        for (var i = 0; i < GCDButtons.length; i++) {
            GCDButtons[i].classList.add('GCD');
          }
        chooseActiveButton();
    }
    else if(button_pressed == '2' && button2[1].classList.contains('visible')){
        Message.textContent += "You perform Jete.\r\n";
        JeteUsed = true;
        for (var i = 0; i < GCDButtons.length; i++) {
            GCDButtons[i].classList.add('GCD');
          }
        chooseActiveButton();
    }
    else if(button_pressed == '3' && button3[1].classList.contains('visible')){
        Message.textContent += "You perform Enrechat.\r\n";
        EntrechatUsed = true;
        for (var i = 0; i < GCDButtons.length; i++) {
            GCDButtons[i].classList.add('GCD');
          }
        chooseActiveButton();
    }
    else if(button_pressed == '4' && button4[1].classList.contains('visible')){
        Message.textContent += "You perform Pirouette.\r\n";
        Pirouetteused = true;
        for (var i = 0; i < GCDButtons.length; i++) {
            GCDButtons[i].classList.add('GCD');
          }
        chooseActiveButton();
    }
    else if(button_pressed == 'e' && buttonE[1].classList.contains('visible')){
        if (buttonPresses >= 4) {
            damage=Math.floor(Math.random() * 3000+50000);
            damagepenalty=fails*15000;
            damage=damage-damagepenalty;
            if(damage <= 0) {
                damage = 0;
            }
            EmboiteUsed = false;
            JeteUsed = false;
            EntrechatUsed = false;
            Pirouetteused = false;
            Message.textContent += "You use Techical Finish.\r\n";
            criticalHit = Math.floor(Math.random() * 100);
            if(criticalHit < 30) {
                Message.textContent += "Critical hit!\r\n";
                damage = damage*2;
            }
            Message.textContent += "You hit Tataru for "+damage+" damage!\r\n";
            Message.classList.add('hit');
            damage=damage/10000;
            health = health-damage;
            progressBar.setAttribute('style','width:'+health+'%');
            if (health < 10)
            {
                health = 100;
                Message.textContent += "Tataru casts Benediction.\r\nTataru is healed to full health!\r\n";
                progressBar.setAttribute('style','width:100%');
                Message.scrollTop = Message.scrollHeight;
            }
            Message.scrollTop = Message.scrollHeight;
            for (var i = 0; i < GCDButtons.length; i++) {
                GCDButtons[i].classList.add('GCD');
            }
            danceFinished = true;
            fails=0;
        }
        if (buttonPresses < 4) {
            Message.textContent += "You use Techical step.\r\n"
            Message.scrollTop = Message.scrollHeight;
            for (var i = 0; i < GCDButtons.length; i++) {
                GCDButtons[i].classList.add('GCD');
            }
        }    
        buttonPresses = 0;
        chooseActiveButton();
    }
    else {
        if (buttonPresses <= 4) {
        Message.textContent += "You failed a step! Potency lowered.\r\n";
        Message.scrollTop = Message.scrollHeight;
        fails++;
        }
        chooseActiveButton();
    }
}


function removeActive(){
    for (var i = 0; i < allbuttons.length; i++) {
      allbuttons[i].classList.add('hidden');
      allbuttons[i].classList.remove('visible');
    }
}


function showButtonEBorder(){
    for (var i = 0; i < buttonE.length; i++) {
      buttonE[i].classList.remove('hidden');
      buttonE[i].classList.add('visible');
      danceFinished = false;
    }
}
function showButton1Border(){
    for (var i = 0; i < button1.length; i++) {
      button1[i].classList.remove('hidden');
      button1[i].classList.add('visible');
    }
}
function showButton2Border(){
    for (var i = 0; i < button2.length; i++) {
      button2[i].classList.remove('hidden');
      button2[i].classList.add('visible');
    }
}
function showButton3Border(){
    for (var i = 0; i < button3.length; i++) {
      button3[i].classList.remove('hidden');
      button3[i].classList.add('visible');
    }
}
function showButton4Border(){
    for (var i = 0; i < button4.length; i++) {
      button4[i].classList.remove('hidden');
      button4[i].classList.add('visible');
    }
}
*/

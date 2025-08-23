
// Start conditions
let History = [];
let R=1, S=0, Sp=0, Sm=0, B=0, Bp=0, Bm=0, Sn=0, Score=0, Pic=0, Mus=0;
let b=0;

// Reset button
function reset_state(){
  R=1; S=0; Sp=0; Sm=0; B=0; Bp=0; Bm=0; Sn=0; Score=0; b=0; Pic=0; Mus=0;
}

function clearspecial(){ Pic=0; Mus=0; }

// Point button functions - what each increments
function button_Sp(){ S++; Sp++; Score+=10; b+=1; }
function button_Sm(){ S++; Sm++; b+=1; }
function button_Bp(){ B++; Bp++; Score+=5;
  if(b===3){ b=0; R+=1; clearspecial(); } else { b+=1; } }
function button_Bm(){ B++; Bm++;
  if(b===3){ b=0; R+=1; clearspecial(); } else { b+=1; } }
function button_Sn(){ b=0; }

function picture(){ Pic = (Pic===1 ? 0 : 1); Mus = (Pic===1 ? 0 : Mus); }
function music(){ Mus = (Mus===1 ? 0 : 1); Pic = (Mus===1 ? 0 : Pic); }

function write(a){ History.push(a); }

// Stuff after gong press
function endgame(){
  let team1 = document.getElementById("team1Input").value;
  let team2 = document.getElementById("team2Input").value;
  let episode = document.getElementById("episodeInput").value;
  if(!team1 || !team2 || !episode) return;

  write(9);
  write(parseInt(team1));
  write(parseInt(team2));
  write(Score);
  write(parseInt(episode));

  disableAllButtons();
  navigator.clipboard.writeText(History.join(","));
}

// Copy current state to clipboard
function pauseGame(){
  navigator.clipboard.writeText(History.join(","));
}

// Load a given state
function replay(inputlist){
  reset_state();
  History = [];
  for(let key of inputlist){
    if(key_map[key]){ key_map[key](); History.push(key); }
  }
  updateAll();
}

// Run replay for the current state -1
function undo(){
  if(History.length>0){
    History.pop();
    replay(History.slice());
  }
}

// State number mapping
let key_map = {
  2: button_Sp,
  3: button_Sm,
  4: button_Sn,
  5: button_Bp,
  6: button_Bm,
  7: picture,
  8: music,
  9: endgame
};

// Add actions to the history
function buttonpress(i){
  key_map[i]();
  write(i);
  if(i===2 || i===3) updateSLabels();
  if(i===5 || i===6) updateBLabels();
  if(i===2 || i===5) updateScore();
  updateButtons();
  updateSpecial();
  updateDots();
}

// Undo button
function guiUndo(){ undo(); }

// Score + button state updates
function updateScore(){
  document.getElementById("scoreLabel").textContent =  Score;
}
function updateSLabels(){
  document.getElementById("sLabel").textContent =   Sp + "/" + S;
}
function updateBLabels(){
  document.getElementById("bLabel").textContent =  Bp + "/" + B;
  document.getElementById("roundLabel").textContent =  R;
}
function updateLabels(){
  updateScore();
  updateSLabels();
  updateBLabels();
}

function updateButtons(){
  document.getElementById("Sp").disabled = !(b===0);
  document.getElementById("Sm").disabled = !(b===0);
  document.getElementById("Sn").disabled = !(b===1);
  document.getElementById("Bp").disabled = !(b===1||b===2||b===3);
  document.getElementById("Bm").disabled = !(b===1||b===2||b===3);
  document.getElementById("Picture").disabled = !(b===0);
  document.getElementById("Music").disabled = !(b===0);
}

function updateSpecial(){
  document.getElementById("Picture").style.backgroundColor = (Pic===1) ? "red" : "";
  document.getElementById("Music").style.backgroundColor = (Mus===1) ? "red" : "";
}

function updateDots(){
  let dots=[document.getElementById("dot1"),document.getElementById("dot2"),document.getElementById("dot3")];
  dots.forEach(d=>d.style.color="black");
  if(b===1) dots[0].style.color="green";
  if(b===2) dots[1].style.color="green";
  if(b===3) dots[2].style.color="green";
}

function disableAllButtons(){
  ["Sp","Sm","Sn","Bp","Bm","Gong"].forEach(id=>{
    document.getElementById(id).disabled=true;
  });
}

function loadHistory(){
  let input = document.getElementById("historyInput").value;
  if(!input) { reset_state(); updateAll(); return; }
  let entries = input.split(",");
  let filtered_history=[];
  for(let entry of entries){
    let num=parseInt(entry.trim());
    if(!isNaN(num)) filtered_history.push(num);
  }
  replay(filtered_history);
}

function updateAll(){
  updateLabels();
  updateButtons();
  updateSpecial();
  updateDots();
}

reset_state();
updateAll();
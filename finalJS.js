var canvas;
var ctx;
var bgImage;
var SpaceImage;
var fireImage;
var ChickenImage;
var ChickenImageup;
var space;
var fire;
var chicken;
var then;
var keysDown;
var intervalTimer;
var numofchickens=5;
var numofrows = 4;
var chickens = new Array(numofrows);
var initialInvadersVelocity; // initial target speed multiplier
var chickensVelocity; // target speed multiplier during game
var chickenUpdate;
var TIME_INTERVAL = 25; // screen refresh interval in milliseconds
var intervalTimer; // holds interval timer
var shots=[];
var chickenshots=[];
var failed=0;
var score=0;
var intervalId;
var countIncreaseSpeed;
var timeLeft; // the amount of time left in seconds
var timerCount; // number of times the timer fired since the last second
var chickenup=true
var chek;
var numofgame;

// variables for the cannon and cannonball
var cannonball; // cannonball image's upper-left corner
var cannonballVelocity=170; // cannonball's velocity
var cannonballOnScreen=false; // is the cannonball on the screen
var cannonballRadius; // cannonball radius
var cannonballSpeed; // cannonball speed
var championSound;
var sadGameOverSound;
var throughGame;
var Spaceshoot;
var eatingchicken;
var brokenspaceship;
var chickenshotImage;
var Key;
var timeinput;

function choosing(){
    const SelectshootKey = document.getElementById('shoot-key');
    Key = SelectshootKey.value;
    SelectshootKey.addEventListener('change', () => {
    Key = SelectshootKey.value;
  });

 const userInput = document.getElementById('choosingTime');

userInput.addEventListener('input', () => {
    timeinput = userInput.value;
});



  const continueButton = document.getElementById('contchoose');

  continueButton.addEventListener('click', (event) => {
    event.preventDefault(); 
    
    if(timeinput==null){
        alert("Fill Time!")
    }
    else if(timeinput<120){
        alert("At least 120 seconds!")
    }
    else{
        document.getElementById( "Choosing" ).style.display="none";
        document.getElementById( "Game" ).style.display="flex";
    
        setupGame()
    }
    

  });
}




function setupGame()
{
   // stop timer if document unload event occurs
   document.addEventListener( "unload", stopTimer, false );

   // get the canvas, its context and setup its click event handler
   canvas = document.getElementById( "theCanvas" );
    canvas.width = 600;
    canvas.height = 600;
   ctx = canvas.getContext("2d");
    numofgame=0;
   // start a new game when user clicks Start Game button
   document.getElementById( "startButton" ).addEventListener( 
      "click", newGame, false );

	// Background image
	bgImage = new Image();
	bgImage.src = "images/space.jpg";
	
	
	// Hero image
	SpaceImage = new Image();
	SpaceImage.src = "images/NEWSPACESHIP.png";
    
    //Chicken image
    ChickenImage = new Image();
	ChickenImage.src = "images/reddownchicken).png";
	monstersCaught = 0;
 
    //Chicken image
    ChickenImageup = new Image();
	ChickenImageup.src = "images/redChicken.png";
 


    // Fire image
	fireImage = new Image();
	fireImage.src = "hitfire.png";


    chickenshotImage = new Image();
	chickenshotImage.src = "chickenshot.jpg";

	// Game objects
	space = {speed: 256 }; // movement in pixels per second
	monster = {};
    chicken={};

    cannonball={};

    fire={};

       // get sounds
   championSound = document.getElementById( "championSound" );
   sadGameOverSound = document.getElementById( "sadGameOverSound" );
   throughGame = document.getElementById( "throughGame" );
   Spaceshoot = document.getElementById( "Spaceshoot" );
   eatingchicken = document.getElementById( "eatingchicken" );
   brokenspaceship = document.getElementById( "brokenspaceship" );
} // end function setupGame


function startTimer()
{
   document.addEventListener('keydown', keydown_ivent, false);

   intervalTimer = window.setInterval( updatePositions, TIME_INTERVAL );
     // Call accelerateInvaders() every 5 seconds
    intervalId = window.setInterval(accelerateInvaders, 5000);
    

} // end function startTimer


// terminate interval timer
function stopTimer()
{
   canvas.removeEventListener( "keydown", keydown_ivent, false);

   window.clearInterval( intervalTimer );
   window.clearInterval( intervalId );
   throughGame.pause();

} // end function stopTimer


function resetElements()
{

    space.x = canvas.width / 2-(fireImage.width/8);
	space.y = canvas.height-100;
    cannonballRadius = canvas.height / 36; // cannonball radius 1/36 canvas width
    cannonballSpeed = canvas.height * 3 / 2;

    for (var i = 0; i < chickens.length; i++) {
        chickens[i] = new Array(numofrows);
    }

    while(shots.length!=0){
        shots.pop();
    }

    while(chickenshots.length!=0){
        chickenshots.pop();
    }

    var p2=35;
    for (var i = 0; i < numofrows; i++) {
        var p =0;
        for (var j = 0; j < numofchickens; j++) {
            chickens[i][j] = {x:p, y:p2};
            p=p+60;
        }
        p2=p2+60;
    }


    initialInvadersVelocity=canvas.width/4;
    countIncreaseSpeed=0;
} // end function resetElements


function newGame()
{
   resetElements(); // reinitialize all game elements
   stopTimer(); // terminate previous interval timer
   chickenup=true
   score=0;
   failed=0;
   timeLeft = timeinput;
   timerCount = 0; // the timer has fired 0 times so far
   chickensVelocity = initialInvadersVelocity; // set initial velocity
   throughGame.play();
   startTimer(); // starts the game loop
   numofgame++;
   gotoGame();
} // end function newGame


// called every TIME_INTERVAL milliseconds
function updatePositions()
{
    if(chickenshots.length==0){
        let randomIndex = Math.floor(Math.random() * chickens.length);
        let randomIndexcol = Math.floor(Math.random() * chickens[randomIndex].length);
        let randomInvader = chickens[randomIndex][randomIndexcol];
        fireInvaderShot(randomInvader);
        
    }

    if(chickenshots.length!=0){
        if(chickenshots[chickenshots.length-1].y> (canvas.height*0.75)){
            let randomIndex = Math.floor(Math.random() * chickens.length);

            if(chickens[randomIndex].length!=0){
                let randomIndexcol = Math.floor(Math.random() * chickens[randomIndex].length);
                let randomInvader = chickens[randomIndex][randomIndexcol];
                fireInvaderShot(randomInvader);
    
            }
        }
    }

   // update the target's position
   var chickenUpdate = TIME_INTERVAL / 1000.0 * chickensVelocity;
   console.log(chickensVelocity);
   for (var i = 0; i < numofrows; i++) {
        for (var j = 0; j < numofchickens; j++) {
            if(chickens[i][j]!=null){
                chickens[i][j] = {x:chickens[i][j].x+chickenUpdate, y:chickens[i][j].y};
                
                

            }
    }
    }
    var minx=700;
    var minrow=0;
    for (var i = 0; i < numofrows; i++) {
        if(chickens[i]!=null && chickens[i].length!=0){
             if(chickens[i][0].x < minx){
                    minx = chickens[i][0].x;
                    minrow=i;
             }
        }
    }

    var maxx=0;
    var maxrow=0;
    for (var i = 0; i < numofrows; i++) {

        if(chickens[i]!=null && chickens[i].length!=0){
            if(chickens[i][chickens[i].length-1].x > maxx){
                maxx = chickens[i][chickens[i].length-1].x;
                maxrow=i;
            }
        }

        
    }

    for (let i = 0; i < numofrows; i++) {
        if( chickens[i].length != 0){
          
            if (chickens[minrow][0].x < 0 || ((chickens[maxrow][chickens[maxrow].length-1].x+60) > canvas.width)){
                chickensVelocity *= -1;
                break;
              }
        }
    }

    
//    
   

    var interval = TIME_INTERVAL / 1000.0*cannonballVelocity;
    for(let i=0; i<shots.length; i++){
        if(shots[i] != null){
            shots[i].y= shots[i].y-(interval);
            if (shots[i].y < 0){
                shots.slice(i,1);
            }
    
        }
    }


    var intervalshot = TIME_INTERVAL / 1000.0*chickensVelocity;
    if(chickensVelocity<0){
        intervalshot *=-1;
    }
    for(let i=0; i<chickenshots.length; i++){
        if(chickenshots[i] != null){
            chickenshots[i].y= chickenshots[i].y+(intervalshot);
            if (chickenshots[i].y < 0){
                chickenshots.slice(i,1);
            }
    
        }
    }


          // check for cannonball collision with target
    for (let i = 0; i < shots.length; i++) {
        let shot = shots[i];
        if(shots[i] != null){
            for (let j = 0; j < numofrows; j++) {
                for (let k = 0; k < numofchickens; k++){
                    let chicken = chickens[j][k];
                    if(chicken!=null){
                        if (
                            shot.x >= chicken.x &&
                            shot.x <= chicken.x +60 &&
                            shot.y <= (chicken.y +60) &&
                            shot.y >=chicken.y
                            ) 
                        {
                              // Remove the shot and the chicken from their arrays
                            shots.splice(i, 1);
                            chickens[j].splice(k,1);
                            eatingchicken.play();
                            if(j==3){
                                score += 5;

                            }
                            if(j==2){
                                score +=10;
                                
                            }
                            if(j==1){
                                score += 15;
                                
                            }
                            if(j==0){
                                score += 20;
                                
                            }
                        }
        
                     }
                }
                  
            }
    
        }
    }   



              // check for cannonball collision with target
              for (let i = 0; i < chickenshots.length; i++) {
                let shot = chickenshots[i];
                if(chickenshots[i] != null){
                    if (
                        shot.x >= space.x &&
                        shot.x <= space.x +50 &&
                        shot.y <= (space.y +50) &&
                        shot.y >=space.y
                        ) 
                    {
                          // Remove the shot and the chicken from their arrays
                          chickenshots.splice(i, 1);
                        failed++;
                        if(failed==3){
                            brokenspaceship.play();
                            draw();
                            sadGameOverSound.play();
                            stopTimer();
                            alert("You Lost"); // show the losing dialog
                            leaderborad(`
                            <br> numofgame: ${numofgame},Score: ${score}`);
                            gotoGameBoard();


                        }
                        else{
                            // resetElements();
                            brokenspaceship.play();
                            space.x = canvas.width / 2;
                            space.y = canvas.height-80;
                        
                        }
                        

                          
                    }
    
                }
            }   

    ++timerCount; // increment the timer event counter

       // if one second has passed
   if (TIME_INTERVAL * timerCount >= 1000)
   {
      --timeLeft; // decrement the timer
      timerCount=0;
   } // end if

   	 // if the timer reached zero
    if (timeLeft <= 0)
        {
           stopTimer();
           if(score >= 100){
            alert("Winner"); // show the losing dialog
            leaderborad(`<br>numofgame: ${numofgame},Score: ${score}`);
            gotoGameBoard();


           }
           else{
            showGameOverDialog("you can do better");
            leaderborad(`<br> numofgame: ${numofgame},Score: ${score}`);
            gotoGameBoard();

           }
        } // end

        var flag= false;
        for (var i = 0; i < numofrows; i++) {
            if(chickens[i].length != 0){
                flag=true;
            }
        }
        if(flag==false){
            draw();
            championSound.play();
            stopTimer();
            alert("Champion!");
            leaderborad(`<br>numofgame: ${numofgame},Score: ${score}`);
            gotoGameBoard();

            
        }
        
     
        

   draw(); // draw all elements at updated positions
} // end function updatePositions



// fires a cannonball
function keydown_ivent(e)
{

    let key = '';
	switch (e.key) {
		case 'ArrowUp':
			if(space.y>=(0.6*canvas.height)){
                space.y -= space.speed *0.2;
            }
			break;
		case 'ArrowDown':
			if(space.y<=(canvas.height-60)){
                space.y += space.speed * 0.2;
            }
			break;
		case 'ArrowLeft':
			if(space.x>=20){
                space.x -= space.speed * 0.2;
            }
			break;
		case 'ArrowRight':
			if(space.x<=(canvas.width-60)){
		        space.x += space.speed * 0.2;
            }
			break;

        case Key:
            fire.x = space.x+(SpaceImage.width/8); // align x-coordinate with cannon
            fire.y = space.y; // centers ball vertically
            fireShot();
            break;
	}

} // end function fireCannonball


// draws the game elements to the given Canvas
function draw()
{
   canvas.width = canvas.width; // clears the canvas (from W3C docs)
   ctx.drawImage(bgImage, 0, 0);

   	// Score
	ctx.fillStyle = "pink";
	ctx.font = "bold 24px serif";
	ctx.textBaseline = "top";
	ctx.fillText("Score: " + score+ ", Time remaining: " + timeLeft + ", remaining chances: " +(3-failed), 5, 5);

      
   ctx.drawImage(SpaceImage, space.x, space.y,50,50);

   if(chickenup){
    for (var i = 0; i < numofrows; i++) {
        for (var j = 0; j < numofchickens; j++) {
             if(chickens[i][j]!=null){
                ctx.drawImage(ChickenImage, chickens[i][j].x, chickens[i][j].y,60,60);
            }
        }
    }
    chickenup=false;
 
   }
   else{
        for (var i = 0; i < numofrows; i++) {
            for (var j = 0; j < numofchickens; j++) {
                if(chickens[i][j]!=null){
                    ctx.drawImage(ChickenImageup, chickens[i][j].x, chickens[i][j].y,60,60);
                }
            }
        }
        chickenup=true;
 
   }


   for(let i=0; i<shots.length; i++){
    // shots[i].x= shots[i].x-(interval);

        let shot = shots[i];
        if(shot != null){
            let shotImage = new Image();
            shotImage.src = "images/fireshotmoving.gif";
            ctx.drawImage(shotImage, shot.x, shot.y,20,20);
            
    
        }
}

for(let i=0; i<chickenshots.length; i++){
    // shots[i].x= shots[i].x-(interval);

        let invadershot = chickenshots[i];
        if(invadershot != null){
            let shotImage = new Image();
            shotImage.src = "images/hitfire.png";
            ctx.drawImage(shotImage, invadershot.x, invadershot.y,20,20);
    
        }
}



} // end function draw

function fireShot() {
    let shotImage = new Image();
    shotImage.src = "images/fireshotmoving.gif";
    let newShot = {
      x: (space.x + (SpaceImage.width/16)),
      y: space.y-(SpaceImage.height/13),
    };
    shots.push(newShot);
    
    Spaceshoot.play();
    // Spaceshoot.pause();
  }
  

  function fireInvaderShot(Invader) {
    let newShot = {
      x: (Invader.x + (30)),
      y: (Invader.y+(30)),
    };
    chickenshots.push(newShot);
  }


  // display an alert when the game ends
function showGameOverDialog(message)
{
    alert(message + "\nScore: " + score);

} // end function showGameOverDialog

function accelerateInvaders() {
    // Increase the speed of the invaders
    if(countIncreaseSpeed != 4){
        if(chickensVelocity > 0){
            chickensVelocity += 5; // Increase speed by 5 units per interval
            countIncreaseSpeed++;
    
        }
        else{
            chickensVelocity -= 5; // Increase speed by 5 units per interval
            countIncreaseSpeed++;
        }
    
    }
    
  }
  








const LGUserName = document.getElementById('logInId');
const LGPassword = document.getElementById('logInPass');
var flag = true;
var flag2 = true;
var flag3 = false;
const CAUserName = document.getElementById('createAccountUsername');
const CAEmail = document.getElementById('createAccountEmail');
const CAFirstName = document.getElementById('createAccountFirst-Name');
const CALasttName = document.getElementById('createAccountLast-Name');
const CAPassword = document.getElementById('createAccountPassword');
const CAPasswordConfirm = document.getElementById('createAccountPasswordConfirm');
const CADateBirth = document.getElementById('createAccountDate');



document.addEventListener("DOMContentLoaded", ()=> {
    const loginForm = document.querySelector("#login");
    const createAccountForm = document.querySelector("#createAccount");
    const welcomepage = document.querySelector("#welcome_page");
    const Gamepage = document.querySelector("#GamePage");

    document.querySelector("#linkCreateAccount").addEventListener("click", e => {
        e.preventDefault();
        document.getElementById('LOGINPAGE').style.display = "none";
        document.getElementById('createAccountPage').style.display = "flex";
        document.getElementById('welcome_page').style.display = "none";
        document.getElementById('GamePage').style.display = "none";
    });

    document.querySelector("#linkLogin").addEventListener("click", e => {
        e.preventDefault();
        document.getElementById('LOGINPAGE').style.display = "flex";
        document.getElementById('createAccountPage').style.display = "none";
        document.getElementById('welcome_page').style.display = "none";
        document.getElementById('GamePage').style.display = "none";


    });


    

    loginForm.addEventListener("submit", e => {
        e.preventDefault();
        checkLogIn();
        if(flag3==true){ 
            document.getElementById( "LOGINPAGE" ).style.display="none";
            document.getElementById( "createAccountPage" ).style.display="none";
            document.getElementById( "welcome_page" ).style.display="none";
            document.getElementById( "GamePage" ).style.display="flex"; 
 
            flag3=false;
        }else {
            alert("Sorry, wrong username and password!");
        }        
    });


    createAccountForm.addEventListener("submit", e => {
        e.preventDefault();
        checkInputs();

        if(flag==true){
            e.preventDefault();
            document.getElementById('LOGINPAGE').style.display = "flex";
	        document.getElementById('createAccountPage').style.display = "none";
        }
        else{
            alert("somthing wrong! check buttons")
        }
        

    });

});

let database= [  {
    username: "p",
    password: "testuser",
  },
]

function isUserValid(user, pass) {
    for (let i = 0; i < database.length; i++) {
      if (database[i].username === user && database[i].password === pass) {
        return true;
      }
    }
    return false;
  }


  function signIn(user, pass) {
    if (isUserValid(user, pass)) {
      
    } else {
      alert("Sorry, wrong username and password!");
    }
  }
  
  function setFormMessage(formElement, type, message){
    const messageElement = formElement.querySelector(".form__message");
    messageElement.textContent = message;
    messageElement.classList.remove("form__message--success", "form__message--error");
    messageElement.classList.add(`form__message--${type}`);
}


function setInputError(inputElement, message){
    inputElement.classList.add("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent=message;
}

function clearInputError(inputElement) {
    inputElement.classList.remove("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = "";
}



  function checkLogIn(){
    const LGUserNamevalue = LGUserName.value.trim();
    const LGPasswordvalue = LGPassword.value.trim();
    

    if (LGUserNamevalue === '') 
    {
        flag2=false;
        setInputError(LGUserName,"fill Username!");
        LGUserName.addEventListener("input", e => {
            clearInputError(LGUserName);
            flag2=true;
        });
    }

    if (LGPasswordvalue === '') 
    {
        flag2 =false;
        setInputError(LGPassword,"fill Password!");
        LGPassword.addEventListener("input", e => {
            clearInputError(LGPassword);
            flag2=true;
        });
    }

    if(flag2==true){
        if (isUserValid(LGUserNamevalue, LGPasswordvalue)==true) {
            flag3=true    

        } 
        
    }  

}


function checkInputs(){
    const createAccountUsernamevalue = CAUserName.value.trim();
    const CAEmailvalue = CAEmail.value.trim();
    const CADateBirthvalue = CADateBirth.value.trim();
    const CAFirstNamevalue = CAFirstName.value.trim();
    const CALasttNamevalue = CALasttName.value.trim();
    const CAPasswordvalue = CAPassword.value.trim();
    const CAPasswordConfirmvalue = CAPasswordConfirm.value.trim();
    const createAccountForm = document.querySelector("#createAccount");
    if (createAccountUsernamevalue === '') 
    {
        flag=false;
        setInputError(CAUserName,"fill Username!");
        CAUserName.addEventListener("input", e => {
            clearInputError(CAUserName);
            flag=true;
        });
    }


    if(CAEmailvalue === ''){
        flag=false;
        setInputError(CAEmail,"fill Email!");
        CAEmail.addEventListener("input", e => {
            clearInputError(CAEmail);
            flag=true;
        });

    }

    if(CADateBirthvalue === ''){
        flag=false;
        setInputError(CADateBirth,"fill Date Birth!");
        CADateBirth.addEventListener("input", e => {
            clearInputError(CADateBirth);
            flag=true;
        });
    }

    if(CAFirstNamevalue === ''){
        flag=false;
        setInputError(CAFirstName,"fill First Name!");
        CAFirstName.addEventListener("input", e => {
            clearInputError(CAFirstName);
            flag=true;
        });
    }else{
        if(RegExp('(?=.*[0-9])').test(CAFirstNamevalue) == true){
            flag=false;
            setInputError(CAFirstName,"First Nae must not contain numbers!");
            CAFirstName.addEventListener("input", e => {
                clearInputError(CAFirstName);
                flag=true;
            });        }
    }

    if(CALasttNamevalue === ''){
        flag=false;
        setInputError(CALasttName,"fill Last Name!");
        CALasttName.addEventListener("input", e => {
            clearInputError(CALasttName);
            flag=true;
        });

    }else{
        if(RegExp('(?=.*[0-9])').test(CALasttNamevalue) == true){
            flag=false;
            setInputError(CALasttName,"Last Nae must not contain numbers!");
            CALasttName.addEventListener("input", e => {
                clearInputError(CALasttName);
                flag=true;
            });        }
    }

    if(CAPasswordvalue === ''){
        flag=false;
        setInputError(CAPassword,"fill Password!");
        CAPassword.addEventListener("input", e => {
            clearInputError(CAPassword);
            flag=true;
        });
    }else{
        if(CAPasswordvalue.length < 8){
            flag=false;
                setInputError(CAPassword,"at least 8!");
                CAPassword.addEventListener("input", e => {
                    clearInputError(CAPassword);
                    flag=true;
                });

        }

        if(CAPasswordvalue.length >= 8 && RegExp('(?=.*[a-z])').test(CAPasswordvalue) == false){
            flag=false;
            setInputError(CAPassword,"password must contain strings!");
            CAPassword.addEventListener("input", e => {
                clearInputError(CAPassword);
                flag=true;
            });        }

        if(CAPasswordvalue.length >= 8 && RegExp('(?=.*[0-9])').test(CAPasswordvalue) == false){
            flag=false;
            setInputError(CAPassword,"password must contain numbers!");
            CAPassword.addEventListener("input", e => {
                clearInputError(CAPassword);
                flag=true;
            });        }
    }


    if(CAPasswordConfirmvalue === ''){
        flag=false;
        setInputError(CAPasswordConfirm,"fill Password Confirm!");
        CAPasswordConfirm.addEventListener("input", e => {
            clearInputError(CAPasswordConfirm);
            flag=true;
        });
    }else{
        if(CAPasswordConfirmvalue != CAPasswordvalue){
            flag=false;
            setInputError(CAPasswordConfirm,"passwords doesnt match!!");
            CAPasswordConfirm.addEventListener("input", e => {
                clearInputError(CAPasswordConfirm);
                flag=true;
            });        }
    }

    if(flag){
        // database[createAccountUsernamevalue]=CAPasswordvalue;
        database[length]={username: createAccountUsernamevalue, password: CAPasswordvalue}
    }


}



function fromwelcometologin(){
    document.getElementById( "LOGINPAGE" ).style.display="flex";
    document.getElementById( "createAccountPage" ).style.display="none";
    document.getElementById( "welcome_page" ).style.display="none";
    document.getElementById( "GamePage" ).style.display="none";


}


function fromwelcometoRegister(){
    document.getElementById( "LOGINPAGE" ).style.display="none";
    document.getElementById( "createAccountPage" ).style.display="flex";
    document.getElementById( "welcome_page" ).style.display="none";
    document.getElementById( "GamePage" ).style.display="none";


}

function fromRegistertoLogin(){
    document.getElementById( "LOGINPAGE" ).style.display="flex";
    document.getElementById( "createAccountPage" ).style.display="none";
    document.getElementById( "welcome_page" ).style.display="none";
    document.getElementById( "GamePage" ).style.display="none";


}

function fromLogIntoRegister(){
    document.getElementById( "LOGINPAGE" ).style.display="none";
    document.getElementById( "createAccountPage" ).style.display="flex";
    document.getElementById( "welcome_page" ).style.display="none";
    document.getElementById( "GamePage" ).style.display="none";


}

function gotowelcomepage(){
    document.getElementById( "LOGINPAGE" ).style.display="none";
    document.getElementById( "createAccountPage" ).style.display="none";
    document.getElementById( "welcome_page" ).style.display="flex";
    document.getElementById( "GamePage" ).style.display="none";


}

function gotologinpage(){
    document.getElementById( "LOGINPAGE" ).style.display="flex";
    document.getElementById( "createAccountPage" ).style.display="none";
    document.getElementById( "welcome_page" ).style.display="none";
    document.getElementById( "GamePage" ).style.display="none";


}

function gotoregisterpage(){
    document.getElementById( "LOGINPAGE" ).style.display="none";
    document.getElementById( "createAccountPage" ).style.display="flex";
    document.getElementById( "welcome_page" ).style.display="none";
    document.getElementById( "GamePage" ).style.display="none";
}

function gotoAboutpage(){
    document.getElementById( "LOGINPAGE" ).style.display="none";
    document.getElementById( "createAccountPage" ).style.display="none";
    document.getElementById( "welcome_page" ).style.display="none";
    document.getElementById( "GamePage" ).style.display="none";
    document.getElementById('about').classList.toggle("active");
}

function gotoGameBoard(){
    document.getElementById( "LOGINPAGE" ).style.display="none";
    document.getElementById( "createAccountPage" ).style.display="none";
    document.getElementById( "welcome_page" ).style.display="none";
    document.getElementById( "GamePage" ).style.display="flex";
    document.getElementById("leaderBoard").style.display = "flex";

}


function gotoGame(){
    document.getElementById( "LOGINPAGE" ).style.display="none";
    document.getElementById( "createAccountPage" ).style.display="none";
    document.getElementById( "welcome_page" ).style.display="none";
    document.getElementById( "GamePage" ).style.display="flex";
    document.getElementById("leaderBoard").style.display = "none";


}


function leaderborad(strings){
    const leaderboard =document.getElementById("leaderBoard");
    leaderboard.innerHTML+=strings;

}



window.addEventListener("load", choosing, false);

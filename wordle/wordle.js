var height = 4; /*number of guesses*/
var width = 4;

var row = 0; /*this number represents the current word we are guessing*/
var column = 0; /*represents the current letter for each attempt*/

var gameOver = false;



window.onload = async() =>{
    const res = await fetch("https://api.masoudkf.com/v1/wordle", {
        headers: {
            "x-api-key": "sw0Tr2othT1AyTQtNDUE06LqMckbTiKWaVYhuirv",
        },
    });
    let json = await res.json();
    let { dictionary } = json;
    wordoftheday = dictionary[Math.floor(Math.random() * dictionary.length)];
    wordoftheday.word = wordoftheday.word.toUpperCase();
    
    var word = wordoftheday.word;
    var hint = wordoftheday.hint;
   

    console.log(word);
    console.log(hint);

    alert("Click the info icon to toggle the instructions.")

   createboard();
    
    
    function createboard() { /*this function will create our tiles once the page loads and create eventListeners for the game.*/
    
        document.getElementById("changetheme").addEventListener("click", todark);
        document.getElementById("info").addEventListener("click", toggleinfo);
        document.getElementById("startover").addEventListener("click", () => {window.location.reload()} );
        document.getElementById("help").addEventListener("click",displayHint);
    
       
       
        for (let r = 0; r < height; r++) {
            for (let c = 0; c < width; c++) {
                let tile = document.createElement("span");
                tile.id = r.toString() + "-" + c.toString();
                tile.classList.add("tile");/* This adds the tile class in the style sheet to the tile element. */
                tile.innerText = "";
                document.getElementById("board").appendChild(tile);
            }
    
        }
    
        
        //Now we add code to listen for user input
        document.addEventListener("keyup", (e) => { //We use key up here so that letters are only registered when a key comes up after pushing it down. (To avoid spamming)
            if (gameOver) return;                   //Note that (e) is just a parameter for an actual pressed key
            //processInput(e);
            if ("KeyA" <= e.code && e.code <= "KeyZ") {
                if (column < width) {
                    let currTile = document.getElementById(row.toString() + '-' + column.toString());
                    if (currTile.innerText == "") {
                        currTile.innerText = e.code[3];
                        column += 1;
                    }
                }
            }
            else if (e.code == "Backspace"){
                if(0< column && column <= width){
                    column -= 1;
                }
                //Because we went back one tile, we need to update the tile id
                let currTile = document.getElementById(row.toString() + '-' + column.toString());
                currTile.innerText = ""; // so if backspace is pressed, we change the value of the current tile to nothing and we decrement column by 1.
            }
            
    
            else if (e.code == "Enter"){
                if (column != width){
                        alert("first complete the word");
                    }
            
                else if (column == width){
                    update();//we call an update function that will process the contents of that row and change the colors of the boxes.
                    row += 1;//fresh row
                    column = 0// first column in fresh row
                }
            }
            
            if(!gameOver && row == height){
                gameOver = true;
                document.getElementById("answer").innerText = word;// adds the word to the header tag with the id "answer". Note that "answer" can also be styled in the css using its id.
                document.getElementById("bottom").innerText = "You missed the word "+word+" and lost!";
                document.getElementById("bottom").style.backgroundColor = "darkred";
                document.getElementById("bottom").style.color = "white";
                document.getElementById("vertical_line").style.display = "none";
                document.getElementById("bottom").style.marginTop = "14%";
             }
    
        })
    }
    
    function update() {
        
        let correctletters = 0;
        for(let i = 0; i < width; i++){
            let currTile = document.getElementById(row.toString() + '-' + i.toString());
            let letter = currTile.innerText;
            
            //if the letter is in the coorect position, we increase the number of correct letters
            if (word[i] == letter) {
                currTile.classList.add("correct");//adds the "correct" style class to the tile if it is the right position
                correctletters += 1;
            }
            else if (word.includes(letter)){
                currTile.classList.add("present");
            }
            else{
                currTile.classList.add("absent");
            }
        }
        if (correctletters == width){
            gameOver = true;
            document.getElementById("bottom").innerText = "You guessed the word "+word+" correctly!";
            document.getElementById("bottom").style.backgroundColor = "yellowgreen";
            document.getElementById("vertical_line").style.display = "none";
            document.getElementById("board").style.display = "none";
            document.getElementById("infotext").style.display = "none";
            document.getElementById("congratulations").style.display = "flex";
            document.getElementById("bottom").style.marginTop = "2%";
        }
    
    }
    
    
    function todark(){
        var something = document.body;
        something.classList.toggle("dark");
        var boardtext = document.getElementById("board");
        boardtext.classList.toggle("whitetext");
        
    }
    
    
    function toggleinfo(){
        var info = document.getElementById("infotext");
        info.classList.toggle("displayn");
       
        var line = document.getElementById("vertical_line");
        line.classList.toggle("displayn");
    }

    function displayHint(){
        document.getElementById("bottom").innerText = "Hint: "+hint;
        document.getElementById("bottom").style.backgroundColor = "beige";
        document.getElementById("vertical_line").style.display = "none";
        document.getElementById("bottom").style.color = "black";
    }

}
   


































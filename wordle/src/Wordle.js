import React, { useEffect, useState, useRef } from "react";
import './style.css';
import './mediaqueries.css'

function Wordle() {
    const height = 4; // number of guesses
    const width = 4;

    let row = 0; // this number represents the current word we are guessing
    let column = 0; // represents the current letter for each attempt

    let gameOver = false;

    const objects = [
        { word: "buzz", hint: "The sound that a bee makes." },
        { word: "cafe", hint: "A place where people drink coffe." },
        { word: "baby", hint: "A very young child, especially one newly or recently born." },
        { word: "maze", hint: "A network of paths and hedges designed as a puzzle through which one has to find a way." },
        { word: "mall", hint: "A large enclosed shopping area from which traffic is excluded" },
        { word: "moun", hint: "A large natural elevation of the earth's surface." },
        { word: "comp", hint: "A precious red stone" },
        { word: "disc", hint: "A flat, thin circular object" },
        { word: "butt", hint: "An insect with colorful wings." },
        { word: "libr", hint: "A place with a collection of books." },
    ];

    const [word, setWord] = useState("");
    const [hint, setHint] = useState("");
    const wordRef = useRef(""); // To store the latest value of word
    const hintRef = useRef(""); // To store the latest value of hint

    useEffect(() => {
        const randomObject = objects[Math.floor(Math.random() * objects.length)];
        setWord(randomObject.word.toUpperCase());
        setHint(randomObject.hint);

        wordRef.current = randomObject.word.toUpperCase(); // Update the ref value
        hintRef.current = randomObject.hint; // Update the ref value

        alert("Click the info icon to toggle the instructions.");
        console.log(randomObject);
        console.log(wordRef.current);

        createBoard();

        const handleKeyup = (e) => {
            if (gameOver) return;
            if ("KeyA" <= e.code && e.code <= "KeyZ") {
                if (column < width) {
                    let currTile = document.getElementById(row.toString() + "-" + column.toString());
                    if (currTile.innerText === "") {
                        currTile.innerText = e.code[3];
                        column += 1;
                    }
                }
            } else if (e.code === "Backspace") {
                if (0 < column && column <= width) {
                    column -= 1;
                }
                let currTile = document.getElementById(row.toString() + "-" + column.toString());
                currTile.innerText = "";
            } else if (e.code === "Enter") {
                if (column !== width) {
                    alert("first complete the word");
                } else if (column === width) {
                    update();
                    row += 1;
                    column = 0;
                }
            }

            if (!gameOver && row === height) {
                gameOver = true;
                document.getElementById("answer").innerText = wordRef.current;
                document.getElementById("bottom").innerText = "You missed the word " + wordRef.current + " and lost!";
                document.getElementById("bottom").style.backgroundColor = "darkred";
                document.getElementById("bottom").style.color = "white";
                document.getElementById("bottom").style.marginTop = "14%";
            }
        };

        document.addEventListener("keyup", handleKeyup);

        // Clean up the event listener on component unmount
        return () => {
            document.removeEventListener("keyup", handleKeyup);
        };
    }, []);

    function createBoard() {
        const boardElement = document.getElementById("board");
        boardElement.innerHTML = ""; // Clear any existing tiles

        for (let r = 0; r < height; r++) {
            for (let c = 0; c < width; c++) {
                let tile = document.createElement("span");
                tile.id = r.toString() + "-" + c.toString();
                tile.classList.add("tile");
                tile.innerText = "";
                boardElement.appendChild(tile);
            }
        }

        document.getElementById("changetheme").addEventListener("click", todark);
        document.getElementById("info").addEventListener("click", toggleinfo);
        document.getElementById("startover").addEventListener("click", () => {
            window.location.reload();
        });
        document.getElementById("help").addEventListener("click", displayHint);
    }

    function update() {
        let correctletters = 0;
        for (let i = 0; i < width; i++) {
            let currTile = document.getElementById(row.toString() + "-" + i.toString());
            let letter = currTile.innerText;
            console.log("word[i] equals", wordRef.current);
            if (wordRef.current[i] === letter) {
                currTile.classList.add("correct");
                correctletters += 1;
            } else if (wordRef.current.includes(letter)) {
                currTile.classList.add("present");
            } else {
                currTile.classList.add("absent");
            }
        }
        if (correctletters === width) {
            gameOver = true;
            document.getElementById("bottom").innerText = "You guessed the word " + wordRef.current + " correctly!";
            document.getElementById("bottom").style.backgroundColor = "yellowgreen";
            document.getElementById("board").style.display = "none";
            document.getElementById("infotext").style.display = "none";
            document.getElementById("congratulations").style.display = "flex";
            document.getElementById("bottom").style.marginTop = "2%";
        }
    }

    function todark() {
        var something = document.body;
        something.classList.toggle("dark");
        var boardtext = document.getElementById("board");
        boardtext.classList.toggle("whitetext");
    }

    function toggleinfo() {
        var info = document.getElementById("infotext");
        info.classList.toggle("displayn");

        
    }

    function displayHint() {
        document.getElementById("bottom").innerText = "Hint: " + hintRef.current;
        document.getElementById("bottom").style.backgroundColor = "beige";
        document.getElementById("bottom").style.color = "black";
    }

    return (
        <div>
            <navbar>
                <div><h1>Wordle</h1></div>
                <div id="buttons">
                    <div id="changetheme">&#9681;</div>
                    <div id="help">&#63;</div>
                    <div id="info">&#9432;</div>
                </div>
            </navbar>
            <hr />
            <div className="fullbody">
                <div id="board"></div>
                <div id="congratulations" style={{ display: "none" }}>
                    <img id ='con_img' src="https://res.cloudinary.com/mkf/image/upload/v1675467141/ENSF-381/labs/congrats_fkscna.gif" alt="Congratulations" />
                </div>
                
                <div id="infotext">
                    <h3>How To Play</h3>
                    <ul>
                        <li>Start typing. The letters will appear in the boxes.</li>
                        <li>Remove letters with backspace.</li>
                        <li>Hit Enter/Return to submit an answer.</li>
                        <li>Letters with green background are in the right spot.</li>
                        <li>Letters with yellow background exist in the word, but are in the wrong spots.</li>
                        <li>Letters with gray background do not exist in the word.</li>
                        <li>If you need a hint, click the &#63; icon.</li>
                    </ul>
                </div>
            </div>
            <div id="startover">Start Over</div>
            <h1 id="answer"></h1>
            <section id="bottom"></section>
            <footer className="foot">
                <p>&#169; Emiko Wordle 2023</p>
            </footer>
        </div>
    );
}

export default Wordle;

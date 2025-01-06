import React, {useState, useEffect} from 'react'
import './App.css'

function App() {

    const [start, setStart] = useState(false);
    const [title, setTitle] = useState('Press Go! to Start');
    const [level, setLevel] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [gamePattern, setGamePattern] = useState([]);
    const [userPattern, setUserPattern] = useState({list: [], button: ''});

    const buttonColors = ['green', 'red', 'yellow', 'blue'];
    

    useEffect(() => {
        if(userPattern.list.length > 0){
            checkAnswer();
        }
    }, [userPattern])

    useEffect(() => {
        const score = localStorage.getItem('score')
        if(score){
            setHighScore(score);
        }
    }, [])

    function nextLevel(){
        const randomChosenColor = buttonColors[Math.floor(Math.random()*4)];
        setGamePattern((prev) => [...prev, randomChosenColor]);
        setUserPattern({ list: [], button: '' });
        animateButton(randomChosenColor);
        setLevel(prev => {
            const newLevel = prev + 1;
            setTitle(`Level ${newLevel}`);
            return newLevel;
        }); 
        
    }

    function checkAnswer(){
        const checkGamePattern = gamePattern.slice(0, userPattern.list.length);
        if(userPattern.list.join(',') === checkGamePattern.join(',')){
            if(userPattern.list.length == gamePattern.length){
                setTimeout(() => {nextLevel()} ,500)
            }
            
        }else{
            if(level > highScore){
                setHighScore(level);
                localStorage.setItem('score', level)
                
            }
            btnError(userPattern.button);
            playSound('error');
            setGamePattern([]);
            setUserPattern({list: [], button: ''});
            setTitle('Game Over! Press Go To Play Again');
            setLevel(0);
            setStart(false);
        }
    }

    function animateButton(color){
        const div = document.getElementsByClassName(color)[0];
        div.classList.add('chosenBtn');
        setTimeout(() => {
            div.classList.remove('chosenBtn')
        }, 200)
    }

    function animateClickedButton(color){
        const div = document.getElementsByClassName(color)[0];
        div.classList.add('clicked');
        setTimeout(() => {
            div.classList.remove('clicked')
        }, 100)
    }

    function btnError(arg){
        arg.classList.add('error');
        document.body.style.background = '#E57373';

        setTimeout(() => {
            arg.classList.remove('error');
            document.body.style.background = 'linear-gradient(135deg, #f7e8a4, #ffdea0)';;

        }, 150)
    }

    function startBtn(){
        if(!start){
            setStart(true);
            nextLevel();
        }
    }

    function handleGame(e, color){
        if(start){
            setUserPattern({
                list: [...userPattern.list, color],
                button: e.currentTarget
            });
            animateClickedButton(color);
            playSound('click');
        }
    }

    function playSound(sound){
        const soundPath = sound === 'click' ? '/sounds/click.ogg' : '/sounds/error.ogg';
        const audio = new Audio(soundPath);
        audio.play();
    }

    return (

        <div className="game-container">
            <h1 className='high-score'>High Score: {highScore}</h1>
            <h1>{title}</h1>
            <button onClick={startBtn}>Go</button>
            {buttonColors.map((color) => {
                return(
                    <div
                        key={color}
                        onClick={(e) => handleGame(e, color)}
                        className={color}
                    >
                    </div>
                )
            })}
        </div>
    )
}

export default App
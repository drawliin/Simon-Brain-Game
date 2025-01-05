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

    function nextLevel(){
        const randomChosenColor = buttonColors[Math.floor(Math.random()*4)];
        setGamePattern((prev) => [...prev, randomChosenColor]);
        setUserPattern({ list: [], button: '' });
        animateButton(randomChosenColor);
        setLevel(prev => prev + 1);
        setTitle(`Level ${level+1}`);
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
                
            }
            btnError(userPattern.button);
            playSound('error');
            setGamePattern([]);
            setUserPattern({list: [], button: ''});
            setTitle('Press Go to start');
            setLevel(0);
            setStart(false);
        }
    }

    function animateButton(color){
        const div = document.getElementsByClassName(color)[0];
        div.classList.add('chosenBtn');
        setTimeout(() => {
            div.classList.remove('chosenBtn')
        }, 300)
    }

    function animateClickedButton(color){
        const div = document.getElementsByClassName(color)[0];
        div.classList.add('clicked');
        setTimeout(() => {
            div.classList.remove('clicked')
        }, 150)
    }

    function btnError(e){
        e.target.classList.add('error');
        document.body.style.background = '#E57373';

        setTimeout(() => {
            e.target.classList.remove('error');
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
                button: e
            });
            animateClickedButton(color);
            playSound('click');
        }
    }

    function playSound(sound){
        const soundPath = sound === 'click' ? '../public/sounds/click.ogg' : '../public/sounds/error.ogg';
        const audio = new Audio(soundPath);
        audio.play();
    }

    return (
        <div className='game-container'>
            <h1 className='high-score'>High Score: {highScore}</h1>
            <h1>{title}</h1>
            <button onClick={startBtn}>Go</button>
            <div onClick={(e) => handleGame(e, 'green')} className='green'></div>
            <div onClick={(e) => handleGame(e, 'red')} className='red'></div>
            <div onClick={(e) => handleGame(e, 'yellow')} className='yellow'></div>
            <div onClick={(e) => handleGame(e, 'blue')} className='blue'></div>

        </div>
    )
}

export default App
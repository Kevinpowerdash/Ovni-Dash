import React, { useState, useEffect } from 'react';
import ovniImage from './images/ovni.png';
import tierraImage from './images/tierra.png';
import meteoritoImage from './images/meteorito.png';
import './App.css';

const App = () => {
  const [ovniPosition, setOvniPosition] = useState({ x: 50, y: 50 });
  const [tierraScale, setTierraScale] = useState(0.1);
  const [meteoritos, setMeteoritos] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [counter, setCounter] = useState(100);

  const handleKeyPress = (event) => {
    if (gameStarted && !gameOver) {
      const speed = 5;
      switch (event.key) {
        case 'w':
          setOvniPosition((prev) => ({ ...prev, y: Math.max(prev.y - speed, 0) }));
          break;
        case 's':
          setOvniPosition((prev) => ({ ...prev, y: Math.min(prev.y + speed, 100) }));
          break;
        case 'a':
          setOvniPosition((prev) => ({ ...prev, x: Math.max(prev.x - speed, 0) }));
          break;
        case 'd':
          setOvniPosition((prev) => ({ ...prev, x: Math.min(prev.x + speed, 100) }));
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      handleKeyPress(event);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const moveTierra = () => {
        if (tierraScale < 2.5) {
          setTierraScale((prev) => Math.min(prev + 0.001, 2.5));
        } else {
          setGameOver(true);
        }
      };

      const tierraMoveInterval = setInterval(moveTierra, 50);

      return () => {
        clearInterval(tierraMoveInterval);
      };
    }
  }, [gameStarted, gameOver, tierraScale]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const meteoritoInterval = setInterval(() => {
        const position = { x: 110, y: Math.random() * 100 };
        const newMeteorito = {
          ...position,
          timeToLive: 10,
        };

        setMeteoritos((prev) => [...prev, newMeteorito]);
      }, 500);

      return () => {
        clearInterval(meteoritoInterval);
      };
    }
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const moveMeteoritos = () => {
        setMeteoritos((prev) =>
          prev.map((meteorito) => ({
            ...meteorito,
            x: meteorito.x - 1, // Ajusta la velocidad horizontal de los meteoritos según sea necesario
          }))
        );
      };

      const meteoritoMoveInterval = setInterval(moveMeteoritos, 50);

      // Ajusta este valor según tus preferencias
      const hitboxRadius = 50;

      const collisionCheck = () => {
        const ovniRadius = 19; // Radio del ovni (ajustar según el tamaño del ovni)
        const meteoritoRadius = 30; // Radio del meteorito (ajustar según el tamaño del meteorito)

        meteoritos.forEach((meteorito, index) => {
          const distance = Math.sqrt(
            Math.pow(ovniPosition.x - meteorito.x, 2) + Math.pow(ovniPosition.y - meteorito.y, 2)
          );

          if (distance < ovniRadius + meteoritoRadius - hitboxRadius) {
            setGameOver(true);
          }
        });
      };

      const collisionInterval = setInterval(collisionCheck, 50);

      return () => {
        clearInterval(meteoritoMoveInterval);
        clearInterval(collisionInterval);
      };
    }
  }, [gameStarted, gameOver, ovniPosition, meteoritos]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const counterInterval = setInterval(() => {
        setCounter((prev) => {
          if (prev > 0) {
            return prev - 1;
          } else {
            setGameOver(true);
            return 0;
          }
        });
      }, 1000);

      return () => {
        clearInterval(counterInterval);
      };
    }
  }, [gameStarted, gameOver]);

  const restartGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setCounter(100);
    setOvniPosition({ x: 50, y: 50 });
    setTierraScale(0.1);
    setMeteoritos([]);
  };

  return (
    <div className={`game-container${gameStarted ? ' game-started' : ''}`}>
      {gameStarted && (
        <>
          <img
            src={tierraImage}
            alt="Tierra"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: `${30 * tierraScale}vw`, // Reducción del tamaño de la tierra
              height: `${50 * tierraScale}vh`, // Reducción del tamaño de la tierra
              zIndex: 1,
            }}
          />
        </>
      )}

      <img
        src={ovniImage}
        alt="Ovni"
        style={{
          position: 'absolute',
          top: `${Math.max(ovniPosition.y - 5, 0)}%`, // Reducción del cuadro de movimiento
          left: `${Math.max(ovniPosition.x - 0, 0)}%`, // Reducción del cuadro de movimiento
          transform: 'translate(-50%, -50%)',
          width: '50px',
          height: '50px',
          zIndex: 6,
        }}
      />

      {meteoritos.map((meteorito, index) => (
        <img
          key={index}
          src={meteoritoImage}
          alt="Meteorito"
          style={{
            position: 'absolute',
            top: `${meteorito.y}%`,
            left: `${meteorito.x}%`,
            width: '40px',
            height: '40px',
            zIndex: 1,
          }}
        />
      ))}

      <div className="menu" style={{ backgroundColor: '#020017', zIndex: gameStarted ? -1 : 2 }}>
        <h1 className="title">O.V.N.I Dash</h1>
        <button className="start-button" onClick={() => setGameStarted(true)} disabled={gameStarted}>
          Iniciar Juego
        </button>
      </div>

      {gameOver && (
        <div className="game-over" style={{ zIndex: 6 }}>
          <h1 style={{ fontFamily: 'Comic Sans MS', color: 'white', textAlign: 'center', marginBottom: '-150px' }}>
            ¡Ganaste!
          </h1>
          <div className="restart-container" style={{ textAlign: 'center', marginTop: '90px' }}>
            <p className="counter" style={{ fontFamily: 'Comic Sans MS', color: 'white', marginBottom: '20px', marginTop: '0' }}>
              {counter}
            </p>
          </div>
          <div className="restart-container" style={{ textAlign: 'center', marginTop: '0' }}>
            <button className="restart-button" onClick={restartGame} style={{ fontFamily: 'Comic Sans MS', color: 'cosmicColor', marginTop: '0' }}>
              Reiniciar
            </button>
          </div>
        </div>
      )}
      {gameStarted && (
        <>
          <div className="counter" style={{ fontFamily: 'Comic Sans MS', color: 'white', zIndex: 6 }}>
            <p>{counter}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default App;

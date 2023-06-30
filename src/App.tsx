import './App.css';
import { buttonStyle1, buttonStyle2, buttonStyle3, buttonStyle4, buttonStyle5, buttonStyle6 } from './styles/buttonStyles'
import Logo from './assets/logo-icon.svg';
import PlusMinus from './assets/buttons/plus-minus-icon.png'
import PercentIcon from '@mui/icons-material/Percent';
import Divide from './assets/buttons/divide-icon.png'
import CloseIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Remove';
import Equal from './assets/buttons/equal-icon.png'
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import { Button, Drawer, IconButton } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import ICalculate from './Interfaces/ICalculate';

function App() {

  const [open, setOpen] = useState(false);
  const [historyClicked, setHistoryClicked] = useState(false)
  const [display, setDisplay] = useState<any>(0)
  const [number, setNumber] = useState(0)
  const [operation, setOperation] = useState('')
  const [histTransform, setHistTransform] = useState(false)
  const [history, setHistory] = useState<ICalculate[]>([]);
  const baseUrl = 'https://localhost:7081/api'


  useEffect(() => {
    getHistory()
    console.log('history', history)
  }, [histTransform]);

  const handleButtonClick = () => {
    setOpen(!open);
  };

  function handleHistoryClick() {
    setHistoryClicked(!historyClicked)
  }

  function handleHistoryTransform() {
    setHistTransform(!histTransform)
  }

  function getHistory() {
    let url = `${baseUrl}/Calculator`
    axios.get(url).then(res => {
      setHistory(res.data)
    }).catch(err => {
      console.log(err)
    })

  }

  useEffect(() => {
    getHistory
  })

  function handleResetDisplay() {
    setDisplay(0)
    setNumber(0)
    setOperation('')
  }

  function inputValue(e: any) {
    let actualDisplay = display.toString()
    let value = e.target.value
    if (!(actualDisplay.includes(",") && value.toString() === ',')) {
      setDisplay(display == 0 || display === 'error' || actualDisplay.includes("=") ? value : display + value)
    }

  }

  function handlePorcent() {
    let actualDisplay = display
    if (!actualDisplay.includes('error')) {
      let porcent = display / 100
      setDisplay(porcent.toString().replace('.', ','))
    }
  }

  function handlePlusMinus() {
    setDisplay(typeof display === 'number' ? parseFloat(display.toString()) * -1 : display * -1)
  }

  function handleOperation(op: string) {
    setOperation(op)
    setNumber(display)
    setDisplay(0)
  }

  function handleCalculation() {
    let payload = {
      firstNumber: number.toString(),
      secondNumber: display.toString(),
      operation: operation
    }
    axios.post(`${baseUrl}/Calculate/Calculate`, payload)
      .then(res => {
        setDisplay(`${payload.firstNumber} ${payload.operation} ${payload.secondNumber} = ${res.data}`)
        setHistory(res.data)
        getHistory()
      })
      .catch(() => {
        setDisplay('error')
      })
    setOperation('')
    setNumber(0)
  }

  return (
    <div className='app'>
      <header className='app-header'>
        <div className='app-header-logo'>
          <img src={Logo} className="App-logo" alt="logo" />
        </div>
        <div className='app-header-buttons'>
          <IconButton aria-label="calc" onClick={handleButtonClick}>
            <i className="fa-solid fa-calculator" style={{ color: "white" }}></i>
          </IconButton>
          <IconButton aria-label="config">
            <SettingsIcon style={{ color: "white" }} />
          </IconButton>
        </div>
      </header>
      <div className='app-bar'>
        <div className='app-bar-menu'>
          <IconButton aria-label="config">
            <MenuIcon style={{ color: "white" }} fontSize="large" />
          </IconButton>
        </div>
      </div>
      <div className='calculator'>
        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          anchor="right"
          PaperProps={{
            sx: {
              height: '866px',
              width: 433,
              top: 64,
            },
          }}
        >
          <div className="calculator-container">

            <div className='calculator-container-header'>
              <span>Calculadora</span>
              {historyClicked ? (
                <Button className='calculator-container-header-history'
                  sx={{ color: 'white', backgroundColor: '#0D7FA9', textTransform: 'none', height: '20px' }}
                  variant='text'
                  onClick={() => {
                    handleHistoryClick()
                    handleHistoryTransform()
                  }} >
                  Histórico
                </Button>) : (
                <Button className='calculator-container-header-history'
                  sx={{ color: 'white', textTransform: 'none', height: '20px' }}
                  variant='text'
                  onClick={() => {
                    handleHistoryClick()
                    handleHistoryTransform()
                  }}
                >
                  Histórico
                </Button>
              )}
            </div>
            {histTransform ? (
              <div className={`calculator-container-history ${histTransform ? 'show' : ''}`}>
                <div className='calculator-container-history-text'>
                  {history?.map((calc) => (
                    <>
                      <br />
                      <span className='calculator-container-history-operation'> {`${calc.operation}=`}</span>
                      <br />
                      <span className='calculator-container-history-result'> {calc.result}</span>
                    </>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="calculator-container-display">
                  <div className='calculator-container-display-text'>{display === 'error' ? display : parseFloat(display).toLocaleString('pt-BR')}</div>
                </div>
                <div className='calculator-container-buttons'>
                  <Button sx={buttonStyle1} onClick={handleResetDisplay}>AC</Button>
                  <Button sx={buttonStyle1} onClick={handlePlusMinus}><img src={PlusMinus} /></Button>
                  <Button sx={buttonStyle1} onClick={handlePorcent}><PercentIcon sx={{ color: 'white', fontSize: '40px' }} /></Button>
                  <Button sx={buttonStyle2} value={'/'} onClick={() => handleOperation('/')}><img src={Divide} /></Button>
                  <Button sx={buttonStyle4} value={7} onClick={inputValue}>7</Button>
                  <Button sx={buttonStyle4} value={8} onClick={inputValue}>8</Button>
                  <Button sx={buttonStyle4} value={9} onClick={inputValue}>9</Button>
                  <Button sx={buttonStyle2} value={'*'} onClick={() => handleOperation('*')}> <CloseIcon sx={{ color: 'white', fontSize: '50px' }} /></Button>
                  <Button sx={buttonStyle4} value={4} onClick={inputValue}>4</Button>
                  <Button sx={buttonStyle4} value={5} onClick={inputValue}>5</Button>
                  <Button sx={buttonStyle4} value={6} onClick={inputValue}>6</Button>
                  <Button sx={buttonStyle2} value={'-'} onClick={() => handleOperation('-')}><RemoveIcon sx={{ color: 'white', fontSize: '50px' }} /></Button>
                  <Button sx={buttonStyle4} value={1} onClick={inputValue}>1</Button>
                  <Button sx={buttonStyle4} value={2} onClick={inputValue}>2</Button>
                  <Button sx={buttonStyle4} value={3} onClick={inputValue}>3</Button>
                  <Button sx={buttonStyle2} value={'+'} onClick={() => handleOperation('+')}> <AddIcon sx={{ color: 'white', fontSize: '50px' }} /></Button>
                  <Button sx={buttonStyle5} value={0} onClick={inputValue} className='calculator-container-buttons-zero'>0</Button>
                  <Button sx={buttonStyle4} value={','} onClick={inputValue} className='calculator-container-buttons-dot'>,</Button>
                  <Button sx={buttonStyle3} onClick={handleCalculation} className='calculator-container-buttons-equal'><img src={Equal} /></Button>
                </div>
              </>
            )}
            <div className='calculator-container-back'>
              <Button sx={buttonStyle6} onClick={handleButtonClick} className='calculator-container-buttons-back'>Voltar</Button>
            </div>
          </div>
        </Drawer>
      </div >
      <footer>
      </footer>
    </div >
  )
}

export default App;

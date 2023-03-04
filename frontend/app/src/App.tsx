import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import MyAppBar from './MyAppBar';
import { BrowserRouter } from 'react-router-dom';
import useMedia from 'use-media';
import Tetris from './features/tetris/Tetris';


const useStyles = makeStyles((theme) => ({
  app_root:{
      margin:'0 auto',
      justifyContent:'center',
      textAlign:'center',
      overflow:'auto',
      background:'black',
      width:'100vw',
      height:'100vh',
  },
}));

const App:React.FC = () => {
  const styles=useStyles();
  const isWide = useMedia({ minWidth: '835px' });
  const isNarrow = useMedia({ maxWidth: '400px' });
  
  const [onPlay,setPlay] = useState<boolean>(false);
  const [scoreState,setScoreState] = useState<number>(0);
  
  return (
    <BrowserRouter>
      <MyAppBar
        isWide={isWide}
        isNarrow={isNarrow}
        onPlay={onPlay}
        setPlay={setPlay}
        scoreState={scoreState}/>
      <div className ={styles.app_root}>
        <Tetris isWide={isWide}
        isNarrow={isNarrow}
        onPlay={onPlay}
        setPlay={setPlay}
        scoreState={scoreState}
        setScoreState={setScoreState}
        />         
      </ div>
    </BrowserRouter>
  );
}

export default App;

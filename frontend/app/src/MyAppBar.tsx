import React from "react";
import { Link} from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { styled } from "@mui/styles";

type Props ={
  isWide:boolean,
  isNarrow:boolean,
  onPlay:boolean,
  setPlay:(onPlay:boolean)=>void,
  scoreState:number,
}

const StyledAppBar = styled(AppBar)({
  position:"static",
  background: 'linear-gradient(45deg, #5972fe 30%, #0091ea 90%)',
});

const MyAppBar: React.FC<Props> = (props) => {

    return (
        <Box sx={{ flexGrow: 1 }} style={{marginBottom:props.isNarrow? '3rem':'4rem'}}>
          <StyledAppBar style={{height:props.isNarrow? '3rem':'4rem'}}>
            <Toolbar>
              <Link to={'/'}
                onClick={()=>props.setPlay(false)}
                style={{ 
                fontSize:props.isNarrow? '1.2rem' : '1.5rem',
                textDecoration: 'none',
                color:'inherit' }}>
                  リアテト
              </Link>
              <div style={{ flexGrow: 1 }}></div>
              <div style={{marginRight:'5rem',display:props.onPlay? 'initial':'none'}}>スコア：{props.scoreState}</div>
            </Toolbar>
          </StyledAppBar>
        </Box>
    );
  };
  
  export default MyAppBar;
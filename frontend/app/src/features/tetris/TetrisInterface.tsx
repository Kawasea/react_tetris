import { Box, Button, IconButton, Modal, Typography} from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useEffect } from "react";
import RotateLeftOutlinedIcon from '@mui/icons-material/RotateLeftOutlined';
import RotateRightOutlinedIcon from '@mui/icons-material/RotateRightOutlined';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import ArrowCircleDownOutlinedIcon from '@mui/icons-material/ArrowCircleDownOutlined';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';

const useStyles = makeStyles((theme) => ({
    interface:{
        margin:'0 auto',
    },
    icons:{
        color:'white',
    }
  }));

  type Props = {
    isWide:boolean,
    isNarrow:boolean,
    updateReady:(count:number)=>void;
    updateGo:(count:number)=>void;
    colorState:number[][];
    getPhase:(n:number)=>string;
    phaseState:string;
    onPlay:boolean;
    switchPlay:()=>void;
    movable:boolean;
    setMovable:(bol:boolean)=>void;
    count:number;
    setCount:(count:number)=>void;
    baseClock:number;
    lotate:(way:string)=>void;
    move:(way:string)=>void;
  };
  

const TetrisInterface: React.FC<Props> = (props) => {
    
    const styles = useStyles();
      
    useEffect(() => {
      if (!props.onPlay) return;

      if (props.phaseState===props.getPhase(0)) {
        const interval = setInterval(() => {
            props.setCount(props.count+1/10);
            props.updateReady(Math.floor(props.count));
        }, props.baseClock/10);
        return () => {
            clearInterval(interval);
        }
      }else if (props.phaseState===props.getPhase(1)) {
        const interval = setInterval(() => {
            props.setCount(props.count+1);
            props.updateGo(Math.floor(props.count));
        }, props.baseClock);
        return () => {
            clearInterval(interval);
        }
      }

      }
    ,[props.onPlay, props.colorState, props]);

    //モーダル設定
    const modalStyle = {
      position: 'absolute' as 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
      p: 4,
    };
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    //

    return (
        <div className={styles.interface}>
        <IconButton onClick={()=>props.lotate('l')} disabled={props.movable?false:true}>
          <RotateLeftOutlinedIcon className={styles.icons} style={{fontSize:props.isNarrow? '2rem' : '2rem'}}/>
        </IconButton>
        <IconButton onClick={()=>props.lotate('r')} disabled={props.movable?false:true}>
          <RotateRightOutlinedIcon className={styles.icons} style={{fontSize:props.isNarrow? '2rem' : '2rem'}}/>
        </IconButton>
        <IconButton onClick={()=>props.move('l')} disabled={props.movable?false:true}>
          <ArrowCircleLeftOutlinedIcon className={styles.icons} style={{fontSize:props.isNarrow? '2rem' : '2rem'}}/>
        </IconButton>
        <IconButton onClick={()=>props.move('d')} disabled={props.movable?false:true}>
          <ArrowCircleDownOutlinedIcon className={styles.icons} style={{fontSize:props.isNarrow? '2rem' : '2rem'}}/>
        </IconButton>
        <IconButton onClick={()=>props.move('r')} disabled={props.movable?false:true}>
          <ArrowCircleRightOutlinedIcon className={styles.icons} style={{fontSize:props.isNarrow? '2rem' : '2rem'}} />
        </IconButton>
          <br/>
          <Button
          style={{fontSize:'1rem',backgroundColor:'black',border:'0.3rem white solid',margin:'1rem auto'}}
          variant="contained"
          onClick={props.switchPlay}>
              {props.onPlay? 'エンド':'スタート'}
          </Button>

          <br />

          <Button onClick={handleOpen} style={{color:'white',fontSize:'1rem',display:props.isWide?'initial':'none'}}>キーボードの操作方法</Button>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modalStyle}>
              <Typography variant="h6">
                回転【 Shift + ← or → 】
              </Typography>
              <Typography variant="h6">
                移動【 ← or ↓ or → 】
              </Typography>
            </Box>
          </Modal>
        
        </div>
    )

};

export default TetrisInterface;
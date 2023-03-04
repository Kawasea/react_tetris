import React, { useMemo, useState } from "react";
import TetrisInterface from "./TetrisInterface";
import { makeStyles} from "@mui/styles";


const useStyles = makeStyles((theme) => ({
    tetris:{
        fontSize:'0',
    },
    tableWide:{
        margin:'0 auto 0 auto',
        borderCollapse:'collapse',
        backgroundColor:'lightgray',
    },
    table:{
        margin:'0 auto 0 auto',
        borderCollapse:'collapse',
        backgroundColor:'lightgray',
        width:'100%',
    },
     cellWide:{ 
        height:'1.5rem',
        width:'1.5rem',
    },
    cell:{ 
        height:'1.5rem',
        width:'1.5rem',
    },
    nextTableWide:{
        display:'inline-block',
        textAlign:'left',
        borderCollapse:'collapse',
        backgroundColor:'lightgray',
        borderTop:'5px black solid',
        borderBottom:'5px black solid',
    },
    nextTable:{
        display:'inline-block',
        textAlign:'left',
        borderCollapse:'collapse',
        backgroundColor:'lightgray',
        borderTop:'5px black solid',
        borderBottom:'5px black solid',
        width:'100%',
    },
     nextCellWide:{
        height:'1.25rem',
        width:'1.25rem',
    },
    nextCell:{
        height:'1.25rem',
        width:'1.25rem',
    },
    nextNames:{
        color:'white',
        fontSize:'1.2rem',
        display:'flex',
        justifyContent:'center',
        marginTop:'0.5rem',
    },
    nextName:{
        margin:'0 1.8rem'
    },
  }));

  type Props ={
    isWide:boolean,
    isNarrow:boolean,
    onPlay:boolean,
    setPlay:(onPlay:boolean)=>void,
    scoreState:number,
    setScoreState:(scoreState:number)=>void,
  }

const Tetris: React.FC<Props> = (props) => {
    const styles = useStyles();
    const maxRow = 20;
    const maxColumn = 10;
    const initialCell = 0;
    const headerCell = 1;
    const hitCell = 0;
    const centerCell = 2;
    const activeNum=10;
    const centerNum=100;
    const headerRow = 4;
    const middleStartColumn = 4;
    const middleEndColumn = 7;
    const continuableAction = 2;
    const baseClocks =[400,300,200,100]
    const spanChangeBaseClocks=[
        100,
        100+100*baseClocks[0]/baseClocks[1],
        100+100*baseClocks[0]/baseClocks[1]+100*baseClocks[1]/baseClocks[2],
    ]
    
    const nextMaxRow = 4;
    const nextMaxColumn = 4;

    const phase = [
        'ready',
        'go',      
    ];
    const getPhase = (n: number) => {
        return phase[n];
        };
 
    const initialColorState = () =>{
        const arr= Array(maxRow).fill(initialCell).map(row => new Array(maxColumn).fill(initialCell));
        for (let i=0;i<headerRow;i++){
            for  (let j=0;j<=maxColumn;j++){
                arr[i][j]=headerCell;
            }
        }
        return arr;
    };
    const getColorArr = () =>{
        const colorArr= Array(maxRow).fill(initialCell).map(row => new Array(maxColumn).fill(initialCell));
        for (let i = 0;i<maxRow;i++){
            for (let j = 0;j<maxColumn;j++){
              colorArr[i][j] = colorState[i][j]
            };
        };
        return colorArr;        
    };
    const initialNextState = () =>{
        const arr= Array(nextMaxRow).fill(initialCell).map(row => new Array(nextMaxColumn).fill(initialCell));
        for (let i=0;i<nextMaxRow;i++){
            for  (let j=0;j<=nextMaxColumn;j++){
                arr[i][j]=headerCell;
            }
        }
        return arr;
    };
    const initializeNextState=()=>{
        let nextArr1=getRandamNextArr(1,nextState1);
        let nextArr2=getRandamNextArr(2,nextState2);
        let nextArr3=getRandamNextArr(3,nextState3);
        setNextState1(nextArr1);
        setNextState2(nextArr2);
        setNextState3(nextArr3);
    };

    const initialCenterState = () =>{
        const arr= [0,0]
        return arr;
    };

    const [phaseState,setPhaseState] =useState<string>(getPhase(0));
    const [isGameOver,setGameOver]=useState<boolean>(false);
    const [colorState,setColorState] = useState<number[][]>(initialColorState);
    const [nextState1,setNextState1] = useState<number[][]>(initialNextState);
    const [nextState2,setNextState2] = useState<number[][]>(initialNextState);
    const [nextState3,setNextState3] = useState<number[][]>(initialNextState);
    const [centerState,setCenterState]=useState<number[]>(initialCenterState);
    const [movable,setMovable]= useState<boolean>(false);
    const [count, setCount] = useState<number>(0);
    const [shape,setShape]=useState<number>(0);
    const [nextShape1,setNextShape1]=useState<number>(0);
    const [nextShape2,setNextShape2]=useState<number>(0);
    const [nextShape3,setNextShape3]=useState<number>(0);
    const [direction,setDirection]=useState<number>(0);
    const [nextDirection1,setNextDirection1]=useState<number>(0);
    const [nextDirection2,setNextDirection2]=useState<number>(0);
    const [nextDirection3,setNextDirection3]=useState<number>(0);
    const [actionCount,setActionCount]=useState<number>(0);
    const [baseClock,setBaseClock]=useState<number>(baseClocks[0]);
    const shapeCenters=[
        //shapePatternと回転位置に応じたヘッダーゾーンの重心座標の三次元配列
        //[shapePattern][回転位置][x or y]
        [
         [2,1],[1,2],[1,2],[2,1]
        ],
        [
         [1,1],[1,2],[2,2],[2,1]
        ],
        [
         [2,1],[1,1],[1,2],[1,2]
        ],
        [
         [2,1],[1,1],[1,2],[2,2]
        ],
        [
         [2,2],[2,1],[1,1],[1,2]
        ],
        [
         [1,1],[1,1],[1,2],[2,2]
        ],
        [
         [1,2],[2,1],[1,1],[1,2]
        ],

    ]
    const shapeParts =[
        //初期位置、右、下、左の時計回り順
        //shapePatternと回転位置に応じた重心から見た相対座標の四次元配列
        //[shapePattern][回転位置][重心以外のパーツ数][row or col]
        [
         [[0,-1],[0,1],[0,2]],
         [[-1,0],[1,0],[2,0]],
         [[0,-2],[0,-1],[0,1]],
         [[-2,0],[-1,0],[1,0]]
        ],
        [
         [[0,1],[1,0],[1,1]],
         [[0,-1],[1,-1],[1,0]],
         [[-1,-1],[-1,0],[0,-1]],
         [[-1,0],[-1,1],[0,1]],
        ],
        [
         [[-1,0],[0,-1],[0,1]],
         [[-1,0],[0,1],[1,0]],
         [[0,-1],[0,1],[1,0]],
         [[-1,0],[0,-1],[1,0]],
        ],
        [
         [[-2,0],[-1,0],[0,1]],
         [[1,0],[0,1],[0,2]],
         [[0,-1],[1,0],[2,0]],
         [[0,-2],[0,-1],[-1,0]],
        ],
        [
         [[-2,0],[-1,0],[0,-1]],
         [[-1,0],[0,1],[0,2]],
         [[0,1],[1,0],[2,0]],
         [[0,-2],[0,-1],[1,0]],
        ],
        [
         [[-1,0],[0,1],[1,1]],
         [[1,-1],[1,0],[0,1]],
         [[-1,-1],[0,-1],[1,0]],
         [[0,-1],[-1,0],[-1,1]],
        ],
        [
         [[-1,0],[0,-1],[1,-1]],
         [[-1,-1],[-1,0],[0,1]],
         [[1,0],[0,1],[-1,1]],
         [[0,-1],[1,0],[1,1]],
        ],
    ]
// □■□□
//　　
//　■□
//　□□
//
//   □
//  □■□
//
//  □
//  □
//  ■□
//
//   □
//   □
//  □■
//
//  □
//  ■□
//   □
//
//   □
//  □■
//  □



    const startGame = () =>{
        props.setPlay(true);
        props.setScoreState(0);
        setGameOver(false);
        setMovable(true);
        setCount(0);
        setBaseClock(baseClocks[0]);
        setPhaseState(getPhase(0));
        setColorState(initialColorState);
        setDirection(0);
        
        initializeNextState();
    }
    const gameOver = ()=>{
        alert(`スコアは${props.scoreState}点でした！`);
        props.setPlay(false);
        setGameOver(false);
        setMovable(false);
        setColorState(initialColorState);
        setNextState1(initialColorState);
        setNextState2(initialColorState);
        setNextState3(initialColorState);
     };

    const switchPlay = () =>{
        if (!props.onPlay) startGame();
        if (props.onPlay) gameOver(); 
    }



    const colors = [
        'none',
        '#37474f',
        'linear-gradient(45deg, #f50057 30%, #ff7474 90%)',
        'linear-gradient(45deg, #651fff 30%, #21CBF3 90%)',
        'linear-gradient(45deg, #00a152 30%, #33eb91 90%)',
        'linear-gradient(45deg, #ff9100 30%, #ffcf33 90%)',
    ];
    const nextColors = [
        'none',
        '#37474f',
        'linear-gradient(45deg, #f50057 30%, #ff7474 90%)',
        'linear-gradient(45deg, #651fff 30%, #21CBF3 90%)',
        'linear-gradient(45deg, #00a152 30%, #33eb91 90%)',
        'linear-gradient(45deg, #ff9100 30%, #ffcf33 90%)',
    ];
    const randamColor = () =>{
        const rangeArr = [2,colors.length-1];
        return Math.floor(Math.random() * (rangeArr[1] - rangeArr[0] + 1) + rangeArr[0]);
    }
    const randamShape = () =>{
        const rangeArr = [0,shapeCenters.length-1];
        return Math.floor(Math.random() * (rangeArr[1] - rangeArr[0] + 1) + rangeArr[0]);
    }
    const randamDirection = () =>{
        const rangeArr = [0,3];
        return Math.floor(Math.random() * (rangeArr[1] - rangeArr[0] + 1) + rangeArr[0]);
    }
    const getColor = (n: number) => {
        if(n>=centerNum){n-=centerNum}
        if(n>=activeNum){n-=activeNum}
        return colors[n];
    };
    const getNextColor = (n: number) => {
        if(n>=centerNum){n-=centerNum}
        if(n>=activeNum){n-=activeNum}
        return nextColors[n];
    };


     const tableLine = (i:number)=> {
        const line:JSX.Element[]=[]
        for (let j =0;j<maxColumn;j++){
            line.push(<td key={j+1} className={props.isNarrow? styles.cell : styles.cellWide} style={{background:getColor(colorState[i][j])}} />);
        };
        return line;
     };
     const tableLines =() =>{
        const lines:JSX.Element[]=[]
        for (let i =headerRow;i<maxRow;i++){
            lines.push(
            <tr key={i+1}>
                {tableLine(i)}
            </tr>
            )
         };
         return lines;
     };
     const tableCells=useMemo(()=> {
        return(
            <table className={styles.tableWide}>
               <tbody>
                {tableLines()}
               </tbody>
            </table>
        ) ;
     },[nextState1,nextState2,nextState3,colorState,props.isWide,props.isNarrow]);

     const nextLine = (n:number,i:number)=> {
        const line:JSX.Element[]=[]
        for (let j =0;j<nextMaxColumn;j++){
            line.push(<td key={j+1} className={props.isNarrow? styles.nextCell : styles.nextCellWide} 
                          style={{background:getNextColor(n===1?nextState1[i][j]:
                                                          n===2?nextState2[i][j]:
                                                                nextState3[i][j])}} />);
        };
        return line;
     };
     const nextLines =(n:number) =>{
        const lines:JSX.Element[]=[]
        for (let i =0;i<nextMaxRow;i++){
            lines.push(
            <tr key={i+1}>
                {nextLine(n,i)}
            </tr>
            )
         };
         return lines;
     };
     const nextCells=useMemo(()=> {
        return(
            <>
            <table className={styles.nextTableWide}>
               <tbody>
                {nextLines(1)}
               </tbody>
            </table>
            <table className={styles.nextTableWide}>
                <tbody>
                {nextLines(2)}
                </tbody>
            </table>
            <table className={styles.nextTableWide}>
                <tbody>
                {nextLines(3)}
                </tbody>
            </table>
        </>
        ) ;
     },[nextState1,nextState2,nextState3,colorState,props.isWide,props.isNarrow]);


     const getShape=(n:number)=>{
        const shapeArr= Array(headerRow).fill(headerCell).map(row => new Array(middleEndColumn-middleStartColumn+1).fill(headerCell));
        const shapePattern = randamShape();
        const shapeDirection = randamDirection();
        
        if (n===1){
            setNextShape1(shapePattern);
            setNextDirection1(shapeDirection);
        }else if (n===2){
            setNextShape2(shapePattern);
            setNextDirection2(shapeDirection);
        }else if (n===3){
            setNextShape3(shapePattern);
            setNextDirection3(shapeDirection);
        }
        const centerArr = shapeCenters[shapePattern][shapeDirection];
        const partArr = shapeParts[shapePattern][shapeDirection];

        shapeArr[centerArr[0]][centerArr[1]]=centerCell;
        for (let i = 0;i<partArr.length;i++){
            shapeArr[centerArr[0]+partArr[i][0]][centerArr[1]+partArr[i][1]]=hitCell;
        };   
        return shapeArr;
     };

     const checkErasable = (colorArr:number[][])=>{
         let getScore = 0;
         let chainErase = 0;
        
        for (let i = maxRow-1;i>=headerRow;i--){
          let cluster=0;
          let maxCombColor=1;
          let combColor=1;

          for (let j = 0;j<maxColumn;j++){
             if (colorArr[i][j]!==initialCell) {cluster+=1;}
          };

          if (cluster===maxColumn){
                for (let k = i;k>=headerRow;k--){
                    //消す前に採点
                    for (let m = 0;m<maxColumn;m++){
                        if (k===i){
                            if (m>=1){
                                if(colorArr[k][m-1]===colorArr[k][m]){
                                  combColor += 1;
                                  if (maxCombColor<combColor){maxCombColor=combColor;}
                                }else{
                                  combColor = 1;
                                }
                            }
                        }
                    };
                    //消す
                    for (let m = 0;m<maxColumn;m++){


                       if(k===headerRow){
                            colorArr[k][m]=initialCell;
                        }else{
                            colorArr[k][m]=colorArr[k-1][m];
                        }    
                    };
                };
                chainErase+=1
                getScore+=100*chainErase+10*maxCombColor
                i+=1;
            };            
        }
        props.setScoreState(props.scoreState+getScore);
        setColorState(colorArr);
    };  
        
     const checkDroppable = (colorArr:number[][])=>{
        let droppable = true;

        for (let i = maxRow-1;i>0;i--){
            if (i<maxRow-1){
                for (let j = 0;j<maxColumn;j++){
                    if(colorArr[i][j]>=activeNum
                      && colorArr[i+1][j]<activeNum
                      && (colorArr[i+1][j]!==initialCell && colorArr[i+1][j]!==headerCell)){
                        droppable=false;
                        setMovable(false);
                        break;
                    }
                };
            }
            else if (i===maxRow-1){
                 for (let j = 0;j<maxColumn;j++){
                     if(colorArr[i][j]>=activeNum){
                        droppable=false;
                        setMovable(false);
                        break;
                     }
                 };
            }
            if (!droppable) break;
        };    
        return droppable;
     };
     const stopColorState = (colorArr:number[][])=>{
        for (let i = 0;i<maxRow;i++){
            for (let j = 0;j<maxColumn;j++){
              if (colorArr[i][j]>=activeNum) {
                  if (i<headerRow) {setGameOver(true);return colorArr;}
                  
                  if (colorArr[i][j]>=centerNum) {
                      colorArr[i][j]-=centerNum;
                  }else{
                      colorArr[i][j]-=activeNum;}
              }
            }
        }
        return colorArr;
     };

     const getRandamColorArr = (colorArr:number[][],nextArr:number[][])=>{
        for (let i = 0;i<headerRow;i++){
            for (let j = middleStartColumn-1;j<=middleEndColumn-1;j++){
                if (nextArr[i][j-middleStartColumn+1]>=centerNum){
                  setCenterState([i,j]);
                }
                colorArr[i][j] = nextArr[i][j-middleStartColumn+1];
            };
        };  
        return colorArr;
     };
     const getRandamNextArr = (n:number,nextArr:number[][])=>{
        const color = randamColor();
        const shapeArr = getShape(n);
        for (let i = 0;i<nextMaxRow;i++){
            for (let j = 0;j<nextMaxColumn;j++){
                if (shapeArr[i][j]===centerCell){
                  nextArr[i][j] = color+centerNum;
                }else if (shapeArr[i][j]===hitCell){
                  nextArr[i][j] = color+activeNum;
                }
                else{
                  nextArr[i][j] = headerCell;
                }
            };
        };  
        return nextArr;
     };
     
     const changePace = (count:number)=>{
         let level = 0;
         for(let i=0;i<baseClocks.length-1;i++){
             if(baseClock===baseClocks[i]){level=i+1;break;}
         };
         if(count>=spanChangeBaseClocks[level-1]){setBaseClock(baseClocks[level])}
     };



     const updateReady=(c:number)=>{
        if (isGameOver){gameOver();return;}

        setPhaseState(getPhase(1));
        
        let colorArr= getColorArr();
        colorArr = getRandamColorArr(colorArr,nextState1);
        
        setColorState(colorArr);
        setNextState1(nextState2);
        setNextState2(nextState3);
        setShape(nextShape1);
        setNextShape1(nextShape2);
        setNextShape2(nextShape3);
        setDirection(nextDirection1);
        setNextDirection1(nextDirection2);
        setNextDirection2(nextDirection3);
        setNextState3(getRandamNextArr(3,initialNextState()));

     };

     const updateGo=(c:number)=>{
        const colorArr= getColorArr();
        setActionCount(0);
        setMovable(true);

        changePace(count);

        if (!checkDroppable(colorArr)){
            setPhaseState(getPhase(0));
            checkErasable(stopColorState(colorArr));
            return ;
        }
            
        for (let i = maxRow-1;i>=0;i--){
            if (i<headerRow){
                for (let j = middleStartColumn-1;j<=middleEndColumn-1;j++){
                        colorArr[i][j]= i===0? headerCell:colorState[i-1][j];
                };
            }
            if (i>=headerRow){
                 for (let j = 0;j<maxColumn;j++){
                     if(colorArr[i-1][j]>=activeNum){
                      colorArr[i][j]=colorState[i-1][j];
                      if (i>headerRow)colorArr[i-1][j]=initialCell; 
                     }
                 };
            }
        };
        
        if (!checkDroppable(colorArr)){
           setPhaseState(getPhase(0));
           checkErasable(stopColorState(colorArr));
        }else{
        setCenterState([centerState[0]+1,centerState[1]])
        setColorState(colorArr);
        }
    };
    const lotation=(colorArr:number[][],colorNum:number,newDirection:number)=>{

        for (let i=0;i<shapeParts[shape][direction].length;i++){
            if(centerState[0]+shapeParts[shape][direction][i][0]<headerRow
            ||centerState[0]+shapeParts[shape][newDirection][i][0]<headerRow)
            {return;}
           };
        for (let i=0;i<shapeParts[shape][newDirection].length;i++){
            if(centerState[0]+shapeParts[shape][newDirection][i][0]<headerRow
            || centerState[0]+shapeParts[shape][newDirection][i][0]>=maxRow
            || centerState[1]+shapeParts[shape][newDirection][i][1]<0
            || centerState[1]+shapeParts[shape][newDirection][i][1]>=maxColumn
            || (colorArr[centerState[0]+shapeParts[shape][newDirection][i][0]]
                        [centerState[1]+shapeParts[shape][newDirection][i][1]]<activeNum
                && colorArr[centerState[0]+shapeParts[shape][newDirection][i][0]]
                            [centerState[1]+shapeParts[shape][newDirection][i][1]]!==initialCell))
            {return;}     
        };

        colorArr[centerState[0]][centerState[1]]=initialCell;
        for (let i=0;i<shapeParts[shape][direction].length;i++){
                colorArr[centerState[0]+shapeParts[shape][direction][i][0]]
                        [centerState[1]+shapeParts[shape][direction][i][1]]=initialCell;
        };
        for (let i=0;i<shapeParts[shape][newDirection].length;i++){
                colorArr[centerState[0]+shapeParts[shape][newDirection][i][0]]
                        [centerState[1]+shapeParts[shape][newDirection][i][1]]=colorNum+activeNum;
        };

        colorArr[centerState[0]][centerState[1]]=colorNum+centerNum;
        setDirection(newDirection);
        setColorState(colorArr);
    }
    const lotate=(way:string)=>{
        if (actionCount>=continuableAction){return;}

        const colorArr = getColorArr();
        if (!checkDroppable(colorArr)){return;}
        const colorNum=colorState[centerState[0]][centerState[1]]-centerNum;
        let newDirection =direction;

        if (way === 'r'){ 
          newDirection += 1;
          if (newDirection>3)newDirection=0;
        } 
        else if (way==='l'){
          newDirection -= 1;
          if (newDirection<0)newDirection=3;
        }
        setActionCount(actionCount+1);
        lotation(colorArr,colorNum,newDirection);
    };

    const movement=(colorArr:number[][],colorNum:number,newCenter:number[],actionCountReset:boolean)=>{

        for (let i=0;i<shapeParts[shape][direction].length;i++){
            if(newCenter[0]+shapeParts[shape][direction][i][0]<headerRow
            || newCenter[0]+shapeParts[shape][direction][i][0]>=maxRow
            || newCenter[1]+shapeParts[shape][direction][i][1]<0
            || newCenter[1]+shapeParts[shape][direction][i][1]>=maxColumn
            || (colorArr[newCenter[0]+shapeParts[shape][direction][i][0]]
                        [newCenter[1]+shapeParts[shape][direction][i][1]]<activeNum
                && colorArr[newCenter[0]+shapeParts[shape][direction][i][0]]
                            [newCenter[1]+shapeParts[shape][direction][i][1]]!==initialCell))
            {return;}     
        };

        colorArr[centerState[0]][centerState[1]]=initialCell;
        for (let i=0;i<shapeParts[shape][direction].length;i++){
                colorArr[centerState[0]+shapeParts[shape][direction][i][0]]
                        [centerState[1]+shapeParts[shape][direction][i][1]]=initialCell;
        };
        for (let i=0;i<shapeParts[shape][direction].length;i++){
                colorArr[newCenter[0]+shapeParts[shape][direction][i][0]]
                        [newCenter[1]+shapeParts[shape][direction][i][1]]=colorNum+activeNum;
        };

        colorArr[newCenter[0]][newCenter[1]]=colorNum+centerNum;
        setCenterState(newCenter);
        setColorState(colorArr);
        setActionCount(actionCountReset? 0 : actionCount+1);
    };
    const move=(way:string)=>{
      if (actionCount>=continuableAction)return;

      const colorArr = getColorArr();
      
      const colorNum=colorState[centerState[0]][centerState[1]]-centerNum;
      for (let i=0;i<shapeParts[shape][direction].length;i++){
       if(centerState[0]+shapeParts[shape][direction][i][0]<headerRow)
       {return;}
      };
      
      let newCenter:number[] = [0,0];
      if (way === 'r')
      {
        newCenter=[centerState[0],centerState[1]+1];
        movement(colorArr,colorNum,newCenter,false);
      }
      else if (way==='l')
      { 
        newCenter=[centerState[0],centerState[1]-1];
        movement(colorArr,colorNum,newCenter,false);
      } 
      else if (way==='d')
      {
        if (!checkDroppable(colorArr)){return;}
        newCenter=[centerState[0]+1,centerState[1]];
        movement(colorArr,colorNum,newCenter,true);
      }
    };


           window.onkeydown = (e) => {

               if(!movable)return false;
               
               if (e.shiftKey) {
                    if (e.key === 'ArrowLeft') {
                        lotate('l');
                    } else if (e.key === 'ArrowRight') {
                        lotate('r');
                    }
               } else if (e.key === 'ArrowLeft') {
                 move('l');
               } else if (e.key === 'ArrowDown') {
                 move('d');
               } else if (e.key === 'ArrowRight') {
                 move('r');
               }
               return false;
           };  
 
           
    
    return (
        <div className={styles.tetris}>
             <div className={styles.nextNames}>
                <p className={styles.nextName}>②</p>
                <p className={styles.nextName}>③</p>
                <p className={styles.nextName}>④</p>
            </div>
            {nextCells}
            {tableCells}
            <TetrisInterface
            isWide={props.isWide}
            isNarrow={props.isNarrow}
            updateReady={updateReady}
            updateGo={updateGo}
            colorState={colorState}
            getPhase={getPhase}
            phaseState={phaseState}
            onPlay={props.onPlay}
            switchPlay={switchPlay}
            movable={movable}
            setMovable={setMovable}
            count={count}
            setCount={setCount}
            baseClock={baseClock}
            lotate={lotate}
            move={move}
            />
        </div>
    )

};

export default Tetris;
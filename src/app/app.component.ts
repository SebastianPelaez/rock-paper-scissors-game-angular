import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { stringify } from '@angular/core/src/util';
import {GameService} from './service'
import { HttpClient, HttpParams } from '@angular/common/http';
import {Games} from './game.model'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ GameService ],
})
export class AppComponent implements OnInit {

  game: Games = { Round: 1, PlayerOneName: "",  PlayerOneOption: -1, PlayerTwoName: "", PlayerTwoOption: -1, Winner: ""};
  gameMode : string = "";
  playerName: string = 'You';
  player2Name: string = "Machine"
  gameStarted: boolean = false;
  playerOneScoreColor: string = "primary";
  playerOneScoreValue: number = 0;
  playerTwoScoreColor: string = "primary";
  playerTwoScoreValue: number = 0;
  loading: boolean = false;
  playerOneSelection:number = -1;
  playerTwoSelection:number = -1;
  machineSelection: number = -1;
  finalResult: number = -1;
  firtsMove: boolean= false;
  endGame: boolean = false;
  winningPlayer: string = "";
  currentRound: number = 1;
  currentPlayer: string = this.playerName;
  isP1Turn: boolean = true;
  lastWinningPlayer: string = "";
  gamesSummary: Array<Games> = [];
  easterEgg: boolean = false;

  @ViewChild('txtPlayerName') txtPlayerName: ElementRef;
  @ViewChild('rock') rock: ElementRef; 
  @ViewChild('paper') paper: ElementRef; 
  @ViewChild('scissors') scissors: ElementRef; 
  @ViewChild('rock2') rock2: ElementRef; 
  @ViewChild('paper2') paper2: ElementRef; 
  @ViewChild('scissors2') scissors2: ElementRef; 

  constructor(private service: GameService) { }

  ngOnInit(): void {    
  }

  playWithMachine() {
    if (this.playerName == "") {
      alert("Player name is required");
      this.txtPlayerName.nativeElement.focus();
      return;
    }
    this.player2Name = "Machine";
    this.gameMode = "vMachine"
    this.gameStarted = true;
  }

  playWithFriend(){

    if (this.playerName == "") {
      alert("Player name is required");
      this.txtPlayerName.nativeElement.focus();
      return;
    }

    if (this.player2Name == "") {
      alert("Player name 2 is required");
      this.txtPlayerName.nativeElement.focus();
      return;
    }

    this.gameMode = "vPlayer"
    this.gameStarted = true;

  
  }

  playerOnePick(option: number){

    if(this.gameMode == "vMachine"){
      if(this.loading) return;
      
      this.changeStatus(option);

      this.firtsMove = true;
      this.loading = true;
      this.playerOneSelection = option;

      setTimeout( () => {
        this.loading = false;        
        const randomNum =  Math.floor(Math.random() * 3 ) ;
        this.machineSelection = randomNum;
        this.validateResult();      
      },  Math.floor(Math.random()  * 500 ) +200);

    }else{
      this.changeStatus(option);
      this.currentPlayer = this.player2Name;
      this.playerOneSelection = option;
      this.isP1Turn = false;
    }
  }

  playerTwoPick(option: number){
    this.playerTwoSelection = option;
    this.changePlayerTwoStatus(option);
    this.loading = true;  
    this.isP1Turn = true;
    this.startFight();
  }


  validateResult(){

    if(this.machineSelection == this.playerOneSelection){
      this.finalResult = 0;
    }else if((this.playerOneSelection - this.machineSelection + 3)% 3 == 1){      
      this.finalResult = 1;
      this.playerOneScoreValue += 20;
      this.lastWinningPlayer = this.playerName;
      this.validateFinalWinner();
      
    }else{
      this.finalResult = 1;
      this.playerTwoScoreValue += 20;
      this.lastWinningPlayer = this.player2Name;
      this.validateFinalWinner();      
    }

  }
  validateFinalWinner(){
    if(this.playerOneScoreValue == 100){
      this.endGame = true;
      this.winningPlayer = this.playerName;
      return;
    }
    if(this.playerTwoScoreValue == 100){
      this.endGame = true;
      this.winningPlayer = this.player2Name;
      return;
    }
  }
  changeStatus(option:number){

    if(option == 0){
      this.rock.nativeElement.src = "../assets/hand_2_select.svg";
      this.paper.nativeElement.src = "../assets/hand_3_unselect.svg";
      this.scissors.nativeElement.src = "../assets/hand_4_unselect.svg";
    }

    if(option == 1){
      this.rock.nativeElement.src = "../assets/hand_2_unselect.svg";
      this.paper.nativeElement.src = "../assets/hand_3_select.svg";
      this.scissors.nativeElement.src = "../assets/hand_4_unselect.svg";
    }

    if(option == 2){
      this.rock.nativeElement.src = "../assets/hand_2_unselect.svg";
      this.paper.nativeElement.src = "../assets/hand_3_unselect.svg";
      this.scissors.nativeElement.src = "../assets/hand_4_select.svg";
    }

  }
  changePlayerTwoStatus(option:number){
    if(option == 0){
      this.rock2.nativeElement.src = "../assets/hand_2_select.svg";
      this.paper2.nativeElement.src = "../assets/hand_3_unselect.svg";
      this.scissors2.nativeElement.src = "../assets/hand_4_unselect.svg";
    }

    if(option == 1){
      this.rock2.nativeElement.src = "../assets/hand_2_unselect.svg";
      this.paper2.nativeElement.src = "../assets/hand_3_select.svg";
      this.scissors2.nativeElement.src = "../assets/hand_4_unselect.svg";
    }

    if(option == 2){
      this.rock2.nativeElement.src = "../assets/hand_2_unselect.svg";
      this.paper2.nativeElement.src = "../assets/hand_3_unselect.svg";
      this.scissors2.nativeElement.src = "../assets/hand_4_select.svg";
    }
  }

  startFight(){

    this.game.Round = this.currentRound;
    this.game.PlayerOneName = this.playerName;
    this.game.PlayerOneOption = this.playerOneSelection;
    this.game.PlayerTwoName = this.player2Name;
    this.game.PlayerTwoOption = this.playerTwoSelection;

    this.service.startGame(this.game).subscribe(
      (response: any) => {
          
        if(response != ""){
          this.loading = false;
          let result: Games = JSON.parse(response);
          this.renderWinner(result);
          if(result.Winner == null){
            result.Winner = "Tied";
            this.finalResult = 0;
          }else{
            this.finalResult = 1;
          }
          this.gamesSummary.push(result);
          this.currentRound += 1;
          this.lastWinningPlayer = result.Winner;
          

          console.log(response);
        }else{
          this.handleErrors("Error: Empty response");
        }         
      }, 
      (error: any) => {
          console.log(error)
          this.handleErrors(error.message);
      })
  }
  renderWinner(result: Games){
    
    if(result.Winner == this.playerName){
      this.finalResult = 1;
      this.playerOneScoreValue += 20;
    }

    if(result.Winner == this.player2Name){
      this.finalResult = 2;
      this.playerTwoScoreValue += 20;
    }

    if(result.Winner == null){
      this.finalResult = 0;
    }

    this.currentPlayer = this.playerName;   
    this.validateFinalWinner();
  }

  handleErrors(message:string){
    alert(message);
  }

  playAgain(){

    this.game= { Round: 1, PlayerOneName: "",  PlayerOneOption: -1, PlayerTwoName: "", PlayerTwoOption: -1, Winner: ""};
    this.gameMode  = "";
    this.playerName = 'You';
    this.player2Name = "Machine"
    this.gameStarted = false;
    this.playerOneScoreColor = "primary";
    this.playerOneScoreValue = 0;
    this.playerTwoScoreColor = "primary";
    this.playerTwoScoreValue = 0;
    this.loading = false;
    this.playerOneSelection = -1;
    this.playerTwoSelection = -1;
    this.machineSelection = -1;
    this.finalResult = -1;
    this.firtsMove= false;
    this.endGame = false;
    this.winningPlayer = "";
    this.currentRound = 1;
    this.currentPlayer = this.playerName;
    this.isP1Turn = true;
    this.gamesSummary = [];

    this.rock.nativeElement.src = "../assets/hand_2_unselect.svg";
    this.paper.nativeElement.src = "../assets/hand_3_unselect.svg";
    this.scissors.nativeElement.src = "../assets/hand_4_unselect.svg";
    this.rock2.nativeElement.src = "../assets/hand_2_unselect.svg";
    this.paper2.nativeElement.src = "../assets/hand_3_unselect.svg";
    this.scissors2.nativeElement.src = "../assets/hand_4_unselect.svg";

  }
  enabledEasterEgg(){
    this.easterEgg = true;
  }

}

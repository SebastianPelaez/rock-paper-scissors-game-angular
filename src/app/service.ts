import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import {Games} from './game.model'

 const headers = new HttpHeaders({'Content-Type':  'application/json','Authorization': 'my-auth-token'})

  @Injectable()
  export class GameService {
    
    //gameUrl = 'https://localhost:44379/api/game';
    gameUrl = 'https://gameapicore.azurewebsites.net/api/game';
    
    response = "";
    constructor(private http: HttpClient){}

    startGame(body: Games) {    
      const url = `${this.gameUrl}/StartGame`;
      return this.http.post(url, body, { headers, responseType: 'text'});
    }
  }
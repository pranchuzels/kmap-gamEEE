import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { StartComponent } from './start/start.component';
import { KmapTableComponent} from './kmap-table/kmap-table.component';
import { KmapGeneratorService } from './kmap-generator.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule, StartComponent, KmapTableComponent]
})
export class AppComponent implements OnInit{
  title = 'K-Map GamEEE';

  startedGame: boolean = false;

  username: string = '';
  score: number = 0;
  difficulty: number = 0;
  form: string = 'min';
  num_var: number = 0;
  terms: number[] = [];
  dont_cares: number[] = [];
  result: number = -10;
  groupings: number[][] = [];
  answers: string[] = [];

  state: number = 0;
  constructor(private kmapGeneratorService: KmapGeneratorService) {
  }

  ngOnInit(): void {
    this.state == 0;
  }

  startGame(state: number): void {
    this.state = state;
  }

  checkUser(username: string) {
    const usernameValue = { username: username };
    this.kmapGeneratorService.postCheckUser(usernameValue).subscribe(item => {
      this.username = (item.username);
      this.score = (item.score);
      this.difficulty = (item.difficulty);
      this.num_var = (item.q_num_var);
      this.form = (item.q_form);
      this.terms = (item.q_terms);
      this.dont_cares = (item.q_dont_cares);
      this.groupings = (item.q_groupings);
    });

    this.startedGame = true;
  }

  changeUserData(result: number): void {
    const request = { 
      type: 1,
      user: {
      username: this.username,
      score: this.score,
      difficulty: this.difficulty,
      result: result}};
    this.kmapGeneratorService.postCheckAnswer(request).pipe(
      catchError(error => {
        if (error.status === 500) {
          this.result = -4; // Set a specific result value for HTTP 500 error
        }
        return of(null); // Return an observable with a null value
      })
    ).subscribe(item => {
      if (item) {
        this.result = item.result;
        this.username = item.user.username;
        this.score = item.user.score;
        this.difficulty = item.user.difficulty;
        this.num_var = item.user.q_num_var;
        this.form = item.user.q_form;
        this.terms = item.user.q_terms;
        this.dont_cares = item.user.q_dont_cares;
        this.groupings = item.user.q_groupings;
      }
    });
  }

  checkAnswer(answer: string) {
    const request = { 
      type: 0,
      user: {
      username: this.username,
      score: this.score,
      difficulty: this.difficulty,
      q_num_var: this.num_var,
      q_form: this.form,
      q_terms: this.terms,
      q_dont_cares: this.dont_cares,
      q_groupings: this.groupings,
      answer: answer} };
    this.kmapGeneratorService.postCheckAnswer(request).pipe(
      catchError(error => {
        if (error.status === 500) {
          this.result = -4; // Set a specific result value for HTTP 500 error
        }
        return of(null); // Return an observable with a null value
      })
    ).subscribe(item => {
      if (item) {
        this.result = item.result;
        this.answers = item.answers;
      }
    });
  }
}

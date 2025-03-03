import { Component, AfterViewInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { trigger, state, style, transition, animate, AnimationEvent } from '@angular/animations';

@Component({
  selector: 'app-start',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './start.component.html',
  styleUrl: './start.component.css',
  animations: [
    trigger('view', [
      state('shown', style({ opacity: 1, transform: 'translateY(-10px)'})),
      state('hidden', style({ opacity: 0, transform: 'translateY(10px)'})),
      transition('hidden => shown', [animate('0.5s ease-out')]),
      transition('shown => hidden', [animate('0.5s ease-in')])
    ]),
  ]
})
export class StartComponent implements AfterViewInit, OnChanges{
  @Input() checkedUsername: boolean = false;
  @Output() startGame = new EventEmitter<number>();
  @Output() emitUsername = new EventEmitter<string>();
  submitted = false;
  showStart = 'hidden';
  

  applyForm = new FormGroup({
    username: new FormControl("", Validators.required)
  });


  constructor() {}

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.showStart = 'shown';
    }, 200);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['checkedUsername'] && changes['checkedUsername'].currentValue == true) {
      this.showStart = 'hidden';
    }
  }

  submitName(): void {
    this.submitted = true;
    if (this.applyForm.valid) {
      this.emitUsername.emit(this.applyForm.value.username || undefined);
    }
  }

  get username() { // get username from 
    return this.applyForm.get('username');
  }

  onAnimationDone(event: AnimationEvent): void {
    if (event.fromState == 'shown' && event.toState == 'hidden') {
      this.startGame.emit(1);
    }
  }

}

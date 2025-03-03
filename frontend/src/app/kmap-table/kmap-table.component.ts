import { ChangeDetectorRef, Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kmap-table',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './kmap-table.component.html',
  styleUrl: './kmap-table.component.css'
})
export class KmapTableComponent implements OnChanges {
  @Input() username: string = '';
  @Input() score: number = 0;
  @Input() difficulty: number = 0
  @Input() num_var: number = 0;
  @Input() form: string = '';
  @Input() terms: number[] = [];
  @Input() dont_cares: number[] = [];
  @Input() result: number = -10;
  @Output() emitAnswer = new EventEmitter<string>();
  
  answerForm: FormGroup;
  submitted = false;  

  constructor(private cdref: ChangeDetectorRef) {
    this.answerForm = new FormGroup({
      answer: new FormControl('', Validators.required)
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['score'] || changes['result']) { // catch all for updates
      this.cdref.detectChanges();
    }
    if (this.result == 1 && changes['score'].previousValue + 1 == changes['score'].currentValue) {
      this.answerForm.reset();
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.answerForm.valid) {
      const answer = this.answerForm.value.answer;
      this.emitAnswer.emit(answer);
      this.answerForm.markAsPristine();
    } else {
      // Handle the invalid form
    }
  }

  getQuestion(): string {
    return this.form === 'min' ? 'Find the minimal SOP.' : 'Find the minimal POS.';
  }

  generateKmapTitles(){
    var titles: string[][] = [];
    if (this.num_var == 5) {
      titles = [["A = 0", "A = 1"]];
    } else if (this.num_var == 6) {
      titles = [["AB = 00", "AB = 01",], [ "AB = 10", "AB = 11"]];
    }

    return titles;
  }

  generateKmap() {
    const size = Math.pow(2, this.num_var);
    var h_size = 0;
    var i_size = 0;
    var j_size = 0;
    var k_size = 0;
    var titles = [];

    if (this.num_var == 2) {
      h_size = 1;
      i_size = 1;
      j_size = 2;
      k_size = 2;
    } else if (this.num_var == 3) {
      h_size = 1;
      i_size = 1;
      j_size = 2;
      k_size = 4;
    } else  if (this.num_var == 4) {
      h_size = 1;
      i_size = 1;
      j_size = 4;
      k_size = 4;
    } else  if (this.num_var == 5) {
      h_size = 1;
      i_size = 2;
      j_size = 4;
      k_size = 4;
      titles = [["A = 0", "A = 1"]];
    } else  if (this.num_var == 6) {
      h_size = 2;
      i_size = 2;
      j_size = 4;
      k_size = 4;
      titles = [["AB = 00", "AB = 01",], [ "AB = 10", "AB = 11"]];
    }

    const kmap = Array.from({ length: h_size } , () => Array.from({ length: i_size } , () => Array.from({ length: j_size }, () => Array(k_size).fill(''))));
    const kmap_index = [0, 1, 3, 2];

    for (let h = 0; h < h_size; h++) {  
      for (let i = 0; i < i_size; i++) {
        for (let j = 0; j < j_size; j++) {
          for (let k = 0; k < k_size; k++) {
            const index = (h << 5) + (i << 4) + (j << 2) + k;
            if (this.dont_cares.includes(index)) {
              kmap[kmap_index[h]][kmap_index[i]][kmap_index[j]][kmap_index[k]] = 'X';
            } else if (this.terms.includes(index)) {
              kmap[kmap_index[h]][kmap_index[i]][kmap_index[j]][kmap_index[k]] = this.form === 'min' ? '1' : '0';
            } else {  
              kmap[kmap_index[h]][kmap_index[i]][kmap_index[j]][kmap_index[k]] = this.form === 'min' ? '0' : '1';
            }
          }
        }
      }
    }

    for (let h = 0; h < h_size; h++) {   // per tablerow
      for (let i = 0; i < i_size; i++) { // per table
        for (let j = 0; j < j_size; j++) { // per row
          kmap[h][i][j].reverse().push(kmap_index[j].toString(2).padStart(Math.log2(j_size), '0'));
          kmap[h][i][j].reverse();
        }

        var arr = [];
        for(let a = 0; a < k_size + 1; a++) {
          if (a == 0) {
            var vars = ""
            for (let b = (h_size + i_size - 2); b < this.num_var; b++) {
              if (b == Math.floor((this.num_var + h_size + i_size - 2) / 2)) {
                vars = vars.concat("", "\\");
              }
              vars = vars.concat("", String.fromCharCode(65 + b));
            }
            arr.push(vars);
          }
          else {
            arr.push(kmap_index[a-1].toString(2).padStart(Math.log2(k_size), '0'));
          }
        }
        kmap[h][i].reverse().push(arr);
        kmap[h][i].reverse();
      }
      
    }

    return kmap;
  }
}

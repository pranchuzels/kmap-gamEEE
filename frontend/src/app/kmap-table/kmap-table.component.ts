import { ChangeDetectorRef, Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators, NgForm } from '@angular/forms';
import { CommonModule} from '@angular/common';
import { PxfObject } from 'node:tls';
import { group } from 'node:console';

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
  @Input() groupings: number[][] = [];
  @Input() answers : string[] = [];
  @Output() emitAnswer = new EventEmitter<string>();
  @Output() emitChangeUserData = new EventEmitter<number>();

  answerForm: FormGroup;
  submitted = false;
  button_text = 'Submit';
  form_info_text = "POS format: (A)(B+C')...";
  kmap: string[][][][] = [];
  trow_indices: number[] = [];
  tcell_indices: number[] = [];
  row_indices: number[] = [];
  cell_indices: number[] = [];

  constructor(private cdref: ChangeDetectorRef) {
    this.answerForm = new FormGroup({
      answer: new FormControl('', Validators.required)
    });
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    // correct answer
    // if (!changes['username'] && this.submitted == false) {
    //   this.submitted = true;
    // }
    if (this.form == "min"){
      this.form_info_text = "SOP format: AB'+CD'+...";
    }
    else {
      this.form_info_text = "POS format: (A)(B+C')...";
    }

    if (this.result == 1 && this.submitted == false) {
      const button = document.getElementById('button');
      if (button) {
        button.textContent = 'Next';
        button.style['backgroundColor'] = '#6C8C6B';
      }
      this.score += 1;
      this.submitted = true;
    }
    else if ((this.result == 0 || this.result == -2) && this.submitted == false) {
      const button = document.getElementById('button');
      if (button) {
        button.textContent = 'Reset';
        button.style['backgroundColor'] = 'rgba(255, 0, 0, 0.85)';
      }
      this.score = 0;
      this.submitted = true;
    }
    else if (this.result == -1 && this.submitted == false) {
      this.submitted = false;
      this.answerForm.enable();

    }

    if (changes['username'] || changes['terms']) { // catch all for updates
      this.cdref.detectChanges();
      this.generateKmap();
      this.submitted = false;
    }
  }

  onSubmit() {
    if (this.submitted == true) {
      const button = document.getElementById('button');
      if (button) {
        button.textContent = 'Submit';
        button.style['backgroundColor'] = '#6C8C6B';
      }
      
      this.emitChangeUserData.emit(this.result);;
      // this.cdref.detectChanges();
      // this.generateKmap();
      this.answerForm.reset();
      this.answerForm.enable();
    }
    else {
      
      if (this.answerForm.valid) {
        const answer = this.answerForm.value.answer;
        this.emitAnswer.emit(answer);
        this.answerForm.markAsPristine();
        this.answerForm.disable();
        // this.result = -10; // check if this breaks anything!!
        
      } else {
        // Handle the invalid form
      }
    }
  }

  checkGrouping(x: number, y: number) {
    let group_num: number[] = [];

    if (this.groupings == undefined) {
      return group_num;
    }

    for (let i = 0; i < this.groupings.length; i++) {
      if (this.groupings[i][3] == x && this.groupings[i][4] == y) {
        group_num.push(i);
      }
    }
    return group_num;
  }

  getGroupStyle(index: number) {
    let group: number[] = this.groupings[index];
    let group_num = group[0];
    let border = '';
    switch (group_num) {
      case 0:
        border = '0.6vh solid rgba(0, 255, 255, 0.4)';
        break;
      case 1:
        border = '0.6vh solid rgba(255, 0, 255, 0.4)';
        break;
      case 2:
        border = '0.6vh solid rgba(255, 255, 0, 0.4)';
        break;
      case 3:
        border = '0.6vh solid rgba(200, 100, 50, 0.4)';
        break;
      case 4:
        border = '0.6vh solid rgba(100, 200, 50, 0.4)';
        break;
      case 5:
        border = '0.6vh solid rgba(50, 100, 200, 0.4)';
        break;
      default:
        border = '0.6vh solid rgba(255, 255, 255, 0.4)';
        break;
    }
    let size_x = group[5];
    let size_y = group[6];

    let margin_top = '0vh';
    let margin_bot = '0vh';
    let margin_left = '0vh';
    let margin_right = '0vh';

    let border_top_width = border;
    let border_bottom_width = border;
    let border_left_width = border;
    let border_right_width = border;
    
    let border_bottom_left_radius = '5px';
    let border_top_left_radius = '5px';
    let border_bottom_right_radius = '5px';
    let border_top_right_radius = '5px';

    if (group[1] == 0){ // single groups
      switch (size_x) {
        case 1:
          margin_bot = '0vh';
          break;
        case 2:
          margin_bot = '-9vh';
          break;
        case 4:
          margin_bot = '-27.3vh';
          break;
        default:
          margin_bot = '0vh';
          break;
      }
      switch (size_y) {
        case 1:
          margin_right = '0vh';
          break;
        case 2:
          margin_right = '-9vh';
          break;
        case 4:
          margin_right = '-27.1vh';
          break;
        default:
          margin_right = '0vh';
          break;
      }
    } else if (group[1] == 1){ // double groups 
      if (group[2] == 2 || group[2] == 0) { // if anchor element is bottom left
        margin_right = '-0.7vh';
        border_right_width = '0px';
        border_bottom_right_radius = '0px';
        border_top_right_radius = '0px';
        switch (size_x) {
          case 1:
            margin_top = '0vh';
            break;
          case 2:
            margin_top = '-9vh';
            break;
          case 4:
            margin_top = '-27.1vh';
            break;
          default:
            margin_top = '0vh';
            break;
        }
      } else { // if anchor element if top right
        margin_left = '-0.7vh';
        border_left_width = '0px';
        border_bottom_left_radius = '0px';
        border_top_left_radius = '0px';
        switch (size_x) {
          case 1:
            margin_bot = '0vh';
            break;
          case 2:
            margin_bot = '-9vh';
            break;
          case 4:
            margin_bot = '-27.1vh';
            break;
          default:
            margin_bot = '0vh';
            break;
        }
      }
    } else if (group[1] == 2){ // groups divided from top/bottom
      if (group[2] == 2) { // if anchor element is bottom left (aka top group)
        margin_top = '-0.7vh';
        border_top_width = '0px';
        border_top_left_radius = '0px';
        border_top_right_radius = '0px';
        switch (size_y) {
          case 1:
            margin_right = '0vh';
            break;
          case 2:
            margin_right = '-9vh';
            break;
          case 4:
            margin_right = '-27.1vh';
            break;
          default:
            margin_right = '0vh';
            break;
        }
        
      } else { // anchor element is top right (aka bottom group)
        margin_bot = '-0.7vh';
        border_bottom_width = '0px';
        border_bottom_left_radius = '0px';
        border_bottom_right_radius = '0px';
        switch (size_y) {
          case 1:
            margin_left = '0vh';
            break;
          case 2:
            margin_left = '-9vh';
            break;
          case 4:
            margin_left = '-27.1vh';
            break;
          default:
            margin_left = '0vh';
            break;
        }
      }
    } else { // group is divided into 4 (only possible for 4 size groups)
      switch (group[2]) {
        case 0: // top left in group (bottom right in kmap)
          margin_bot = '-0.7vh';
          margin_right = '-0.7vh';
          border_bottom_width = '0px';
          border_right_width = '0px';
          border_bottom_left_radius = '0px';
          border_top_right_radius = '0px';
          break;
        case 1: // top right in group (bottom left in kmap)
          margin_bot = '-0.7vh';
          margin_left = '-0.7vh';
          border_bottom_width = '0px';
          border_left_width = '0px';
          border_bottom_right_radius = '0px';
          border_top_left_radius = '0px';
          break;
        case 2: // bottom left in group (top right in kmap)
          margin_top = '-0.7vh';
          margin_right = '-0.7vh';
          border_top_width = '0px';
          border_right_width = '0px';
          border_top_left_radius = '0px';
          border_bottom_right_radius = '0px';
          break;
        case 3: // bottom right in group (top left in kmap)
          margin_top = '-0.7vh';
          margin_left = '-0.7vh';
          border_top_width = '0px';
          border_left_width = '0px';
          border_top_right_radius = '0px';
          border_bottom_left_radius = '0px';
          break;
        default:
          break;
      }
    }

    

    return { 'content': "",
      'position': 'absolute',
      'top': '-0.3vh',
      'left': '-0.3vh',
      'right': '-0.3vh',
      'bottom': '-0.3vh',
      'border': border,
      // 'border-radius': '5px',
      'z-index': index + 1,
      'margin-top': margin_top,
      'margin-bottom': margin_bot,
      'margin-left': margin_left,
      'margin-right': margin_right,
      'border-top-width': border_top_width,
      'border-bottom-width': border_bottom_width,
      'border-left-width': border_left_width,
      'border-right-width': border_right_width,
      'border-bottom-left-radius': border_bottom_left_radius,
      'border-top-left-radius': border_top_left_radius,
      'border-bottom-right-radius': border_bottom_right_radius,
      'border-top-right-radius': border_top_right_radius
    };
  }

  getQuestion(): string {
    return this.form === 'min' ? 'Find the minimal SOP.' : 'Find the minimal POS.';
  }

  generateKmapTitles(){
    // titles for 5 & 6 variable kmaps
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

    this.kmap = Array.from({ length: h_size } , () => Array.from({ length: i_size } , () => Array.from({ length: j_size }, () => Array(k_size).fill(''))));
    const kmap_index = [0, 1, 3, 2];

    this.trow_indices = Array.from(
      { length: (h_size - 1) / 1 + 1 },
      (value, index) => 1 + index * 1
      );
    this.tcell_indices = Array.from(
      { length: (j_size - 1) / 1 + 1 },
      (value, index) => 1 + index * 1
      );
    this.row_indices = Array.from(
      { length: (j_size - 1) / 1 + 1 },
      (value, index) => 1 + index * 1
      );
    this.cell_indices = Array.from(
      { length: (k_size - 1) / 1 + 1 },
      (value, index) => 1 + index * 1
      );

    // Fill kmap table values
    for (let h = 0; h < h_size; h++) {  
      for (let i = 0; i < i_size; i++) {
        for (let j = 0; j < j_size; j++) {
          for (let k = 0; k < k_size; k++) {
            let index = 0;
            if (h_size == 1 && i_size == 1 && j_size == 2 && k_size == 2){
              index = (j << 1) + k;
            }
            else {
              index = (h << 5) + (i << 4) + (j << 2) + k;
            }
            if (this.dont_cares.includes(index)) {
              this.kmap[kmap_index[h]][kmap_index[i]][kmap_index[j]][kmap_index[k]] = 'X';
            } else if (this.terms.includes(index)) {
              this.kmap[kmap_index[h]][kmap_index[i]][kmap_index[j]][kmap_index[k]] = this.form === 'min' ? '1' : '0';
            } else {  
              this.kmap[kmap_index[h]][kmap_index[i]][kmap_index[j]][kmap_index[k]] = this.form === 'min' ? '0' : '1';
            }
          }
        }
      }
    }

    // Add titles to kmap
    for (let h = 0; h < h_size; h++) {   // per tablerow
      for (let i = 0; i < i_size; i++) { // per table
        for (let j = 0; j < j_size; j++) { // per row
          // add row legend
          this.kmap[h][i][j].reverse().push(kmap_index[j].toString(2).padStart(Math.log2(j_size), '0'));
          this.kmap[h][i][j].reverse();
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
        this.kmap[h][i].reverse().push(arr);
        this.kmap[h][i].reverse();
      }
      
    }

  }
}

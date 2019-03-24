import {MatButtonModule, MatCheckboxModule} from '@angular/material';
import { NgModule } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  imports: [MatButtonModule, MatCheckboxModule, MatCardModule, MatInputModule, MatProgressSpinnerModule, MatIconModule],
  exports: [MatButtonModule, MatCheckboxModule, MatCardModule, MatInputModule, MatProgressSpinnerModule, MatIconModule],
})
export class MaterialModule { }
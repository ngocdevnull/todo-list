import { NgModule } from '@angular/core';

import { TodoService } from './service/todo.service';
import { TodoListComponent } from './todo-list.component';
import { ConfirmDialogComponent } from '../shared/components/confirm-dialog/confirm-dialog.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TodoFormComponent } from './components/todo-form/todo-form.component';
import { MatButtonModule } from '@angular/material/button';
import { PriorityPipe } from '../shared/pipes/priority.pipe';
import { LoaderComponent } from '../shared/components/loader/loader.component';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [TodoFormComponent, ConfirmDialogComponent, TodoListComponent],
  exports: [TodoListComponent],
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    PriorityPipe,
    LoaderComponent,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
  ],
  providers: [TodoService],
})
export class TodoListModule {}

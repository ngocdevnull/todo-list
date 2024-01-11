import {NgModule} from "@angular/core";

import {TodoService} from "./service/todo.service";
import {TodoListComponent} from "./todo-list.component";
import {ConfirmDialogComponent} from "./components/confirm-dialog/confirm-dialog.component";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatDialogModule} from "@angular/material/dialog";
import {MatIconModule} from "@angular/material/icon";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {TodoFormComponent} from "./components/todo-form/todo-form.component";

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
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [TodoService]
})

export class TodoListModule {
}
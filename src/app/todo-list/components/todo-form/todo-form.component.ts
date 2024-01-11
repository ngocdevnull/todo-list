import {Component, Inject} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {TodoService} from "../../service/todo.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Todo} from "../../model/todo.model";

@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss'],
})
export class TodoFormComponent {
  public form: FormGroup = new FormGroup({
    summary: new FormControl('', [Validators.required, Validators.maxLength(30)]),
    description: new FormControl(''),
    completeByDate: new FormControl(''),
    priority: new FormControl(1, Validators.required),
  });

  public isEditMode = false;
  public idEdit: number = 0;

  public constructor(
    private todoService: TodoService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<TodoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { todo: Todo },) {

    if (data && data.todo) {
      this.isEditMode = true;
      this.idEdit = data.todo.id
      this.setFormValues(data.todo);
    }
  }

  public setFormValues(todo: Todo): void {
    this.form.patchValue({
      summary: todo.summary,
      description: todo.description,
      completeByDate: todo.completeByDate?.toISOString().substring(0, 10),
      priority: todo.priority.toString(),
    });
  }

  public onFormSubmit(): void {
    if (this.form.valid) {
      const summary = this.form.get('summary')!.value;
      const description = this.form.get('description')!.value || '';
      const completeByDate = this.form.get('completeByDate')!.value || null;
      const priority = this.form.get('priority')!.value;

      const data: Todo = {
        id: 0,
        summary,
        description,
        priority,
        isCompleted: false,
        completeByDate: completeByDate ? new Date(completeByDate) : this.setDefaultCompleteByDate(),
      };

      if (this.isEditMode) {
        this.todoService.editTodo(this.idEdit, data).subscribe({
          next: () => {
            this.openSnackBar('Edit successfully', 'success')
            this.dialogRef.close(true)
            this.resetNewTodoForm();
          },
          error: () => {
            this.openSnackBar('Edit failed', 'error')
            this.dialogRef.close()
          }
        })
      } else {
        this.todoService.createTodo(data).subscribe({
            next: () => {
              this.openSnackBar('Todo created successfully', 'success')
              this.dialogRef.close(true)
              this.resetNewTodoForm();
            },
            error: () => {
              this.openSnackBar('Failed to create todo', 'error')
              this.dialogRef.close()
            }
          },
        );
      }
    } else {
      this.openSnackBar('Form is not valid', 'error')
    }
  }

  private openSnackBar(mes: string, type: string): void {
    this.snackBar.open(mes, 'Close', {
      duration: 3000,
      panelClass: `${type}-toast`
    })
  }

  private resetNewTodoForm(): void {
    this.form.reset({
      summary: '',
      description: '',
      completeByDate: '',
      priority: 1,
    });
  }

  private setDefaultCompleteByDate(): Date {
    const today = new Date();
    today.setDate(today.getDate() + 3);
    return today;
  }

}

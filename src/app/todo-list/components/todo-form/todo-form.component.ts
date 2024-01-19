import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Todo } from '../../model/todo.model';
import { Priority } from '../../model/priority.model';
import { TodoService } from '../../service/todo.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss'],
})
export class TodoFormComponent {
  private readonly innerDisabled$ = new BehaviorSubject<boolean>(false);

  public form: FormGroup = new FormGroup({
    summary: new FormControl('', [Validators.required, Validators.maxLength(30)]),
    description: new FormControl(''),
    completeByDate: new FormControl(''),
    priority: new FormControl(1, Validators.required),
  });
  public priorities: Priority[] = [
    { value: 1, label: 'low' },
    { value: 2, label: 'medium' },
    { value: 3, label: 'high' },
  ];
  public isEditMode = false;
  public idEdit: number = 0;
  public isDisabled$: Observable<boolean> = this.innerDisabled$.asObservable();

  public constructor(
    private todoService: TodoService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<TodoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { todo: Todo },
  ) {
    if (data && data.todo) {
      this.isEditMode = true;
      this.idEdit = data.todo.id;
      this.setFormValues(data.todo);
    }
  }

  public setFormValues(todo: Todo): void {
    this.form.patchValue({
      summary: todo.summary,
      description: todo.description,
      completeByDate: new Date(todo.completeByDate!).toISOString().substring(0, 10),
      priority: todo.priority,
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

      this.innerDisabled$.next(true);

      if (this.isEditMode) {
        this.todoService.editTodo(this.idEdit, data).subscribe({
          next: () => {
            this.openSnackBar('Edit successfully', 'success');
            this.dialogRef.close(true);
            this.innerDisabled$.next(false);
          },
          error: () => {
            this.openSnackBar('Edit failed', 'error');
            this.dialogRef.close();
            this.innerDisabled$.next(false);
          },
        });
      } else {
        this.todoService.createTodo(data).subscribe({
          next: () => {
            this.openSnackBar('Todo created successfully', 'success');
            this.dialogRef.close(true);
            this.resetNewTodoForm();
            this.innerDisabled$.next(false);
          },
          error: () => {
            this.openSnackBar('Failed to create todo', 'error');
            this.dialogRef.close();
            this.innerDisabled$.next(false);
          },
        });
      }
    } else {
      this.openSnackBar('Summary is required', 'error');
    }
  }

  private openSnackBar(mes: string, type: string): void {
    this.snackBar.open(mes, 'Close', {
      duration: 3000,
      panelClass: `${type}-toast`,
    });
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

import { Component, EventEmitter, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Todo } from '../../interfaces/todo.interface';
import { Priority } from '../../interfaces/priority.interface';
import { Level } from '../../../shared/enums/level.enum';

@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss']
})
export class TodoFormComponent {
  public readonly form: FormGroup = new FormGroup({
    summary: new FormControl('', [Validators.required, Validators.maxLength(30)]),
    description: new FormControl(''),
    completeByDate: new FormControl(''),
    priority: new FormControl(Level.LOW, Validators.required),
    isCompleted: new FormControl(false)
  });
  public readonly priorities: Priority[] = [
    { value: Level.LOW, label: 'Low' },
    { value: Level.MEDIUM, label: 'Medium' },
    { value: Level.HIGH, label: 'High' }
  ];

  public submitButtonText = '';
  public formValueEmitter = new EventEmitter<Todo>();

  public constructor(
    private dialogRef: MatDialogRef<TodoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { todo: Todo; submitButtonText: string }
  ) {
    if (data?.todo) {
      this.setFormValues(data.todo);
    }
    this.submitButtonText = data.submitButtonText;
  }

  public dateFilter(date: Date | null): boolean {
    if (!date) {
      return false;
    }
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    return date >= currentDate;
  }

  public onFormSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      formValue.completeByDate = formValue.completeByDate || this.setDefaultCompleteByDate();
      this.dialogRef.close(formValue);
    }
  }

  private setDefaultCompleteByDate(): Date {
    const today = new Date();
    today.setDate(today.getDate() + 3);
    return today;
  }

  private setFormValues(todo: Todo): void {
    this.form.patchValue(todo);
  }
}

import {Component, OnInit} from '@angular/core';
import {TodoService} from './service/todo.service';
import {Todo} from "./model/todo.model";
import {MatDialog} from "@angular/material/dialog";
import {TodoFormComponent} from "./components/todo-form/todo-form.component";
import {ConfirmDialogComponent} from "./components/confirm-dialog/confirm-dialog.component";
import {EMPTY, Observable, ReplaySubject} from "rxjs";
import {map, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent implements OnInit {
  public todos$: Observable<Todo[]> | undefined
  public refetchApiTrigger$ = new ReplaySubject<void>(1);

  public constructor(private todoService: TodoService, private dialog: MatDialog) {}

  public ngOnInit(): void {
    this.todos$ = this.refetchApiTrigger$.pipe(switchMap(() => this.todoService.getTodos()), map(data => data))
    this.refetchApiTrigger$.next();
  }

  public markAsCompleted(todoId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '60vw',
      data: {text: 'mark as finish'}
    });

    dialogRef.afterClosed().pipe(switchMap((result) =>
      result ? this.todoService.markAsCompleted(todoId) : EMPTY
    )).subscribe({next: () => this.refetchApiTrigger$.next()})
  }

  public markAsUnfinished(todoId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '60vw',
      data: {text: 'mark as unfinished'}
    });

    dialogRef.afterClosed().pipe(switchMap((result) =>
      result ? this.todoService.markAsUnfinished(todoId) : EMPTY
    )).subscribe({next: () => this.refetchApiTrigger$.next()})
  }

  public deleteTodo(todoId: number): void {
    this.todoService.deleteTodo(todoId).subscribe()
  }

  public isHighPriorityAndDueSoon(todo: Todo): boolean {
    const isUnfinished = !todo.isCompleted;
    const oneDayAhead = new Date();
    oneDayAhead.setDate(new Date().getDate() + 1);
    const isHighPriority = todo.priority === 3;

    return isUnfinished && isHighPriority
  }

  public openTodoFormDialog(): void {
    this.dialog.open(TodoFormComponent, {
      width: '70vw',
    });
  }

  public editTodo(todo: Todo): void {
    this.dialog.open(TodoFormComponent, {
      width: '70vw',
      data: {todo}
    });
  }

  public openPopConfirm(todoId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '60vw',
      data: {text: 'delete'}
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteTodo(todoId)
        this.refetchApiTrigger$.next();
      }
    });
  }
}

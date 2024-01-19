import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, EMPTY, Observable, ReplaySubject, shareReplay, take, tap } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { TodoService } from './service/todo.service';
import { Todo } from './model/todo.model';
import { TodoFormComponent } from './components/todo-form/todo-form.component';
import { ConfirmDialogComponent } from '../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent implements OnInit {
  private readonly innerDisabled$ = new BehaviorSubject<boolean>(false);

  public todos$!: Observable<Todo[]>;
  public refetchApiTrigger$ = new ReplaySubject<void>(1);
  public isDisabled$: Observable<boolean> = this.innerDisabled$.asObservable();

  public constructor(
    private todoService: TodoService,
    private dialog: MatDialog,
  ) {}

  public ngOnInit(): void {
    this.todos$ = this.refetchApiTrigger$.pipe(
      switchMap(() => this.todoService.getTodos()),
      map((data) => data),
      shareReplay(1),
      tap(() => {
        this.innerDisabled$.next(false);
      }),
    );
    this.refetchApiTrigger$.next();
  }

  public markAsCompleted(todoId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '30vw',
      data: { text: 'mark as finish' },
    });

    dialogRef
      .afterClosed()
      .pipe(
        switchMap((result) => {
          this.innerDisabled$.next(result);
          return result ? this.todoService.markAsCompleted(todoId) : EMPTY;
        }),
      )
      .subscribe({
        next: () => {
          this.refetchApiTrigger$.next();
        },
      });
  }

  public markAsUnfinished(todoId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '30vw',
      data: { text: 'mark as unfinished' },
    });

    dialogRef
      .afterClosed()
      .pipe(
        switchMap((result) => {
          this.innerDisabled$.next(result);
          return result ? this.todoService.markAsUnfinished(todoId) : EMPTY;
        }),
      )
      .subscribe({
        next: () => {
          this.refetchApiTrigger$.next();
        },
      });
  }

  public openTodoFormDialog(): void {
    const dialogRef = this.dialog.open(TodoFormComponent, {
      width: '40vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.refetchApiTrigger$.next();
      }
    });
  }

  public editTodo(todo: Todo): void {
    const dialogRef = this.dialog.open(TodoFormComponent, {
      width: '40vw',
      data: { todo },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.refetchApiTrigger$.next();
      }
    });
  }

  public openPopConfirm(todoId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '30vw',
      data: { text: 'delete' },
    });

    dialogRef
      .afterClosed()
      .pipe(
        switchMap((result) => {
          this.innerDisabled$.next(result);
          return result ? this.todoService.deleteTodo(todoId) : EMPTY;
        }),
      )
      .subscribe({ next: () => this.refetchApiTrigger$.next() });
  }
}

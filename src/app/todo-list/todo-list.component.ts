import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, distinctUntilChanged, EMPTY, filter, Observable, ReplaySubject, shareReplay, tap } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { TodoService } from './service/todo.service';
import { Todo } from './model/todo.model';
import { TodoFormComponent } from './components/todo-form/todo-form.component';
import { ConfirmDialogComponent } from '../shared/components/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent implements OnInit, OnDestroy {
  private readonly innerDisabled$ = new BehaviorSubject<boolean>(true);
  private readonly innerLoading$ = new BehaviorSubject<boolean>(false);

  public todos$!: Observable<Todo[]>;
  public refetchApiTrigger$ = new ReplaySubject<void>(1);
  public isDisabled$: Observable<boolean> = this.innerDisabled$.asObservable();
  public isLoading$: Observable<boolean> = this.innerLoading$.asObservable();

  public constructor(
    private todoService: TodoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  public ngOnInit(): void {
    this.todos$ = this.refetchApiTrigger$.pipe(
      switchMap(() => this.todoService.getTodos()),
      map((data) => data),
      shareReplay(1),
      distinctUntilChanged(),
      tap(() => {
        this.innerDisabled$.next(false);
        this.innerLoading$.next(false);
      }),
    );
    this.refetchApiTrigger$.next();
  }

  public ngOnDestroy() {
    this.todos$ = this.refetchApiTrigger$.pipe(switchMap(() => this.todoService.getTodos(true)));
  }

  @HostListener('window:beforeunload', ['$event'])
  public onFilterFinishedItems(): void {
    this.ngOnDestroy();
  }

  public markAsCompleted(todoId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { text: 'mark as finish' },
    });

    dialogRef
      .afterClosed()
      .pipe(
        switchMap((result) => {
          this.innerLoading$.next(result);
          return result ? this.todoService.markAsCompleted(todoId) : EMPTY;
        }),
      )
      .subscribe({
        next: () => this.refetchApiTrigger$.next(),
        error: () => this.innerLoading$.next(false),
      });
  }

  public markAsUnfinished(todoId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { text: 'mark as unfinished' },
    });

    dialogRef
      .afterClosed()
      .pipe(
        switchMap((result) => {
          this.innerLoading$.next(result);
          return result ? this.todoService.markAsUnfinished(todoId) : EMPTY;
        }),
      )
      .subscribe({
        next: () => this.refetchApiTrigger$.next(),
        error: () => this.innerLoading$.next(false),
      });
  }

  public createTodo(): void {
    const dialogRef = this.dialog.open(TodoFormComponent, { data: { submitButtonText: 'Create' } });

    dialogRef.componentInstance.formValueEmitter
      .pipe(
        switchMap((result) => {
          if (result) {
            this.innerLoading$.next(true);
            return this.todoService.createTodo(result);
          } else {
            return EMPTY;
          }
        }),
      )
      .subscribe({
        next: () => {
          this.openSnackBar('Todo created successfully', 'success');
          dialogRef.close();
          this.innerLoading$.next(false);
        },
        error: () => {
          this.openSnackBar('Failed to create todo', 'error');
          this.innerLoading$.next(false);
        },
      });

    dialogRef.afterClosed().subscribe({
      next: () => this.refetchApiTrigger$.next(),
    });
  }

  public editTodo(todo: Todo): void {
    const dialogRef = this.dialog.open(TodoFormComponent, {
      data: { todo, submitButtonText: 'Edit' },
    });

    dialogRef.componentInstance.formValueEmitter
      .pipe(
        switchMap((result) => {
          if (result) {
            this.innerLoading$.next(true);
            return this.todoService.editTodo(todo.id, result);
          } else {
            return EMPTY;
          }
        }),
      )
      .subscribe({
        next: () => {
          this.openSnackBar('Edit successfully', 'success');
          dialogRef.close();
          this.innerLoading$.next(false);
        },
        error: () => {
          this.openSnackBar('Edit failed', 'error');
          this.innerLoading$.next(false);
        },
      });

    dialogRef.afterClosed().subscribe({ next: () => this.refetchApiTrigger$.next() });
  }

  public openPopConfirm(todoId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { text: 'delete' },
    });

    dialogRef
      .afterClosed()
      .pipe(
        switchMap((result) => {
          this.innerLoading$.next(result);
          return result ? this.todoService.deleteTodo(todoId) : EMPTY;
        }),
      )
      .subscribe({
        next: () => this.refetchApiTrigger$.next(),
        error: () => this.innerLoading$.next(false),
      });
  }

  private openSnackBar(mes: string, type: string): void {
    this.snackBar.open(mes, 'Close', {
      duration: 3000,
      panelClass: `${type}-toast`,
    });
  }
}

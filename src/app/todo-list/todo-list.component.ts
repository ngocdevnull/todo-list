import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { delay, EMPTY, Observable, ReplaySubject, shareReplay, Subject, takeUntil, tap } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TodoService } from './service/todo.service';
import { Todo } from './interfaces/todo.interface';
import { TodoFormComponent } from './components/todo-form/todo-form.component';
import { ConfirmDialogComponent } from '../shared/components/confirm-dialog/confirm-dialog.component';
import { CREATED, EDIT, ERROR, MARK, MARKTYPE, SUCCESS } from '../shared/constants';
import { Loading } from '../services/loading.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListComponent implements OnInit, OnDestroy {
  private refetchApiTrigger$ = new ReplaySubject<void>(1);
  private destroy$ = new Subject<void>();

  public todos$!: Observable<Todo[]>;

  protected readonly MARKTYPE = MARKTYPE;

  public constructor(
    private todoService: TodoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private loadingService: Loading
  ) {}

  public ngOnInit(): void {
    this.setupTodoStream();

    this.refetchApiTrigger$.next();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public mark(todoId: number, type: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { text: type === MARKTYPE.completed ? MARK.UNFINISHED : MARK.FINISHED }
    });

    dialogRef
      .afterClosed()
      .pipe(
        tap(result => {
          if (result) {
            this.loadingService.open();
          }
        }),
        delay(2000),
        switchMap(result => {
          if (result) {
            this.loadingService.open();
          }
          return result
            ? type === MARKTYPE.completed
              ? this.todoService.markAsUnfinished(todoId)
              : this.todoService.markAsCompleted(todoId)
            : EMPTY;
        })
      )
      .subscribe({
        next: () => this.refetchApiTrigger$.next(),
        error: () => this.loadingService.close()
      });
  }

  public createTodo(): void {
    const dialogRef = this.dialog.open(TodoFormComponent, { data: { submitButtonText: 'Create' } });

    dialogRef
      .afterClosed()
      .pipe(
        tap(data => {
          if (data) {
            this.loadingService.open();
          }
        }),
        delay(2000),
        switchMap(result => this.todoService.createTodo(result)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: () => {
          this.loadingService.close();
          this.openSnackBar(CREATED.SUCCESSFULLY, SUCCESS);
        },
        error: () => {
          this.loadingService.close();
          this.openSnackBar(CREATED.FAILED, ERROR);
        }
      });
  }

  public editTodo(todo: Todo): void {
    const dialogRef = this.dialog.open(TodoFormComponent, {
      data: { todo, submitButtonText: 'Edit' }
    });

    dialogRef
      .afterClosed()
      .pipe(
        tap(data => {
          if (data) {
            this.loadingService.open();
          }
        }),
        delay(2000),
        switchMap(result => {
          return this.todoService.editTodo(todo.id, result);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: () => {
          this.loadingService.close();
          this.openSnackBar(EDIT.SUCCESSFULLY, SUCCESS);
        },
        error: () => {
          this.loadingService.close();
          this.openSnackBar(EDIT.FAILED, ERROR);
        }
      });
  }

  public openPopConfirm(todoId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { text: 'delete' }
    });

    dialogRef
      .afterClosed()
      .pipe(
        tap(result => {
          if (result) {
            this.loadingService.open();
          }
        }),
        delay(2000),
        switchMap(result => {
          if (result) {
            this.loadingService.open();
          }
          return result ? this.todoService.deleteTodo(todoId) : EMPTY;
        })
      )
      .subscribe({
        next: () => this.refetchApiTrigger$.next(),
        error: () => this.loadingService.close()
      });
  }

  private openSnackBar(mes: string, type: string): void {
    this.snackBar.open(mes, 'Close', {
      duration: 3000,
      panelClass: `${type}-toast`
    });
  }

  private setupTodoStream(): void {
    this.todos$ = this.refetchApiTrigger$.pipe(
      switchMap(() => this.todoService.getTodos()),
      shareReplay(1),
      takeUntil(this.destroy$),
      tap(() => {
        this.loadingService.close();
      })
    );
  }
}

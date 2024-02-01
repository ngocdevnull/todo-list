import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { TodoListModule } from './todo-list/todo-list.module';
import { AppRoutingModule } from './app-routing.module';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ServerErrorComponent } from './pages/server-error/server-error.component';

@NgModule({
  declarations: [AppComponent, NotFoundComponent, ServerErrorComponent],
  imports: [BrowserModule, BrowserAnimationsModule, TodoListModule, AppRoutingModule],
  bootstrap: [AppComponent],
})
export class AppModule {}

/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */

/// <reference path="./interfaces.d.ts"/>

import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { TodoModel } from "./todoModel";
import { TodoFooter } from "./footer";
import { TodoItem } from "./todoItem";
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY } from "./constants";

class TodoApp extends React.Component<IAppProps, IAppState> {

  public state : IAppState;

  constructor(props : IAppProps) {
    super(props);
    this.state = {
      nowShowing: ALL_TODOS,
      editing: null,
      selectedPriority: 'medium' as Priority
    };
  }

  public componentDidMount() {
    // Handle hash-based routing manually since we're using hash navigation
    this.handleHashChange();
    window.addEventListener('hashchange', this.handleHashChange.bind(this));
  }

  public componentWillUnmount() {
    window.removeEventListener('hashchange', this.handleHashChange.bind(this));
  }

  private handleHashChange() {
    const hash = window.location.hash.replace('#', '') || '/';
    let newShowing = ALL_TODOS;
    
    if (hash === '/active') {
      newShowing = ACTIVE_TODOS;
    } else if (hash === '/completed') {
      newShowing = COMPLETED_TODOS;
    }
    
    if (this.state.nowShowing !== newShowing) {
      this.setState({ nowShowing: newShowing });
    }
  }

  public handleNewTodoKeyDown(event : React.KeyboardEvent) {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }

    event.preventDefault();

    const target = event.target as HTMLInputElement;
    var val = target.value.trim();

    if (val) {
      this.props.model.addTodo(val, this.state.selectedPriority);
      target.value = '';
    }
  }

  public handlePriorityChange(event : React.ChangeEvent<HTMLSelectElement>) {
    this.setState({ selectedPriority: event.target.value as Priority });
  }

  public toggleAll(event : React.FormEvent) {
    var target : any = event.target;
    var checked = target.checked;
    this.props.model.toggleAll(checked);
  }

  public toggle(todoToToggle : ITodo) {
    this.props.model.toggle(todoToToggle);
  }

  public destroy(todo : ITodo) {
    this.props.model.destroy(todo);
  }

  public edit(todo : ITodo) {
    this.setState({editing: todo.id});
  }

  public save(todoToSave : ITodo, text : String) {
    this.props.model.save(todoToSave, text);
    this.setState({editing: null});
  }

  public cancel() {
    this.setState({editing: null});
  }

  public clearCompleted() {
    this.props.model.clearCompleted();
  }

  public render() {
    var footer;
    var main;
    const todos = this.props.model.todos;

    var shownTodos = todos.filter((todo) => {
      switch (this.state.nowShowing) {
      case ACTIVE_TODOS:
        return !todo.completed;
      case COMPLETED_TODOS:
        return todo.completed;
      default:
        return true;
      }
    });

    var todoItems = shownTodos.map((todo) => {
      return (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={this.toggle.bind(this, todo)}
          onDestroy={this.destroy.bind(this, todo)}
          onEdit={this.edit.bind(this, todo)}
          editing={this.state.editing === todo.id}
          onSave={this.save.bind(this, todo)}
          onCancel={ e => this.cancel() }
        />
      );
    });

    // Note: It's usually better to use immutable data structures since they're
    // easier to reason about and React works very well with them. That's why
    // we use map(), filter() and reduce() everywhere instead of mutating the
    // array or todo items themselves.
    var activeTodoCount = todos.reduce(function (accum, todo) {
      return todo.completed ? accum : accum + 1;
    }, 0);

    var completedCount = todos.length - activeTodoCount;

    if (activeTodoCount || completedCount) {
      footer =
        <TodoFooter
          count={activeTodoCount}
          completedCount={completedCount}
          nowShowing={this.state.nowShowing}
          onClearCompleted={ (e: any) => this.clearCompleted() }
        />;
    }

    if (todos.length) {
      main = (
        <section className="main">
          <input
            id="toggle-all"
            className="toggle-all"
            type="checkbox"
            onChange={ e => this.toggleAll(e) }
            checked={activeTodoCount === 0}
          />
          <label
            htmlFor="toggle-all"
          >
            Mark all as complete
          </label>
          <ul className="todo-list">
            {todoItems}
          </ul>
        </section>
      );
    }

    return (
      <div>
        <header className="header">
          <h1>todos</h1>
          <div className="todo-input-container">
            <input
              className="new-todo"
              placeholder="What needs to be done?"
              onKeyDown={ e => this.handleNewTodoKeyDown(e) }
              autoFocus={true}
            />
            <select
              className="priority-dropdown"
              value={this.state.selectedPriority}
              onChange={ e => this.handlePriorityChange(e) }
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </header>
        {main}
        {footer}
      </div>
    );
  }
}

var model = new TodoModel('react-todos');

const container = document.getElementsByClassName('todoapp')[0];
const root = ReactDOM.createRoot(container);

function render() {
  root.render(<TodoApp model={model}/>);
}

model.subscribe(render);
render();

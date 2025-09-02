// Priority type definition and constants
type Priority = 'high' | 'medium' | 'low';

const PRIORITY = {
  HIGH: 'high' as Priority,
  MEDIUM: 'medium' as Priority,
  LOW: 'low' as Priority
} as const;

interface ITodo {
  id: string,
  title: string,
  completed: boolean,
  priority: Priority
}

interface ITodoItemProps {
  key : string,
  todo : ITodo;
  editing? : boolean;
  onSave: (val: any) => void;
  onDestroy: () => void;
  onEdit: ()  => void;
  onCancel: (event : any) => void;
  onToggle: () => void;
}

interface ITodoItemState {
  editText : string
}

interface ITodoFooterProps {
  completedCount : number;
  onClearCompleted : any;
  nowShowing? : string;
  count : number;
}


interface ITodoModel {
  key : any;
  todos : Array<ITodo>;
  onChanges : Array<any>;
  subscribe(onChange);
  inform();
  addTodo(title : string, priority: Priority);
  toggleAll(checked);
  toggle(todoToToggle);
  destroy(todo);
  save(todoToSave, text);
  clearCompleted();
}

interface IAppProps {
  model : ITodoModel;
}

interface IAppState {
  editing? : string | null;
  nowShowing? : string;
  selectedPriority: Priority;
}

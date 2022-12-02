import TodoItem from './TodoItem';

const TodoCollection = ({
  todos,
  onToggleDone,
  onChangeMode,
  onSave,
  onDelete,
}) => {
  return (
    <div>
      {todos.map((todo) => {
        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggleDone={onToggleDone}
            onChangeMode={onChangeMode}
            onSave={onSave}
            onDelete={onDelete}
          />
        );
      })}
    </div>
  );
};

export default TodoCollection;

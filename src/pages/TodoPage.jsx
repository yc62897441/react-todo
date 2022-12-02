import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Footer, Header, TodoCollection, TodoInput } from 'components';
import { getTodos, createTodo, patchTodo, deleteTodo } from '../api/todos.js';
import Swal from 'sweetalert2';

const TodoPage = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const getTodosAsync = async () => {
      try {
        const todos = await getTodos();

        setTodos(
          todos.map((todo) => {
            return {
              ...todo,
              isEdit: false,
            };
          }),
        );
      } catch (error) {
        console.error(error);
      }
    };
    getTodosAsync();
  }, []);

  function handleChange(value) {
    setInputValue(value);
  }

  async function handleAddTodo() {
    if (inputValue.length === 0) {
      return;
    }

    try {
      const data = await createTodo({
        title: inputValue,
        isDone: false,
      });
      setTodos([
        ...todos,
        {
          id: data.id,
          title: data.title,
          isDone: data.isDone,
          isEdit: false,
        },
      ]);
      setInputValue('');
    } catch (error) {
      console.error(error);
    }
  }

  function handleKeyDown(key) {
    if (key === 'Enter') {
      handleAddTodo();
    }
  }

  async function handletoggleDone(id) {
    try {
      const currentTodo = todos.find((todo) => todo.id === id);

      const data = await patchTodo({
        ...currentTodo,
        isDone: !currentTodo.isDone,
      });

      const newTodos = todos.map((todo) => {
        if (todo.id === id) {
          return {
            ...data,
          };
        }
        return todo;
      });
      setTodos([...newTodos]);
    } catch (error) {
      console.error(error);
    }
  }

  function handleChangeMode({ id, isEdit }) {
    const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          isEdit: isEdit,
        };
      }
      return todo;
    });
    setTodos([...newTodos]);
  }

  async function handleSave({ id, title }) {
    try {
      await patchTodo({
        id: id,
        title: title,
      });

      const newTodos = todos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            title: title,
            isEdit: false,
          };
        }
        return todo;
      });
      setTodos([...newTodos]);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteTodo(id);
      const newTodos = todos.filter((todo) => todo.id !== id);
      setTodos([...newTodos]);
    } catch (error) {
      console.error(error);
    }
  }

  function handleLogout() {
    localStorage.removeItem('authToken');
    Swal.fire({
      position: 'top',
      title: '登出成功',
      timer: 1000,
      icon: 'success',
      showCancelButton: true,
    });
    navigate('/login');
  }

  return (
    <div>
      TodoPage
      <Header />
      <TodoInput
        inputValue={inputValue}
        onChange={handleChange}
        onAddTodo={handleAddTodo}
        onKeyDown={handleKeyDown}
      />
      <TodoCollection
        todos={todos}
        onToggleDone={handletoggleDone}
        onChangeMode={handleChangeMode}
        onSave={handleSave}
        onDelete={handleDelete}
      />
      <Footer leftNum={todos.length} handleLogout={handleLogout} />
    </div>
  );
};

export default TodoPage;

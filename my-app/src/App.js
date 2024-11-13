import { useEffect, useState } from 'react';
import './App.css';
import './icon-search.svg';

export const App = () => {
	const [todos, setTodos] = useState([]);
	const [refreshTodos, setRefreshTodos] = useState(false);
	const [isCreating, setIsCreating] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [dataSearch, setDataSearch] = useState('');
	const [dataSort, setDataSort] = useState(todos);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		fetch('http://localhost:3003/todos')
			.then((loadedData) => loadedData.json())
			.then((loadedTodos) => {
				setTodos(loadedTodos);
			});
	}, [refreshTodos]);

	//Добавить дело
	const requestAddWork = () => (_) => {
		setIsCreating(true);

		fetch('http://localhost:3003/todos/', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json;charset=utf-8' },
			body: JSON.stringify({
				userId: 1,
				title: 'repellendus sunt dolores architecto voluptatum',
				completed: 'completed',
			}),
		})
			.then((rawResponse) => rawResponse.json())
			.then((response) => {
				console.log('Добавлено дело, ответ сервера:', response);
				setRefreshTodos(!refreshTodos);
			})
			.finally(() => setIsCreating(false));
	};

	// Заменить дело
	const requestUpdateWork = (id, userId, completed) => (_) => {
		setIsUpdating(true);

		fetch('http://localhost:3003/todos/' + id, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json;charset=utf-8' },
			body: JSON.stringify({
				userId: userId,
				id: id,
				title: 'repellendus sunt dolores architecto voluptatum',
				completed: completed,
			}),
		})
			.then((rawResponse) => rawResponse.json())
			.then((response) => {
				console.log('Заменить дело, ответ сервера:', response);
				setRefreshTodos(!refreshTodos);
			})
			.finally(() => setIsUpdating(false));
	};

	// Удалить дело
	const requestDeleteWork = (id) => (_) => {
		setIsDeleting(true);

		fetch('http://localhost:3003/todos/' + id, {
			method: 'DELETE',
		})
			.then((rawResponse) => rawResponse.json())
			.then((response) => {
				console.log('Дело удалено, ответ сервера:', response);
				setRefreshTodos(!refreshTodos);
			})
			.finally(() => setIsDeleting(false));
	};

	//Фильтрация дел
	const filteredTodos = todos.filter((obj, index, array) => {
		return obj.title.includes(dataSearch);
	});

	//Сортировка дел
	const funSort = () => {
		if (!isLoading) {
			const dataSort = [...todos].sort((a, b) => a.title.localeCompare(b.title));
			setDataSort(dataSort);
			setIsLoading(true);
		} else {
			const dataSort = [...todos].sort((a, b) => b.title.localeCompare(a.title));
			setDataSort(dataSort);
			setIsLoading(false);
		}
	};

	return (
		<div className="App">
			<h2>Список дел:</h2>
			{todos.map(({ id, title, userId, completed }) => (
				<div key={id}>
					{id} - {title}
					<div className="buttons">
						<button
							className="button"
							disabled={isDeleting}
							onClick={requestDeleteWork(id)}
						>
							Удалить дело
						</button>
						<button
							className="button"
							disabled={isUpdating}
							onClick={requestUpdateWork(id, userId, completed)}
						>
							Заменить дело
						</button>
					</div>
				</div>
			))}

			<button className="button" disabled={isCreating} onClick={requestAddWork()}>
				Добавить дело
			</button>

			<div className="line"></div>

			<div>
				<button className="btn" onClick={funSort}>
					Сортировка
				</button>
			</div>

			<div>
				<h3>Отсортировано:</h3>
				{dataSort.map(({ id, title }) => (
					<div key={id}>
						{id} - {title}
					</div>
				))}
			</div>

			<div className="line"></div>

			<div>
				<input
					className="inputSearch"
					onChange={(event) => setDataSearch(event.target.value)}
				/>
			</div>
			<div>
				<h3>Найдено:</h3>
				{filteredTodos.map(({ id, title }) => (
					<div key={id}>
						{id} - {title}
					</div>
				))}
			</div>
		</div>
	);
};

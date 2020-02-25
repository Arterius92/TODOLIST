(function(window) {
    let newTask = document.querySelector('.new-todo'),
        todoList = document.querySelector('.todo-list'),
        todoCount = document.querySelector('.todo-count strong');

    let taskArr = [];

    // 1. Добавление задачи
    newTask.addEventListener('keypress', addTask);

    function addTask(e) {
        if (e.keyCode == 13) {
            let todo = {
                name: newTask.value,
                checked: false
            };
            taskArr.push(todo);
            localStorage.setItem('todoListKey', JSON.stringify(taskArr));
            newTask.value = '';
            renderTasks();
        };
    };

    //функция отрисовки задач
    function renderTasks() {
        let output = '';
        taskArr.forEach((item, index) => {
			//${item.checked ? 'class="completed"' : ''
            // if(item.checked) {'class="completed"';} else {''}

        output += `<li ${item.checked ? 'class="completed"' : ''}>
						<div class="view">
							<input data-id="${index}" class="toggle" type="checkbox" ${item.checked ? 'checked' : ''}>
							<label data-id="${index}">${item.name}</label>
							<button class="destroy" data-id="${index}"></button>
						</div>
						<input class="edit" value="${item.name}">
					</li>`;
        });
        todoList.innerHTML = output;

    // 5. Кол-во задач
        todoCount.innerText = taskArr.length;
    };

    // 1.1 Отрисовка задач при загрузке
    if (localStorage.getItem('todoListKey')) {
        taskArr = JSON.parse(localStorage.getItem('todoListKey'));
        renderTasks();
    };

    // 2. Удаление задачи
    todoList.addEventListener('click', removeTask);

    function removeTask(e) {
        if (e.target.classList.contains('destroy')) {
            let id = e.target.dataset.id;
            taskArr.splice(id, 1);
            localStorage.setItem('todoListKey', JSON.stringify(taskArr));
            renderTasks();
        };
    };

    // 3. Выполненная задача
    todoList.addEventListener('change', checkTask);

    function checkTask(e) {
        if (e.target.classList.contains('toggle')) {
			let id = e.target.dataset.id;
            taskArr[id].checked = !taskArr[id].checked;
            localStorage.setItem('todoListKey', JSON.stringify(taskArr));
            renderTasks();
        };
    };

    // 4. Редактирование задачи
    todoList.addEventListener('dblclick', editTask);

    function editTask(e) {
        if (e.target.nodeName == 'LABEL') {
            let id = e.target.dataset.id;
            e.target.closest('li').classList.add('editing');
            e.target.closest('li').lastElementChild.addEventListener('keypress', function(e) {
				if (e.keyCode == 13) {
					let newName = e.target.closest('li').lastElementChild.value;
					taskArr[id].name = newName;
					e.target.closest('li').classList.remove('editing');
					localStorage.setItem('todoListKey', JSON.stringify(taskArr));
					renderTasks();
				};
			});
		};
	};

    // 6. Показать все
    // 7. Показать активные
    // 8. Показать выполненные
    let filter = document.querySelector('.filters');

    filter.addEventListener('click', function(e) {
        if (e.target.nodeName == 'A') {
            document.querySelectorAll('.filters a').forEach(item => {
                item.classList.remove('selected');
            });

            let href = e.target.getAttribute('href');
            e.target.classList.add('selected');
            if (href.indexOf('active') != -1) {
                showActive();
            } else if (href.indexOf('completed') != -1) {
                showCompleted();
            } else {
                renderTasks();
            };
        };
    });

    function showActive() {
        let output = '';
        let count = 0;
        taskArr.forEach((item, index) => {
            if (!item.checked) {
                output += `<li>
								<div class="view">
									<input data-id="${index}" class="toggle" type="checkbox">
									<label data-id="${index}">${item.name}</label>
									<button class="destroy" data-id="${index}"></button>
								</div>
								<input class="edit" value="${item.name}">
							</li>`;
                count++;
            };
        });
        todoList.innerHTML = output;
        todoCount.innerText = count;
    }

    function showCompleted() {
        let output = '';
        let count = 0;
        taskArr.forEach((item, index) => {
            if (item.checked) {
                output += `<li class="completed">
								<div class="view">
									<input data-id="${index}" class="toggle" type="checkbox" checked>
									<label data-id="${index}">${item.name}</label>
									<button class="destroy" data-id="${index}"></button>
								</div>
								<input class="edit" value="${item.name}">
							</li>`;
                count++;
            };
        });
        todoList.innerHTML = output;
        todoCount.innerText = count;
    };

    // 10. Отметить все задачи
    let toggleAll = document.querySelector('.toggle-all');

    toggleAll.addEventListener('change', function(e) {
        if (e.target.checked) {
            taskArr.forEach(item => {
                item.checked = true;
            });
        } else {
            taskArr.forEach(item => {
                item.checked = false;
            });
        };
        localStorage.setItem('todoListKey', JSON.stringify(taskArr));
        renderTasks();
    });

    // 9. Очистить выполненные
    let clear = document.querySelector('.clear-completed');

    clear.addEventListener('click', function(e) {
        let length = taskArr.length;
        for (let i = length - 1; i >= 0; i--) {
            if (taskArr[i].checked == true) {
                taskArr.splice(i, 1);
            };
        };
        console.log(taskArr);
        localStorage.setItem('todoListKey', JSON.stringify(taskArr));
        renderTasks();
    });
})(window);

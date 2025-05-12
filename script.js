document.addEventListener('DOMContentLoaded', () => {
    const employeeForm = document.getElementById('employee-form');
    const employeeTableBody = document.getElementById('employee-table-body');
    const searchInput = document.getElementById('search');

    function getEmployees() {
        const data = localStorage.getItem('employees') || '';
        if (data === '') return [];
        return data.split(';').map(empStr => empStr.split('|'));
    }

    function saveEmployees(employees) {
        const data = employees.map(emp => emp.join('|')).join(';');
        localStorage.setItem('employees', data);
    }

    function renderTable(data) {
        employeeTableBody.innerHTML = '';
        data.forEach((emp, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${emp[0]}</td>
                <td>${emp[1]}</td>
                <td>${emp[2]}</td>
                <td>${emp[3]}</td>
                <td>
                    <button class="edit" data-index="${index}">Edit</button>
                    <button class="delete" data-index="${index}">Delete</button>
                </td>
            `;
            employeeTableBody.appendChild(row);
        });
    }

    employeeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const department = document.getElementById('department').value.trim();
        const joiningDate = document.getElementById('joining-date').value;

        if (name && email && department && joiningDate) {
            const employees = getEmployees();
            employees.push([name, email, department, joiningDate]);
            saveEmployees(employees);
            renderTable(employees);
            employeeForm.reset();
        }
    });

    employeeTableBody.addEventListener('click', (e) => {
        const employees = getEmployees();
        if (e.target.classList.contains('delete')) {
            const index = e.target.getAttribute('data-index');
            employees.splice(index, 1);
            saveEmployees(employees);
            renderTable(employees);
        }
        if (e.target.classList.contains('edit')) {
            const index = e.target.getAttribute('data-index');
            const emp = employees[index];
            document.getElementById('name').value = emp[0];
            document.getElementById('email').value = emp[1];
            document.getElementById('department').value = emp[2];
            document.getElementById('joining-date').value = emp[3];
            employees.splice(index, 1);
            saveEmployees(employees);
            renderTable(employees);
        }
    });

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        const employees = getEmployees();
        const filtered = employees.filter(emp =>
            emp[0].toLowerCase().includes(query) ||
            emp[1].toLowerCase().includes(query)
        );
        renderTable(filtered);
    });

    // Initial load
    renderTable(getEmployees());
});

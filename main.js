const studentform = document.querySelector('#student-form');
const studentlist = document.querySelector('#student-list');
const message = document.querySelector('#message');
const searchInput = document.querySelector('#search');

let editingId = null;
let students = JSON.parse(localStorage.getItem('students')) || [];

function setMessage(text, color) {
    message.textContent = text;
    message.style.backgroundColor = color;
}

function validateStudent(name, ageValue, course) {
    const age = Number(ageValue);
    return name !== '' && course !== '' && ageValue !== '' && !Number.isNaN(age) && age > 0;
}

function saveStudentsToLocalStorage() {
    localStorage.setItem('students', JSON.stringify(students));
}

function createStudentRow(student) {
    const row = document.createElement('tr');
    row.dataset.id = student.id;

    const nameCell = document.createElement('td');
    const ageCell = document.createElement('td');
    const courseCell = document.createElement('td');
    const actionCell = document.createElement('td');

    nameCell.textContent = student.name;
    ageCell.textContent = student.age;
    courseCell.textContent = student.course;

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.style.backgroundColor = 'orange';
    editButton.style.marginRight = '8px';

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.style.backgroundColor = 'red';

    editButton.addEventListener('click', function () {
        document.querySelector('#studentname').value = student.name;
        document.querySelector('#studentAge').value = student.age;
        document.querySelector('#studentcourse').value = student.course;
        editingId = student.id;
        setMessage('Edit the student details and submit the form.', 'blue');
    });

    deleteButton.addEventListener('click', function () {
        students = students.filter((item) => item.id !== student.id);
        saveStudentsToLocalStorage();
        renderStudents();
        setMessage('Student deleted successfully!', 'green');

        if (editingId === student.id) {
            editingId = null;
            studentform.reset();
        }
    });

    actionCell.append(editButton, deleteButton);
    row.append(nameCell, ageCell, courseCell, actionCell);

    return row;
}

function renderStudents() {
    studentlist.innerHTML = '';
    students.forEach(function (student) {
        studentlist.appendChild(createStudentRow(student));
    });
}

studentform.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.querySelector('#studentname').value.trim();
    const ageValue = document.querySelector('#studentAge').value.trim();
    const course = document.querySelector('#studentcourse').value.trim();

    if (!validateStudent(name, ageValue, course)) {
        setMessage('Please fill in all fields with a valid age.', 'red');
        return;
    }

    const studentData = {
        id: editingId || Date.now().toString(),
        name,
        age: Number(ageValue),
        course
    };

    if (editingId) {
        const index = students.findIndex((student) => student.id === editingId);
        if (index !== -1) {
            students[index] = studentData;
        }
        setMessage('Student updated successfully!', 'green');
        editingId = null;
    } else {
        students.push(studentData);
        setMessage('Student added successfully!', 'green');
    }

    saveStudentsToLocalStorage();
    renderStudents();
    studentform.reset();
});

searchInput.addEventListener('input', function () {
    const searchValue = searchInput.value.toLowerCase();
    const rows = studentlist.querySelectorAll('tr');

    rows.forEach(function (row) {
        const studentName = row.cells[0].textContent.toLowerCase();
        row.style.display = studentName.includes(searchValue) ? '' : 'none';
    });
});

renderStudents();

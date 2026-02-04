let students = JSON.parse(localStorage.getItem('blossomData')) || [
    { name: "Mennas Fransiska", studentNumber: "2003", marks: 78 },
    { name: "Amunyera Lovisa", studentNumber: "3210", marks: 62 },
    { name: "Abiatar Rauna", studentNumber: "2004", marks: 49 }
];

const calculateGrade = (m) => {
    if (m >= 75) return "A";
    if (m >= 65) return "B";
    if (m >= 55) return "C";
    if (m >= 50) return "D";
    return "F";
};

function displayStudents(filtered = students) {
    const tableBody = document.querySelector("#studentTable tbody");
    tableBody.innerHTML = "";

    filtered.forEach((s, i) => {
        const grade = calculateGrade(s.marks);
        const pass = s.marks >= 50 ? "Pass" : "Fail";
        
        tableBody.innerHTML += `
            <tr>
                <td><strong>${s.name}</strong></td>
                <td>${s.studentNumber}</td>
                <td>${s.marks}%</td>
                <td>${grade}</td>
                <td><span class="status-tag ${pass.toLowerCase()}">${pass.toUpperCase()}</span></td>
                <td>
                    <button class="btn-edit" onclick="editMode(${i})">✏️</button>
                    <button class="btn-delete" onclick="deleteRecord(${i})">🗑️</button>
                </td>
            </tr>
        `;
    });
    updateStats(filtered);
}

function updateStats(data) {
    const statsRow = document.getElementById('statsRow');
    const average = data.length ? (data.reduce((a, b) => a + b.marks, 0) / data.length).toFixed(1) : 0;
    statsRow.innerHTML = `
        <div class="stat-box"><h4>Students</h4><p>${data.length}</p></div>
        <div class="stat-box"><h4>Class Average</h4><p>${average}%</p></div>
        <div class="stat-box"><h4>Top Performance</h4><p>${data.length ? Math.max(...data.map(s => s.marks)) : 0}%</p></div>
    `;
}

function handleFormSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('newName').value;
    const id = document.getElementById('newNumber').value;
    const mark = parseInt(document.getElementById('newMark').value);
    const index = document.getElementById('editIndex').value;

    if (index === "-1") {
        students.push({ name, studentNumber: id, marks: mark });
    } else {
        students[index] = { name, studentNumber: id, marks: mark };
        document.getElementById('editIndex').value = "-1";
        document.getElementById('submitBtn').innerText = "Save Record";
    }

    localStorage.setItem('blossomData', JSON.stringify(students));
    displayStudents();
    e.target.reset();
}

function deleteRecord(i) {
    if(confirm("Confirm Deletion?")) {
        students.splice(i, 1);
        localStorage.setItem('blossomData', JSON.stringify(students));
        displayStudents();
    }
}

function editMode(i) {
    const s = students[i];
    document.getElementById('newName').value = s.name;
    document.getElementById('newNumber').value = s.studentNumber;
    document.getElementById('newMark').value = s.marks;
    document.getElementById('editIndex').value = i;
    document.getElementById('submitBtn').innerText = "Add/Update";
}

function searchStudents() {
    const term = document.getElementById('searchBar').value.toLowerCase();
    const filtered = students.filter(s => s.name.toLowerCase().includes(term) || s.studentNumber.includes(term));
    displayStudents(filtered);
}

window.onload = () => displayStudents();
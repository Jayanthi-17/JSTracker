class AttendanceTrackerSystem {
    constructor() {
        this.employees = {}; 
        this.attendance = {}; 
        this.currentEmployeeId = 0;
    }
    addEmployee(name, department) {
        // Check if employee already exists
        for (const id in this.employees) {
            if (this.employees[id].name === name && this.employees[id].department === department) {
                return `⚠️ You are already an employee with ID ${id}.`;
            }
        }
    
        // Add new employee if not found
        this.currentEmployeeId++;
        this.employees[this.currentEmployeeId] = {
            id: this.currentEmployeeId,
            name: name,
            department: department,
            hireDate: new Date().toLocaleDateString()
        };
        return `✅ Employee '${name}' added successfully with ID ${this.currentEmployeeId}`;
    }
    

    markAttendance(employeeId) {
        if (!this.employees.hasOwnProperty(employeeId)) {
            return "❌ Employee ID not found.";
        }
        
        const date = new Date().toISOString().split('T')[0];

        if (!this.attendance[date]) {
            this.attendance[date] = new Set();
        }

        if (this.attendance[date].has(employeeId)) {
            return `⚠️ Employee ID ${employeeId} is already marked present today.`;
        }

        this.attendance[date].add(employeeId);
        return `✅ Attendance marked for employee ID ${employeeId} on ${date}.`;
    }

    viewAttendance() {
        return Object.entries(this.attendance).map(([date, ids]) => {
            const names = [...ids].map(id => this.employees[id]?.name || 'Unknown');
            return `📅 Date: ${date}, Present: ${names.join(', ')}`;
        });
    }

    viewEmployees() {
        return Object.values(this.employees).map(emp => 
            `🆔 ID: ${emp.id}, Name: ${emp.name}, Department: ${emp.department}, Hire Date: ${emp.hireDate}`
        );
    }
}

const ats = new AttendanceTrackerSystem();

function addEmployee() {
    const name = document.getElementById("employeeName").value.trim();
    const department = document.getElementById("employeeDept").value.trim();
    
    if (name && department) {
        const message = ats.addEmployee(name, department);
        document.getElementById("employeeMessage").innerText = message;

        if (!message.includes("⚠️")) {
            triggerFlowerEffect("addEmployeeBtn"); // Trigger animation only if employee is added
            document.getElementById("employeeName").value = "";
            document.getElementById("employeeDept").value = "";
        }
    } else {
        document.getElementById("employeeMessage").innerText = "⚠️ Please enter both Name and Department.";
    }
}
function markAttendance() {
    const employeeId = parseInt(document.getElementById("employeeId").value);
    
    if (!isNaN(employeeId)) {
        document.getElementById("attendanceMessage").innerText = ats.markAttendance(employeeId);
        triggerFlowerEffect("markAttendanceBtn"); // Trigger animation
        document.getElementById("employeeId").value = "";
    } else {
        document.getElementById("attendanceMessage").innerText = "⚠️ Please enter a valid Employee ID.";
    }
}

function viewAttendance() {
    const attendanceList = document.getElementById("attendanceList");
    attendanceList.innerHTML = "";
    
    const records = ats.viewAttendance();
    if (records.length === 0) {
        attendanceList.innerHTML = "<li>📌 No attendance records found.</li>";
    } else {
        records.forEach(record => {
            const li = document.createElement("li");
            li.textContent = record;
            attendanceList.appendChild(li);
        });
    }
}

function viewEmployees() {
    const employeeList = document.getElementById("employeeList");
    employeeList.innerHTML = "";
    
    const employees = ats.viewEmployees();
    if (employees.length === 0) {
        employeeList.innerHTML = "<li>📌 No employees added yet.</li>";
    } else {
        employees.forEach(record => {
            const li = document.createElement("li");
            li.textContent = record;
            employeeList.appendChild(li);
        });
    }
}
// 🌸 Flower Animation Effect
function triggerFlowerEffect(buttonId) {
    const button = document.getElementById(buttonId);
    
    for (let i = 0; i < 5; i++) { 
        let flower = document.createElement("span");
        flower.classList.add("flower");
        flower.innerHTML = "🤩"; // Flower symbol

        let x = (Math.random() * 100 - 50) + "px"; // Random horizontal position
        let y = (Math.random() * 100 - 50) + "px"; // Random vertical position

        flower.style.setProperty("--x", x);
        flower.style.setProperty("--y", y);

        // Set position in the center relative to button
        flower.style.position = "absolute";
        flower.style.left = "50%";
        flower.style.top = "50%";
        flower.style.transform = "translate(-50%, -50%)";

        button.appendChild(flower);

        // Remove flower after animation completes
        setTimeout(() => flower.remove(), 1000);
    }
}


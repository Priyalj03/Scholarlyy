const bcrypt = require('bcrypt');
const Student = require('../models/studentSchema.js');
const Subject = require('../models/subjectSchema.js');
const Parent = require('../models/parentSchema.js');

const studentRegister = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        const existingStudent = await Student.findOne({
            rollNum: req.body.rollNum,
            school: req.body.adminID,
            sclassName: req.body.sclassName,
        });

        if (existingStudent) {
            res.send({ message: 'Roll Number already exists' });
        }
        else {
            // Create student first
            const student = new Student({
                name: req.body.name,
                rollNum: req.body.rollNum,
                password: hashedPass,
                email: req.body.email,
                phoneNumber: req.body.phoneNumber,
                address: req.body.address,
                sclassName: req.body.sclassName,
                school: req.body.adminID,
                role: "Student"
            });

            let result = await student.save();

            // If parent information is provided, create parent and link it
            if (req.body.parent) {
                const parentSalt = await bcrypt.genSalt(10);
                const parentHashedPass = await bcrypt.hash(req.body.parent.password, parentSalt);

                const parent = new Parent({
                    name: req.body.parent.name,
                    email: req.body.parent.email,
                    phoneNumber: req.body.parent.phoneNumber,
                    password: parentHashedPass,
                    school: req.body.adminID,
                    student: result._id,
                    role: "Parent"
                });

                const savedParent = await parent.save();
                
                // Update student with parent reference
                result.parent = savedParent._id;
                await result.save();
            }

            result.password = undefined;
            res.send(result);
        }
    } catch (err) {
        console.error('Error in studentRegister:', err);
        res.status(500).json({ message: err.message });
    }
};

const studentLogIn = async (req, res) => {
    try {
        let student = await Student.findOne({ rollNum: req.body.rollNum, name: req.body.studentName });
        if (student) {
            const validated = await bcrypt.compare(req.body.password, student.password);
            if (validated) {
                student = await student.populate("school", "schoolName")
                student = await student.populate("sclassName", "sclassName")
                student.password = undefined;
                student.examResult = undefined;
                student.attendance = undefined;
                res.send(student);
            } else {
                res.send({ message: "Invalid password" });
            }
        } else {
            res.send({ message: "Student not found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getStudents = async (req, res) => {
    try {
        let students = await Student.find({ school: req.params.id }).populate("sclassName", "sclassName");
        if (students.length > 0) {
            let modifiedStudents = students.map((student) => {
                return { ...student._doc, password: undefined };
            });
            res.send(modifiedStudents);
        } else {
            res.send({ message: "No students found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getStudentDetail = async (req, res) => {
    try {
        let student = await Student.findById(req.params.id)
            .populate("school", "schoolName")
            .populate("sclassName", "sclassName")
            .populate("examResult.subName", "subName")
            .populate("attendance.subName", "subName sessions")
            .populate("parent", "name email phoneNumber");
        if (student) {
            student.password = undefined;
            res.send(student);
        }
        else {
            res.send({ message: "No student found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

const deleteStudent = async (req, res) => {
    try {
        // First find the student to get the parent reference
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.send({ message: "Student not found" });
        }

        // If student has a parent, delete the parent
        if (student.parent) {
            await Parent.findByIdAndDelete(student.parent);
        }

        // Delete the student
        const result = await Student.findByIdAndDelete(req.params.id);
        res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
}

const deleteStudents = async (req, res) => {
    try {
        // Find all students in the school
        const students = await Student.find({ school: req.params.id });
        
        // Get all parent IDs
        const parentIds = students
            .filter(student => student.parent)
            .map(student => student.parent);

        // Delete all associated parents
        if (parentIds.length > 0) {
            await Parent.deleteMany({ _id: { $in: parentIds } });
        }

        // Delete all students
        const result = await Student.deleteMany({ school: req.params.id });
        if (result.deletedCount === 0) {
            res.send({ message: "No students found to delete" });
        } else {
            res.send(result);
        }
    } catch (error) {
        res.status(500).json(error);
    }
}

const deleteStudentsByClass = async (req, res) => {
    try {
        // Find all students in the class
        const students = await Student.find({ sclassName: req.params.id });
        
        // Get all parent IDs
        const parentIds = students
            .filter(student => student.parent)
            .map(student => student.parent);

        // Delete all associated parents
        if (parentIds.length > 0) {
            await Parent.deleteMany({ _id: { $in: parentIds } });
        }

        // Delete all students
        const result = await Student.deleteMany({ sclassName: req.params.id });
        if (result.deletedCount === 0) {
            res.send({ message: "No students found to delete" });
        } else {
            res.send(result);
        }
    } catch (error) {
        res.status(500).json(error);
    }
}

const updateStudent = async (req, res) => {
    try {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10)
            res.body.password = await bcrypt.hash(res.body.password, salt)
        }
        let result = await Student.findByIdAndUpdate(req.params.id,
            { $set: req.body },
            { new: true })

        result.password = undefined;
        res.send(result)
    } catch (error) {
        res.status(500).json(error);
    }
}

const updateExamResult = async (req, res) => {
    const { subName, marksObtained } = req.body;

    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.send({ message: 'Student not found' });
        }

        const existingResult = student.examResult.find(
            (result) => result.subName.toString() === subName
        );

        if (existingResult) {
            existingResult.marksObtained = marksObtained;
        } else {
            student.examResult.push({ subName, marksObtained });
        }

        const result = await student.save();
        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const studentAttendance = async (req, res) => {
    const { subName, status, date } = req.body;

    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.send({ message: 'Student not found' });
        }

        const subject = await Subject.findById(subName);
        if (!subject) {
            return res.send({ message: 'Subject not found' });
        }

        // Convert both dates to start of day for comparison
        const inputDate = new Date(date);
        inputDate.setHours(0, 0, 0, 0);

        const existingAttendance = student.attendance.find(
            (a) => {
                const attendanceDate = new Date(a.date);
                attendanceDate.setHours(0, 0, 0, 0);
                return attendanceDate.getTime() === inputDate.getTime() && 
                       a.subName.toString() === subName;
            }
        );

        if (existingAttendance) {
            existingAttendance.status = status;
            const result = await student.save();
            return res.send({ message: 'Attendance updated successfully', result });
        } else {
            // Check if the student has already attended the maximum number of sessions
            const attendedSessions = student.attendance.filter(
                (a) => a.subName.toString() === subName
            ).length;

            if (attendedSessions >= subject.sessions) {
                return res.send({ message: 'Maximum attendance limit reached' });
            }

            student.attendance.push({ date: inputDate, status, subName });
            const result = await student.save();
            return res.send({ message: 'Attendance marked successfully', result });
        }
    } catch (error) {
        console.error('Attendance Error:', error);
        res.status(500).json({ message: 'Error marking attendance', error: error.message });
    }
};

const clearAllStudentsAttendanceBySubject = async (req, res) => {
    const subName = req.params.id;

    try {
        const result = await Student.updateMany(
            { 'attendance.subName': subName },
            { $pull: { attendance: { subName } } }
        );
        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const clearAllStudentsAttendance = async (req, res) => {
    const schoolId = req.params.id

    try {
        const result = await Student.updateMany(
            { school: schoolId },
            { $set: { attendance: [] } }
        );

        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const removeStudentAttendanceBySubject = async (req, res) => {
    const studentId = req.params.id;
    const subName = req.body.subId

    try {
        const result = await Student.updateOne(
            { _id: studentId },
            { $pull: { attendance: { subName: subName } } }
        );

        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};


const removeStudentAttendance = async (req, res) => {
    const studentId = req.params.id;

    try {
        const result = await Student.updateOne(
            { _id: studentId },
            { $set: { attendance: [] } }
        );

        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};


module.exports = {
    studentRegister,
    studentLogIn,
    getStudents,
    getStudentDetail,
    deleteStudents,
    deleteStudent,
    updateStudent,
    studentAttendance,
    deleteStudentsByClass,
    updateExamResult,

    clearAllStudentsAttendanceBySubject,
    clearAllStudentsAttendance,
    removeStudentAttendanceBySubject,
    removeStudentAttendance,
};
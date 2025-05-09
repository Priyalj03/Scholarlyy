const bcrypt = require('bcrypt');
const Parent = require('../models/parentSchema.js');
const Student = require('../models/studentSchema.js');

const parentRegister = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        const existingParent = await Parent.findOne({
            email: req.body.email,
            school: req.body.adminID
        });

        if (existingParent) {
            res.send({ message: 'Email already exists' });
        }
        else {
            const parent = new Parent({
                name: req.body.name,
                email: req.body.email,
                phoneNumber: req.body.phoneNumber,
                password: hashedPass,
                school: req.body.adminID,
                student: req.body.student,
                role: "Parent"
            });

            let result = await parent.save();
            result.password = undefined;

            await Student.findByIdAndUpdate(req.body.student, { parent: parent._id });

            res.send(result);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const parentLogIn = async (req, res) => {
    try {
        let parent = await Parent.findOne({ email: req.body.email });
        if (parent) {
            const validated = await bcrypt.compare(req.body.password, parent.password);
            if (validated) {
                parent = await parent.populate("school", "schoolName");
                parent = await parent.populate("student", "name rollNum sclassName");
                parent.password = undefined;
                res.send(parent);
            } else {
                res.send({ message: "Invalid password" });
            }
        } else {
            res.send({ message: "Parent not found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getStudentsForParent = async (req, res) => {
    try {
        const students = await Student.find({ 
            school: req.params.id,
            parent: { $exists: false } // Only get students without parents
        })
            .select('name rollNum sclassName')
            .populate('sclassName', 'sclassName');
        res.send(students);
    } catch (err) {
        res.status(500).json(err);
    }
};

const getParents = async (req, res) => {
    try {
        const parents = await Parent.find({ school: req.params.id })
            .select('-password')
            .populate('student', 'name rollNum sclassName')
            .populate('school', 'schoolName');
        res.send(parents);
    } catch (err) {
        res.status(500).json(err);
    }
};

const deleteParent = async (req, res) => {
    try {
        // Find the parent first to get the student reference
        const parent = await Parent.findById(req.params.id);
        if (!parent) {
            return res.send({ message: "Parent not found" });
        }

        // Remove parent reference from the student
        if (parent.student) {
            await Student.findByIdAndUpdate(parent.student, { $unset: { parent: 1 } });
        }

        // Delete the parent
        const result = await Parent.findByIdAndDelete(req.params.id);
        res.send(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

const getParentDetail = async (req, res) => {
    try {
        let parent = await Parent.findById(req.params.id)
            .populate("school", "schoolName")
            .populate("student", "name rollNum sclassName")
            .select('-password');
            
        if (parent) {
            res.send(parent);
        }
        else {
            res.send({ message: "No parent found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = {
    parentRegister,
    parentLogIn,
    getStudentsForParent,
    getParents,
    deleteParent,
    getParentDetail
}; 
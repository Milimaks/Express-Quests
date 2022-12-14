// const users = [
//     {
//         firstname: 'John',
//         lastname: "Doe",
//         email: "john.doe@example.com",
//         city: "Paris",
//         language: "English",
//     },
//     {
//         firstname: 'Valeriy',
//         lastname: "Appius",
//         email: "valeriy.appius@example.com",
//         city: "Moscow",
//         language: "Russian",
//     },
//     {
//         firstname: 'Ralf',
//         lastname: "Geronimo",
//         email: "ralf.geronimo@example.com",
//         city: "New York",
//         language: 'Italian',
//     },
//     {
//         firstname: 'Maria',
//         lastname: 'Iskandar',
//         email: 'maria.iskandar@example.com',
//         city: 'New York',
//         language: 'German',
//     },
//     {
//         firstname: 'Jane',
//         lastname: "Doe",
//         email: "jane.doe@example.com",
//         city: "London",
//         language: "English",
//     },
//     {
//         firstname: 'Johanna',
//         lastname: "Martino",
//         email: "johanna.martino@example.com",
//         city: "Milan",
//         language: "Spanish",
//     },
// ];

const database = require("./database")

const updateUser = (req, res) => {
    const id = parseInt(req.params.id);
    const { firstname, lastname, email, city, language } = req.body;

    database
        .query(
            "update users set firstname = ?, lastname = ?, email = ?, city = ?, language = ? where id = ?",
            [firstname, lastname, email, city, language, id]
        )
        .then(([result]) => {
            if (result.affectedRows === 0) {
                res.status(404).send("Not Found");
            } else {
                res.sendStatus(204);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error editing the user");
        });
};

const postUser = (req, res) => {
    const { firstname, lastname, email, city, language } = req.body;

    database
        .query(
            "INSERT INTO users(firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
            [firstname, lastname, email, city, language]
        )
        .then(([result]) => {
            res.location(`/api/users/${result.insertId}`).sendStatus(201);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error saving the movie");
        });
};

const getUsers = (req, res) => {
    let sql = "select * from users";
    const sqlValues = [];

    if (req.query.language != null) {
        sql += " where language = ?";
        sqlValues.push(req.query.language);

        if (req.query.city != null) {
            sql += " and city <= ?";
            sqlValues.push(req.query.city);
        }
    } else if (req.query.city != null) {
        sql += " where city <= ?";
        sqlValues.push(req.query.city);
    }


    database
        .query(sql, sqlValues)
        .then(([users]) => {
            res.json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error retrieving data from database");
        });
};

const getUserById = (req, res) => {
    const id = parseInt(req.params.id);

    database
        .query("select * from users where id = ?", [id])
        .then(([users]) => {
            if (users[0] != null) {
                res.json(users[0]);
            } else {
                res.status(404).send("Not Found");
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error retrieving data from database");
        });
};
const deleteUser = (req, res) => {
    const id = parseInt(req.params.id);

    database
        .query("delete from users where id = ?", [id])
        .then(([result]) => {
            if (result.affectedRows === 0) {
                res.status(404).send("Not Found");
            } else {
                res.sendStatus(204);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error deleting the movie");
        });
};


module.exports = {
    getUserById,
    getUsers,
    postUser,
    updateUser,
    deleteUser,
};

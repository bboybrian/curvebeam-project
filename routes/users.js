var express = require('express');
var router = express.Router();
var sanitizeHtml = require('sanitize-html');

/* GET all students */
router.get("/students", async (req, res) => {
  try {
    const pool = await req.pool;
    const request = await pool.request();

    let query = `SELECT "id", "name", "class", "c_id", "left" FROM "Students" FULL OUTER JOIN "Cars" ON "id" = "s_id"`;
    let response = await request.query(query);

    if (response.recordset.length > 0) {
      res.status(200).send(response.recordset);
    } else {
      res.status(400).send(response);
    }

  } catch (err) {
    console.error(err);
    res.sendStatus(400);
  }
});

/* GET all student-car pairs */
router.get("/student-cars", async (req, res) => {
  try {
    const pool = await req.pool;
    const request = await pool.request();

    let query = `SELECT "id", "name", "class", "c_id", "left" FROM "Students" INNER JOIN "Cars" ON "id" = "s_id"`;
    let response = await request.query(query);

    if (response.recordset.length > 0) {
      res.status(200).send(response.recordset);
    } else {
      res.status(400).send(response);
    }

  } catch (err) {
    console.error(err);
    res.sendStatus(400);
  }
});

//#region LINK student-car
// Link student <-> car
router.post("/assign-car", async (req, res) => {
  try {
    // Sanitize inputs
    let c_id = sanitizeHtml(req.body.car);
    let s_id = sanitizeHtml(req.body.s_id);

    // console.log(s_id)

    // Update table
    const pool = await req.pool;
    const request = await pool.request();

    let dup_check = `SELECT * FROM "Cars" WHERE "c_id" = '${c_id}' AND "s_id" = '${s_id}'`;
    let dup_check_response = await request.query(dup_check);
    if (dup_check_response.recordset.length > 0) {
      res.status(400).send("Duplicate entry");
      return;
    }

    let query = `INSERT INTO "Cars" (s_id, c_id) VALUES ('${s_id}', '${c_id}')`;
    let response = await request.query(query);
    if (response.rowsAffected[0] > 0) {
      // Success
      res.status(200).send(response);
    } else {
      res.status(400).send("POST/assign-car  #assign car to student failed.");
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(400);
  }
});

// Unink student <->  car.
router.delete("/unassign-car", async (req, res) => {
  try {
    // Sanitize inputs
    let c_id = sanitizeHtml(req.body.car);
    let s_id = sanitizeHtml(req.body.s_id);

    // Update table
    const pool = await req.pool;
    const request = await pool.request();

    let query = `DELETE FROM "Cars" WHERE "s_id" = '${s_id}' AND "c_id" = '${c_id}'`;
    let response = await request.query(query);

    if (response.rowsAffected[0] > 0) {
      // Success
      res.status(200).send(response);
    } else {
      res.status(400).send("DELETE/unassign-car  #unassign car to student failed.");
    }

  } catch (err) {
    console.error(err);
    res.sendStatus(400);
  }
});
//#endregion

//#region student
// Mark student as 'left'
router.put("/student-left", async (req, res) => {
  try {
    // Sanitize inputs
    let ids = sanitizeHtml(req.body.ids).split(',').join("','");//.slice(1,-1);

    // Update table
    const pool = await req.pool;
    const request = await pool.request();
    // res.send(200);
    // return;

    let query = `UPDATE "Students" SET "left" = 1 WHERE "id" IN ('${ids}')`;
    let response = await request.query(query);
    if (response.rowsAffected[0] > 0) {
      // Success
      res.status(200).send(response);
    } else {
      res.status(400).send("PUT/student-left  #mark student as left failed.");
    }

  } catch (err) {
    console.error(err);
    res.sendStatus(400);
  }
});

// Reset ALL student-left
router.put("/reset-student-left", async (req, res) => {
  try {
    // Update table
    const pool = await req.pool;
    const request = await pool.request();

    let query = `UPDATE "Students" SET "left" = 0`;
    let response = await request.query(query);
    if (response.rowsAffected[0] > 0) {
      // Success
      res.status(200).send(response);
    } else {
      res.status(400).send("PUT/reset-student-left  #reset student-left failed.");
    }

  } catch (err) {
    console.error(err);
    res.sendStatus(400);
  }
});

// Insert a student
router.post("/student", async (req, res) => {
  try {
    // Sanitize inputs
    let class_ = sanitizeHtml(req.body.class);
    let name = sanitizeHtml(req.body.name);

    // Update table
    const pool = await req.pool;
    const request = await pool.request();

    let dup_check = `SELECT * FROM "Students" WHERE "name" = '${name}' AND "class" = '${class_}'`;
    let dup_check_response = await request.query(dup_check);
    if (dup_check_response.recordset.length > 0) {
      res.status(400).send("Duplicate entry");
      return;
    }

    let query = `INSERT INTO "Students" (name, class) VALUES ('${name}', '${class_}')`;
    let response = await request.query(query);
    if (response.rowsAffected[0] > 0) {
      // Success
      res.status(200).send(response);
    } else {
      res.status(400).send("POST/student  #insert student failed.");
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(400);
  }
});

// Edit a student
router.put("/student", async (req, res) => {
  try {
    // Sanitize inputs
    let class_ = req.body.class ? sanitizeHtml(req.body.class) : null;
    let name = req.body.name ? sanitizeHtml(req.body.name) : null;
    let id = sanitizeHtml(req.body.s_id);

    // Update table
    const pool = await req.pool;
    const request = await pool.request();
    let query = `UPDATE "Students" SET name = '${name}', class = '${class_}' WHERE id = '${id}'`;
    let response = await request.query(query);
    if (response.rowsAffected[0] > 0) {
      // Success
      res.status(200).send(response);
    } else {
      res.status(400).send("PUT/student  #edit student failed.");
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(400);
  }
});

// DELETE a student
router.delete("/student", async (req, res) => {
  try {
    let student_id = sanitizeHtml(req.body.student_id);
    const pool = await req.pool;
    const request = await pool.request();
    let query = `DELETE FROM "Students" WHERE id = '${student_id}'`;
    let response = await request.query(query);

    if (response.rowsAffected[0] > 0) {
      // Success
      res.status(200).send(response);
    } else {
      res.status(400).send("DELETE/student  #delete student failed.");
    }

  } catch (err) {
    console.error(err);
    res.sendStatus(400);
  }
});

//#endregion

//#region car
// Delete a student's cars
router.delete("/car", async (req, res) => {
  try {
    let s_id = sanitizeHtml(req.body.s_id);
    const pool = await req.pool;
    const request = await pool.request();
    let query = `DELETE FROM "Cars" WHERE s_id = '${s_id}'`;
    let response = await request.query(query);

    if (response.rowsAffected[0] > 0) {
      // Success
      res.status(200).send(response);
    } else {
      res.status(400).send("DELETE/car  #delete car failed.");
    }

  } catch (err) {
    console.error(err);
    res.sendStatus(400);
  }
});
//#endregion

module.exports = router;

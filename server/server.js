// src/index.mjs
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql2 from 'mysql2';

const app = express();
const port = 3001;

// Enable CORS for all routes
app.use(cors());

app.use(express.json());

const conn = mysql2.createConnection({
  host: '192.168.101.199',
  port: 3306,
  user: 'root',
  password: '',
  database: 'mysql-api'
});
conn.config.namedPlaceholders = true;
conn.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

//todo Get all records
app.get('/', async (req, res) => {
  try {
    let sql = `SELECT * FROM librarys INNER JOIN users ON librarys.CREATE_BY = users.id`;
    conn.execute(sql, (err, rows) => {
      if (err) {
        res.status(500).json({
          message: err.message
        });
        return;
      }
      res.status(200).json(rows);
    });
  } catch (error) {
    console.error('Error fetching Kintone data:', error);

    // Send the error message back to the client for debugging
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

app.get('/getLibrary/:id', async (req, res) => {

  const { id } = req.params;
  try {
    let sql = `SELECT * FROM librarys INNER JOIN users ON librarys.CREATE_BY = users.id WHERE LIB_ID = '${id}'`;
    conn.execute(sql, (err, rows) => {
      if (err) {
        res.status(500).json({
          message: err.message
        });
        return;
      }
      res.status(200).json(rows);
    });
  } catch (error) {
    console.error('Error fetching Kintone data:', error);

    // Send the error message back to the client for debugging
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }

});

//todo Get 1 record
app.post('/getUser', async (req, res) => {
  try {
    const { userInput, password } = req.body;
    let sql = `SELECT * FROM users WHERE password = :password AND name = :userInput OR email = :userInput `;
    conn.execute(sql, { userInput, password }, (err, rows) => {
      if (err) {
        res.status(500).json({
          message: err.message
        });
        return;
      }

      res.status(200).json(rows);
    });
  } catch (error) {
    console.error('Error:', error.errors.query);
    res.status(500).json({ error: error, details: error.message });
  }
});

// add code new 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the upload directory exists
const uploadDir = path.join(__dirname, '../server/src/uploads/');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

// Initialize upload variable
const upload = multer({
  storage: storage,
  limits: { fileSize: 500000000 }
}).fields([
  { name: 'files', maxCount: 10 },
  { name: 'image', maxCount: 10 }
]);

// POST route to handle array file upload
app.post('/addLibrary', upload, async (req, res) => {
  try {
    const imageFile = req.files.image[0];
    const files = req.files?.files || [];
    const image = imageFile ? imageFile.filename : '';

    let attrachment = [];
    await files.forEach(item => {
      let file = {
        filename: item.filename,
        originalname: item.originalname,
        size: item.size
      };
      attrachment.push(file);
    });

    const {
      userName,
      libraryName,
      description,
      reference,
      overviewDes,
      installationDes,
      HowToUseDes,
      exampleDes,
      suggestionDes,
      rowsInstallations,
      rowsHowToUse,
      rowsExample,
    } = JSON.parse(req.body.data);

    const libraryData = {
      LIB_NAME: libraryName,
      DESCRIPTION: description,
      REFERENCE: reference,
      DESCRIPTIONS_OVER: overviewDes,
      DESCRIPTIONS_INS: installationDes,
      DESCRIPTIONS_HTU: HowToUseDes,
      DESCRIPTIONS_EXP: exampleDes,
      DESCRIPTIONS_SGT: suggestionDes,
      IMAGE: image,
      CREATE_BY: userName,
      ATTRACHMENT: JSON.stringify(attrachment),
      INSTALLATION: JSON.stringify(rowsInstallations),
      HOWTOUSE: JSON.stringify(rowsHowToUse),
      EXAMPLE: JSON.stringify(rowsExample)
    }
    const sql = `INSERT INTO librarys (LIB_NAME, DESCRIPTION, REFERENCE, DESCRIPTIONS_OVER, DESCRIPTIONS_INS, DESCRIPTIONS_HTU, DESCRIPTIONS_EXP, DESCRIPTIONS_SGT, IMAGE, CREATE_BY, ATTRACHMENT, INSTALLATION, HOWTOUSE, EXAMPLE)
                VALUES(:LIB_NAME, :DESCRIPTION, :REFERENCE, :DESCRIPTIONS_OVER, :DESCRIPTIONS_INS, :DESCRIPTIONS_HTU, :DESCRIPTIONS_EXP, :DESCRIPTIONS_SGT, :IMAGE, :CREATE_BY, :ATTRACHMENT, :INSTALLATION, :HOWTOUSE, :EXAMPLE)`;

    conn.execute(sql, libraryData, async (err, rows) => {
      if (err) {
        res.status(500).json({ message: err.message });
        return;
      }

      const libraryInsertId = rows.insertId;
      res.status(200).json({
        message: 'success',
        data: libraryInsertId
      });
    })
  } catch (error) {
    // console.error('Error:', error);
    res.status(500).json(error);
  }
});

app.post('/mobile_addLibrary', upload, async (req, res) => {
  try {
    // console.log('req', req.files);

    // Safely retrieve image file if exists
    const imageFile = req.files?.image?.[0];
    const files = req.files?.files || [];
    const image = imageFile ? imageFile.filename : '';

    let attrachment = [];

    // Using a regular for-loop instead of forEach with await
    for (let item of files) {
      let file = {
        filename: item.filename,
        originalname: item.originalname,
        size: item.size,
      };
      attrachment.push(file);
    }

    // console.log('attrachment', attrachment);

    const {
      userName,
      libraryName,
      description,
      reference,
      overviewDes,
      installationDes,
      HowToUseDes,
      exampleDes,
      suggestionDes,
      rowsInstallations,
      rowsHowToUse,
      rowsExample,
    } = JSON.parse(req.body.data);

    const libraryData = {
      LIB_NAME: libraryName,
      DESCRIPTION: description,
      REFERENCE: reference,
      DESCRIPTIONS_OVER: overviewDes,
      DESCRIPTIONS_INS: installationDes,
      DESCRIPTIONS_HTU: HowToUseDes,
      DESCRIPTIONS_EXP: exampleDes,
      DESCRIPTIONS_SGT: suggestionDes,
      IMAGE: image,
      CREATE_BY: userName,
      ATTRACHMENT: JSON.stringify(attrachment),
      INSTALLATION: JSON.stringify(rowsInstallations),
      HOWTOUSE: JSON.stringify(rowsHowToUse),
      EXAMPLE: JSON.stringify(rowsExample),
    };

    console.log('libraryData', libraryData);

    const sql = `
      INSERT INTO librarys (
        LIB_NAME, DESCRIPTION, REFERENCE, DESCRIPTIONS_OVER, DESCRIPTIONS_INS, 
        DESCRIPTIONS_HTU, DESCRIPTIONS_EXP, DESCRIPTIONS_SGT, IMAGE, CREATE_BY, 
        ATTRACHMENT, INSTALLATION, HOWTOUSE, EXAMPLE
      ) VALUES (:LIB_NAME, :DESCRIPTION, :REFERENCE, :DESCRIPTIONS_OVER, :DESCRIPTIONS_INS, :DESCRIPTIONS_HTU, :DESCRIPTIONS_EXP, :DESCRIPTIONS_SGT, :IMAGE, :CREATE_BY, :ATTRACHMENT, :INSTALLATION, :HOWTOUSE, :EXAMPLE)
    `;

    conn.query(sql, libraryData, (err, response) => {
      if (err) throw err;
      res.json({ message: 'Library added', data: response });
    });

    // Send a response after query succeeds
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json(error);  // Ensure only one response is sent
  }
});

app.put('/mobile_update_library/:id', upload, async (req, res) => {
  try {
    const { id } = req.params;
    const files = req.files.files || [];
    const imageFile = req.files;
    
    // Parse the rest of the data from req.body.data
    const {
      // userName,
      libraryName,
      description,
      reference,
      overviewDes,
      installationDes,
      HowToUseDes,
      exampleDes,
      suggestionDes,
      rowsInstallations,
      rowsHowToUse,
      rowsExample,
      defaultImage,
      defaultFiles,
      removedFiles
    } = JSON.parse(req.body.data);

    if(removedFiles.length > 0) {
      removedFiles.forEach(filename => {
        const filePath = path.join(__dirname, '../server/src/uploads/', filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }
    
    let attrachment = [];

    // Using a regular for-loop instead of forEach with await
    if (files.length > 0) {
      for (let item of files) {
        let file = {
          filename: item.filename,
          originalname: item.originalname,
          size: item.size,
        };
        attrachment.push(file);
      }
      if(defaultFiles.length > 0) attrachment = [...defaultFiles, ...attrachment];
    }else {
      if(defaultFiles.length > 0) {
        attrachment = [...defaultFiles];
      }else {
        attrachment = [];
      }
    }
    

    // console.log('files', files);
    // console.log('defaultFiles', defaultFiles);
    // console.log('removedFiles', removedFiles);
    // console.log('attrachment', attrachment);
    
    
    let image = '';
    
    // console.log('image file:', imageFile);
    // console.log('default:', defaultImage);

    if (imageFile.image) {
        image = imageFile.image[0].filename;

        const oldImagePath = path.join(__dirname, '../server/src/uploads/', defaultImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
    } else {
      image = defaultImage;
    }

    

    const sql = `UPDATE librarys SET 
                  LIB_NAME = ?, 
                  DESCRIPTION = ?, 
                  REFERENCE = ?, 
                  DESCRIPTIONS_OVER = ?, 
                  DESCRIPTIONS_INS = ?, 
                  DESCRIPTIONS_HTU = ?, 
                  DESCRIPTIONS_EXP = ?, 
                  DESCRIPTIONS_SGT = ?, 
                  IMAGE = ?, 
                  ATTRACHMENT = ?, 
                  INSTALLATION = ?, 
                  HOWTOUSE = ?, 
                  EXAMPLE = ?
                WHERE LIB_ID = ?`;

    const params = [
      libraryName,
      description,
      reference,
      overviewDes,
      installationDes,
      HowToUseDes,
      exampleDes,
      suggestionDes,
      image,
      JSON.stringify(attrachment),
      JSON.stringify(rowsInstallations),
      JSON.stringify(rowsHowToUse),
      JSON.stringify(rowsExample),
      id
    ];

    // Log SQL query and parameters for debugging
    // console.log("Executing SQL Query:", sql);
    // console.log("With Params:", params);

    // Execute the query
    conn.query(sql, params, (err, response) => {
      if (err) {
        console.error("SQL Error:", err.message);
        return res.status(500).json({ message: 'Database error', details: err.message });
      }
      res.status(200).json({
        message: 'Library updated successfully',
        data: response
      });
    });

  } catch (error) {
    console.error("Error updating library:", error);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
});

//todo get file
app.get('/files/:filename', (req, res) => {
  const fileName = req.params.filename;
  const filePath = path.join(__dirname, '../server/src/uploads/', fileName);
  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send('File not found');
    }
    // Serve the file without triggering download
    res.sendFile(filePath, (err) => {
      if (err) {
        return res.status(500).send('Error in serving the file');
      }
    });
  });
});

// Update route to handle array file upload
app.put('/Update/Data/:id', upload, async (req, res) => {
  try {
    const { id } = req.params;
    let image = '';
    const imageFile = req.files ? req.files.image[0] : [];
    const oldImagePath = path.join(__dirname, '../server/src/uploads/', imageFile.originalname);
    const newImagePath = path.join(__dirname, '../server/src/uploads/', imageFile.filename);
    if (fs.existsSync(oldImagePath)) {
      image = imageFile.originalname;
      fs.unlinkSync(oldImagePath);
      fs.renameSync(newImagePath, oldImagePath);
    } else {
      image = imageFile.filename;
    }
    const files = req.files?.files || [];
    let attrachment = [];
    await files.forEach(item => {
      let oldFilePath = path.join(__dirname, '../server/src/uploads/', item.originalname);
      let newFilePath = path.join(__dirname, '../server/src/uploads/', item.filename);
      let file = {
        filename: item.filename,
        originalname: item.originalname,
        size: item.size
      };
      if (fs.existsSync(oldFilePath)) {
        file.filename = item.originalname
        fs.unlinkSync(oldFilePath);
        fs.renameSync(newFilePath, oldFilePath);
      }

      attrachment.push(file);
    });
    const {
      userName,
      libraryName,
      description,
      reference,
      overviewDes,
      installationDes,
      HowToUseDes,
      exampleDes,
      suggestionDes,
      rowsInstallations,
      rowsHowToUse,
      rowsExample,
    } = JSON.parse(req.body.record);
    const libraryData = {
      LIB_NAME: libraryName,
      DESCRIPTION: description,
      REFERENCE: reference,
      DESCRIPTIONS_OVER: overviewDes,
      DESCRIPTIONS_INS: installationDes,
      DESCRIPTIONS_HTU: HowToUseDes,
      DESCRIPTIONS_EXP: exampleDes,
      DESCRIPTIONS_SGT: suggestionDes,
      IMAGE: image,
      CREATE_BY: userName,
      ATTRACHMENT: JSON.stringify(attrachment),
      INSTALLATION: JSON.stringify(rowsInstallations),
      HOWTOUSE: JSON.stringify(rowsHowToUse),
      EXAMPLE: JSON.stringify(rowsExample)
    }
    const sql = `UPDATE librarys SET 
                LIB_NAME = :LIB_NAME, 
                DESCRIPTION = :DESCRIPTION, 
                REFERENCE = :REFERENCE, 
                DESCRIPTIONS_OVER = :DESCRIPTIONS_OVER, 
                DESCRIPTIONS_INS = :DESCRIPTIONS_INS, 
                DESCRIPTIONS_HTU = :DESCRIPTIONS_HTU, 
                DESCRIPTIONS_EXP = :DESCRIPTIONS_EXP, 
                DESCRIPTIONS_SGT = :DESCRIPTIONS_SGT, 
                IMAGE = :IMAGE, 
                CREATE_BY = :CREATE_BY, 
                ATTRACHMENT = :ATTRACHMENT, 
                INSTALLATION = :INSTALLATION, 
                HOWTOUSE = :HOWTOUSE, 
                EXAMPLE = :EXAMPLE
                WHERE LIB_ID = ${id}`;

    conn.execute(sql, libraryData, async (err, response) => {
      if (err) {
        res.status(500).json({ message: err.message });
        return;
      }
      res.status(200).json({
        message: 'success',
        data: response
      });


    })
  } catch (error) {
    res.status(500).json(error);
  }
});

// Delete record according ID
app.delete('/delete/library/:id', async (req, res) => {
  const { id } = req.params;
  try {
    let sql = `DELETE FROM librarys WHERE LIB_ID = ${id}`;
    conn.execute(sql, async (err, response) => {
      if (err) {
        res.status(500).json({ message: err.message });
        return;
      }
      res.status(200).json({
        message: 'Delete success',
        data: response
      });
    })
  } catch (error) {
    console.error('Error deleting Kintone record:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
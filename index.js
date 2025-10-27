const express = require("express");
const joi = require("joi");
const { Sequelize, DataTypes, Op } = require("sequelize");
require("dotenv").config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4040;
const DB_NAME = process.env.DB_NAME || "test";
const DB_USER = process.env.DB_USER || "2wpYqhRTwr6WFUT.root";
const DB_PASS = process.env.DB_PASS || "LtBer3s7hxrSxVpK@1234";
const DB_HOST =
  process.env.DB_HOST || "gateway01.ap-southeast-1.prod.aws.tidbcloud.com";
const DB_PORT = process.env.DB_PORT || 4000;

const db = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "mysql",
  dialectOptions: {
    ssl: {
      rejectUnauthorized: true,
    },
  },
  logging: false,
});

db.authenticate()
  .then(() => console.log("MySql Databse is connected Successfully...!"))
  .catch((err) =>
    console.log("Database is failed to connect pls check your connection..!", err)
  );

const Movie = db.define(
  "movies",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    title: { type: DataTypes.STRING(255), allowNull: false },
    type: { type: DataTypes.ENUM("TV Shows", "Movies"), allowNull: false },
    director: { type: DataTypes.STRING(255), allowNull: false },
    budget: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },
    location: { type: DataTypes.STRING(255), allowNull: false },
    duration: { type: DataTypes.STRING(100), allowNull: false },
    year: { type: DataTypes.STRING(50), allowNull: false },
  },
  {
    tableName: "Movies",
    timestamps: true,
  }
);

const MovieSchema = joi.object({
  title: joi.string().max(255).required(),
  type: joi.string().valid("TV Shows", "Movies").required(),
  director: joi.string().max(255).required(),
  budget: joi.alternatives().try(joi.number(), joi.string()).required(),
  location: joi.string().max(255).required(),
  duration: joi.string().max(100).required(),
  year: joi.string().max(50).required(),
});

const updateSchema = joi
  .object({
    title: joi.string().max(255),
    type: joi.string().valid("TV Shows", "Movies"),
    director: joi.string().max(255),
    budget: joi.alternatives().try(joi.number(), joi.string()),
    location: joi.string().max(255),
    duration: joi.string().max(100),
    year: joi.string().max(50),
  })
  .min(1);

function toNumberSafe(v) {
  const n = Number(v);
  return Number.isNaN(n) ? 0 : n;
}

app.get("/", async (req, res) => {
  res
    .status(200)
    .json({ success: true, message: "Movies API Running Successfully...!" });
});

app.post("/api/entries", async (req, res) => {
  try {
    const { error, value } = MovieSchema.validate(req.body, { convert: true });
    if (error) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Error while inserting the data...!",
          error,
        });
    }
    value.budget = toNumberSafe(value.budget);
    await Movie.create(value);
    res.status(201).json({ success: true, message: "Movie Added in the DB.." });
  } catch (e) {
    console.error("Error:", e);
    res.status(500).json({ error: "Server error while creating" });
  }
});

app.get("/api/entries/search", async (req, res) => {
  try {
    const title = req.query.title ? req.query.title.trim() : "";

    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide a title to search" });
    }

    const movies = await Movie.findAll({
      where: {
        title: {
          [Op.like]: `%${title}%`,
        },
      },
    });

    if (movies.length === 0) {
      return res.status(404).json({ success: false, message: "No Data Found" });
    }

    res.json({ success: true, data: movies });
  } catch (error) {
    console.error("Search error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error while searching" });
  }
});

app.get("/api/entries", async (req, res) => {
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;
  if (page < 1) page = 1;
  if (limit < 1) limit = 10;
  const offset = (page - 1) * limit;
  try {
    const { count, rows } = await Movie.findAndCountAll({
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });
    res.json({
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit),
      data: rows,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/entries/:id", async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (movie) {
      res
        .status(200)
        .json({ success: true, message: "Data Found", data: movie });
    } else {
      res.status(404).json({ success: false, message: "No Data Found" });
    }
  } catch (e) {
    res.status(500).json({ error: "Server error while fetching" });
  }
});

app.put("/api/entries/:id", async (req, res) => {
  try {
    const { error, value } = updateSchema.validate(req.body, { convert: true });
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: "Error while updating the data" });
    }
    if (value.budget !== undefined) value.budget = toNumberSafe(value.budget);
    const item = await Movie.findByPk(req.params.id);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "No Data Found to update" });
    }
    await item.update(value);
    res.status(200).json({ success: true, message: "Data Updated in DB" });
  } catch (e) {
    res.status(500).json({ error: "Server error while updating" });
  }
});

app.delete("/api/entries/:id", async (req, res) => {
  try {
    const item = await Movie.findByPk(req.params.id);
    if (item) {
      await item.destroy();
      res
        .status(200)
        .json({ success: true, message: "Data Deleted in Database" });
    } else {
      res
        .status(404)
        .json({ success: false, message: "No Data Found to Delete" });
    }
  } catch (e) {
    res.status(500).json({ error: "Server error while deleting" });
  }
});

db.sync({ alter: true })
  .then(() => console.log("Tables created or updated successfully"))
  .catch((err) => console.error("Error syncing database:", err));

app.listen(PORT, () => console.log(`Server Start Running on port ${PORT}...!`));

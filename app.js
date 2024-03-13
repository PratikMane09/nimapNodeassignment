const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const rootDir = require("./utils/path");

const adminRoutes = require("./routes/admin");
const homeRoutes = require("./routes/home");
const categoryRoutes = require("./routes/categoryRoutes");
const sequelize = require("./utils/database");
const Category = require("./models/CategoryModel");
const Product = require("./models/ProductModel");
const User = require("./models/UserModel");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

//Static files
app.use(express.static(path.join(rootDir, "public")));
app.use(
  "/css",
  express.static(path.join(rootDir, "node_modules", "bootstrap", "dist", "css"))
);
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  User.findByPk(1).then((user) => {
    req.user = user;

    next();
  });
});

//Routes
app.use(homeRoutes);
app.use("/products", adminRoutes);
app.use("/categories", categoryRoutes);
app.use((req, res) => {
  const viewsData = {
    pageTitle: "Page Not Found",
  };
  res.status(404).render("404", viewsData);
});

Category.hasMany(Product);
Category.belongsTo(User);

Product.belongsTo(Category);
Product.belongsTo(User);

User.hasMany(Category);
User.hasMany(Product);

sequelize
  .sync()
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      User.create({ name: "Pratik", email: "pratik@mail.com" });
    }
  })
  .catch((error) => {
    console.log(error);
  });

// pagination
const resultsPerPage = 10;

app.use("/", (req, res) => {
  let sql = "SELECT * FROM products";
  console.log("hereis data", sql);

  // db.query(sql, (err, result) => {
  //   if (err) throw err;
  //   const numOfResults = result.length;
  //   const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
  //   let page = req.query.page ? Number(req.query.page) : 1;
  //   if (page > numberOfPages) {
  //     res.redirect("/?page=" + encodeURIComponent(numberOfPages));
  //   } else if (page < 1) {
  //     res.redirect("/?page=" + encodeURIComponent("1"));
  //   }
  //   //Determine the SQL LIMIT starting number
  //   const startingLimit = (page - 1) * resultsPerPage;
  //   //Get the relevant number of POSTS for this starting page
  //   sql = `SELECT * FROM products LIMIT ${startingLimit},${resultsPerPage}`;
  //   db.query(sql, (err, result) => {
  //     if (err) throw err;
  //     let iterator = page - 5 < 1 ? 1 : page - 5;
  //     let endingLink =
  //       iterator + 9 <= numberOfPages
  //         ? iterator + 9
  //         : page + (numberOfPages - page);
  //     if (endingLink < page + 4) {
  //       iterator -= page + 4 - numberOfPages;
  //     }
  //     res.render("index", {
  //       data: result,
  //       page,
  //       iterator,
  //       endingLink,
  //       numberOfPages,
  //     });
  //   });
  // });
});

app.listen(8000, () => {
  console.log("server started at port 8000");
});

const express = require("express");
const puppeteer = require("puppeteer");
const bodyParser = require("body-parser");
const Scrapper = require("./content");
var url = "";
const app = express();
const PORT = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.get("/", async function (req, res) {
  if (!url) {
    res.render("home", {});
  } else {
    try {
      const browser = await puppeteer.launch({
        headless: false,
      });
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: "load" , timeout: 600000});
      const ReviewHref = await page.evaluate(() => {
        const elements = Array.from(
          document.querySelectorAll(".a-link-emphasis.a-text-bold")
        );
        return elements.map((x) => x.href);
      });
      Scrapper.scrapper(ReviewHref[0], 1);
      await browser.close();
    } catch (error) {
      console.error("Error:", error);
    }
  }
});

app.post("/home", function (req, res) {
  url = "";
  res.redirect("/");
});
app.post("/", function (req, res) {
  url = req.body.enteredItem;
  res.redirect("/");
});
app.listen(PORT, function () {
  console.log(`Port started at ${PORT}`);
});

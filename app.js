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
app.get
("/", async function (req, res) {
  if (!url) {
    res.render("home", {});
  } else {
    try {
      const browser = await puppeteer.launch({
        headless: false,
      });
      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36');
      await page.goto(url, { waitUntil: "load" , timeout: 600000});
      await page.waitForSelector('#productTitle');
      await page.goto(url, { waitUntil: "load" , timeout: 600000});
      const ReviewHref = await page.evaluate(() => {
        const elements = Array.from(
          document.querySelectorAll(".a-link-emphasis.a-text-bold")
        );
        return elements.map((x) => x.href);
      });
      const descriptions = await page.evaluate(() => {
        const listItems = document.querySelectorAll(".a-unordered-list.a-vertical.a-spacing-mini li");
        const items = [];
        
        listItems.forEach(item => {
          items.push(item.textContent.trim());
        });
        
        return items;
      });
      await browser.close();
      await Scrapper.scrapper(ReviewHref[0], 1,descriptions);
    } catch (error) {
      console.error("Error:", error);
    }
    res.render("completed",{});
  }
});

app.get("/home", function (req, res) {
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

const puppeteer = require("puppeteer");
const ExcelJS = require("exceljs");
const constant = require("./constants")

async function scrapeReviews(url, i, worksheet) {
  if (i == 4) {
    console.log("Scrapping Completed")
    return;
  }
  try {
    const browser = await puppeteer.launch({
      headless: false,
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36');
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 600000 });
    const searchText = "Enter the characters you see below";
    const content = await page.content();
    if(content.includes(searchText))
    {
      await page.waitForNavigation();
    }
    const url1 = await page.evaluate(() => window.location.href);
    if (url1.includes("signin")) {
      await page.type("#ap_email",constant.email);
      await page.click("#continue");
      await page.waitForSelector("#ap_password");
      await page.type("#ap_password", constant.password);
      await page.click("#signInSubmit");
    }
    await page.waitForSelector(".a-row.a-spacing-small.review-data");
    const extractedText = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".a-row.a-spacing-small.review-data")
      ).map((x) => x.textContent.trim().replace(/\n+/g, " "));
    });
    for (let j = 0; j < extractedText.length; j++) {
      worksheet.addRow([extractedText[j]]);
    }

    const nextUrl = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".a-last > a")).map(
        (x) => x.href
      );
    });
    await browser.close();
    await scrapeReviews(nextUrl[0], i + 1, worksheet);
  } catch (error) {
    console.error("Error:", error);
  }
}

module.exports.scrapper = async function (url, i,descriptions) {
  const workbook = new ExcelJS.Workbook(); 
  const worksheet = workbook.addWorksheet(`Page ${i}`);
  descriptions.forEach(element => {
    worksheet.addRow([element]);
  });
  await scrapeReviews(url, i || 1, worksheet);
  await workbook.xlsx.writeFile("reviews.xlsx");
};

//

// let task = cron.schedule("* * * * *", async function () {
// 	await console.log("매분마다 작업 실행:", new Date().toString());

// 	const { Builder, By, until } = require("selenium-webdriver");
// 	async function news() {
// 		let driver = await new Builder().forBrowser("chrome").build();

// 		//네이버실행
// 		await driver.get("https://www.naver.com");
// 		//const pageSource = await driver.wait(until.elementLocated(By.xpath('/html/body'))).getAttribute('innerHTML');
// 		//console.log(pageSource);
// 		await driver.wait(until.elementLocated(By.css("#footer")));
// 		//let pageSource1 = await driver.wait(until.elementLocated(By.xpath('/html/body'))).getAttribute('innerHTML');
// 		//console.log(pageSource1);

// 		/*//다른지 check 1
//         let pageSource1 = await driver.wait(until.elementLocated(By.xpath('/html/body'))).getAttribute('innerHTML');
//         console.log(pageSource1);
//         */
// 		//경제 클릭
// 		let listFinance = await driver.findElement(
// 			By.className("_NM_THEME_CATE tab id_finance")
// 		);
// 		listFinance.click();
// 		//잠깐대기
// 		await driver.wait(until.elementLocated(By.css(".theme_info")));

//         setTimeout(async function () {
//             let postLists = await driver.findElements(
//                 By.xpath(
//                     '*[@id="NM_THEME_CONTAINER"]/div[1]/div/ul/li[1]/a[2]/strong'
//                 )
//             );
//             let getText = await postLists.getText();
//        console.log(getText);
//          }, 1500);

//         //맨위 POST 가져오기
// 		// setTimeout(async function () {
// 		// 	let postLists = await driver.findElements(By.css(".theme_info"));
// 		// 	let getUrl = await postLists[1].getAttribute("href");
// 		// 	await driver.get(`${getUrl}`);
// 		// }, 1500);

// 		//Post글 콘솔로 가져오기

// 		//html모두 가져오기
// 		//et pageSource2 = await driver.wait(until.elementLocated(By.xpath('/html/body'))).getAttribute('innerHTML');
// 		// console.log(pageSource2);

// 		await driver.wait(until.elementLocated(By.css(".se_textarea")), 5000);
// 		let textAreas = await driver.findElements(By.css(".se_textarea"));

// 		for (i = 0; i < textAreas.length; i++) {
// 			console.log(await textAreas[i].getText());
// 		}
// 	}
// 	news();
// });

// task.start();

// const cron = require("node-cron");
// let task = cron.schedule("0 0 * * *", async function () {
const { Builder, By, until, Condition } = require("selenium-webdriver");
const { titleIs } = require("selenium-webdriver/lib/until");
const mysql = require("mysql");
const con = mysql.createConnection({
	host: "localhost",
	port: "3000",
	user: "root",
	password: "1234",
	database: "news",
	charset: "utf8mb4",
});

con.connect();

async function news() {
	let driver = await new Builder().forBrowser("chrome").build();

	//네이버실행
	await driver.get("https://www.naver.com");
	//const pageSource = await driver.wait(until.elementLocated(By.xpath('/html/body'))).getAttribute('innerHTML');
	//console.log(pageSource);
	await driver.wait(until.elementLocated(By.css("#footer")));
	//let pageSource1 = await driver.wait(until.elementLocated(By.xpath('/html/body'))).getAttribute('innerHTML');
	//console.log(pageSource1);

	/*//다른지 check 1
        let pageSource1 = await driver.wait(until.elementLocated(By.xpath('/html/body'))).getAttribute('innerHTML');
        console.log(pageSource1);
        */

	//경제 클릭
	let listFinance = await driver.findElement(
		By.className("_NM_THEME_CATE tab id_finance")
	);
	listFinance.click();
	await driver.wait(until.elementLocated(By.css(".theme_info")));

	//모든 요소가 다 나올때까지 대기 (최하단 source box기준)
	await driver.wait(
		until.elementLocated(
			By.xpath(
				'//*[@id="NM_THEME_CONTAINER"]/div[1]/div/ul/li/a[2]/div/span[2]/span'
			)
		),
		10000
	);

	//모든요소 각자 찾아주기 - 경제 부분
	let urls = await driver.findElements(
		By.xpath('//*[@id="NM_THEME_CONTAINER"]/div[1]/div/ul/li/a[1]/img')
	);

	let titles = await driver.findElements(
		By.xpath('//*[@id="NM_THEME_CONTAINER"]/div[1]/div/ul/li/a[2]/strong')
	);

	let texts = await driver.findElements(
		By.xpath('//*[@id="NM_THEME_CONTAINER"]/div[1]/div/ul/li/a[2]/p')
	);

	let authors = await driver.findElements(
		By.xpath(
			'//*[@id="NM_THEME_CONTAINER"]/div[1]/div/ul/li/a[2]/div/span[2]/span'
		)
	);

	let dates = await driver.findElements(
		By.xpath(
			'//*[@id="NM_THEME_CONTAINER"]/div[1]/div/ul/li/a[2]/div/span[1]'
		)
	);

	console.log(urls[0].getAttribute("src"));
	console.log("src");

	//경제란
	let category = "경제";
	let id = [];
	let newsImg = [];
	let newsTitles = [];
	let newsTexts = [];
	let newsAuthors = [];
	let newsDates = [];
	let newsLink = [];

	// let new
	for (i = 0; i < titles.length; i++) {
		//rid
		await id.push(i + 1);

		//img src
		let imgArr = await urls[i].getAttribute("src");

		await newsImg.push(imgArr);

		//title
		let titleArr = await titles[i].getText();
		await newsTitles.push(titleArr);

		//texts
		let textArr = await texts[i].getText();
		await newsTexts.push(textArr);

		//authors
		let authorArr = await authors[i].getText();
		await newsAuthors.push(authorArr);

		//dates
		let dateArr = await dates[i].getText();
		await newsDates.push(dateArr);
	}
	//mysql

	let values = [
		[
			id[0],
			newsImg[0],
			category,
			newsTitles[0],
			newsTexts[0],
			newsAuthors[0],
			newsDates[0],
		],
		[
			id[1],
			newsImg[1],
			category,
			newsTitles[1],
			newsTexts[1],
			newsAuthors[1],
			newsDates[1],
		],
		[
			id[2],
			newsImg[2],
			category,
			newsTitles[2],
			newsTexts[2],
			newsAuthors[2],
			newsDates[2],
		],
		[
			id[3],
			newsImg[3],
			category,
			newsTitles[3],
			newsTexts[3],
			newsAuthors[3],
			newsDates[3],
		],
		[
			id[4],
			newsImg[4],
			category,
			newsTitles[4],
			newsTexts[4],
			newsAuthors[4],
			newsDates[4],
		],
	];

	//sql 입력
	await con.query("truncate news_info", (error, result) => {
		console.log("데이터가 삭제되었습니다.");
	});

	const query = "insert into news_info values ?;";
	const query_str = await con.query(query, [values], (error, result) => {
		if (error) {
			throw error;
		} else {
			console.log(query_str.sql); // SQL Query문 출력
		}
	});

	await console.log("news completed");

	////////////////////////////리빙란/////////////////////////////////////

	//리빙란

	let livingList = await driver.findElement(
		By.className("_NM_THEME_CATE tab id_livinghome")
	);
	await livingList.click();
	await driver.wait(until.elementLocated(By.css(".theme_info")), 5000);
	//모든 요소가 다 나올때까지 대기 (최하단 source box기준)
	await driver.wait(
		until.elementLocated(
			By.xpath(
				'//*[@id="NM_THEME_CONTAINER"]/div[2]/div/ul/li[4]/a[2]/div/span[1]'
			)
		),
		10000
	);

	//모든요소 각자 찾아주기 - 리빙부분
	let liveUrls = await driver.findElements(
		By.xpath('//*[@id="NM_THEME_CONTAINER"]/div[1]/div/ul/li/a[1]/img')
	);

	let liveTitles = await driver.findElements(
		By.xpath('//*[@id="NM_THEME_CONTAINER"]/div[1]/div/ul/li/a[2]/strong')
	);

	let liveTexts = await driver.findElements(
		By.xpath('//*[@id="NM_THEME_CONTAINER"]/div[1]/div/ul/li/a[2]/p')
	);

	let liveAuthors = await driver.findElements(
		By.xpath(
			'//*[@id="NM_THEME_CONTAINER"]/div[1]/div/ul/li/a[2]/div/span[2]/span'
		)
	);

	let liveDates = await driver.findElements(
		By.xpath(
			'//*[@id="NM_THEME_CONTAINER"]/div[1]/div/ul/li/a[2]/div/span[1]'
		)
	);

	//빈배열만들기
	let livingCategory = "리빙";
	let livingId = [];
	let livingImg = [];
	let livingTitles = [];
	let livingTexts = [];
	let livingAuthors = [];
	let livingDates = [];

	await console.log("make Arr");

	for (i = 0; i < liveTitles.length; i++) {
		//rid
		await livingId.push(i + 1);
		console.log(livingId);
		//img src
		let livingImgArr = await liveUrls[i].getAttribute("src");
		await livingImg.push(livingImgArr);

		//title
		let livingTitleArr = await liveTitles[i].getText();
		await livingTitles.push(livingTitleArr);

		//texts
		let livingTextArr = await liveTexts[i].getText();
		await livingTexts.push(livingTextArr);
		console.log(livingTexts);

		//authors
		let livingAuthorArr = await liveAuthors[i].getText();
		await livingAuthors.push(livingAuthorArr);

		//dates
		let livingDateArr = await liveDates[i].getText();
		await livingDates.push(livingDateArr);
	}

	let livingValues = [
		[
			livingId[0],
			livingImg[0],
			livingCategory,
			livingTitles[0],
			livingTexts[0],
			livingAuthors[0],
			livingDates[0],
		],
		[
			livingId[1],
			livingImg[1],
			livingCategory,
			livingTitles[1],
			livingTexts[1],
			livingAuthors[1],
			livingDates[1],
		],
		[
			livingId[2],
			livingImg[2],
			livingCategory,
			livingTitles[2],
			livingTexts[2],
			livingAuthors[2],
			livingDates[2],
		],
		[
			livingId[3],
			livingImg[3],
			livingCategory,
			livingTitles[3],
			livingTexts[3],
			livingAuthors[3],
			livingDates[3],
		],
	];

	//sql 입력
	await con.query("truncate living_info", (error, result) => {
		console.log("리빙 데이터가 삭제되었습니다.");
	});

	const livingQuery = "insert into living_info values ?;";
	const livingQuery_str = await con.query(
		livingQuery,
		[livingValues],
		(error, result) => {
			if (error) {
				throw error;
			} else {
				console.log(query_str.sql); // SQL Query문 출력
			}
		}
	);
}

news();
// });

// task.start();

//i가 5번이나 반복되는데 마지막 요소를 계속 찾을 수 없어서 생긴 오류인듯 함

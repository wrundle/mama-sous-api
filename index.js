const express = require('express');
const cheerio = require('cheerio');
const phin = require('phin');
const fs = require('fs');


const parseContent = async (url) => {
	const res = await phin(url);
	try {
		const content = [];
		const fullHTML = res.body;
		const $ = cheerio.load(fullHTML);
		$('[class="sect nav__anchor"]').each((foo, sect) => {
			const $$ = cheerio.load($(sect).html());
			$$('.ddish--with-photo').each((bar, dish) => {
				const $$$ = cheerio.load($(dish).html());
				content.push({
					section: $$('.sect__title').text(),
					name: $$$('.ddish__name').text(),
					imgSrc: $$$('[class="ddish__photo lazyload"]').prop('data-full'),
					badge: $$$('[class="ddish__badge ddish__badge--hit"]').text(),
					description: $$$('.ddish__ingredients').text(),
					price: $$$('.ddish__sum').text().replace(/\s+/g, " "),
					size: $$$('.ddish__size').text().replace(/\s+/g, " "),
				});
			});
		})
		console.log(content);
		return content;
	} catch (error) {
		console.log(error)
		return null
	};
};


const app = express();
const port = process.env.PORT || 5000;

app.get("/", async (req, res) => {
	res.send(await parseContent('https://papa-sous.ru'));
});

app.listen(port, () => {
	console.log(`Listening on port ${port}\n`);
});

module.exports = app;

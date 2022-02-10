import axios from 'axios'
import pretty from 'pretty'
import * as cheerio from 'cheerio'

export const getGoalNews = async(pageNum) => {
	if(!pageNum) pageNum = 1 
	const url = `${process.env.WS_GOALCOM}en/news/${pageNum}`
	const fetchedContent = []

	await axios.get(url).then((res) => {
		const $ = cheerio.load(res.data)

		$('.page-container').children().children().each((i, elem) => {
			const card = $(elem).find('tbody tr')
			const content = {
				title: card.find('h3').text(),
				img: card.find('td a img').attr('src'),
				tag: card.find('.widget-news-card__content .widget-news-card__category').text(),
				article_link: card.find('td a').attr('href')
			}

			// console.log(content)

			let isValid = true

			Object.values(content).forEach((contentValue) => {
				if(!contentValue && isValid) {
					isValid = false
				}
			})

			// const _parseByArgs = (prefix) => {
			// 	if(!card_link.includes(prefix)) return
			// 	if(card_link.includes('https://www.goal.com/en/match/') && (prefix == '/en/match/' || '/en/news/live/')) return
			// 	console.log(card_link.replace(prefix, '').split('/').length > 2 && card_link)
			// 	content.prefix = prefix
			// 	[ content.article_slug, content.article_id ] = card_link.replace(prefix, '').split('/')
			// }

			isValid && fetchedContent.push(content)
		})

		const timeout = process.env.WS_GOALCOM_LOAD_USE_INTERVAL == 'true' 
			? Math.floor(Math.random() * Number(process.env.WS_GOALCOM_LOAD_END_INTERVAL)) + Number(process.env.WS_GOALCOM_LOAD_INITIAL_INTERVAL)
			: 0

		console.log(`successfully crawled ${url}, ${process.env.WS_GOALCOM_LOAD_MULTIPLE == 'true' ? `next fetch in ${timeout}ms` : 'multiple disabled'}`)

		process.env.WS_GOALCOM_LOAD_MULTIPLE == 'true'
			&& pageNum < Number(process.env.WS_GOALCOM_MAX_NUM_OF_PAGES)
				? setTimeout(async () => await getGoalNews(pageNum+1), timeout)
				: console.log('scraping finished')
		
	}).catch((err) => 
		console.error(`Could not fetch ${process.env.WS_GOALCOM}en/news/${pageNum} failed with ${err}`)
	)
	return fetchedContent
}

// export const getGoalArticleByUrl = async (article_link) => {
// 	const url = `${article_link.startsWith('/en') ? `${process.env.WS_GOALCOM}${article_link}` : article_link}`
// 	console.log(url)

// 	axios.get(url).then((res) => {
// 		const $ = cheerio.load(res.data)
// 		console.log(pretty($.html()))
// 	})
// }
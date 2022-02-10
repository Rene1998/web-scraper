import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import { getGoalNews } from './crawlers/goalComCrawler.js';

const app = express()
app.use(cors())
app.use(express.json())

app.listen(process.env.PORT ,() => console.log(`server has started successfully at port :${process.env.PORT}`))
let goalNewsContent = []

const initCrawlers = async () => {
	goalNewsContent = await getGoalNews()
	// await getGoalArticle('afcon-2021-burkina-faso-vs-senegal-preview-kick-off-time-tv', 'blte188a9a5d9fa55a0')
}

initCrawlers()

app.get('/goal-com/fetched-news', (req, res) => res.json(goalNewsContent))

// app.post('/goal-com/fetched-article', async (req, res) => {
// 	console.log(req.body)
// 	const article = await getGoalArticleByUrl(req.body.url)
// 	res.json(article)
// })
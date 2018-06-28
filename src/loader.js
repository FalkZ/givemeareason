import { Main } from './Main.js'
//import { Gallery } from './Gallery.elm'
import registerServiceWorker from './registerServiceWorker'
//import imports from '../imports'

import yaml from 'js-yaml'

import joker from './joker.svg'

//console.log(content)

import './main.styl'
import './header.styl'
import './Gallery.styl'

import $ from 'jquery'

if (
	window.location.hash.includes('#invite_token=') ||
	window.location.hash.includes('#recovery_token=')
) {
	window.location = '/admin/' + window.location.hash
}

//Main.embed(document.getElementById('root'))

const app = Main.fullscreen()

/*app.ports.check.subscribe(function(word) {
	const suggestions = spellCheck(word)
	app.ports.suggestions.send(suggestions)
})*/

//const { general, de, en } = imports.content

const formatDate = (d) => {
	let month = '' + (d.getMonth() + 1)
	let day = '' + d.getDate()
	let year = d.getFullYear()

	if (month.length < 2) month = '0' + month
	if (day.length < 2) day = '0' + day

	return [year, month, day].join('-')
}

const getNow = () => formatDate(new Date(Date.now()))

fetch('content/deutsch.yml')
	.then((response) => {
		console.log(response)
		return response
	})
	.then((response) => response.text())
	.then((text) => yaml.safeLoad(text) || {})
	.then((content) =>
		Object.assign(content, {
			now: getNow(),
			logo: joker
			//events: content.events.map((event) =>
			//	Object.assign(event, { date: formatDate(event.date) })
			//)
		})
	)
	.then((content) => {
		console.log(content)
		return content
	})
	.then((content) => app.ports.content.send(content))
	.catch(console.error)

registerServiceWorker()

$(document).ready(function() {
	$('a').click(function({ target: { hash } }) {
		if (hash) {
			try {
				$('html, body').animate(
					{
						scrollTop: $(hash).offset().top - 200
					},
					600
				)
			} catch (error) {
				console.warn('scroll target not found', error)
			}
		}
	})
})

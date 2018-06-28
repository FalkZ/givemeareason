import { Main } from './Main.elm'
//import { Gallery } from './Gallery.elm'
import registerServiceWorker from './registerServiceWorker'
import imports from '../imports'

import content from './content.yaml'
import joker from './joker.svg'

console.log(content)

content.logo = joker

import './main.styl'
import './header.styl'
import './Gallery.styl'

import $ from 'jquery'

//Main.embed(document.getElementById('root'))

const app = Main.fullscreen()

/*app.ports.check.subscribe(function(word) {
	const suggestions = spellCheck(word)
	app.ports.suggestions.send(suggestions)
})*/

const { general, de, en } = imports.content

const getNow = () => {
	const d = new Date(Date.now())
	let month = '' + (d.getMonth() + 1)
	let day = '' + d.getDate()
	let year = d.getFullYear()

	if (month.length < 2) month = '0' + month
	if (day.length < 2) day = '0' + day

	return [year, month, day].join('-')
}

content.now = getNow()

console.log(content.now)

app.ports.content.send(content)

console.log(content)

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

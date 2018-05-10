import { Main } from './Main.elm'
import { Gallery } from './Gallery.elm'
import registerServiceWorker from './registerServiceWorker'
import imports from '../imports'

import content from './test.yaml'

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

app.ports.content.send(content)

function spellCheck(language) {
	// have a real implementation!

	return Object.assign({}, imports.content.general, imports.content[language])
}

registerServiceWorker()

$(document).ready(function() {
	$('a').click(function({ target: { hash } }) {
		if (hash) {
			try {
				$('html, body').animate(
					{
						scrollTop: $(hash).offset().top - 100
					},
					600
				)
			} catch (error) {
				console.warn('scroll target not found', error)
			}
		}
	})
})

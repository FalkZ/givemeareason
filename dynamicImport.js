var glob = require('glob')
var { writeFile } = require('fs')

const createImports = (files) => {
	let string = `// automaticly created with dynamicImport.js
	
import set from 'lodash.set'


`
	let exp = `
	
const exp = {}
`

	files.forEach((file, index) => {
		string += `\nimport _dymanicImport${index} from '${file}'`
		exp +=
			"\nset(exp, '" +
			file.split('.')[file.split('.').length - 2].replace(/\//g, '.').replace('.', '') +
			`' , _dymanicImport${index})`
	})

	const arr = []
	for (let index = 0; index < files.length; index++) {
		arr.push(`_dymanicImport${index}`)
	}

	string += exp //'\n\nconsole.log([' + arr.join() + '])'

	string += `
	
export default exp
	`

	writeFile('./imports.js', string, function(err) {
		if (err) {
			throw new Error(err)
		}

		console.log('Import were created')
	})
}

if (process.argv.length === 3) {
	glob(process.argv.pop() + '/**/*.*', function(err, files) {
		if (err) {
			throw new Error(err)
		} else {
			createImports(files)
		}
	})
} else {
	throw new Error('invalid folder name')
}

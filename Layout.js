// File: Layout.js ref 1.2
import * as CubeDefs from './cubeConstants.js'

const FACE_LAYOUT_COORDINATES = CubeDefs.FACE_LAYOUT
const STICKER_MARGIN = 1
const NON_CENTER_CELL = CubeDefs.NON_CENTER_FACE

let canvas
let ctx
let m
let squareSize
let smallRadius
let middleRadius
let largeRadius
let dimensionsInitialized = false

function getStickerGeometry(stickerIndex) {
	if (!dimensionsInitialized) {
		console.error('Layout.js: getStickerGeometry called before dimensions were initialized.')
		return null
	}

	const faceOrderIndex = Math.floor(stickerIndex / 8)
	const localOrderOnFace = stickerIndex % 8
	const localCoords = NON_CENTER_CELL[localOrderOnFace]
	const localRow = localCoords.row
	const localCol = localCoords.col
	const baseFaceCanvasX = FACE_LAYOUT_COORDINATES[faceOrderIndex][0] * m
	const baseFaceCanvasY = FACE_LAYOUT_COORDINATES[faceOrderIndex][1] * m
	const stickerCanvasX = baseFaceCanvasX + localCol * squareSize
	const stickerCanvasY = baseFaceCanvasY + localRow * squareSize
	const initRow = localRow === 0
	const finalRow = localRow === 2 //CUBE_SIZE - 1
	const initCol = localCol === 0
	const finalCol = localCol === 2 //CUBE_SIZE - 1

	const calculatedRadii = [
		finalRow && finalCol ? middleRadius : initRow || initCol ? smallRadius : largeRadius,
		finalRow && initCol ? middleRadius : initRow || finalCol ? smallRadius : largeRadius,
		initRow && initCol ? middleRadius : finalRow || finalCol ? smallRadius : largeRadius,
		initRow && finalCol ? middleRadius : finalRow || initCol ? smallRadius : largeRadius,
	]

	return {
		x: stickerCanvasX,
		y: stickerCanvasY,
		radii: calculatedRadii,
	}
}

function getCenterGeometry(faceName) {
	if (!dimensionsInitialized) {
		console.error('Layout.js: getCenterGeometry called before dimensions were initialized.')
		return null
	}
	const faceOrderIdx = CubeDefs.SIDES.indexOf(faceName)
	if (faceOrderIdx === -1) {
		console.error(`Layout.js: Unknown faceName ${faceName} for getCenterGeometry.`)
		return null
	}
	const baseFaceCanvasX = FACE_LAYOUT_COORDINATES[faceOrderIdx][0] * m
	const baseFaceCanvasY = FACE_LAYOUT_COORDINATES[faceOrderIdx][1] * m
	const centerCanvasX = baseFaceCanvasX + squareSize
	const centerCanvasY = baseFaceCanvasY + squareSize
	const calculatedRadii = [largeRadius, largeRadius, largeRadius, largeRadius]

	return {
		x: centerCanvasX,
		y: centerCanvasY,
		radii: calculatedRadii,
	}
}

function drawRect(x, y, w, h, calculatedRadii, fillColor, _borderColorUnused, _lineWidthUnused, isActive = false) {
	if (!ctx) return

	ctx.beginPath()
	if (typeof ctx.roundRect === 'function') {
		ctx.roundRect(x, y, w, h, calculatedRadii)
	} else {
		ctx.moveTo(x + calculatedRadii[3], y)
		ctx.lineTo(x + w - calculatedRadii[0], y)
		ctx.quadraticCurveTo(x + w, y, x + w, y + calculatedRadii[0])
		ctx.lineTo(x + w, y + h - calculatedRadii[1])
		ctx.quadraticCurveTo(x + w, y + h, x + w - calculatedRadii[1], y + h)
		ctx.lineTo(x + calculatedRadii[2], y + h)
		ctx.quadraticCurveTo(x, y + h, x, y + h - calculatedRadii[2])
		ctx.lineTo(x, y + calculatedRadii[3])
		ctx.quadraticCurveTo(x, y, x + calculatedRadii[3], y)
		ctx.closePath()
	}
	ctx.fillStyle = fillColor
	ctx.fill()

	ctx.strokeStyle = isActive ? 'yellow' : '#000000'
	ctx.lineWidth = isActive ? 3 : 1
	ctx.stroke()
}

export function setupLayoutEnvironment(selector, canvasWidthArgument) {
	if (dimensionsInitialized) {
		return
	}
	const el = document.querySelector(selector)
	if (!el) {
		console.error('Layout.js: Target element for canvas not found:', selector)
		return
	}

	canvas = document.createElement('canvas')
	el.innerHTML = ''
	el.appendChild(canvas)
	ctx = canvas.getContext('2d')

	if (!ctx) {
		console.error('Layout.js: Failed to get 2D context')
		return
	}
	const currentCanvasWidth = canvasWidthArgument || 720
	const m_forHeightCalc = currentCanvasWidth / 4
	canvas.width = currentCanvasWidth
	canvas.height = m_forHeightCalc * 3

	m = Math.min(canvas.width / 4, canvas.height / 3)
	squareSize = Math.floor(m / 3)
	smallRadius = squareSize / 12
	middleRadius = smallRadius * 1.25
	largeRadius = smallRadius * 3
	dimensionsInitialized = true
}

export function drawLayout(cubeState, args) {
	const { activeStickerIndex, drawCatch24Text } = args

	ctx.fillStyle = '#000000'
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	for (const faceName of CubeDefs.SIDES) {
		const centerColor = CubeDefs.FACE_COLORS[faceName]
		const geometry = getCenterGeometry(faceName)
		if (geometry) {
			drawRect(geometry.x, geometry.y, squareSize - STICKER_MARGIN, squareSize - STICKER_MARGIN, geometry.radii, centerColor, '#000000', 1, false)
		}
	}

	for (let stickerIdx = 0; stickerIdx < 48; stickerIdx++) {
		const geometry = getStickerGeometry(stickerIdx)
		if (!geometry) continue

		const color = cubeState.getStickerColor(stickerIdx)
		const isActive = activeStickerIndex === stickerIdx

		drawRect(
			geometry.x,
			geometry.y,
			squareSize - STICKER_MARGIN,
			squareSize - STICKER_MARGIN,
			geometry.radii,
			color,
			'#000000', // borderColor
			isActive ? 3 : 1, // lineWidth
			isActive,
		)
	}
	// --- FACSIMILE CATCH-24 ---
	if (drawCatch24Text) {
		const padding = 20
		const fontSize = 72

		ctx.textBaseline = 'alphabetic'
		ctx.fillStyle = '#DDDDDD'
		ctx.textAlign = 'left'

		const textParts = [
			{ text: 'Catch-', font: `${fontSize}pt "Brush Script MT", cursive` },
			{ text: '2', font: `${fontSize}pt "Academy Engraved LET", serif` },
			{ text: '4', font: `${fontSize}pt "Bodoni 72 Oldstyle", serif` },
		]

		let totalWidth = 0
		const partWidths = []

		for (const part of textParts) {
			ctx.font = part.font
			const metrics = ctx.measureText(part.text)
			partWidths.push(metrics.width)
			totalWidth += metrics.width
		}

		let currentX = canvas.width - padding - totalWidth
		const yPos = m * 2 + m / 2.2 + fontSize / 2

		textParts.forEach((part, index) => {
			ctx.font = part.font
			ctx.fillText(part.text, currentX, yPos)
			currentX += partWidths[index]
		})
	}
}

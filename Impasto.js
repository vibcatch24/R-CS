// Impasto.js ref 1.2
import * as CubeDefs from './cubeConstants.js'
import { CubeState } from './CubeState.js'
import { drawLayout, setOnLogoLoadCallback, setupLayoutEnvironment } from './Layout.js'

const CANVAS_WIDTH_CONFIG = 720
const CUBE_DIMENSION_CONFIG = 3
const M_FOR_CLICK_DETECTION = CANVAS_WIDTH_CONFIG / 4
const SQUARE_SIZE_FOR_CLICK_DETECTION = Math.floor(M_FOR_CLICK_DETECTION / CUBE_DIMENSION_CONFIG)

let cubeState = new CubeState()
let currentActiveStickerIndex = 0
let allStickersAreNonDefault = false
let shouldDrawCatch24Text = false
let copyTimeoutId = null

// --- Initialization Layout (canvas) ---
setupLayoutEnvironment('#cube-container', CANVAS_WIDTH_CONFIG)
setOnLogoLoadCallback(updateAndRedrawAll)
// --- Getting references to DOM elements---
const canvasEl = document.querySelector('#cube-container canvas')
const paletteContainer = document.getElementById('color-palette')
const resetButton = document.getElementById('reset-button')
const applyCopyButton = document.getElementById('catch24-button')
const applyInputButton = document.getElementById('apply-input-button')
const codeCatch24output = document.getElementById('position-code')
const positionCodeInput = document.getElementById('catch24-input')
const diagnosticMessage = document.getElementById('diagnostic-message')
const titleHeader = document.getElementById('app-title')
const readmeContainer = document.getElementById('readme-container')

function initializeOrResetCubeState() {
	positionCodeInput.style.color = ''
	positionCodeInput.value = ''
	positionCodeInput.style.fontFamily = '"Times New Roman", ""Times", serif'
	positionCodeInput.style.fontSize = '1em'

	applyInputButton.style.background = 'linear-gradient(to right, #8A2BE2 25px, dodgerblue 40px)'

	clearDiagnosticMessage()

	shouldDrawCatch24Text = false
	cubeState = new CubeState()
	currentActiveStickerIndex = 0

	updateAndRedrawAll()
}

function handleApplyCode(isSolution) {
	clearDiagnosticMessage()
	const userInput = positionCodeInput.value.trim()
	if (userInput === '') return

	const cleanUserInput = userInput.replace(/\s*↩\s*$/, '')
	const isPotentiallyMoves = /[FBUDLRw'23`>1]/.test(cleanUserInput)
	const isPotentiallyCatch24 = /^[a-x\s-]{18,}$/.test(userInput)

	if (isPotentiallyMoves && !isPotentiallyCatch24) {
		const rotationRegex = /[xyz]/i
		if (rotationRegex.test(userInput)) {
			setDiagnosticMessage('Error: Rotations of the entire cube (x, y, z) are not supported.')
			return
		}

		const normalizedSequence = normalizeAndFormatMoveSequence(cleanUserInput)

		if (normalizedSequence === null || normalizedSequence.trim() === '') {
			setDiagnosticMessage('Error: Unable to recognize the move sequence.')
			return
		}

		const result = cubeState.applyMoveSequence(normalizedSequence, isSolution)

		if (result.success) {
			positionCodeInput.value = normalizedSequence
			positionCodeInput.style.fontFamily = '"Times New Roman", "Times", serif'
			positionCodeInput.style.color = 'lime'
			if (isSolution) {
				positionCodeInput.value = `${normalizedSequence} ↩`
				applyInputButton.style.background = '#8A2BE2'
				positionCodeInput.focus()
				const len = positionCodeInput.value.length
				positionCodeInput.selectionStart = positionCodeInput.selectionEnd = len
			} else {
				applyInputButton.style.background = 'linear-gradient(to right, #8A2BE2 25px, dodgerblue 40px)'
			}
			updateAndRedrawAll()
		} else {
			setDiagnosticMessage(result.error)
		}
	} else if (isPotentiallyCatch24) {
		const codeInput = userInput.replace(/\s+/g, '').toLowerCase()
		if (codeInput.length === 18 && /^[a-x]{18}$/.test(codeInput)) {
			const result = cubeState.applyCatch24Code(codeInput)
			if (result.success) {
				applyInputButton.style.background = 'dodgerblue'
				positionCodeInput.value = codeInput.split('').join(' ')
				positionCodeInput.style.fontFamily = '"Menlo", "Consolas", monospace'
				positionCodeInput.style.fontSize = '1.1em'
				positionCodeInput.style.color = 'lime'
				updateAndRedrawAll()
			} else {
				setDiagnosticMessage(result.error)
			}
		} else {
			setDiagnosticMessage('Error: Catch-24 code must be 18 characters long a-x.')
		}
	} else {
		setDiagnosticMessage('Error: Input not recognized.')
	}
}

function handleCatch24Copy() {
	const codeToCopy = codeCatch24output.value.replace(/\s+/g, '')
	if (codeToCopy) {
		navigator.clipboard
			.writeText(codeToCopy)
			.then(() => {
				positionCodeInput.value = codeToCopy
				positionCodeInput.style.fontFamily = '"Menlo", "Consolas", monospace'
				positionCodeInput.style.fontSize = '1.1em'
				positionCodeInput.style.color = 'dodgerblue'

				applyInputButton.style.background = 'linear-gradient(to right, #8A2BE2 25px, dodgerblue 40px)'

				const originalText = 'Copy'
				applyCopyButton.textContent = 'Copied'
				applyCopyButton.classList.add('copied')
				if (copyTimeoutId) clearTimeout(copyTimeoutId)
				copyTimeoutId = setTimeout(() => {
					applyCopyButton.textContent = originalText
					applyCopyButton.classList.remove('copied')
				}, 1000)
			})
			.catch((err) => {
				setDiagnosticMessage('Copy error.')
			})
	}
}

function normalizeAndFormatMoveSequence(input) {
	let cleaned = input.replace(/\s+/g, '')
	cleaned = cleaned.replace(/`/g, "'").replace(/’/g, "'").replace(/3/g, "'").replace(/1/g, '')

	const moveRegex = /[FBUDLR]w?['2]?/g
	const moves = cleaned.match(moveRegex)
	if (!moves || moves.length === 0) return ''

	const moveValues = { "'": -1, 2: 2 }
	const simplifiedMoves = []

	for (const rawMove of moves) {
		const modifier = rawMove.slice(-1)
		const face = modifier === "'" || modifier === '2' ? rawMove.slice(0, -1) : rawMove
		const value = moveValues[modifier] || 1
		const lastMove = simplifiedMoves.length > 0 ? simplifiedMoves[simplifiedMoves.length - 1] : null

		if (lastMove && lastMove.face === face) {
			lastMove.value += value
		} else {
			simplifiedMoves.push({ face: face, value: value })
		}
	}

	const finalMoves = []
	for (const move of simplifiedMoves) {
		const netTurns = ((move.value % 4) + 4) % 4
		if (netTurns === 1) finalMoves.push(move.face)
		else if (netTurns === 2) finalMoves.push(`${move.face}2`)
		else if (netTurns === 3) finalMoves.push(`${move.face}'`)
	}
	return finalMoves.join(' ')
}

function updateAndRedrawAll() {
	checkAndUpdateAllStickersNonDefault()
	updateControlsVisibility()
	updatePaletteAndPotentiallyAutoApply()
	updateCatch24Display()
	drawLayout(cubeState, getLayoutArgs())
}

function checkAndUpdateAllStickersNonDefault() {
	allStickersAreNonDefault = cubeState.stickersColor.every((color) => color !== CubeDefs.DEFAULT_COLOR)
	return allStickersAreNonDefault
}

function getLayoutArgs() {
	return {
		activeStickerIndex: allStickersAreNonDefault ? -1 : currentActiveStickerIndex,
		drawCatch24Text: shouldDrawCatch24Text,
	}
}

function updateControlsVisibility() {
	const controlsShouldBeVisible = !allStickersAreNonDefault
	paletteContainer.style.display = controlsShouldBeVisible ? 'grid' : 'none'
	if (eraserButton) {
		eraserButton.style.display = controlsShouldBeVisible && currentActiveStickerIndex !== 0 ? 'inline-block' : 'none'
	}
}

function getStickerIndexFromCoords(clickX, clickY, targetCanvasElement) {
	if (!targetCanvasElement || SQUARE_SIZE_FOR_CLICK_DETECTION <= 0) return null
	const rect = targetCanvasElement.getBoundingClientRect()
	const scaleX = targetCanvasElement.width / rect.width
	const scaleY = targetCanvasElement.height / rect.height
	const canvasClickX = (clickX - rect.left) * scaleX
	const canvasClickY = (clickY - rect.top) * scaleY
	const faceLayoutCoords = CubeDefs.FACE_LAYOUT

	for (let faceOrderIndex = 0; faceOrderIndex < faceLayoutCoords.length; faceOrderIndex++) {
		const [faceGridX, faceGridY] = faceLayoutCoords[faceOrderIndex]
		const faceCanvasX = faceGridX * M_FOR_CLICK_DETECTION
		const faceCanvasY = faceGridY * M_FOR_CLICK_DETECTION
		if (canvasClickX >= faceCanvasX && canvasClickX < faceCanvasX + M_FOR_CLICK_DETECTION && canvasClickY >= faceCanvasY && canvasClickY < faceCanvasY + M_FOR_CLICK_DETECTION) {
			const relativeX = canvasClickX - faceCanvasX
			const relativeY = canvasClickY - faceCanvasY
			const col = Math.floor(relativeX / SQUARE_SIZE_FOR_CLICK_DETECTION)
			const row = Math.floor(relativeY / SQUARE_SIZE_FOR_CLICK_DETECTION)
			if (row === 1 && col === 1) return null // Centers
			const localOrderOnFace = CubeDefs.NON_CENTER_FACE.findIndex((p) => p.row === row && p.col === col)
			if (localOrderOnFace !== -1) return faceOrderIndex * 8 + localOrderOnFace
			return null
		}
	}
	return null
}

function handleCanvasClick(event) {
	const clickedStickerIndex = getStickerIndexFromCoords(event.clientX, event.clientY, canvasEl)
	if (clickedStickerIndex === null) return
	const canProceedToModify = (allStickersAreNonDefault && clickedStickerIndex < 16) || (!allStickersAreNonDefault && clickedStickerIndex < currentActiveStickerIndex)
	if (!canProceedToModify) return

	const wasSolved = allStickersAreNonDefault
	if (!wasSolved && cubeState.getStickerColor(clickedStickerIndex) === CubeDefs.DEFAULT_COLOR) {
		currentActiveStickerIndex = clickedStickerIndex
		updateAndRedrawAll()
	} else {
		currentActiveStickerIndex = clickedStickerIndex
		allStickersAreNonDefault = false
		clearDiagnosticMessage()
		for (let i = currentActiveStickerIndex; i < CubeDefs.TOTAL_STIKERS; i++) {
			if (cubeState.getStickerColor(i) !== CubeDefs.DEFAULT_COLOR) {
				cubeState.setStickerColor(i, CubeDefs.DEFAULT_COLOR)
			}
		}
		updateAndRedrawAll()
	}
}

function handleBackspaceButtonClick() {
	if (currentActiveStickerIndex > 0) {
		clearDiagnosticMessage()
		currentActiveStickerIndex--
		allStickersAreNonDefault = false
		for (let i = currentActiveStickerIndex; i < CubeDefs.TOTAL_STIKERS; i++) {
			if (cubeState.getStickerColor(i) !== CubeDefs.DEFAULT_COLOR) {
				cubeState.setStickerColor(i, CubeDefs.DEFAULT_COLOR)
			}
		}
		updateAndRedrawAll()
	}
}

function applyColorToSticker(colorToApply) {
	if (!colorToApply || currentActiveStickerIndex >= CubeDefs.TOTAL_STIKERS) return

	const stickerToProcess = currentActiveStickerIndex
	cubeState.setStickerColor(stickerToProcess, colorToApply)
	const deductionsMade = cubeState.runSmartLogic(stickerToProcess)
	checkAndUpdateAllStickersNonDefault()
	if (!allStickersAreNonDefault || deductionsMade) {
		let nextIdx = stickerToProcess
		if (cubeState.getStickerColor(nextIdx) !== CubeDefs.DEFAULT_COLOR) {
			nextIdx = stickerToProcess + 1
		}
		if (nextIdx < CubeDefs.TOTAL_STIKERS) {
			const initialSearchIdx = nextIdx
			while (cubeState.getStickerColor(nextIdx) !== CubeDefs.DEFAULT_COLOR) {
				nextIdx = nextIdx + 1
				if (nextIdx >= CubeDefs.TOTAL_STIKERS || nextIdx === initialSearchIdx) {
					checkAndUpdateAllStickersNonDefault()
					break
				}
			}
		}
		currentActiveStickerIndex = nextIdx >= CubeDefs.TOTAL_STIKERS ? -1 : nextIdx
	}
	updateAndRedrawAll()
}

function updatePaletteAndPotentiallyAutoApply() {
	if (allStickersAreNonDefault) return
	const validColors = cubeState.getValidColorsForSticker(currentActiveStickerIndex)
	const allPaletteButtons = paletteContainer.querySelectorAll('button.color-button')
	for (const button of allPaletteButtons) {
		const color = button.dataset.color
		const isVisible = validColors.includes(color)
		button.style.visibility = isVisible ? 'visible' : 'hidden'
		button.disabled = !isVisible
	}
	if (validColors.length === 0 && currentActiveStickerIndex < 48) {
		setDiagnosticMessage('Error: Invalid cube position!')
	}
	if (validColors.length === 1 && !cubeState.justErased) {
		// Assuming justErased is a property on cubeState
		applyColorToSticker(validColors[0])
	}
}

function handleColorClick(event) {
	const clickedButton = event.target.closest('.color-button')
	if (!clickedButton || clickedButton.disabled) return
	const selectedColor = clickedButton.dataset.color
	if (cubeState) cubeState.justErased = false
	applyColorToSticker(selectedColor)
}

function updateCatch24Display() {
	const code = cubeState.generateCodeCatch24()
	const isComplete = code && !code.includes('-')
	codeCatch24output.value = code.split('').join(' ')
	applyCopyButton.disabled = !isComplete
	if (isComplete) {
		codeCatch24output.style.color = 'dodgerblue'
		shouldDrawCatch24Text = true
	} else {
		codeCatch24output.style.color = ''
		shouldDrawCatch24Text = false
	}
}

function setDiagnosticMessage(message) {
	if (diagnosticMessage) diagnosticMessage.textContent = message
}

function clearDiagnosticMessage() {
	if (diagnosticMessage) diagnosticMessage.textContent = ''
}
// --- DYNAMIC UI CREATION ---
const eraserButton = document.createElement('button')
eraserButton.id = 'backspace-button'
eraserButton.textContent = ' ⌫ '
eraserButton.title = 'Backspace'

document.getElementById('left-controls').appendChild(eraserButton)

paletteContainer.innerHTML = ''
const paletteButtonSize = Math.floor(M_FOR_CLICK_DETECTION / CUBE_DIMENSION_CONFIG)
paletteContainer.style.gridTemplateColumns = `repeat(${CUBE_DIMENSION_CONFIG}, ${paletteButtonSize}px)`
for (const colorValue of Object.values(CubeDefs.FACE_COLORS)) {
	if (colorValue === CubeDefs.DEFAULT_COLOR) continue
	const btn = document.createElement('button')
	btn.style.backgroundColor = colorValue
	btn.dataset.color = colorValue
	btn.classList.add('color-button')
	btn.style.width = `${paletteButtonSize}px`
	btn.style.height = `${paletteButtonSize}px`
	btn.style.borderRadius = `${Math.max(1, Math.floor(paletteButtonSize / 6))}px`
	btn.addEventListener('click', handleColorClick)
	paletteContainer.appendChild(btn)
}

resetButton.addEventListener('click', initializeOrResetCubeState)

canvasEl.addEventListener('click', handleCanvasClick)

eraserButton.addEventListener('click', handleBackspaceButtonClick)

applyCopyButton.addEventListener('click', handleCatch24Copy)

applyInputButton.addEventListener('click', (event) => {
	if (event.target.closest('.hotzone-icon')) {
		handleApplyCode(true)
	} else {
		handleApplyCode(false)
	}
})

positionCodeInput.addEventListener('paste', (event) => {
	positionCodeInput.style.color = ''
	clearDiagnosticMessage()
	event.preventDefault()
	const pastedText = (event.clipboardData || window.Clipboard).getData('text/plain')
	const input = event.target
	input.value = input.value.substring(0, input.selectionStart) + pastedText + input.value.substring(input.selectionEnd)
})

titleHeader.addEventListener('click', async () => {
	if (readmeContainer.style.display === 'block') {
		readmeContainer.style.display = 'none'
		return
	}
	if (readmeContainer.innerHTML.trim() !== '') {
		readmeContainer.style.display = 'block'
		return
	}
	try {
		const response = await fetch('./readme.html')

		if (!response.ok) {
			throw new Error('Failed to load readme.html')
		}
		const htmlContent = await response.text()

		readmeContainer.innerHTML = htmlContent
		readmeContainer.style.display = 'block'
	} catch (error) {
		console.error('Error:', error)
		readmeContainer.innerHTML = 'Failed to load file content.'
		readmeContainer.style.display = 'block'
	}
})

initializeOrResetCubeState()

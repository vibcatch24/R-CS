// CubeState.js ref 1.2
import * as CubeDefs from './cubeConstants.js'

const DEBUG = CubeDefs.DEBUG_STATE
export class CubeState {
	constructor() {
		this.stickersColor = new Array(CubeDefs.TOTAL_STIKERS).fill(CubeDefs.DEFAULT_COLOR)
		this.pieceDefs = CubeDefs.PIECE_DEFS
		this.definitionAssignments = {} // { 'corner_0': physicalSlotId, 'edge_3': physicalSlotId, ... }
		this.faceColors = CubeDefs.FACE_COLORS
		this.stickerIndex = null
	}

	getStickerColor(stickerIndex) {
		return this.stickersColor[stickerIndex]
	}

	_getPieceInfoByStickerIndex(stickerIndex) {
		const definitions = stickerIndex % 2 ? this.pieceDefs.edges : this.pieceDefs.corners

		for (const def of definitions) {
			if (def.refInd.includes(stickerIndex)) {
				return {
					id: def.id,
					type: def.type,
					refInd: def.refInd,
					faces: def.faces,
				}
			}
		}
	}

	_getCornerSlotStickerData(cornerSlotID) {
		const slotDef = this.pieceDefs.corners[cornerSlotID]
		const stickerSlotArray = []
		for (let i = 0; i < 3; i++) {
			stickerSlotArray.push({
				stickerIndex: slotDef.refInd[i],
				color: this.stickersColor[slotDef.refInd[i]],
				faceIndexOfSlot: i,
			})
		}
		return stickerSlotArray
	}

	_getEdgeSlotStickerData(edgeSlotID) {
		const slotDef = this.pieceDefs.edges[edgeSlotID]
		const stickerSlotArray = []
		for (let i = 0; i < 2; i++) {
			stickerSlotArray.push({
				stickerIndex: slotDef.refInd[i],
				color: this.stickersColor[slotDef.refInd[i]],
				faceIndexOfSlot: i,
			})
		}
		return stickerSlotArray
	}

	_getFaceNameOfSticker(stickerIndex) {
		const faceOrderIndex = Math.floor(stickerIndex / 8)
		return CubeDefs.SIDES[faceOrderIndex]
	}

	_getCurrentPermutation(typeSlot) {
		const isCorner = typeSlot === 'corner'
		const count = isCorner ? 8 : 12
		const permutation = new Array(count)

		for (const defKey in this.definitionAssignments) {
			if (defKey.startsWith(typeSlot)) {
				const slotId = this.definitionAssignments[defKey]
				const defId = Number.parseInt(defKey.split('_')[1], 10)

				permutation[slotId] = defId
			}
		}
		return permutation
	}

	_getAssignedCornerDefID_fromTwoColors(physicalSlotID, twoKnownColorsInfo) {
		const colorA_Data = twoKnownColorsInfo[0]
		const colorB_Data = twoKnownColorsInfo[1]
		const candidateDefinitionsData = []
		for (const candDef of this.pieceDefs.corners) {
			const candDefCanonicalColors = candDef.faces.map((faceName) => this.faceColors[faceName])

			const hasColorA = candDefCanonicalColors.includes(colorA_Data.color)
			const hasColorB = candDefCanonicalColors.includes(colorB_Data.color)

			let isAvailable = true
			const candDefKey = `corner_${candDef.id}`
			if (Object.prototype.hasOwnProperty.call(this.definitionAssignments, candDefKey) && this.definitionAssignments[candDefKey] !== physicalSlotID) {
				isAvailable = false
			}

			if (hasColorA && hasColorB && isAvailable) {
				candidateDefinitionsData.push({
					definition: candDef,
					canonicalColors: candDefCanonicalColors,
				})
			}
		}

		const orderedFaceOnPhysicalSlot = this._getOrderedPairFromTriple([0, 1, 2], colorA_Data.faceIndexOfSlot, colorB_Data.faceIndexOfSlot)
		const slotColorOrder = []
		if (orderedFaceOnPhysicalSlot[0] === colorA_Data.faceIndexOfSlot) {
			slotColorOrder.push(colorA_Data.color, colorB_Data.color)
		} else {
			slotColorOrder.push(colorB_Data.color, colorA_Data.color)
		}

		for (const currentCandidateData of candidateDefinitionsData) {
			const candidateColorPair = this._getOrderedPairFromTriple(currentCandidateData.canonicalColors, colorA_Data.color, colorB_Data.color)

			if (!candidateColorPair) {
				continue
			}
			if (slotColorOrder[0] === candidateColorPair[0] && slotColorOrder[1] === candidateColorPair[1]) {
				return currentCandidateData.definition.id
			}
		}
		return null
	}

	_getOrderedPairFromTriple(tripleArray, itemB, itemC) {
		if (itemB === itemC && itemB !== undefined) {
			return null
		}
		const idxB = tripleArray.indexOf(itemB)
		const idxC = tripleArray.indexOf(itemC)

		if (idxB === -1 || idxC === -1) {
			return null
		}
		let excludedIdx = -1
		for (let i = 0; i < 3; i++) {
			if (i !== idxB && i !== idxC) {
				excludedIdx = i
				break
			}
		}
		if (excludedIdx === -1) {
			return null
		}
		const firstInPair = tripleArray[(excludedIdx + 1) % 3]
		const secondInPair = tripleArray[(excludedIdx + 2) % 3]
		if ((firstInPair === itemB && secondInPair === itemC) || (firstInPair === itemC && secondInPair === itemB)) {
			return [firstInPair, secondInPair]
		}
		return null
	}

	getValidColorsForSticker(stickerIndex) {
		const pieceInfo = this._getPieceInfoByStickerIndex(stickerIndex)
		const slotStickerIndices = pieceInfo.refInd
		const otherColorsOnPhysicalSlot = []

		for (const sIndex of slotStickerIndices) {
			if (sIndex !== stickerIndex) {
				const color = this.stickersColor[sIndex]
				if (color !== CubeDefs.DEFAULT_COLOR) {
					otherColorsOnPhysicalSlot.push(color)
				}
			}
		}
		let validColors = Object.values(this.faceColors)

		validColors = validColors.filter((color) => !otherColorsOnPhysicalSlot.includes(color))
		if (DEBUG) console.log(`  After Rule A (no duplicates on piece): [${validColors.join(',')}]`)

		validColors = validColors.filter((potentialColor) => {
			let potentialColorFaceName = null
			for (const faceNameKey in this.faceColors) {
				if (this.faceColors[faceNameKey] === potentialColor) {
					potentialColorFaceName = faceNameKey
					break
				}
			}
			let colorOppositeToPotential = null

			for (const facePair of CubeDefs.OPPOSITE_FACE_PAIRS) {
				let oppositeFace = null
				if (facePair[0] === potentialColorFaceName) oppositeFace = facePair[1]
				else if (facePair[1] === potentialColorFaceName) oppositeFace = facePair[0]
				if (oppositeFace) {
					colorOppositeToPotential = this.faceColors[oppositeFace]
					break
				}
			}
			if (colorOppositeToPotential && otherColorsOnPhysicalSlot.includes(colorOppositeToPotential)) {
				return false
			}
			return true
		})
		if (DEBUG) console.log(`  After Rule B (no opposites on piece): [${validColors.join(',')}]`)

		validColors = validColors.filter((potentialColor) => {
			let count = 0
			for (let i = 0; i < this.stickersColor.length; i++) {
				if (this.stickersColor[i] === potentialColor) {
					count++
				}
			}
			const isRuleCFailed = count >= 8 && this.stickersColor[stickerIndex] !== potentialColor
			return !isRuleCFailed
		})
		if (DEBUG) console.log(`  After Rule C (global limit 8): [${validColors.join(',')}]`)

		if (pieceInfo.type === 'edge') {
			validColors = validColors.filter((potentialColor) => {
				const otherStickerIndex = pieceInfo.refInd.find((idx) => idx !== stickerIndex)
				const colorOnOtherSticker = this.stickersColor[otherStickerIndex]

				if (colorOnOtherSticker === CubeDefs.DEFAULT_COLOR) {
					return true
				}

				const colorsOnThisEdge = [potentialColor, colorOnOtherSticker]
				let identifiedEdgeId

				for (const defEdge of this.pieceDefs.edges) {
					const colorsForDefEdge = defEdge.faces.map((f) => this.faceColors[f])
					if (colorsForDefEdge.length === 2 && colorsForDefEdge.includes(colorsOnThisEdge[0]) && colorsForDefEdge.includes(colorsOnThisEdge[1])) {
						identifiedEdgeId = defEdge.id
						break
					}
				}

				const canonicalKey = `edge_${identifiedEdgeId}`
				if (Object.prototype.hasOwnProperty.call(this.definitionAssignments, canonicalKey) && this.definitionAssignments[canonicalKey] !== pieceInfo.id) {
					return false
				}
				return true
			})
			if (DEBUG) console.log(`  After Rule E-edges (no duplicates slots): [${validColors.join(',')}]`)
		}

		if (stickerIndex > 7) {
			validColors = validColors.filter((potentialColor) => {
				const iterationStartStickerIndex = stickerIndex % 2 === 0 ? 0 : 1
				let countStickersOfTypeWithColor = 0

				for (let idx = iterationStartStickerIndex; idx < CubeDefs.TOTAL_STIKERS; idx += 2) {
					if (this.stickersColor[idx] === potentialColor) {
						countStickersOfTypeWithColor++
					}
				}

				if (countStickersOfTypeWithColor > 3) {
					return false
				}
				return true
			})
		}
		if (DEBUG) console.log(`  After Rule D (1 color for type slots=limit 4): [${validColors.join(',')}]`)

		if (pieceInfo.type === 'corner') {
			const cornerStickerData = this._getCornerSlotStickerData(pieceInfo.id)
			const coloredStickers = cornerStickerData.filter((s) => s.color !== CubeDefs.DEFAULT_COLOR)

			if (coloredStickers.length === 2) {
				const twoKnownColorsInfo = coloredStickers.map((s) => ({
					color: s.color,
					faceIndexOfSlot: s.faceIndexOfSlot,
				}))

				const assignedCornerDefID = this._getAssignedCornerDefID_fromTwoColors(pieceInfo.id, twoKnownColorsInfo)
				const assignedStickerData = this.pieceDefs.corners[assignedCornerDefID].faces.map((faceName) => ({
					color: this.faceColors[faceName],
				}))
				// Extract the color values from arr1 into a new array for easier comparison
				const colorsFromArr1 = assignedStickerData.map((item) => item.color)
				const commonColors = validColors.filter((color) => colorsFromArr1.includes(color))
				return commonColors
			}

			if (coloredStickers.length === 1) {
				const knownSticker = coloredStickers[0]
				const targetStickerInfoInSlot = cornerStickerData.find((s) => s.stickerIndex === stickerIndex)

				if (targetStickerInfoInSlot) {
					validColors = validColors.filter((potentialColor) => {
						const twoKnownColorsInfo = [
							{ color: knownSticker.color, faceIndexOfSlot: knownSticker.faceIndexOfSlot },
							{ color: potentialColor, faceIndexOfSlot: targetStickerInfoInSlot.faceIndexOfSlot },
						]
						const assignedCornerDefID = this._getAssignedCornerDefID_fromTwoColors(pieceInfo.id, twoKnownColorsInfo)
						const isColorAllowedByThisRuleG = assignedCornerDefID !== null && assignedCornerDefID !== -1 && typeof assignedCornerDefID !== 'undefined'
						return isColorAllowedByThisRuleG
					})
				}
			}
		}
		if (DEBUG) console.log(`%cgetValidColorsForSticker for sticker ${stickerIndex} FINAL: [${validColors.join(',')}]`, 'font-weight:bold;')
		return validColors
	}

	setStickerColor(stickerIndex, newColor) {
		this.stickerIndex = stickerIndex
		if (newColor === CubeDefs.DEFAULT_COLOR) {
			for (let i = stickerIndex; i < CubeDefs.TOTAL_STIKERS; i++) {
				this.stickersColor[i] = CubeDefs.DEFAULT_COLOR
				this._clearAssignmentSlot(i)
			}
			return
		}
		this.stickersColor[stickerIndex] = newColor
		return
	}

	_setColorStickerEdgeSlot(edgeAssigmentSlot, edgePhisicalSlot) {
		const stickersPhisicalSlot = this.pieceDefs.edges[edgePhisicalSlot].refInd
		const stickersColorPhisicalSlot = stickersPhisicalSlot.map((index) => this.stickersColor[index])
		const stickersColorAssigmentSlot = this.pieceDefs.edges[edgeAssigmentSlot].faces.map((face) => this.faceColors[face])
		const colorAssigned = stickersColorAssigmentSlot.filter((item) => !stickersColorPhisicalSlot.includes(item))

		for (let i = 1; i > 0; i--) {
			if (stickersColorPhisicalSlot[i] === CubeDefs.DEFAULT_COLOR) {
				this.setStickerColor(stickersPhisicalSlot[i], colorAssigned[0])
			}
		}
	}

	_setAllStickersToSolvedState() {
		for (let i = 17; i < CubeDefs.TOTAL_STIKERS; i++) {
			const faceName = CubeDefs.SIDES[Math.floor(i / 8)]
			this.stickersColor[i] = this.faceColors[faceName]
		}
		this.definitionAssignments = {}
		for (let i = 0; i < 8; i++) {
			this.definitionAssignments[`corner_${i}`] = i
		}
		for (let i = 0; i < 12; i++) {
			this.definitionAssignments[`edge_${i}`] = i
		}
	}

	applyCatch24Code(inputCode) {
		let preliminaryCode = ''
		for (let i = 0; i < 18; i++) {
			preliminaryCode += CubeDefs.CATCH24_MULT_TABLE.get(inputCode[i])[CubeDefs.IDENTITY[i]]
		}
		const decodedInfo = this._decodePreliminaryCode(preliminaryCode)
		if (!decodedInfo.success) return decodedInfo

		const missingPieces = this._determineMissingPieces(decodedInfo.corners, decodedInfo.edges)
		if (!missingPieces) return { success: false, error: 'Internal error: could not be determined c0/e11.' }

		const allCornersInfo = [missingPieces.c0_data, ...decodedInfo.corners]
		const allEdgesInfo = [...decodedInfo.edges, missingPieces.e11_data]

		this.stickersColor = new Array(CubeDefs.TOTAL_STIKERS).fill(CubeDefs.DEFAULT_COLOR)
		this.definitionAssignments = {}

		for (const info of allCornersInfo) {
			this.definitionAssignments[`corner_${info.pieceDefId}`] = info.physicalSlotId
			this._paintSlotFromData(info.physicalSlotId, 'corner', info.pieceDefId, info.orientation)
		}
		for (const info of allEdgesInfo) {
			const infoToUse = info.physicalSlotId !== 11 ? info : missingPieces.e11_data
			this.definitionAssignments[`edge_${infoToUse.pieceDefId}`] = infoToUse.physicalSlotId
			this._paintSlotFromData(infoToUse.physicalSlotId, 'edge', infoToUse.pieceDefId, infoToUse.orientation)
		}
		return { success: true }
	}

	_applyIterativeDeductionRules() {
		for (let c_slotId = 0; c_slotId < 8; c_slotId++) {
			for (const defKey in this.definitionAssignments) {
				if (this.definitionAssignments[defKey] === defKey.startsWith('corner_')) {
					break
				}
			}
			this._deduceAndCompleteCorner(c_slotId)
		}
		let pieceType = 'corner'
		const currentStickerIndex = this.stickerIndex
		if (currentStickerIndex % 2) {
			pieceType = 'edge'
		}
		const pieceTypeAndSuffix = `${pieceType}s`
		// fixed-point iteration
		let madeChangeInCurrentPass
		do {
			madeChangeInCurrentPass = false
			let assignedCount = 0

			for (const pieceDefKey in this.definitionAssignments) {
				if (Object.prototype.hasOwnProperty.call(this.definitionAssignments, pieceDefKey)) {
					if (pieceDefKey.startsWith(`${pieceType}_`)) {
						assignedCount++
					}
				}
			}
			if (assignedCount < 3) break

			const allCubeFaceColors = Object.values(this.faceColors)
			targetColorLoop: for (const targetColor of allCubeFaceColors) {
				const stickersFound = []
				const startIterationIndex = pieceType === 'edge' ? 1 : 0

				for (let i = startIterationIndex; i < CubeDefs.TOTAL_STIKERS; i += 2) {
					if (this.stickersColor[i] === targetColor) {
						stickersFound.push(i)
					}
				}
				if (stickersFound.length !== 4) {
					continue
				}

				const assignedSlotsID = []
				const unassignedSlotID = []
				let currentUnassignedSticker = null

				for (const stickerIdx of stickersFound) {
					const pieceInfo = this._getPieceInfoByStickerIndex(stickerIdx)
					const physSlotID = pieceInfo.id
					let isAssignedToCorrectDefinitionType = false

					for (const definitionKey in this.definitionAssignments) {
						if (Object.prototype.hasOwnProperty.call(this.definitionAssignments, definitionKey)) {
							if (this.definitionAssignments[definitionKey] === physSlotID) {
								if (definitionKey.startsWith(`${pieceType}_`)) {
									isAssignedToCorrectDefinitionType = true
								}
							}
						}
					}
					if (isAssignedToCorrectDefinitionType) {
						assignedSlotsID.push(physSlotID)
					} else {
						unassignedSlotID.push(physSlotID)
						currentUnassignedSticker = stickerIdx
					}
					if (unassignedSlotID.length > 1 || assignedSlotsID.length === 4) {
						continue targetColorLoop
					}
				}

				if (assignedSlotsID.length === 3 && unassignedSlotID.length === 1) {
					let targetFaceName = null
					for (const faceNameKey in this.faceColors) {
						if (this.faceColors[faceNameKey] === targetColor) {
							targetFaceName = faceNameKey
							break
						}
					}
					const definitionArray = this.pieceDefs[pieceTypeAndSuffix]
					let destinationDefinitionSlotID = null

					for (const pieceDefObject of definitionArray) {
						const pieceFaceNames = pieceDefObject.faces

						if (pieceFaceNames.includes(targetFaceName)) {
							const currentPieceDefID = pieceDefObject.id
							const assignmentKeyToCheck = `${pieceType}_${currentPieceDefID}`
							if (this.definitionAssignments[assignmentKeyToCheck] === undefined) {
								destinationDefinitionSlotID = currentPieceDefID
								break
							}
						}
					}

					const definitionData = this.pieceDefs[pieceTypeAndSuffix][destinationDefinitionSlotID]
					const definedFaceNames = definitionData.faces
					const definitionSlotColors = definedFaceNames.map((faceName) => this.faceColors[faceName])
					const k_target = definitionSlotColors.indexOf(targetColor)
					const physicalPieceData = this.pieceDefs[pieceTypeAndSuffix][unassignedSlotID[0]]
					const actualStickerIndicesForPiece = physicalPieceData.refInd
					const anchorStickerPosInActualPiece = actualStickerIndicesForPiece.indexOf(currentUnassignedSticker)
					const numStickersOnPiece = definitionSlotColors.length

					for (let i = 0; i < numStickersOnPiece; i++) {
						const colorToApply = definitionSlotColors[i]
						const offsetFromAnchorInDefinition = (i - k_target + numStickersOnPiece) % numStickersOnPiece
						const targetStickerOrderIndexInPiece = (anchorStickerPosInActualPiece + offsetFromAnchorInDefinition + numStickersOnPiece) % numStickersOnPiece
						const actualStickerIndexToColor = actualStickerIndicesForPiece[targetStickerOrderIndexInPiece]

						this.stickersColor[actualStickerIndexToColor] = colorToApply
					}
					this.definitionAssignments[`${pieceType}_${destinationDefinitionSlotID}`] = unassignedSlotID[0]

					madeChangeInCurrentPass = true
					break
				}
			}
		} while (madeChangeInCurrentPass)

		const assignedEdgeKeys = Object.keys(this.definitionAssignments).filter((k) => k.startsWith('edge_'))
		const assignedCornerKeys = Object.keys(this.definitionAssignments).filter((k) => k.startsWith('corner_'))

		if (assignedCornerKeys.length === 7) {
			const assignedCornerSlotIds = assignedCornerKeys.map((key) => this.definitionAssignments[key])
			let unsolvedPhisicalSlotId
			const unsolvedStickers = []
			for (let i = 0; i < 8; i++) {
				if (!assignedCornerSlotIds.includes(i)) {
					unsolvedPhisicalSlotId = i
					unsolvedStickers.push(this.pieceDefs.corners[i].refInd)
					break
				}
			}

			const assignedCornerDefIds = assignedCornerKeys.map((key) => Number.parseInt(key.split('_')[1], 10))
			let unassignedDefId
			const unassignedDefIdFaceColors = []
			for (let i = 0; i < 8; i++) {
				if (!assignedCornerDefIds.includes(i)) {
					unassignedDefId = i

					for (const face of this.pieceDefs.corners[i].faces) {
						unassignedDefIdFaceColors.push(this.faceColors[face])
					}
					break
				}
			}
			let pieceInfo
			let sumOrientation = 0
			for (let i = 0; i < CubeDefs.TOTAL_STIKERS; i += 2) {
				if (this.stickersColor[i] === 'snow' || this.stickersColor[i] === 'yellow') {
					pieceInfo = this._getPieceInfoByStickerIndex(i)
					for (let j = 0; j < pieceInfo.refInd.length; j++) {
						if (pieceInfo.refInd[j] === i) {
							sumOrientation += j
						}
					}
				}
			}
			const ori = (3 - (sumOrientation % 3)) % 3

			for (let i = 0; i < 3; i++) {
				this.setStickerColor(unsolvedStickers[0][(ori + i) % 3], unassignedDefIdFaceColors[i])
			}
			this.definitionAssignments[`corner_${unassignedDefId}`] = unsolvedPhisicalSlotId
		}
		if (assignedEdgeKeys.length === 10 && assignedCornerKeys.length === 8) {
			const cornerPermutation = this._getCurrentPermutation('corner')
			const cornerParity = this._calculatePermutationParity(cornerPermutation)

			const assignedSlots = new Set()
			const assignedDefs = new Set()

			for (const key of assignedEdgeKeys) {
				assignedSlots.add(this.definitionAssignments[key])
				assignedDefs.add(Number.parseInt(key.split('_')[1], 10))
			}
			const unassignedSlotIds = Array.from({ length: 12 }, (_, i) => i).filter((id) => !assignedSlots.has(id))
			const unassignedDefIds = Array.from({ length: 12 }, (_, i) => i).filter((id) => !assignedDefs.has(id))
			let [defP_id, defQ_id] = unassignedDefIds
			const [slotY_id, slotZ_id] = unassignedSlotIds
			const tempEdgePermutation = this._getCurrentPermutation('edge')
			tempEdgePermutation[slotY_id] = defP_id
			tempEdgePermutation[slotZ_id] = defQ_id

			const edgeParity = this._calculatePermutationParity(tempEdgePermutation)

			if (cornerParity !== edgeParity) {
				;[defP_id, defQ_id] = [defQ_id, defP_id]
			}
			this.definitionAssignments[`edge_${defP_id}`] = slotY_id
			this.definitionAssignments[`edge_${defQ_id}`] = slotZ_id
			this._setColorStickerEdgeSlot(defP_id, slotY_id)
			this._setColorStickerEdgeSlot(defQ_id, slotZ_id)
		}
	}

	applyMoveSequence(moveSequence, isSolution = false) {
		const parser = (sequence) => {
			const moveStrings = sequence.split(' ')
			const parsedMoves = []
			for (const moveStr of moveStrings) {
				if (moveStr.length === 0) continue
				let face = moveStr
				let turns = 1
				const lastChar = face.slice(-1)
				if (lastChar === "'") {
					turns = -1
					face = face.slice(0, -1)
				} else if (lastChar === '2') {
					turns = 2
					face = face.slice(0, -1)
				}
				parsedMoves.push({ face, turns })
			}
			return parsedMoves
		}

		const wideMoveMap = { Uw: 'D', Dw: 'U', Rw: 'L', Lw: 'R', Fw: 'B', Bw: 'F' }
		const parsedSequence = parser(moveSequence)
		const sequenceWithSimpleMoves = parsedSequence.map((move) => {
			const mappedFace = wideMoveMap[move.face]

			if (mappedFace) {
				return { face: mappedFace, turns: move.turns }
			}
			return move
		})
		let sequenceToApply

		if (isSolution) {
			sequenceToApply = sequenceWithSimpleMoves.reverse().map((move) => {
				return {
					face: move.face,
					turns: move.turns === 2 ? 2 : -move.turns,
				}
			})
		} else {
			sequenceToApply = sequenceWithSimpleMoves
		}

		this.cornerPermutation = Array.from({ length: 8 }, (_, i) => i)
		this.cornerOrientation = Array(8).fill(0)
		this.edgePermutation = Array.from({ length: 12 }, (_, i) => i)
		this.edgeOrientation = Array(12).fill(0)

		for (const move of sequenceToApply) {
			this._applySingleMove(move.face, move.turns)
		}

		const finalCatch24Code = this._generateCatch24CodeFromState()
		if (!finalCatch24Code) {
			return { success: false, error: 'Internal error: Failed to generate code.' }
		}
		return this.applyCatch24Code(finalCatch24Code)
	}

	_applySingleMove(face, turns) {
		const moveDef = CubeDefs.MOVE_DEFINITIONS[face]
		if (!moveDef) return

		const turnCount = (turns + 4) % 4

		for (let i = 0; i < turnCount; i++) {
			this._cyclePieces(this.cornerPermutation, moveDef.corners.affected, moveDef.corners.permutation)
			this._cyclePieces(this.cornerOrientation, moveDef.corners.affected, moveDef.corners.permutation)
			if (moveDef.corners.orientationChange) {
				this._updateOrientation(this.cornerOrientation, moveDef.corners.affected, moveDef.corners.orientationChange, 3)
			}

			this._cyclePieces(this.edgePermutation, moveDef.edges.affected, moveDef.edges.permutation)
			this._cyclePieces(this.edgeOrientation, moveDef.edges.affected, moveDef.edges.permutation)
			if (moveDef.edges.orientationChange) {
				this._updateOrientation(this.edgeOrientation, moveDef.edges.affected, moveDef.edges.orientationChange, 2)
			}
		}
	}

	_calculateCornerOrientation(cornerSlotId) {
		const stickerData = this._getCornerSlotStickerData(cornerSlotId)
		if (stickerData.some((s) => s.color === CubeDefs.DEFAULT_COLOR)) {
			return '?'
		}
		const udSticker = stickerData.find((s) => s.color === this.faceColors.U || s.color === this.faceColors.D)
		const physicalFaceName = this._getFaceNameOfSticker(udSticker.stickerIndex)
		const slotDefinition = this.pieceDefs.corners[cornerSlotId]

		return slotDefinition.faces.indexOf(physicalFaceName)
	}

	_calculateEdgeOrientation(edgeSlotId, overrideStickerData = null) {
		const stickerData = overrideStickerData ? overrideStickerData : this._getEdgeSlotStickerData(edgeSlotId)
		const currentColors = stickerData.map((s) => s.color).sort()
		const pieceDefinition = this.pieceDefs.edges.find((def) => {
			const defColors = def.faces.map((f) => this.faceColors[f]).sort()
			return defColors.length === 2 && defColors.every((val, index) => val === currentColors[index])
		})
		const canonicalFaces = pieceDefinition.faces
		const isUDPiece = canonicalFaces.includes('U') || canonicalFaces.includes('D')
		const refColor = isUDPiece ? (canonicalFaces.includes('U') ? this.faceColors.U : this.faceColors.D) : this.faceColors[canonicalFaces[0]]
		const refSticker = stickerData.find((s) => s.color === refColor)
		const physicalFaceName = this._getFaceNameOfSticker(refSticker.stickerIndex)

		if (edgeSlotId <= 7) {
			const isStickerOnUorDFace = physicalFaceName === 'U' || physicalFaceName === 'D'
			return isStickerOnUorDFace ? 0 : 1
		}
		const isStickerOnForBFace = physicalFaceName === 'F' || physicalFaceName === 'B'
		return isStickerOnForBFace ? 0 : 1
	}

	_calculatePermutationParity(permArray) {
		const n = permArray.length
		let inversions = 0
		for (let i = n - 1; i > 0; i--) {
			for (let j = i - 1; j >= 0; j--) {
				if (permArray[j] > permArray[i]) {
					inversions++
				}
			}
		}
		return inversions % 2
	}

	_checkFaceFullyAndCorrectlyColored(faceName) {
		const targetColor = this.faceColors[faceName]

		for (const cornerDef of this.pieceDefs.corners) {
			const faceIndexInDef = cornerDef.faces.indexOf(faceName)
			if (faceIndexInDef !== -1) {
				const stickerIx = cornerDef.refInd[faceIndexInDef]
				if (this.stickersColor[stickerIx] !== targetColor) return false
			}
		}

		for (const edgeDef of this.pieceDefs.edges) {
			const faceIndexInDef = edgeDef.faces.indexOf(faceName)
			if (faceIndexInDef !== -1) {
				const stickerGlobalIndex = edgeDef.refInd[faceIndexInDef]
				if (this.stickersColor[stickerGlobalIndex] !== targetColor) return false
			}
		}
		return true
	}

	_clearAssignmentSlot(stickerIndex) {
		const pieceInfo = this._getPieceInfoByStickerIndex(stickerIndex)
		const pieceTypePrefix = `${pieceInfo.type}_`

		for (const defKey in this.definitionAssignments) {
			if (this.definitionAssignments[defKey] === pieceInfo.id && defKey.startsWith(pieceTypePrefix)) {
				const keyToDelete = defKey
				delete this.definitionAssignments[keyToDelete]
				return
			}
		}
	}

	_cyclePieces(array, affected, map) {
		const temp = affected.map((index) => array[index])

		for (let i = 0; i < map.length; i++) {
			array[affected[map[i]]] = temp[i]
		}
	}

	_decodePreliminaryCode(preliminaryCode) {
		const corners = []
		const edges = []
		const usedCornerDefs = new Set()
		const usedEdgeDefs = new Set()

		for (let i = 0; i < 7; i++) {
			const value = CubeDefs.BASE24_CHARS.indexOf(preliminaryCode[i])
			const pieceDefId = Math.floor(value / 3)
			if (usedCornerDefs.has(pieceDefId)) return { success: false, error: `Error: Corner element c${pieceDefId} is used twice.` }
			usedCornerDefs.add(pieceDefId)
			corners.push({ pieceDefId, orientation: value % 3, physicalSlotId: i + 1 })
		}

		for (let i = 0; i < 11; i++) {
			const value = CubeDefs.BASE24_CHARS.indexOf(preliminaryCode[i + 7], 25)
			const pieceDefId = Math.floor((value - 25) / 2)
			if (usedEdgeDefs.has(pieceDefId)) return { success: false, error: `Error: Edge element e${pieceDefId} is used twice.` }
			usedEdgeDefs.add(pieceDefId)
			edges.push({ pieceDefId, orientation: (value - 25) % 2, physicalSlotId: i })
		}
		return { success: true, corners, edges }
	}

	_deduceAndCompleteCorner(physicalSlotID) {
		let colorChanged = false
		let assignmentChanged = false
		const cornerStickerData = this._getCornerSlotStickerData(physicalSlotID)
		const coloredStickers = cornerStickerData.filter((s) => s.color !== CubeDefs.DEFAULT_COLOR)

		if (coloredStickers.length === 2) {
			const twoKnownColorsInfo = coloredStickers.map((s) => ({
				color: s.color,
				faceIndexOfSlot: s.faceIndexOfSlot,
			}))

			const assignedCornerDefID = this._getAssignedCornerDefID_fromTwoColors(physicalSlotID, twoKnownColorsInfo)

			if (assignedCornerDefID !== null) {
				const winningDef = this.pieceDefs.corners[assignedCornerDefID]
				const winningDefKey = `corner_${winningDef.id}`

				this.definitionAssignments[winningDefKey] = physicalSlotID
				assignmentChanged = true

				const uncoloredSticker = cornerStickerData.find((s) => s.color === CubeDefs.DEFAULT_COLOR)
				if (uncoloredSticker) {
					const knownColorsArr = coloredStickers.map((s) => s.color)
					const winningDefCanonColors = winningDef.faces.map((fn) => this.faceColors[fn])
					const thirdDeducedColor = winningDefCanonColors.find((c) => !knownColorsArr.includes(c))

					if (thirdDeducedColor) {
						let countForThirdColor = 0
						for (let i = 0; i < this.stickersColor.length; i++) {
							if (this.stickersColor[i] === thirdDeducedColor) countForThirdColor++
						}
						this.setStickerColor(uncoloredSticker.stickerIndex, thirdDeducedColor)
						colorChanged = true
					}
				}
			}
		}
		return { colorChanged, assignmentChanged }
	}

	deduceAndSetSolvedStateFromUL() {
		const faceUpIsCorrect = this._checkFaceFullyAndCorrectlyColored('U')
		if (faceUpIsCorrect) {
			const faceLeftIsCorrect = this._checkFaceFullyAndCorrectlyColored('L')
			if (faceLeftIsCorrect) {
				this._setAllStickersToSolvedState()
				return true
			}
		}
		return false
	}

	_determineMissingPieces(knownCorners, knownEdges) {
		const assignedCornerDefs = new Set(knownCorners.map((c) => c.pieceDefId))
		let c0_defId = -1
		for (let i = 0; i < 8; i++) {
			if (!assignedCornerDefs.has(i)) {
				c0_defId = i
				break
			}
		}

		const assignedEdgeDefs = new Set(knownEdges.map((e) => e.pieceDefId))
		let e11_defId = -1
		for (let i = 0; i < 12; i++) {
			if (!assignedEdgeDefs.has(i)) {
				e11_defId = i
				break
			}
		}

		const sumCornerOri = knownCorners.reduce((sum, c) => sum + c.orientation, 0)
		const c0_ori = (3 - (sumCornerOri % 3)) % 3
		const sumEdgeOri = knownEdges.reduce((sum, e) => sum + e.orientation, 0)
		const e11_ori = (2 - (sumEdgeOri % 2)) % 2

		if (c0_defId === -1 || e11_defId === -1) return null

		return {
			c0_data: { pieceDefId: c0_defId, orientation: c0_ori, physicalSlotId: 0 },
			e11_data: { pieceDefId: e11_defId, orientation: e11_ori, physicalSlotId: 11 },
		}
	}

	_generateCatch24CodeFromState() {
		const preliminaryCodeChars = new Array(18).fill('-')

		for (let slotId = 1; slotId < 8; slotId++) {
			const pieceId = this.cornerPermutation[slotId]
			const ori = this.cornerOrientation[slotId]
			const value = pieceId * 3 + ori
			preliminaryCodeChars[slotId - 1] = CubeDefs.BASE24_CHARS[value]
		}

		for (let slotId = 0; slotId < 11; slotId++) {
			const pieceId = this.edgePermutation[slotId]
			const ori = this.edgeOrientation[slotId]
			const value = 25 + pieceId * 2 + ori
			preliminaryCodeChars[slotId + 7] = CubeDefs.BASE24_CHARS[value]
		}

		const preliminaryCode = preliminaryCodeChars.join('')

		let finalCode = ''
		for (let i = 0; i < 18; i++) {
			finalCode += CubeDefs.CATCH24_MULT_TABLE.get(preliminaryCode[i])[CubeDefs.INVERSE[i]]
		}
		return finalCode
	}

	generateCodeCatch24() {
		const PLACEHOLDER_CHAR = '-'
		const FINAL_LENGTH = 18

		const cornerPermMap = new Array(8).fill(-1)
		const edgePermMap = new Array(12).fill(-1)

		for (const defKey in this.definitionAssignments) {
			const assignedSlotId = this.definitionAssignments[defKey]
			const defId = Number.parseInt(defKey.split('_')[1], 10)
			if (defKey.startsWith('corner_')) {
				cornerPermMap[assignedSlotId] = defId
			} else if (defKey.startsWith('edge_')) {
				edgePermMap[assignedSlotId] = defId
			}
		}
		const resultCodeChars = new Array(FINAL_LENGTH).fill(PLACEHOLDER_CHAR)
		let codeIndex = 0

		for (let slotId = 1; slotId < 8; slotId++) {
			const pieceId = cornerPermMap[slotId]
			if (pieceId !== -1) {
				const ori = this._calculateCornerOrientation(slotId)
				const value = pieceId * 3 + ori
				resultCodeChars[codeIndex] = CubeDefs.BASE24_CHARS[value]
			}
			codeIndex++
		}

		for (let slotId = 0; slotId < 11; slotId++) {
			const pieceId = edgePermMap[slotId]
			if (pieceId !== -1) {
				const ori = this._calculateEdgeOrientation(slotId)
				const value = pieceId * 2 + ori + 25
				resultCodeChars[codeIndex] = CubeDefs.BASE24_CHARS[value]
			}
			codeIndex++
		}
		const preliminaryCode = resultCodeChars.join('')

		if (preliminaryCode.includes(PLACEHOLDER_CHAR) || preliminaryCode.includes('?')) {
			return preliminaryCode
		}

		let finalCatch24Code = ''
		for (let i = 0; i < 18; i++) {
			finalCatch24Code += CubeDefs.CATCH24_MULT_TABLE.get(preliminaryCode[i])[CubeDefs.INVERSE[i]]
		}
		return finalCatch24Code
	}

	_handleEdgeIdentificationOnUserMove(currentStickerIndex) {
		const pieceInfo = this._getPieceInfoByStickerIndex(currentStickerIndex)
		const physicalSlotID = pieceInfo.id
		const slotDef = this.pieceDefs.edges[physicalSlotID]
		const stickerIndex1_onSlot = slotDef.refInd[0]
		const stickerIndex2_onSlot = slotDef.refInd[1]
		const color1_onSlot = this.stickersColor[stickerIndex1_onSlot]
		const color2_onSlot = this.stickersColor[stickerIndex2_onSlot]

		if (color1_onSlot === CubeDefs.DEFAULT_COLOR || color2_onSlot === CubeDefs.DEFAULT_COLOR) return false

		let assignedEdgeDef = null
		for (const candDef of this.pieceDefs.edges) {
			const candDefCanonicalColors = candDef.faces.map((faceName) => this.faceColors[faceName])

			if (candDefCanonicalColors.includes(color1_onSlot) && candDefCanonicalColors.includes(color2_onSlot)) {
				const candDefKey = `edge_${candDef.id}`
				let isCandDefAvailable = true
				if (Object.prototype.hasOwnProperty.call(this.definitionAssignments, candDefKey) && this.definitionAssignments[candDefKey] !== physicalSlotID) {
					isCandDefAvailable = false
				}
				if (isCandDefAvailable) {
					assignedEdgeDef = candDef
					break
				}
			}
		}
		if (assignedEdgeDef) {
			const assignedEdgeDefKey = `edge_${assignedEdgeDef.id}`
			this.definitionAssignments[assignedEdgeDefKey] = physicalSlotID
			return true
		}
	}

	_identifyAndAssignEdge(physicalSlotID) {
		const slotDef = this.pieceDefs.edges[physicalSlotID]
		const stickerIndex1_onSlot = slotDef.refInd[0]
		const stickerIndex2_onSlot = slotDef.refInd[1]
		const color1_onSlot = this.stickersColor[stickerIndex1_onSlot]
		const color2_onSlot = this.stickersColor[stickerIndex2_onSlot]

		if (color1_onSlot === CubeDefs.DEFAULT_COLOR || color2_onSlot === CubeDefs.DEFAULT_COLOR) {
			return false
		}
		if (color1_onSlot === color2_onSlot) {
			return false
		}

		let assignedEdgeDef = null
		for (const candDef of this.pieceDefs.edges) {
			const candDefCanonicalColors = candDef.faces.map((faceName) => this.faceColors[faceName])
			if (candDefCanonicalColors.includes(color1_onSlot) && candDefCanonicalColors.includes(color2_onSlot)) {
				const candDefKey = `edge_${candDef.id}`
				let isCandDefAvailable = true
				if (Object.prototype.hasOwnProperty.call(this.definitionAssignments, candDefKey) && this.definitionAssignments[candDefKey] !== physicalSlotID) {
					isCandDefAvailable = false
				}
				if (isCandDefAvailable) {
					assignedEdgeDef = candDef
					break
				}
			}
		}

		if (assignedEdgeDef) {
			const assignedEdgeDefKey = `edge_${assignedEdgeDef.id}`
			let assignmentActuallyChanged = false

			for (const keyInAssignments in this.definitionAssignments) {
				if (this.definitionAssignments[keyInAssignments] === physicalSlotID && keyInAssignments.startsWith('edge_') && keyInAssignments !== assignedEdgeDefKey) {
					delete this.definitionAssignments[keyInAssignments]
					assignmentActuallyChanged = true
				}
			}
			if (this.definitionAssignments[assignedEdgeDefKey] !== undefined && this.definitionAssignments[assignedEdgeDefKey] !== physicalSlotID) {
				delete this.definitionAssignments[assignedEdgeDefKey]
				assignmentActuallyChanged = true
			}
			if (this.definitionAssignments[assignedEdgeDefKey] !== physicalSlotID) {
				this.definitionAssignments[assignedEdgeDefKey] = physicalSlotID
				assignmentActuallyChanged = true
			}
			if (assignmentActuallyChanged) {
				return true
			}
		}
		return false
	}

	_paintSlotFromData(physicalSlotId, pieceType, pieceDefId, orientation) {
		const pieceDefsArray = pieceType === 'corner' ? this.pieceDefs.corners : this.pieceDefs.edges
		const pieceToPlace = pieceDefsArray.find((p) => p.id === pieceDefId)
		const targetSlot = pieceDefsArray.find((p) => p.id === physicalSlotId)

		if (!pieceToPlace || !targetSlot) return

		const canonicalColors = pieceToPlace.faces.map((f) => this.faceColors[f])
		const numStickers = canonicalColors.length

		for (let i = 0; i < numStickers; i++) {
			const colorToApply = canonicalColors[i]
			const targetStickerSlotIndex = (i + orientation) % numStickers
			const physicalStickerIndex = targetSlot.refInd[targetStickerSlotIndex]
			this.stickersColor[physicalStickerIndex] = colorToApply
		}
	}

	_paintStickersFromAssignments() {
		let colorChangedOverall = false

		for (const defKey in this.definitionAssignments) {
			const physicalSlotID = this.definitionAssignments[defKey]
			const [pieceTypePrefix, defIdStr] = defKey.split('_')
			const defId = Number.parseInt(defIdStr)

			let pieceDef
			let expectedStickers
			let pieceTypeStr
			if (pieceTypePrefix === 'corner') {
				pieceDef = this.pieceDefs.corners.find((p) => p.id === defId)
				expectedStickers = 3
				pieceTypeStr = 'corner'
			} else if (pieceTypePrefix === 'edge') {
				pieceDef = this.pieceDefs.edges.find((p) => p.id === defId)
				expectedStickers = 2
				pieceTypeStr = 'edge'
			} else continue

			if (!pieceDef) continue

			const slotStickerData = pieceTypeStr === 'corner' ? this._getCornerSlotStickerData(physicalSlotID) : this._getEdgeSlotStickerData(physicalSlotID)

			if (!slotStickerData || slotStickerData.length !== expectedStickers) continue

			const coloredStickersOnSlot = slotStickerData.filter((s) => s.color !== CubeDefs.DEFAULT_COLOR)
			if (coloredStickersOnSlot.length === expectedStickers) continue

			const canonicalColorsOfAssignedDef = pieceDef.faces.map((f) => this.faceColors[f])
			const currentColorsOnPhysicalSlot = coloredStickersOnSlot.map((s) => s.color)

			for (const sData of slotStickerData) {
				if (sData.color === CubeDefs.DEFAULT_COLOR) {
					let deducedColor = null
					if (expectedStickers - coloredStickersOnSlot.length === 1) {
						deducedColor = canonicalColorsOfAssignedDef.find((c) => !currentColorsOnPhysicalSlot.includes(c))
					}
					if (deducedColor) {
						let countForDeducedColor = 0
						for (let i = 0; i < this.stickersColor.length; i++) {
							if (this.stickersColor[i] === deducedColor) countForDeducedColor++
						}
						if (countForDeducedColor < 8) {
							this.setStickerColor(sData.stickerIndex, deducedColor)
							colorChangedOverall = true
						}
					}
				}
			}
		}
		return colorChangedOverall
	}

	runFullDeductionCycle() {
		let overallChangeMade = false
		let stateChangedInOuterLoop
		let outerLoopPassCount = 0
		const MAX_OUTER_PASSES = 5

		do {
			outerLoopPassCount++
			stateChangedInOuterLoop = false
			if (this.stickerIndex === 15) {
				const UL = this.deduceAndSetSolvedStateFromUL()
				if (UL) {
					stateChangedInOuterLoop = true
					return
				}
			}
			stateChangedInOuterLoop = this._applyIterativeDeductionRules()

			if (stateChangedInOuterLoop) {
				overallChangeMade = true
			}
		} while (stateChangedInOuterLoop && outerLoopPassCount < MAX_OUTER_PASSES)

		return overallChangeMade
	}

	runSmartLogic(changedStickerIndex) {
		if (changedStickerIndex < 8 || this.stickersColor[changedStickerIndex] === CubeDefs.DEFAULT_COLOR) return

		let anyAutomaticChangeMade = false

		if (changedStickerIndex % 2 === 0) {
			const pieceInfo = this._getPieceInfoByStickerIndex(changedStickerIndex)
			const physicalSlotID_corner = pieceInfo.id
			const cornerStickerData = this._getCornerSlotStickerData(physicalSlotID_corner)
			const coloredCornerStickers = cornerStickerData.filter((s) => s.color !== CubeDefs.DEFAULT_COLOR)

			if (coloredCornerStickers.length === 2) {
				const twoKnownColorsInfo = coloredCornerStickers.map((s) => ({
					color: s.color,
					faceIndexOfSlot: s.faceIndexOfSlot,
				}))

				const assignedCornerDefID = this._getAssignedCornerDefID_fromTwoColors(physicalSlotID_corner, twoKnownColorsInfo)

				if (assignedCornerDefID !== null) {
					const winningDef = this.pieceDefs.corners[assignedCornerDefID]
					const winningDefKey = `corner_${winningDef.id}`
					let currentAssignmentChanged = false

					for (const key in this.definitionAssignments) {
						if (this.definitionAssignments[key] === physicalSlotID_corner && key.startsWith('corner_') && key !== winningDefKey) {
							delete this.definitionAssignments[key]
							currentAssignmentChanged = true
						}
					}
					if (this.definitionAssignments[winningDefKey] !== undefined && this.definitionAssignments[winningDefKey] !== physicalSlotID_corner) {
						delete this.definitionAssignments[winningDefKey]
						currentAssignmentChanged = true
					}
					if (this.definitionAssignments[winningDefKey] !== physicalSlotID_corner) {
						this.definitionAssignments[winningDefKey] = physicalSlotID_corner
						currentAssignmentChanged = true
					}
					if (currentAssignmentChanged) anyAutomaticChangeMade = true

					const uncoloredStickerData = cornerStickerData.find((s) => s.color === CubeDefs.DEFAULT_COLOR)
					if (uncoloredStickerData) {
						const knownColors = coloredCornerStickers.map((s) => s.color)
						const winningDefCanonicalColors = winningDef.faces.map((faceName) => this.faceColors[faceName])
						const thirdColor = winningDefCanonicalColors.find((c) => !knownColors.includes(c))
						if (thirdColor && this.getStickerColor(uncoloredStickerData.stickerIndex) === CubeDefs.DEFAULT_COLOR) {
							this.setStickerColor(uncoloredStickerData.stickerIndex, thirdColor)
							anyAutomaticChangeMade = true
						}
					}
				}
			}
		} else {
			if (this._handleEdgeIdentificationOnUserMove(changedStickerIndex)) {
				anyAutomaticChangeMade = true
			}
		}
		this.runFullDeductionCycle()
		return anyAutomaticChangeMade
	}

	_updateOrientation(array, affected, changes, mod) {
		for (let i = 0; i < affected.length; i++) {
			array[affected[i]] = (array[affected[i]] + changes[i]) % mod
		}
	}
}

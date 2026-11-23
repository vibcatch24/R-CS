// ============================================================================
// Crystallographic Symmetry & Reversibility Analyzer (Cubie Level)
// 48 Oh symmetries, 33 Schoenflies point groups, and AxMSIO4 (⟲) detection
// ============================================================================

import { cubeState } from './Impasto.js'
import * as CubeDefs from './cubeConstants.js'

const arr = (...items) => items

// Four basic Oh symmetry generators (Kociemba's basis) mapped to PIECE_DEFS
const GENERATORS = {
	URF3: {
		cp: arr(0, 7, 6, 1, 2, 5, 4, 3),
		co: arr(2, 1, 2, 1, 2, 1, 2, 1),
		ep: arr(1, 8, 5, 9, 3, 11, 7, 10, 0, 4, 6, 2),
		eo: arr(1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1),
		isMirror: false,
	},
	F2: {
		cp: arr(6, 7, 4, 5, 2, 3, 0, 1),
		co: arr(0, 0, 0, 0, 0, 0, 0, 0),
		ep: arr(6, 5, 4, 7, 2, 1, 0, 3, 9, 8, 11, 10),
		eo: arr(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
		isMirror: false,
	},
	U4: {
		cp: arr(3, 0, 1, 2, 5, 6, 7, 4),
		co: arr(0, 0, 0, 0, 0, 0, 0, 0),
		ep: arr(3, 0, 1, 2, 7, 4, 5, 6, 11, 8, 9, 10),
		eo: arr(0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1),
		isMirror: false,
	},
	LR2: {
		cp: arr(1, 0, 3, 2, 5, 4, 7, 6),
		co: arr(0, 0, 0, 0, 0, 0, 0, 0),
		ep: arr(2, 1, 0, 3, 6, 5, 4, 7, 9, 8, 11, 10),
		eo: arr(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
		isMirror: true,
	},
}

// Group multiplication on cubie level supporting improper (mirror) transformations
const multiplySym = (a, b) => {
	const mirrorA = Boolean(a.isMirror)
	const mirrorB = Boolean(b.isMirror)

	const cp = Array.from({ length: 8 })
	const co = Array.from({ length: 8 })
	for (let i = 0; i < 8; i++) {
		const perm = b.cp.at(i)
		cp[i] = a.cp.at(perm)
		const bOri = mirrorA ? (3 - b.co.at(i)) % 3 : b.co.at(i)
		co[i] = (a.co.at(perm) + bOri) % 3
	}

	const ep = Array.from({ length: 12 })
	const eo = Array.from({ length: 12 })
	for (let i = 0; i < 12; i++) {
		const perm = b.ep.at(i)
		ep[i] = a.ep.at(perm)
		eo[i] = (a.eo.at(perm) + b.eo.at(i)) % 2
	}

	return {
		cp,
		co,
		ep,
		eo,
		isMirror: mirrorA !== mirrorB,
	}
}

// Group inverse (S^-1) accounting for corner twist inversion under mirror reflection
const inverseSym = (a) => {
	const mirrorA = Boolean(a.isMirror)

	const cp = Array.from({ length: 8 })
	const co = Array.from({ length: 8 })
	for (let i = 0; i < 8; i++) cp[a.cp.at(i)] = i
	for (let i = 0; i < 8; i++) {
		const ori = a.co.at(cp.at(i))
		co[i] = mirrorA ? ori : (3 - ori) % 3
	}

	const ep = Array.from({ length: 12 })
	const eo = Array.from({ length: 12 })
	for (let i = 0; i < 12; i++) ep[a.ep.at(i)] = i
	for (let i = 0; i < 12; i++) eo[i] = a.eo.at(ep.at(i))

	return { cp, co, ep, eo, isMirror: mirrorA }
}

const isEqualCubie = (a, b) => {
	for (let i = 0; i < 8; i++) {
		if (a.cp.at(i) !== b.cp.at(i) || a.co.at(i) !== b.co.at(i)) return false
	}
	for (let i = 0; i < 12; i++) {
		if (a.ep.at(i) !== b.ep.at(i) || a.eo.at(i) !== b.eo.at(i)) return false
	}
	return true
}

const IDENTITY_CUBIE = {
	cp: arr(0, 1, 2, 3, 4, 5, 6, 7),
	co: arr(0, 0, 0, 0, 0, 0, 0, 0),
	ep: arr(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11),
	eo: arr(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	isMirror: false,
}

// Central inversion (I) reference state in PIECE_DEFS indexing
const INVERSION_CUBIE = {
	cp: arr(5, 4, 7, 6, 1, 0, 3, 2),
	co: arr(0, 0, 0, 0, 0, 0, 0, 0),
	ep: arr(6, 7, 4, 5, 2, 3, 0, 1, 10, 11, 8, 9),
	eo: arr(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	isMirror: true,
}

// Geometric classification of each of the 48 Oh operations (E, I, C2, C3, C4, sigma_h, sigma_d, S4, S6)
const classifyOperationType = (perm) => {
	if (!perm.isMirror && isEqualCubie(perm, IDENTITY_CUBIE)) return 'E'
	if (perm.isMirror && isEqualCubie(perm, INVERSION_CUBIE)) return 'I'

	let fixedCorners = 0
	for (let i = 0; i < 8; i++) {
		if (perm.cp.at(i) === i) fixedCorners++
	}
	let fixedEdges = 0
	for (let i = 0; i < 12; i++) {
		if (perm.ep.at(i) === i) fixedEdges++
	}

	const sq = multiplySym(perm, perm)
	const isOrder2 = isEqualCubie(sq, IDENTITY_CUBIE)

	if (!perm.isMirror) {
		if (isOrder2) {
			return fixedEdges === 0 ? 'C2_face' : 'C2_edge'
		}
		const cube = multiplySym(sq, perm)
		return isEqualCubie(cube, IDENTITY_CUBIE) ? 'C3' : 'C4'
	}

	if (isOrder2) {
		return fixedCorners === 0 ? 'sigma_h' : 'sigma_d'
	}
	const cube = multiplySym(sq, perm)
	return isEqualCubie(cube, IDENTITY_CUBIE) ? 'S6' : 'S4'
}

// Generates all 48 Oh transformations with exact 3D calibration of corner/edge orientations
const generateOhSymmetries = () => {
	const sideNames = ['U', 'D', 'R', 'L', 'F', 'B']

	const recomputeExactSym = (s) => {
		const facePerm = {}
		for (const f of sideNames) {
			const slotsWithF = []
			for (let slot = 0; slot < 12; slot++) {
				const piece = s.ep.at(slot)
				if (CubeDefs.PIECE_DEFS.edges.at(piece).faces.includes(f)) {
					slotsWithF.push(CubeDefs.PIECE_DEFS.edges.at(slot).faces)
				}
			}
			for (const cand of sideNames) {
				if (slotsWithF.every((pair) => pair.includes(cand))) {
					facePerm[f] = cand
					break
				}
			}
		}

		const exactCo = Array.from({ length: 8 })
		for (let slot = 0; slot < 8; slot++) {
			const piece = s.cp.at(slot)
			const baseFace = CubeDefs.PIECE_DEFS.corners.at(piece).faces.at(0)
			const mappedFace = facePerm[baseFace]
			const slotFaces = CubeDefs.PIECE_DEFS.corners.at(slot).faces
			const rawIdx = slotFaces.indexOf(mappedFace)
			exactCo[slot] = s.isMirror ? (3 - rawIdx) % 3 : rawIdx
		}

		const exactEo = Array.from({ length: 12 })
		for (let slot = 0; slot < 12; slot++) {
			const piece = s.ep.at(slot)
			const baseFace = CubeDefs.PIECE_DEFS.edges.at(piece).faces.at(0)
			const mappedFace = facePerm[baseFace]
			if (slot <= 7) {
				exactEo[slot] = mappedFace === 'U' || mappedFace === 'D' ? 0 : 1
			} else {
				exactEo[slot] = mappedFace === 'F' || mappedFace === 'B' ? 0 : 1
			}
		}

		return { ...s, co: exactCo, eo: exactEo }
	}

	const list = []
	let s = IDENTITY_CUBIE

	for (let urf3 = 0; urf3 < 3; urf3++) {
		for (let f2 = 0; f2 < 2; f2++) {
			for (let u4 = 0; u4 < 4; u4++) {
				for (let lr2 = 0; lr2 < 2; lr2++) {
					const calibrated = recomputeExactSym(s)
					const calibratedInv = recomputeExactSym(inverseSym(calibrated))
					list.push({
						idx: list.length,
						perm: calibrated,
						inv: calibratedInv,
						type: classifyOperationType(calibrated),
					})
					s = multiplySym(s, GENERATORS.LR2)
				}
				s = multiplySym(s, GENERATORS.U4)
			}
			s = multiplySym(s, GENERATORS.F2)
		}
		s = multiplySym(s, GENERATORS.URF3)
	}
	return list
}

const OH_SYMMETRIES = generateOhSymmetries()

// Identifies the exact Schoenflies point group among all 33 conjugacy classes
const identifyKociembaClass = (matchedOps) => {
	const order = matchedOps.length
	if (order === 48) return 'Oh'
	if (order === 1) return 'C1'

	const counts = {
		E: 0,
		I: 0,
		C4: 0,
		C3: 0,
		C2_face: 0,
		C2_edge: 0,
		sigma_h: 0,
		sigma_d: 0,
		S4: 0,
		S6: 0,
	}

	for (const op of matchedOps) {
		counts[op.type]++
	}

	if (counts.C3 === 2 && counts.sigma_d >= 1) {
		return counts.I === 1 ? 'D3d' : 'C3v'
	}

	if (order === 24) {
		if (counts.I === 0 && counts.sigma_h === 0 && counts.sigma_d === 0) return 'O'
		return counts.I === 1 ? 'Th' : 'Td'
	}
	if (order === 16) return 'D4h'
	if (order === 12) {
		return counts.I === 1 ? 'D3d' : 'T'
	}
	if (order === 8) {
		if (counts.S4 === 0 && counts.I === 0 && counts.sigma_h === 0 && counts.sigma_d === 0) return 'D4'
		if (counts.I === 1) {
			if (counts.C4 === 2) return 'C4h'
			return counts.C2_face === 3 ? 'D2h (face)' : 'D2h (edge)'
		}
		if (counts.C4 === 2) return 'C4v'
		return counts.C2_face === 3 ? 'D2d (face)' : 'D2d (edge)'
	}
	if (order === 6) {
		if (counts.I === 1) return 'S6'
		return counts.sigma_d >= 1 ? 'C3v' : 'D3'
	}
	if (order === 4) {
		if (counts.C4 === 2) return 'C4'
		if (counts.S4 === 2) return 'S4'
		if (counts.I === 0 && counts.sigma_h === 0 && counts.sigma_d === 0) {
			return counts.C2_face === 3 ? 'D2 (face)' : 'D2 (edge)'
		}
		if (counts.I === 1) {
			return counts.C2_face === 1 ? 'C2h (a)' : 'C2h (b)'
		}
		if (counts.C2_edge === 1) return 'C2v (b)'
		return counts.sigma_d === 2 ? 'C2v (a1)' : 'C2v (a2)'
	}
	if (order === 3) return 'C3'
	if (order === 2) {
		if (counts.C2_face === 1) return 'C2 (a)'
		if (counts.C2_edge === 1) return 'C2 (b)'
		if (counts.I === 1) return 'Ci'
		return counts.sigma_h === 1 ? 'Cs (a)' : 'Cs (b)'
	}

	return 'C1'
}

export const SymmetryAnalyzer = {
	reconstructCubie: (preCode) => {
		if (!preCode || preCode.length !== 18) return null

		const cp = []
		const co = []
		const ep = []
		const eo = []

		let sumCo = 0
		for (let i = 0; i < 7; i++) {
			const v = CubeDefs.BASE24_CHARS.indexOf(preCode[i])
			const cv = v > 23 ? v - 24 : v
			const safeV = cv === -1 ? 0 : cv
			cp.push(Math.floor(safeV / 3))
			const ori = safeV % 3
			co.push(ori)
			sumCo += ori
		}

		let sumEo = 0
		for (let i = 7; i < 18; i++) {
			const v = CubeDefs.BASE24_CHARS.indexOf(preCode[i], 25)
			const safeV = v === -1 ? 25 : v - 25
			ep.push(Math.floor(safeV / 2))
			const ori = safeV % 2
			eo.push(ori)
			sumEo += ori
		}

		let missingC = 0
		for (let id = 0; id < 8; id++) {
			if (!cp.includes(id)) {
				missingC = id
				break
			}
		}
		cp.unshift(missingC)
		co.unshift((3 - (sumCo % 3)) % 3)

		let missingE = 0
		for (let id = 0; id < 12; id++) {
			if (!ep.includes(id)) {
				missingE = id
				break
			}
		}
		ep.push(missingE)
		eo.push((2 - (sumEo % 2)) % 2)

		return { cp, co, ep, eo, isMirror: false }
	},

	// Evaluates symmetry group and reversibility mark:
	// '↩' — direct reversibility in Catch-24 space (S(P) === S(P^-1))
	// '⟲' — Axial Mirror-Split Involution of Order 4 (AxMSIO4)
	// '⇄' — mirror anti-involution (S(P) === S(M * P^-1 * M^-1))
	analyzeCubie: (preCode) => {
		const p = SymmetryAnalyzer.reconstructCubie(preCode)
		if (!p) return { symClass: '', invMark: '', sigInverse: '' }

		const matchedOps = []
		for (let i = 0; i < OH_SYMMETRIES.length; i++) {
			const op = OH_SYMMETRIES.at(i)
			const conj = multiplySym(op.perm, multiplySym(p, op.inv))
			if (isEqualCubie(conj, p)) {
				matchedOps.push(op)
			}
		}

		const symClass = identifyKociembaClass(matchedOps)

		if (isEqualCubie(p, IDENTITY_CUBIE)) {
			return { symClass, invMark: '', sigInverse: '' }
		}

		// Converts slot-based edge orientation into piece-based detailed representation for group inversion
		const toDetailed = (cubie) => ({
			...cubie,
			eo: cubie.eo.map((ori, slot) => {
				const piece = cubie.ep.at(slot)
				return slot <= 7 !== piece <= 7 ? (ori + 1) % 2 : ori
			}),
		})

		const getCatch24FromSlotCubie = (slotCubie) => {
			let code = ''
			for (let slotId = 1; slotId < 8; slotId++) {
				const pieceId = slotCubie.cp.at(slotId)
				const ori = slotCubie.co.at(slotId)
				code += CubeDefs.BASE24_CHARS[pieceId * 3 + ori]
			}
			for (let slotId = 0; slotId < 11; slotId++) {
				const pieceId = slotCubie.ep.at(slotId)
				const ori = slotCubie.eo.at(slotId)
				code += CubeDefs.BASE24_CHARS[pieceId * 2 + ori + 25]
			}

			let finalCode = ''
			for (let i = 0; i < 18; i++) {
				finalCode += CubeDefs.CATCH24_MULT_TABLE.get(code[i])[CubeDefs.INVERSE[i]]
			}
			return finalCode
		}

		const pDetailed = toDetailed(p)
		const pDetailedInv = inverseSym(pDetailed)
		const pSlotInv = toDetailed(pDetailedInv)

		const sigDirect = getCatch24FromSlotCubie(p)
		const sigInverse = getCatch24FromSlotCubie(pSlotInv)

		if (sigDirect === sigInverse) {
			return { symClass, invMark: '↩', sigInverse }
		}

		const antiOps = []
		for (const op of OH_SYMMETRIES) {
			const conj = multiplySym(op.perm, multiplySym(pDetailed, op.inv))
			const sigConj = getCatch24FromSlotCubie(toDetailed(conj))
			if (sigConj === sigInverse) {
				antiOps.push(op)
			}
		}

		if (antiOps.length > 0) {
			const superGroup = identifyKociembaClass([...matchedOps, ...antiOps])
			return { symClass, invMark: `{${superGroup}}`, sigInverse }
		}

		return { symClass, invMark: '', sigInverse }
	},

	classifySchoenflies: (preCode) => {
		const { symClass, invMark } = SymmetryAnalyzer.analyzeCubie(preCode)
		return invMark ? `${symClass} ${invMark}` : symClass
	},

	init: () => {
		const fIn = document.getElementById('batch-file-input')
		const btn = document.getElementById('batch-run-button')
		const mIn = document.getElementById('catch24-input')
		const app = document.getElementById('apply-input-button')
		const cont = document.getElementById('batch-download-container')
		const symVal = document.getElementById('symmetry-value')
		const metVal = document.getElementById('metrics-value')

		if (!fIn || !btn || !mIn || !app || !cont) return

		const getMetricsData = (seq) => {
			if (!Array.isArray(seq) || seq.length === 0) return null
			const AXIS_MAP = { U: 'UD', D: 'UD', F: 'FB', B: 'FB', R: 'RL', L: 'RL' }
			let t = 0
			let q = 0
			let prevAxis = ''
			let blockMax = 0

			for (let k = 0; k < seq.length; k++) {
				const m = seq[k]
				const turns = Math.abs(m.turns)
				const axis = AXIS_MAP[m.face] || m.face
				q += turns
				if (axis === prevAxis) {
					if (turns > blockMax) blockMax = turns
				} else {
					t += blockMax
					prevAxis = axis
					blockMax = turns
				}
			}
			t += blockMax
			return { t, q, f: seq.length }
		}

		app.addEventListener('click', () => {
			if (window._interceptorActive) return

			setTimeout(() => {
				const rawInput = (mIn.value || '').trim()
				const pCode = (cubeState?.lastPreliminaryCode || '').trim()

				if (rawInput && pCode && symVal) {
					const res = SymmetryAnalyzer.classifySchoenflies(pCode)
					symVal.innerText = res
					symVal.className = res ? 'symmetry-badge sym-spatial' : 'symmetry-badge'
				} else if (symVal) {
					symVal.innerText = ''
					symVal.className = 'symmetry-badge'
				}

				if (metVal) {
					const hasSeq = Boolean(rawInput && window._lastNormalizedScramble)
					const mData = hasSeq ? getMetricsData(cubeState?.lastParsedSequence) : null
					metVal.innerText = mData ? `(${mData.t}t, ${mData.q}q, ${mData.f}f)` : ''
					metVal.className = mData ? 'symmetry-badge sym-spatial' : 'symmetry-badge'
				}
			}, 50)
		})

		const resetBtn = document.getElementById('reset-button')
		if (resetBtn) {
			resetBtn.addEventListener('click', () => {
				setTimeout(() => {
					window._lastNormalizedScramble = ''
					window._lastBatchSig = ''
					if (cubeState) cubeState.lastPreliminaryCode = ''
					if (symVal) {
						symVal.innerText = ''
						symVal.className = 'symmetry-badge'
					}
					if (metVal) {
						metVal.innerText = ''
						metVal.className = 'symmetry-badge'
					}
					if (cont) {
						cont.innerHTML = ''
					}
				}, 30)
			})
		}

		btn.onclick = () => {
			cont.innerHTML = ''
			fIn.click()
		}

		fIn.onchange = (e) => {
			const files = e.target.files
			if (!files || files.length === 0) return

			const [file] = files
			const reader = new FileReader()
			reader.onload = (evt) => {
				const text = evt.target.result
				const rawLines = text
					.split(/\r?\n/)
					.map((l) => l.trim())
					.filter((l) => l.length > 0)
				if (rawLines.length === 0) return
				if (symVal) {
					symVal.innerText = ''
					symVal.className = 'symmetry-badge'
				}
				if (metVal) {
					metVal.innerText = ''
					metVal.className = 'symmetry-badge'
				}

				const extractValidInput = (rawRow) => {
					const rowText = rawRow.replace(/(\s+\(|\/\/).*$/, '').trim()
					if (!rowText) return ''

					if (!rowText.includes('\t') && !rowText.includes(';') && !rowText.includes(',')) {
						if (/^[FBRLUDw2'’′13+\-\s]+$/.test(rowText) && /[FBRLUD]/.test(rowText) && !/^[fqt]$/.test(rowText)) {
							return rowText.replace(/\s+/g, ' ')
						}
						const cleanSig = rowText.replace(/\s+/g, '')
						if (/^[a-x]{18}$/.test(cleanSig)) return cleanSig
						return ''
					}

					let delimiter = '\t'
					if (!rowText.includes('\t')) {
						if (rowText.includes(';')) delimiter = ';'
						else if (rowText.includes(',')) delimiter = ','
					}

					const cells = rowText
						.split(delimiter)
						.map((c) => c.trim().replace(/^"|"$/g, '').trim())
						.filter((c) => c.length > 0)

					const seqCell = cells.find((c) => /^[FBRLUDw2'’′13+\-\s]+$/.test(c) && /[FBRLUD]/.test(c) && !/^[fqt]$/.test(c))
					const sigCell = cells.find((c) => /^[a-x]{18}$/.test(c.replace(/\s+/g, '')))

					if (seqCell) return seqCell.replace(/\s+/g, ' ')
					if (sigCell) return sigCell.replace(/\s+/g, '')
					return ''
				}

				// Detect symmetry of the very first valid entry silently
				window._interceptorActive = true
				let baseSymmetry = ''
				for (let i = 0; i < rawLines.length; i++) {
					const firstInput = extractValidInput(rawLines.at(i))
					if (firstInput) {
						window._lastBatchSig = ''
						window._lastNormalizedScramble = ''
						mIn.value = firstInput
						app.click()
						const pCode = (cubeState?.lastPreliminaryCode || '').trim()
						if (pCode) {
							baseSymmetry = SymmetryAnalyzer.analyzeCubie(pCode).symClass
							break
						}
					}
				}
				window._interceptorActive = false

				const checkMismatches = baseSymmetry
					? window.confirm(`Check for mismatches with first group "${baseSymmetry}"? (OK - yes, mismatches only / Cancel - no, process all)`)
					: false

				// const symDisplay = document.getElementById('sym-class-display')
				// const invDisplay = document.getElementById('inv-mark-display')
				// if (symDisplay) symDisplay.textContent = checkMismatches ? baseSymmetry : ''
				// if (invDisplay) invDisplay.textContent = ''

				btn.innerText = '⏳...'
				btn.style.color = '#ffc107'

				setTimeout(async () => {
					const results = []
					const seenSignatures = new Set()
					let uniqueTotalCount = 0
					let mismatchCount = 0
					//let limitPromptShown = false
					const start = Date.now()
					window._interceptorActive = true

					for (let i = 0; i < rawLines.length; i++) {
						const scramble = extractValidInput(rawLines.at(i))

						if (scramble) {
							window._lastBatchSig = ''
							window._lastNormalizedScramble = ''
							mIn.value = scramble
							app.click()

							const sig = (window._lastBatchSig || '').trim()
							const pCode = (cubeState?.lastPreliminaryCode || '').trim()

							if (sig && pCode && !seenSignatures.has(sig)) {
								seenSignatures.add(sig)
								uniqueTotalCount++

								const { symClass, invMark } = SymmetryAnalyzer.analyzeCubie(pCode)
								const isMismatch = checkMismatches && symClass !== baseSymmetry
								if (isMismatch) mismatchCount++

								if (!checkMismatches || isMismatch) {
									const hasSequence = Boolean(window._lastNormalizedScramble)
									const cleanScramble = hasSequence ? window._lastNormalizedScramble : ''
									const mData = hasSequence ? getMetricsData(cubeState?.lastParsedSequence) : null

									const tVal = mData ? mData.t : ''
									const qVal = mData ? mData.q : ''
									const fVal = mData ? mData.f : ''
									const note = isMismatch ? `\tExpected: ${baseSymmetry}` : ''

									results.push(`${cleanScramble}\t${sig}\t${symClass}\t${invMark.replace(/[{}]/g, '')}\t${tVal}\t${qVal}\t${fVal}${note}`)
								}

								checkMismatches && mismatchCount
							}
						}

						if ((i + 1) % 5000 === 0 || i + 1 === rawLines.length) {
							const auditInfo = checkMismatches ? ` | group: ${baseSymmetry} | mismatches: ${mismatchCount}` : ''
							cont.innerText = `Processed: ${(i + 1).toLocaleString()} / ${rawLines.length.toLocaleString()} (unique: ${uniqueTotalCount.toLocaleString()}${auditInfo})`
							await new Promise((r) => setTimeout(r, 0))
						}
					}

					window._interceptorActive = false
					btn.innerText = 'Batch'
					btn.style.color = '#ffffff'

					const elapsed = ((Date.now() - start) / 1000).toFixed(2)
					const safeName = baseSymmetry.replace(/[^A-Za-z0-9_-]/g, '_')
					const defaultFileName = checkMismatches ? `rcs_mismatches_${safeName}.tsv` : 'rcs_signatures_output.tsv'
					const extraStatus = checkMismatches ? ` | Group: ${baseSymmetry} | Mismatches: ${mismatchCount}` : ''

					cont.innerHTML = `
						<span style="color: #4caf50; font-weight: bold;">🎉 Done (${elapsed}s)! Unique: ${uniqueTotalCount.toLocaleString()}${extraStatus}. </span>
						<a href="#" class="batch-download-link">Download TSV</a>
					`

					const dlLink = cont.querySelector('.batch-download-link')
					dlLink.onclick = async (ev) => {
						ev.preventDefault()
						if (results.length === 0) {
							window.alert('Report is empty (0 rows). Nothing to save.')
							return
						}
						const shouldSave = window.confirm(`Report contains ${results.length.toLocaleString()} rows.\nSave TSV file now? (OK - yes, save / Cancel - no)`)
						if (!shouldSave) return

						const header = checkMismatches ? 'Scramble\tCatch-24 Signature\tSymmetry\t{Inv}\tt\tq\tf\tAudit' : 'Scramble\tCatch-24 Signature\tSymmetry\t{Inv}\tt\tq\tf'
						const tsv = [header, ...results].join('\n')
						const blob = new Blob([tsv], { type: 'text/tab-separated-values;charset=utf-8;' })

						if (window.showSaveFilePicker) {
							try {
								const handle = await window.showSaveFilePicker({
									suggestedName: defaultFileName,
									types: [
										{
											description: 'Tab-Separated Values (TSV)',
											accept: { 'text/tab-separated-values': ['.tsv'] },
										},
									],
								})
								const writable = await handle.createWritable()
								await writable.write(blob)
								await writable.close()
								return
							} catch (err) {
								if (err?.name === 'AbortError') return
							}
						}

						const url = URL.createObjectURL(blob)
						const tempA = document.createElement('a')
						tempA.href = url
						tempA.download = defaultFileName
						document.body.appendChild(tempA)
						tempA.click()
						document.body.removeChild(tempA)
						URL.revokeObjectURL(url)
					}

					fIn.value = ''
				}, 50)
			}
			reader.readAsText(file)
		}
	},
}

document.addEventListener('DOMContentLoaded', () => SymmetryAnalyzer.init())

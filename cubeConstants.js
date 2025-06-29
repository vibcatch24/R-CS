// Файл: cubeConstants.js ref 1.2
export const DEBUG_STATE = false
export const TOTAL_STIKERS = 48
export const DEFAULT_COLOR = '#C0C0C0'
export const SIDES = ['U', 'L', 'F', 'R', 'B', 'D']
export const FACE_COLORS = {
	U: 'snow',
	L: 'orange',
	F: 'lime',
	D: 'yellow',
	R: 'red',
	B: 'dodgerblue',
}

export const FACE_LAYOUT = [
	[1, 0],
	[0, 1],
	[1, 1],
	[2, 1],
	[3, 1],
	[1, 2], // U, L, F, R, B, D
]
export const NON_CENTER_FACE = [
	{ row: 0, col: 0 },
	{ row: 0, col: 1 },
	{ row: 0, col: 2 },
	{ row: 1, col: 2 },
	{ row: 2, col: 2 },
	{ row: 2, col: 1 },
	{ row: 2, col: 0 },
	{ row: 1, col: 0 },
]

export const OPPOSITE_FACE_PAIRS = [
	['U', 'D'],
	['L', 'R'],
	['F', 'B'],
]

export const PIECE_DEFS = {
	corners: [
		{
			id: 0,
			type: 'corner',
			faces: ['U', 'R', 'F'],
			refInd: [4, 24, 18],
		},
		{
			id: 1,
			type: 'corner',
			faces: ['U', 'F', 'L'],
			refInd: [6, 16, 10],
		},
		{
			id: 2,
			type: 'corner',
			faces: ['U', 'L', 'B'],
			refInd: [0, 8, 34],
		},
		{
			id: 3,
			type: 'corner',
			faces: ['U', 'B', 'R'],
			refInd: [2, 32, 26],
		},
		{
			id: 4,
			type: 'corner',
			faces: ['D', 'R', 'B'],
			refInd: [44, 28, 38],
		},
		{
			id: 5,
			type: 'corner',
			faces: ['D', 'B', 'L'],
			refInd: [46, 36, 14],
		},
		{
			id: 6,
			type: 'corner',
			faces: ['D', 'L', 'F'],
			refInd: [40, 12, 22],
		},
		{
			id: 7,
			type: 'corner',
			faces: ['D', 'F', 'R'],
			refInd: [42, 20, 30],
		},
	],
	edges: [
		{
			id: 0,
			type: 'edge',
			faces: ['U', 'R'],
			refInd: [3, 25],
		},
		{
			id: 1,
			type: 'edge',
			faces: ['U', 'F'],
			refInd: [5, 17],
		},
		{
			id: 2,
			type: 'edge',
			faces: ['U', 'L'],
			refInd: [7, 9],
		},
		{
			id: 3,
			type: 'edge',
			faces: ['U', 'B'],
			refInd: [1, 33],
		},
		{
			id: 4,
			type: 'edge',
			faces: ['D', 'R'],
			refInd: [43, 29],
		},
		{
			id: 5,
			type: 'edge',
			faces: ['D', 'F'],
			refInd: [41, 21],
		},
		{
			id: 6,
			type: 'edge',
			faces: ['D', 'L'],
			refInd: [47, 13],
		},
		{
			id: 7,
			type: 'edge',
			faces: ['D', 'B'],
			refInd: [45, 37],
		},
		{
			id: 8,
			type: 'edge',
			faces: ['F', 'R'],
			refInd: [19, 31],
		},
		{
			id: 9,
			type: 'edge',
			faces: ['F', 'L'],
			refInd: [23, 11],
		},
		{
			id: 10,
			type: 'edge',
			faces: ['B', 'L'],
			refInd: [35, 15],
		},
		{
			id: 11,
			type: 'edge',
			faces: ['B', 'R'],
			refInd: [39, 27],
		},
	],
}

export const CATCH24_MULT_TABLE = new Map([
	['a', ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x']],
	['b', ['b', 'a', 'd', 'c', 'h', 'v', 'x', 'e', 'u', 'w', 'p', 'o', 'r', 'q', 'l', 'k', 'n', 'm', 't', 's', 'i', 'f', 'j', 'g']],
	['c', ['c', 'd', 'a', 'b', 's', 'i', 'w', 't', 'f', 'x', 'l', 'k', 'q', 'r', 'p', 'o', 'm', 'n', 'e', 'h', 'v', 'u', 'g', 'j']],
	['d', ['d', 'c', 'b', 'a', 't', 'u', 'j', 's', 'v', 'g', 'o', 'p', 'n', 'm', 'k', 'l', 'r', 'q', 'h', 'e', 'f', 'i', 'x', 'w']],
	['e', ['e', 'h', 't', 's', 'b', 'n', 'k', 'a', 'm', 'l', 'x', 'w', 'u', 'v', 'j', 'g', 'f', 'i', 'c', 'd', 'r', 'q', 'o', 'p']],
	['f', ['f', 'u', 'i', 'v', 'k', 'c', 'q', 'o', 'a', 'n', 's', 'e', 'g', 'x', 't', 'h', 'w', 'j', 'l', 'p', 'd', 'b', 'm', 'r']],
	['g', ['g', 'w', 'x', 'j', 'm', 'k', 'd', 'q', 'p', 'a', 'u', 'i', 't', 'e', 'f', 'v', 's', 'h', 'r', 'n', 'o', 'l', 'c', 'b']],
	['h', ['h', 'e', 's', 't', 'a', 'q', 'p', 'b', 'r', 'o', 'g', 'j', 'i', 'f', 'w', 'x', 'v', 'u', 'd', 'c', 'm', 'n', 'l', 'k']],
	['i', ['i', 'v', 'f', 'u', 'l', 'a', 'm', 'p', 'c', 'r', 'e', 's', 'w', 'j', 'h', 't', 'g', 'x', 'k', 'o', 'b', 'd', 'q', 'n']],
	['j', ['j', 'x', 'w', 'g', 'n', 'o', 'a', 'r', 'l', 'd', 'f', 'v', 'e', 't', 'u', 'i', 'h', 's', 'q', 'm', 'k', 'p', 'b', 'c']],
	['k', ['k', 'o', 'p', 'l', 'u', 'x', 's', 'f', 'g', 'e', 'r', 'm', 'd', 'b', 'n', 'q', 'c', 'a', 'i', 'v', 'j', 'w', 't', 'h']],
	['l', ['l', 'p', 'o', 'k', 'v', 'j', 'e', 'i', 'w', 's', 'n', 'q', 'b', 'd', 'r', 'm', 'a', 'c', 'f', 'u', 'x', 'g', 'h', 't']],
	['m', ['m', 'q', 'n', 'r', 'w', 'e', 'u', 'g', 't', 'i', 'b', 'c', 'o', 'l', 'a', 'd', 'k', 'p', 'x', 'j', 'h', 's', 'f', 'v']],
	['n', ['n', 'r', 'm', 'q', 'x', 't', 'f', 'j', 'e', 'v', 'c', 'b', 'k', 'p', 'd', 'a', 'o', 'l', 'w', 'g', 's', 'h', 'u', 'i']],
	['o', ['o', 'k', 'l', 'p', 'f', 'w', 'h', 'u', 'j', 't', 'q', 'n', 'a', 'c', 'm', 'r', 'b', 'd', 'v', 'i', 'g', 'x', 'e', 's']],
	['p', ['p', 'l', 'k', 'o', 'i', 'g', 't', 'v', 'x', 'h', 'm', 'r', 'c', 'a', 'q', 'n', 'd', 'b', 'u', 'f', 'w', 'j', 's', 'e']],
	['q', ['q', 'm', 'r', 'n', 'g', 's', 'v', 'w', 'h', 'f', 'd', 'a', 'p', 'k', 'c', 'b', 'l', 'o', 'j', 'x', 't', 'e', 'i', 'u']],
	['r', ['r', 'n', 'q', 'm', 'j', 'h', 'i', 'x', 's', 'u', 'a', 'd', 'l', 'o', 'b', 'c', 'p', 'k', 'g', 'w', 'e', 't', 'v', 'f']],
	['s', ['s', 't', 'h', 'e', 'd', 'r', 'l', 'c', 'q', 'k', 'j', 'g', 'v', 'u', 'x', 'w', 'i', 'f', 'a', 'b', 'n', 'm', 'p', 'o']],
	['t', ['t', 's', 'e', 'h', 'c', 'm', 'o', 'd', 'n', 'p', 'w', 'x', 'f', 'i', 'g', 'j', 'u', 'v', 'b', 'a', 'q', 'r', 'k', 'l']],
	['u', ['u', 'f', 'v', 'i', 'o', 'b', 'r', 'k', 'd', 'm', 'h', 't', 'j', 'w', 'e', 's', 'x', 'g', 'p', 'l', 'a', 'c', 'n', 'q']],
	['v', ['v', 'i', 'u', 'f', 'p', 'd', 'n', 'l', 'b', 'q', 't', 'h', 'x', 'g', 's', 'e', 'j', 'w', 'o', 'k', 'c', 'a', 'r', 'm']],
	['w', ['w', 'g', 'j', 'x', 'q', 'l', 'b', 'm', 'o', 'c', 'v', 'f', 'h', 's', 'i', 'u', 'e', 't', 'n', 'r', 'p', 'k', 'a', 'd']],
	['x', ['x', 'j', 'g', 'w', 'r', 'p', 'c', 'n', 'k', 'b', 'i', 'u', 's', 'h', 'v', 'f', 't', 'e', 'm', 'q', 'l', 'o', 'd', 'a']],
])

export const BASE24_CHARS = 'akrigscpqfxhbonvwtdlmuje-frasiqchundevmbtkjlgpwox'

// Inverse = ['f','c','i','b','v','d','u','i','a','f','c','u','d','v','b','r','q','n']
export const INVERSE = [5, 2, 8, 1, 21, 3, 20, 8, 0, 5, 2, 20, 3, 21, 1, 17, 16, 13]

// Identity = ['i','c','f','b','v','d','u','f','a','i','c','u','d','v','b','k','l','p']
export const IDENTITY = [8, 2, 5, 1, 21, 3, 20, 5, 0, 8, 2, 20, 3, 21, 1, 10, 11, 15]

export const MOVE_DEFINITIONS = {
	U: {
		corners: { affected: [0, 1, 2, 3], permutation: [1, 2, 3, 0] },
		edges: { affected: [0, 1, 2, 3], permutation: [1, 2, 3, 0] },
	},
	D: {
		corners: { affected: [4, 5, 6, 7], permutation: [1, 2, 3, 0] },
		edges: { affected: [4, 5, 6, 7], permutation: [3, 0, 1, 2] },
	},
	R: {
		corners: { affected: [0, 3, 4, 7], permutation: [1, 2, 3, 0], orientationChange: [2, 1, 2, 1] },
		edges: { affected: [0, 11, 4, 8], permutation: [1, 2, 3, 0] },
	},
	L: {
		corners: { affected: [1, 2, 5, 6], permutation: [3, 0, 1, 2], orientationChange: [1, 2, 1, 2] },
		edges: { affected: [2, 10, 6, 9], permutation: [3, 0, 1, 2] },
	},
	F: {
		corners: { affected: [0, 7, 6, 1], permutation: [1, 2, 3, 0], orientationChange: [1, 2, 1, 2] },
		edges: { affected: [1, 8, 5, 9], permutation: [1, 2, 3, 0], orientationChange: [1, 1, 1, 1] },
	},
	B: {
		corners: { affected: [3, 2, 5, 4], permutation: [1, 2, 3, 0], orientationChange: [2, 1, 2, 1] },
		edges: { affected: [3, 11, 7, 10], permutation: [3, 0, 1, 2], orientationChange: [1, 1, 1, 1] },
	},
}

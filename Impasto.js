// cubeConstants.js
var DEBUG_STATE = false;
var TOTAL_STIKERS = 48;
var DEFAULT_COLOR = "#C0C0C0";
var SIDES = ["U", "L", "F", "R", "B", "D"];
var FACE_COLORS = {
  U: "snow",
  L: "orange",
  F: "lime",
  D: "yellow",
  R: "red",
  B: "dodgerblue"
};
var FACE_LAYOUT = [
  [1, 0],
  [0, 1],
  [1, 1],
  [2, 1],
  [3, 1],
  [1, 2]
];
var NON_CENTER_FACE = [
  { row: 0, col: 0 },
  { row: 0, col: 1 },
  { row: 0, col: 2 },
  { row: 1, col: 2 },
  { row: 2, col: 2 },
  { row: 2, col: 1 },
  { row: 2, col: 0 },
  { row: 1, col: 0 }
];
var OPPOSITE_FACE_PAIRS = [
  ["U", "D"],
  ["L", "R"],
  ["F", "B"]
];
var PIECE_DEFS = {
  corners: [
    {
      id: 0,
      type: "corner",
      faces: ["U", "R", "F"],
      refInd: [4, 24, 18]
    },
    {
      id: 1,
      type: "corner",
      faces: ["U", "F", "L"],
      refInd: [6, 16, 10]
    },
    {
      id: 2,
      type: "corner",
      faces: ["U", "L", "B"],
      refInd: [0, 8, 34]
    },
    {
      id: 3,
      type: "corner",
      faces: ["U", "B", "R"],
      refInd: [2, 32, 26]
    },
    {
      id: 4,
      type: "corner",
      faces: ["D", "R", "B"],
      refInd: [44, 28, 38]
    },
    {
      id: 5,
      type: "corner",
      faces: ["D", "B", "L"],
      refInd: [46, 36, 14]
    },
    {
      id: 6,
      type: "corner",
      faces: ["D", "L", "F"],
      refInd: [40, 12, 22]
    },
    {
      id: 7,
      type: "corner",
      faces: ["D", "F", "R"],
      refInd: [42, 20, 30]
    }
  ],
  edges: [
    {
      id: 0,
      type: "edge",
      faces: ["U", "R"],
      refInd: [3, 25]
    },
    {
      id: 1,
      type: "edge",
      faces: ["U", "F"],
      refInd: [5, 17]
    },
    {
      id: 2,
      type: "edge",
      faces: ["U", "L"],
      refInd: [7, 9]
    },
    {
      id: 3,
      type: "edge",
      faces: ["U", "B"],
      refInd: [1, 33]
    },
    {
      id: 4,
      type: "edge",
      faces: ["D", "R"],
      refInd: [43, 29]
    },
    {
      id: 5,
      type: "edge",
      faces: ["D", "F"],
      refInd: [41, 21]
    },
    {
      id: 6,
      type: "edge",
      faces: ["D", "L"],
      refInd: [47, 13]
    },
    {
      id: 7,
      type: "edge",
      faces: ["D", "B"],
      refInd: [45, 37]
    },
    {
      id: 8,
      type: "edge",
      faces: ["F", "R"],
      refInd: [19, 31]
    },
    {
      id: 9,
      type: "edge",
      faces: ["F", "L"],
      refInd: [23, 11]
    },
    {
      id: 10,
      type: "edge",
      faces: ["B", "L"],
      refInd: [35, 15]
    },
    {
      id: 11,
      type: "edge",
      faces: ["B", "R"],
      refInd: [39, 27]
    }
  ]
};
var CATCH24_MULT_TABLE = new Map([
  ["a", ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x"]],
  ["b", ["b", "a", "d", "c", "h", "v", "x", "e", "u", "w", "p", "o", "r", "q", "l", "k", "n", "m", "t", "s", "i", "f", "j", "g"]],
  ["c", ["c", "d", "a", "b", "s", "i", "w", "t", "f", "x", "l", "k", "q", "r", "p", "o", "m", "n", "e", "h", "v", "u", "g", "j"]],
  ["d", ["d", "c", "b", "a", "t", "u", "j", "s", "v", "g", "o", "p", "n", "m", "k", "l", "r", "q", "h", "e", "f", "i", "x", "w"]],
  ["e", ["e", "h", "t", "s", "b", "n", "k", "a", "m", "l", "x", "w", "u", "v", "j", "g", "f", "i", "c", "d", "r", "q", "o", "p"]],
  ["f", ["f", "u", "i", "v", "k", "c", "q", "o", "a", "n", "s", "e", "g", "x", "t", "h", "w", "j", "l", "p", "d", "b", "m", "r"]],
  ["g", ["g", "w", "x", "j", "m", "k", "d", "q", "p", "a", "u", "i", "t", "e", "f", "v", "s", "h", "r", "n", "o", "l", "c", "b"]],
  ["h", ["h", "e", "s", "t", "a", "q", "p", "b", "r", "o", "g", "j", "i", "f", "w", "x", "v", "u", "d", "c", "m", "n", "l", "k"]],
  ["i", ["i", "v", "f", "u", "l", "a", "m", "p", "c", "r", "e", "s", "w", "j", "h", "t", "g", "x", "k", "o", "b", "d", "q", "n"]],
  ["j", ["j", "x", "w", "g", "n", "o", "a", "r", "l", "d", "f", "v", "e", "t", "u", "i", "h", "s", "q", "m", "k", "p", "b", "c"]],
  ["k", ["k", "o", "p", "l", "u", "x", "s", "f", "g", "e", "r", "m", "d", "b", "n", "q", "c", "a", "i", "v", "j", "w", "t", "h"]],
  ["l", ["l", "p", "o", "k", "v", "j", "e", "i", "w", "s", "n", "q", "b", "d", "r", "m", "a", "c", "f", "u", "x", "g", "h", "t"]],
  ["m", ["m", "q", "n", "r", "w", "e", "u", "g", "t", "i", "b", "c", "o", "l", "a", "d", "k", "p", "x", "j", "h", "s", "f", "v"]],
  ["n", ["n", "r", "m", "q", "x", "t", "f", "j", "e", "v", "c", "b", "k", "p", "d", "a", "o", "l", "w", "g", "s", "h", "u", "i"]],
  ["o", ["o", "k", "l", "p", "f", "w", "h", "u", "j", "t", "q", "n", "a", "c", "m", "r", "b", "d", "v", "i", "g", "x", "e", "s"]],
  ["p", ["p", "l", "k", "o", "i", "g", "t", "v", "x", "h", "m", "r", "c", "a", "q", "n", "d", "b", "u", "f", "w", "j", "s", "e"]],
  ["q", ["q", "m", "r", "n", "g", "s", "v", "w", "h", "f", "d", "a", "p", "k", "c", "b", "l", "o", "j", "x", "t", "e", "i", "u"]],
  ["r", ["r", "n", "q", "m", "j", "h", "i", "x", "s", "u", "a", "d", "l", "o", "b", "c", "p", "k", "g", "w", "e", "t", "v", "f"]],
  ["s", ["s", "t", "h", "e", "d", "r", "l", "c", "q", "k", "j", "g", "v", "u", "x", "w", "i", "f", "a", "b", "n", "m", "p", "o"]],
  ["t", ["t", "s", "e", "h", "c", "m", "o", "d", "n", "p", "w", "x", "f", "i", "g", "j", "u", "v", "b", "a", "q", "r", "k", "l"]],
  ["u", ["u", "f", "v", "i", "o", "b", "r", "k", "d", "m", "h", "t", "j", "w", "e", "s", "x", "g", "p", "l", "a", "c", "n", "q"]],
  ["v", ["v", "i", "u", "f", "p", "d", "n", "l", "b", "q", "t", "h", "x", "g", "s", "e", "j", "w", "o", "k", "c", "a", "r", "m"]],
  ["w", ["w", "g", "j", "x", "q", "l", "b", "m", "o", "c", "v", "f", "h", "s", "i", "u", "e", "t", "n", "r", "p", "k", "a", "d"]],
  ["x", ["x", "j", "g", "w", "r", "p", "c", "n", "k", "b", "i", "u", "s", "h", "v", "f", "t", "e", "m", "q", "l", "o", "d", "a"]]
]);
var BASE24_CHARS = "akrigscpqfxhbonvwtdlmuje-frasiqchundevmbtkjlgpwox";
var INVERSE = [5, 2, 8, 1, 21, 3, 20, 8, 0, 5, 2, 20, 3, 21, 1, 17, 16, 13];
var IDENTITY = [8, 2, 5, 1, 21, 3, 20, 5, 0, 8, 2, 20, 3, 21, 1, 10, 11, 15];
var MOVE_DEFINITIONS = {
  U: {
    corners: { affected: [0, 1, 2, 3], permutation: [1, 2, 3, 0] },
    edges: { affected: [0, 1, 2, 3], permutation: [1, 2, 3, 0] }
  },
  D: {
    corners: { affected: [4, 5, 6, 7], permutation: [1, 2, 3, 0] },
    edges: { affected: [4, 5, 6, 7], permutation: [3, 0, 1, 2] }
  },
  R: {
    corners: { affected: [0, 3, 4, 7], permutation: [1, 2, 3, 0], orientationChange: [2, 1, 2, 1] },
    edges: { affected: [0, 11, 4, 8], permutation: [1, 2, 3, 0] }
  },
  L: {
    corners: { affected: [1, 2, 5, 6], permutation: [3, 0, 1, 2], orientationChange: [1, 2, 1, 2] },
    edges: { affected: [2, 10, 6, 9], permutation: [3, 0, 1, 2] }
  },
  F: {
    corners: { affected: [0, 7, 6, 1], permutation: [1, 2, 3, 0], orientationChange: [1, 2, 1, 2] },
    edges: { affected: [1, 8, 5, 9], permutation: [1, 2, 3, 0], orientationChange: [1, 1, 1, 1] }
  },
  B: {
    corners: { affected: [3, 2, 5, 4], permutation: [1, 2, 3, 0], orientationChange: [2, 1, 2, 1] },
    edges: { affected: [3, 11, 7, 10], permutation: [3, 0, 1, 2], orientationChange: [1, 1, 1, 1] }
  }
};

// CubeState.js
var DEBUG = DEBUG_STATE;

class CubeState {
  constructor() {
    this.stickersColor = new Array(TOTAL_STIKERS).fill(DEFAULT_COLOR);
    this.pieceDefs = PIECE_DEFS;
    this.definitionAssignments = {};
    this.faceColors = FACE_COLORS;
    this.stickerIndex = null;
  }
  getStickerColor(stickerIndex) {
    return this.stickersColor[stickerIndex];
  }
  _getPieceInfoByStickerIndex(stickerIndex) {
    const definitions = stickerIndex % 2 ? this.pieceDefs.edges : this.pieceDefs.corners;
    for (const def of definitions) {
      if (def.refInd.includes(stickerIndex)) {
        return {
          id: def.id,
          type: def.type,
          refInd: def.refInd,
          faces: def.faces
        };
      }
    }
  }
  _getCornerSlotStickerData(cornerSlotID) {
    const slotDef = this.pieceDefs.corners[cornerSlotID];
    const stickerSlotArray = [];
    for (let i = 0;i < 3; i++) {
      stickerSlotArray.push({
        stickerIndex: slotDef.refInd[i],
        color: this.stickersColor[slotDef.refInd[i]],
        faceIndexOfSlot: i
      });
    }
    return stickerSlotArray;
  }
  _getEdgeSlotStickerData(edgeSlotID) {
    const slotDef = this.pieceDefs.edges[edgeSlotID];
    const stickerSlotArray = [];
    for (let i = 0;i < 2; i++) {
      stickerSlotArray.push({
        stickerIndex: slotDef.refInd[i],
        color: this.stickersColor[slotDef.refInd[i]],
        faceIndexOfSlot: i
      });
    }
    return stickerSlotArray;
  }
  _getFaceNameOfSticker(stickerIndex) {
    const faceOrderIndex = Math.floor(stickerIndex / 8);
    return SIDES[faceOrderIndex];
  }
  _getCurrentPermutation(typeSlot) {
    const isCorner = typeSlot === "corner";
    const count = isCorner ? 8 : 12;
    const permutation = new Array(count);
    for (const defKey in this.definitionAssignments) {
      if (defKey.startsWith(typeSlot)) {
        const slotId = this.definitionAssignments[defKey];
        const defId = Number.parseInt(defKey.split("_")[1], 10);
        permutation[slotId] = defId;
      }
    }
    return permutation;
  }
  _getAssignedCornerDefID_fromTwoColors(physicalSlotID, twoKnownColorsInfo) {
    const colorA_Data = twoKnownColorsInfo[0];
    const colorB_Data = twoKnownColorsInfo[1];
    const candidateDefinitionsData = [];
    for (const candDef of this.pieceDefs.corners) {
      const candDefCanonicalColors = candDef.faces.map((faceName) => this.faceColors[faceName]);
      const hasColorA = candDefCanonicalColors.includes(colorA_Data.color);
      const hasColorB = candDefCanonicalColors.includes(colorB_Data.color);
      let isAvailable = true;
      const candDefKey = `corner_${candDef.id}`;
      if (Object.prototype.hasOwnProperty.call(this.definitionAssignments, candDefKey) && this.definitionAssignments[candDefKey] !== physicalSlotID) {
        isAvailable = false;
      }
      if (hasColorA && hasColorB && isAvailable) {
        candidateDefinitionsData.push({
          definition: candDef,
          canonicalColors: candDefCanonicalColors
        });
      }
    }
    const orderedFaceOnPhysicalSlot = this._getOrderedPairFromTriple([0, 1, 2], colorA_Data.faceIndexOfSlot, colorB_Data.faceIndexOfSlot);
    const slotColorOrder = [];
    if (orderedFaceOnPhysicalSlot[0] === colorA_Data.faceIndexOfSlot) {
      slotColorOrder.push(colorA_Data.color, colorB_Data.color);
    } else {
      slotColorOrder.push(colorB_Data.color, colorA_Data.color);
    }
    for (const currentCandidateData of candidateDefinitionsData) {
      const candidateColorPair = this._getOrderedPairFromTriple(currentCandidateData.canonicalColors, colorA_Data.color, colorB_Data.color);
      if (!candidateColorPair) {
        continue;
      }
      if (slotColorOrder[0] === candidateColorPair[0] && slotColorOrder[1] === candidateColorPair[1]) {
        return currentCandidateData.definition.id;
      }
    }
    return null;
  }
  _getOrderedPairFromTriple(tripleArray, itemB, itemC) {
    if (itemB === itemC && itemB !== undefined) {
      return null;
    }
    const idxB = tripleArray.indexOf(itemB);
    const idxC = tripleArray.indexOf(itemC);
    if (idxB === -1 || idxC === -1) {
      return null;
    }
    let excludedIdx = -1;
    for (let i = 0;i < 3; i++) {
      if (i !== idxB && i !== idxC) {
        excludedIdx = i;
        break;
      }
    }
    if (excludedIdx === -1) {
      return null;
    }
    const firstInPair = tripleArray[(excludedIdx + 1) % 3];
    const secondInPair = tripleArray[(excludedIdx + 2) % 3];
    if (firstInPair === itemB && secondInPair === itemC || firstInPair === itemC && secondInPair === itemB) {
      return [firstInPair, secondInPair];
    }
    return null;
  }
  getValidColorsForSticker(stickerIndex) {
    const pieceInfo = this._getPieceInfoByStickerIndex(stickerIndex);
    const slotStickerIndices = pieceInfo.refInd;
    const otherColorsOnPhysicalSlot = [];
    for (const sIndex of slotStickerIndices) {
      if (sIndex !== stickerIndex) {
        const color = this.stickersColor[sIndex];
        if (color !== DEFAULT_COLOR) {
          otherColorsOnPhysicalSlot.push(color);
        }
      }
    }
    let validColors = Object.values(this.faceColors);
    validColors = validColors.filter((color) => !otherColorsOnPhysicalSlot.includes(color));
    if (DEBUG)
      console.log(`  After Rule A (no duplicates on piece): [${validColors.join(",")}]`);
    validColors = validColors.filter((potentialColor) => {
      let potentialColorFaceName = null;
      for (const faceNameKey in this.faceColors) {
        if (this.faceColors[faceNameKey] === potentialColor) {
          potentialColorFaceName = faceNameKey;
          break;
        }
      }
      let colorOppositeToPotential = null;
      for (const facePair of OPPOSITE_FACE_PAIRS) {
        let oppositeFace = null;
        if (facePair[0] === potentialColorFaceName)
          oppositeFace = facePair[1];
        else if (facePair[1] === potentialColorFaceName)
          oppositeFace = facePair[0];
        if (oppositeFace) {
          colorOppositeToPotential = this.faceColors[oppositeFace];
          break;
        }
      }
      if (colorOppositeToPotential && otherColorsOnPhysicalSlot.includes(colorOppositeToPotential)) {
        return false;
      }
      return true;
    });
    if (DEBUG)
      console.log(`  After Rule B (no opposites on piece): [${validColors.join(",")}]`);
    validColors = validColors.filter((potentialColor) => {
      let count = 0;
      for (let i = 0;i < this.stickersColor.length; i++) {
        if (this.stickersColor[i] === potentialColor) {
          count++;
        }
      }
      const isRuleCFailed = count >= 8 && this.stickersColor[stickerIndex] !== potentialColor;
      return !isRuleCFailed;
    });
    if (DEBUG)
      console.log(`  After Rule C (global limit 8): [${validColors.join(",")}]`);
    if (pieceInfo.type === "edge") {
      validColors = validColors.filter((potentialColor) => {
        const otherStickerIndex = pieceInfo.refInd.find((idx) => idx !== stickerIndex);
        const colorOnOtherSticker = this.stickersColor[otherStickerIndex];
        if (colorOnOtherSticker === DEFAULT_COLOR) {
          return true;
        }
        const colorsOnThisEdge = [potentialColor, colorOnOtherSticker];
        let identifiedEdgeId;
        for (const defEdge of this.pieceDefs.edges) {
          const colorsForDefEdge = defEdge.faces.map((f) => this.faceColors[f]);
          if (colorsForDefEdge.length === 2 && colorsForDefEdge.includes(colorsOnThisEdge[0]) && colorsForDefEdge.includes(colorsOnThisEdge[1])) {
            identifiedEdgeId = defEdge.id;
            break;
          }
        }
        const canonicalKey = `edge_${identifiedEdgeId}`;
        if (Object.prototype.hasOwnProperty.call(this.definitionAssignments, canonicalKey) && this.definitionAssignments[canonicalKey] !== pieceInfo.id) {
          return false;
        }
        return true;
      });
      if (DEBUG)
        console.log(`  After Rule E-edges (no duplicates slots): [${validColors.join(",")}]`);
    }
    if (stickerIndex > 7) {
      validColors = validColors.filter((potentialColor) => {
        const iterationStartStickerIndex = stickerIndex % 2 === 0 ? 0 : 1;
        let countStickersOfTypeWithColor = 0;
        for (let idx = iterationStartStickerIndex;idx < TOTAL_STIKERS; idx += 2) {
          if (this.stickersColor[idx] === potentialColor) {
            countStickersOfTypeWithColor++;
          }
        }
        if (countStickersOfTypeWithColor > 3) {
          return false;
        }
        return true;
      });
    }
    if (DEBUG)
      console.log(`  After Rule D (1 color for type slots=limit 4): [${validColors.join(",")}]`);
    if (pieceInfo.type === "corner") {
      const cornerStickerData = this._getCornerSlotStickerData(pieceInfo.id);
      const coloredStickers = cornerStickerData.filter((s) => s.color !== DEFAULT_COLOR);
      if (coloredStickers.length === 2) {
        const twoKnownColorsInfo = coloredStickers.map((s) => ({
          color: s.color,
          faceIndexOfSlot: s.faceIndexOfSlot
        }));
        const assignedCornerDefID = this._getAssignedCornerDefID_fromTwoColors(pieceInfo.id, twoKnownColorsInfo);
        const assignedStickerData = this.pieceDefs.corners[assignedCornerDefID].faces.map((faceName) => ({
          color: this.faceColors[faceName]
        }));
        const colorsFromArr1 = assignedStickerData.map((item) => item.color);
        const commonColors = validColors.filter((color) => colorsFromArr1.includes(color));
        return commonColors;
      }
      if (coloredStickers.length === 1) {
        const knownSticker = coloredStickers[0];
        const targetStickerInfoInSlot = cornerStickerData.find((s) => s.stickerIndex === stickerIndex);
        if (targetStickerInfoInSlot) {
          validColors = validColors.filter((potentialColor) => {
            const twoKnownColorsInfo = [
              { color: knownSticker.color, faceIndexOfSlot: knownSticker.faceIndexOfSlot },
              { color: potentialColor, faceIndexOfSlot: targetStickerInfoInSlot.faceIndexOfSlot }
            ];
            const assignedCornerDefID = this._getAssignedCornerDefID_fromTwoColors(pieceInfo.id, twoKnownColorsInfo);
            const isColorAllowedByThisRuleG = assignedCornerDefID !== null && assignedCornerDefID !== -1 && typeof assignedCornerDefID !== "undefined";
            return isColorAllowedByThisRuleG;
          });
        }
      }
    }
    if (DEBUG)
      console.log(`%cgetValidColorsForSticker for sticker ${stickerIndex} FINAL: [${validColors.join(",")}]`, "font-weight:bold;");
    return validColors;
  }
  setStickerColor(stickerIndex, newColor) {
    this.stickerIndex = stickerIndex;
    if (newColor === DEFAULT_COLOR) {
      for (let i = stickerIndex;i < TOTAL_STIKERS; i++) {
        this.stickersColor[i] = DEFAULT_COLOR;
        this._clearAssignmentSlot(i);
      }
      return;
    }
    this.stickersColor[stickerIndex] = newColor;
    return;
  }
  _setColorStickerEdgeSlot(edgeAssigmentSlot, edgePhisicalSlot) {
    const stickersPhisicalSlot = this.pieceDefs.edges[edgePhisicalSlot].refInd;
    const stickersColorPhisicalSlot = stickersPhisicalSlot.map((index) => this.stickersColor[index]);
    const stickersColorAssigmentSlot = this.pieceDefs.edges[edgeAssigmentSlot].faces.map((face) => this.faceColors[face]);
    const colorAssigned = stickersColorAssigmentSlot.filter((item) => !stickersColorPhisicalSlot.includes(item));
    for (let i = 1;i > 0; i--) {
      if (stickersColorPhisicalSlot[i] === DEFAULT_COLOR) {
        this.setStickerColor(stickersPhisicalSlot[i], colorAssigned[0]);
      }
    }
  }
  _setAllStickersToSolvedState() {
    for (let i = 17;i < TOTAL_STIKERS; i++) {
      const faceName = SIDES[Math.floor(i / 8)];
      this.stickersColor[i] = this.faceColors[faceName];
    }
    this.definitionAssignments = {};
    for (let i = 0;i < 8; i++) {
      this.definitionAssignments[`corner_${i}`] = i;
    }
    for (let i = 0;i < 12; i++) {
      this.definitionAssignments[`edge_${i}`] = i;
    }
  }
  applyCatch24Code(inputCode) {
    let preliminaryCode = "";
    for (let i = 0;i < 18; i++) {
      preliminaryCode += CATCH24_MULT_TABLE.get(inputCode[i])[IDENTITY[i]];
    }
    const decodedInfo = this._decodePreliminaryCode(preliminaryCode);
    if (!decodedInfo.success)
      return decodedInfo;
    const missingPieces = this._determineMissingPieces(decodedInfo.corners, decodedInfo.edges);
    if (!missingPieces)
      return { success: false, error: "Internal error: could not be determined c0/e11." };
    const allCornersInfo = [missingPieces.c0_data, ...decodedInfo.corners];
    const allEdgesInfo = [...decodedInfo.edges, missingPieces.e11_data];
    this.stickersColor = new Array(TOTAL_STIKERS).fill(DEFAULT_COLOR);
    this.definitionAssignments = {};
    for (const info of allCornersInfo) {
      this.definitionAssignments[`corner_${info.pieceDefId}`] = info.physicalSlotId;
      this._paintSlotFromData(info.physicalSlotId, "corner", info.pieceDefId, info.orientation);
    }
    for (const info of allEdgesInfo) {
      const infoToUse = info.physicalSlotId !== 11 ? info : missingPieces.e11_data;
      this.definitionAssignments[`edge_${infoToUse.pieceDefId}`] = infoToUse.physicalSlotId;
      this._paintSlotFromData(infoToUse.physicalSlotId, "edge", infoToUse.pieceDefId, infoToUse.orientation);
    }
    return { success: true };
  }
  _applyIterativeDeductionRules() {
    for (let c_slotId = 0;c_slotId < 8; c_slotId++) {
      for (const defKey in this.definitionAssignments) {
        if (this.definitionAssignments[defKey] === defKey.startsWith("corner_")) {
          break;
        }
      }
      this._deduceAndCompleteCorner(c_slotId);
    }
    let pieceType = "corner";
    const currentStickerIndex = this.stickerIndex;
    if (currentStickerIndex % 2) {
      pieceType = "edge";
    }
    const pieceTypeAndSuffix = `${pieceType}s`;
    let madeChangeInCurrentPass;
    do {
      madeChangeInCurrentPass = false;
      let assignedCount = 0;
      for (const pieceDefKey in this.definitionAssignments) {
        if (Object.prototype.hasOwnProperty.call(this.definitionAssignments, pieceDefKey)) {
          if (pieceDefKey.startsWith(`${pieceType}_`)) {
            assignedCount++;
          }
        }
      }
      if (assignedCount < 3)
        break;
      const allCubeFaceColors = Object.values(this.faceColors);
      targetColorLoop:
        for (const targetColor of allCubeFaceColors) {
          const stickersFound = [];
          const startIterationIndex = pieceType === "edge" ? 1 : 0;
          for (let i = startIterationIndex;i < TOTAL_STIKERS; i += 2) {
            if (this.stickersColor[i] === targetColor) {
              stickersFound.push(i);
            }
          }
          if (stickersFound.length !== 4) {
            continue;
          }
          const assignedSlotsID = [];
          const unassignedSlotID = [];
          let currentUnassignedSticker = null;
          for (const stickerIdx of stickersFound) {
            const pieceInfo = this._getPieceInfoByStickerIndex(stickerIdx);
            const physSlotID = pieceInfo.id;
            let isAssignedToCorrectDefinitionType = false;
            for (const definitionKey in this.definitionAssignments) {
              if (Object.prototype.hasOwnProperty.call(this.definitionAssignments, definitionKey)) {
                if (this.definitionAssignments[definitionKey] === physSlotID) {
                  if (definitionKey.startsWith(`${pieceType}_`)) {
                    isAssignedToCorrectDefinitionType = true;
                  }
                }
              }
            }
            if (isAssignedToCorrectDefinitionType) {
              assignedSlotsID.push(physSlotID);
            } else {
              unassignedSlotID.push(physSlotID);
              currentUnassignedSticker = stickerIdx;
            }
            if (unassignedSlotID.length > 1 || assignedSlotsID.length === 4) {
              continue targetColorLoop;
            }
          }
          if (assignedSlotsID.length === 3 && unassignedSlotID.length === 1) {
            let targetFaceName = null;
            for (const faceNameKey in this.faceColors) {
              if (this.faceColors[faceNameKey] === targetColor) {
                targetFaceName = faceNameKey;
                break;
              }
            }
            const definitionArray = this.pieceDefs[pieceTypeAndSuffix];
            let destinationDefinitionSlotID = null;
            for (const pieceDefObject of definitionArray) {
              const pieceFaceNames = pieceDefObject.faces;
              if (pieceFaceNames.includes(targetFaceName)) {
                const currentPieceDefID = pieceDefObject.id;
                const assignmentKeyToCheck = `${pieceType}_${currentPieceDefID}`;
                if (this.definitionAssignments[assignmentKeyToCheck] === undefined) {
                  destinationDefinitionSlotID = currentPieceDefID;
                  break;
                }
              }
            }
            const definitionData = this.pieceDefs[pieceTypeAndSuffix][destinationDefinitionSlotID];
            const definedFaceNames = definitionData.faces;
            const definitionSlotColors = definedFaceNames.map((faceName) => this.faceColors[faceName]);
            const k_target = definitionSlotColors.indexOf(targetColor);
            const physicalPieceData = this.pieceDefs[pieceTypeAndSuffix][unassignedSlotID[0]];
            const actualStickerIndicesForPiece = physicalPieceData.refInd;
            const anchorStickerPosInActualPiece = actualStickerIndicesForPiece.indexOf(currentUnassignedSticker);
            const numStickersOnPiece = definitionSlotColors.length;
            for (let i = 0;i < numStickersOnPiece; i++) {
              const colorToApply = definitionSlotColors[i];
              const offsetFromAnchorInDefinition = (i - k_target + numStickersOnPiece) % numStickersOnPiece;
              const targetStickerOrderIndexInPiece = (anchorStickerPosInActualPiece + offsetFromAnchorInDefinition + numStickersOnPiece) % numStickersOnPiece;
              const actualStickerIndexToColor = actualStickerIndicesForPiece[targetStickerOrderIndexInPiece];
              this.stickersColor[actualStickerIndexToColor] = colorToApply;
            }
            this.definitionAssignments[`${pieceType}_${destinationDefinitionSlotID}`] = unassignedSlotID[0];
            madeChangeInCurrentPass = true;
            break;
          }
        }
    } while (madeChangeInCurrentPass);
    const assignedEdgeKeys = Object.keys(this.definitionAssignments).filter((k) => k.startsWith("edge_"));
    const assignedCornerKeys = Object.keys(this.definitionAssignments).filter((k) => k.startsWith("corner_"));
    if (assignedCornerKeys.length === 7) {
      const assignedCornerSlotIds = assignedCornerKeys.map((key) => this.definitionAssignments[key]);
      let unsolvedPhisicalSlotId;
      const unsolvedStickers = [];
      for (let i = 0;i < 8; i++) {
        if (!assignedCornerSlotIds.includes(i)) {
          unsolvedPhisicalSlotId = i;
          unsolvedStickers.push(this.pieceDefs.corners[i].refInd);
          break;
        }
      }
      const assignedCornerDefIds = assignedCornerKeys.map((key) => Number.parseInt(key.split("_")[1], 10));
      let unassignedDefId;
      const unassignedDefIdFaceColors = [];
      for (let i = 0;i < 8; i++) {
        if (!assignedCornerDefIds.includes(i)) {
          unassignedDefId = i;
          for (const face of this.pieceDefs.corners[i].faces) {
            unassignedDefIdFaceColors.push(this.faceColors[face]);
          }
          break;
        }
      }
      let pieceInfo;
      let sumOrientation = 0;
      for (let i = 0;i < TOTAL_STIKERS; i += 2) {
        if (this.stickersColor[i] === "snow" || this.stickersColor[i] === "yellow") {
          pieceInfo = this._getPieceInfoByStickerIndex(i);
          for (let j = 0;j < pieceInfo.refInd.length; j++) {
            if (pieceInfo.refInd[j] === i) {
              sumOrientation += j;
            }
          }
        }
      }
      const ori = (3 - sumOrientation % 3) % 3;
      for (let i = 0;i < 3; i++) {
        this.setStickerColor(unsolvedStickers[0][(ori + i) % 3], unassignedDefIdFaceColors[i]);
      }
      this.definitionAssignments[`corner_${unassignedDefId}`] = unsolvedPhisicalSlotId;
    }
    if (assignedEdgeKeys.length === 10 && assignedCornerKeys.length === 8) {
      const cornerPermutation = this._getCurrentPermutation("corner");
      const cornerParity = this._calculatePermutationParity(cornerPermutation);
      const assignedSlots = new Set;
      const assignedDefs = new Set;
      for (const key of assignedEdgeKeys) {
        assignedSlots.add(this.definitionAssignments[key]);
        assignedDefs.add(Number.parseInt(key.split("_")[1], 10));
      }
      const unassignedSlotIds = Array.from({ length: 12 }, (_, i) => i).filter((id) => !assignedSlots.has(id));
      const unassignedDefIds = Array.from({ length: 12 }, (_, i) => i).filter((id) => !assignedDefs.has(id));
      let [defP_id, defQ_id] = unassignedDefIds;
      const [slotY_id, slotZ_id] = unassignedSlotIds;
      const tempEdgePermutation = this._getCurrentPermutation("edge");
      tempEdgePermutation[slotY_id] = defP_id;
      tempEdgePermutation[slotZ_id] = defQ_id;
      const edgeParity = this._calculatePermutationParity(tempEdgePermutation);
      if (cornerParity !== edgeParity) {
        [defP_id, defQ_id] = [defQ_id, defP_id];
      }
      this.definitionAssignments[`edge_${defP_id}`] = slotY_id;
      this.definitionAssignments[`edge_${defQ_id}`] = slotZ_id;
      this._setColorStickerEdgeSlot(defP_id, slotY_id);
      this._setColorStickerEdgeSlot(defQ_id, slotZ_id);
    }
  }
  applyMoveSequence(moveSequence, isSolution = false) {
    const parser = (sequence) => {
      const moveStrings = sequence.split(" ");
      const parsedMoves = [];
      for (const moveStr of moveStrings) {
        if (moveStr.length === 0)
          continue;
        let face = moveStr;
        let turns = 1;
        const lastChar = face.slice(-1);
        if (lastChar === "'") {
          turns = -1;
          face = face.slice(0, -1);
        } else if (lastChar === "2") {
          turns = 2;
          face = face.slice(0, -1);
        }
        parsedMoves.push({ face, turns });
      }
      return parsedMoves;
    };
    const wideMoveMap = { Uw: "D", Dw: "U", Rw: "L", Lw: "R", Fw: "B", Bw: "F" };
    const parsedSequence = parser(moveSequence);
    const sequenceWithSimpleMoves = parsedSequence.map((move) => {
      const mappedFace = wideMoveMap[move.face];
      if (mappedFace) {
        return { face: mappedFace, turns: move.turns };
      }
      return move;
    });
    let sequenceToApply;
    if (isSolution) {
      sequenceToApply = sequenceWithSimpleMoves.reverse().map((move) => {
        return {
          face: move.face,
          turns: move.turns === 2 ? 2 : -move.turns
        };
      });
    } else {
      sequenceToApply = sequenceWithSimpleMoves;
    }
    this.cornerPermutation = Array.from({ length: 8 }, (_, i) => i);
    this.cornerOrientation = Array(8).fill(0);
    this.edgePermutation = Array.from({ length: 12 }, (_, i) => i);
    this.edgeOrientation = Array(12).fill(0);
    for (const move of sequenceToApply) {
      this._applySingleMove(move.face, move.turns);
    }
    const finalCatch24Code = this._generateCatch24CodeFromState();
    if (!finalCatch24Code) {
      return { success: false, error: "Internal error: Failed to generate code." };
    }
    return this.applyCatch24Code(finalCatch24Code);
  }
  _applySingleMove(face, turns) {
    const moveDef = MOVE_DEFINITIONS[face];
    if (!moveDef)
      return;
    const turnCount = (turns + 4) % 4;
    for (let i = 0;i < turnCount; i++) {
      this._cyclePieces(this.cornerPermutation, moveDef.corners.affected, moveDef.corners.permutation);
      this._cyclePieces(this.cornerOrientation, moveDef.corners.affected, moveDef.corners.permutation);
      if (moveDef.corners.orientationChange) {
        this._updateOrientation(this.cornerOrientation, moveDef.corners.affected, moveDef.corners.orientationChange, 3);
      }
      this._cyclePieces(this.edgePermutation, moveDef.edges.affected, moveDef.edges.permutation);
      this._cyclePieces(this.edgeOrientation, moveDef.edges.affected, moveDef.edges.permutation);
      if (moveDef.edges.orientationChange) {
        this._updateOrientation(this.edgeOrientation, moveDef.edges.affected, moveDef.edges.orientationChange, 2);
      }
    }
  }
  _calculateCornerOrientation(cornerSlotId) {
    const stickerData = this._getCornerSlotStickerData(cornerSlotId);
    if (stickerData.some((s) => s.color === DEFAULT_COLOR)) {
      return "?";
    }
    const udSticker = stickerData.find((s) => s.color === this.faceColors.U || s.color === this.faceColors.D);
    const physicalFaceName = this._getFaceNameOfSticker(udSticker.stickerIndex);
    const slotDefinition = this.pieceDefs.corners[cornerSlotId];
    return slotDefinition.faces.indexOf(physicalFaceName);
  }
  _calculateEdgeOrientation(edgeSlotId, overrideStickerData = null) {
    const stickerData = overrideStickerData ? overrideStickerData : this._getEdgeSlotStickerData(edgeSlotId);
    const currentColors = stickerData.map((s) => s.color).sort();
    const pieceDefinition = this.pieceDefs.edges.find((def) => {
      const defColors = def.faces.map((f) => this.faceColors[f]).sort();
      return defColors.length === 2 && defColors.every((val, index) => val === currentColors[index]);
    });
    const canonicalFaces = pieceDefinition.faces;
    const isUDPiece = canonicalFaces.includes("U") || canonicalFaces.includes("D");
    const refColor = isUDPiece ? canonicalFaces.includes("U") ? this.faceColors.U : this.faceColors.D : this.faceColors[canonicalFaces[0]];
    const refSticker = stickerData.find((s) => s.color === refColor);
    const physicalFaceName = this._getFaceNameOfSticker(refSticker.stickerIndex);
    if (edgeSlotId <= 7) {
      const isStickerOnUorDFace = physicalFaceName === "U" || physicalFaceName === "D";
      return isStickerOnUorDFace ? 0 : 1;
    }
    const isStickerOnForBFace = physicalFaceName === "F" || physicalFaceName === "B";
    return isStickerOnForBFace ? 0 : 1;
  }
  _calculatePermutationParity(permArray) {
    const n = permArray.length;
    let inversions = 0;
    for (let i = n - 1;i > 0; i--) {
      for (let j = i - 1;j >= 0; j--) {
        if (permArray[j] > permArray[i]) {
          inversions++;
        }
      }
    }
    return inversions % 2;
  }
  _checkFaceFullyAndCorrectlyColored(faceName) {
    const targetColor = this.faceColors[faceName];
    for (const cornerDef of this.pieceDefs.corners) {
      const faceIndexInDef = cornerDef.faces.indexOf(faceName);
      if (faceIndexInDef !== -1) {
        const stickerIx = cornerDef.refInd[faceIndexInDef];
        if (this.stickersColor[stickerIx] !== targetColor)
          return false;
      }
    }
    for (const edgeDef of this.pieceDefs.edges) {
      const faceIndexInDef = edgeDef.faces.indexOf(faceName);
      if (faceIndexInDef !== -1) {
        const stickerGlobalIndex = edgeDef.refInd[faceIndexInDef];
        if (this.stickersColor[stickerGlobalIndex] !== targetColor)
          return false;
      }
    }
    return true;
  }
  _clearAssignmentSlot(stickerIndex) {
    const pieceInfo = this._getPieceInfoByStickerIndex(stickerIndex);
    const pieceTypePrefix = `${pieceInfo.type}_`;
    for (const defKey in this.definitionAssignments) {
      if (this.definitionAssignments[defKey] === pieceInfo.id && defKey.startsWith(pieceTypePrefix)) {
        const keyToDelete = defKey;
        delete this.definitionAssignments[keyToDelete];
        return;
      }
    }
  }
  _cyclePieces(array, affected, map) {
    const temp = affected.map((index) => array[index]);
    for (let i = 0;i < map.length; i++) {
      array[affected[map[i]]] = temp[i];
    }
  }
  _decodePreliminaryCode(preliminaryCode) {
    const corners = [];
    const edges = [];
    const usedCornerDefs = new Set;
    const usedEdgeDefs = new Set;
    for (let i = 0;i < 7; i++) {
      const value = BASE24_CHARS.indexOf(preliminaryCode[i]);
      const pieceDefId = Math.floor(value / 3);
      if (usedCornerDefs.has(pieceDefId))
        return { success: false, error: `Error: Corner element c${pieceDefId} is used twice.` };
      usedCornerDefs.add(pieceDefId);
      corners.push({ pieceDefId, orientation: value % 3, physicalSlotId: i + 1 });
    }
    for (let i = 0;i < 11; i++) {
      const value = BASE24_CHARS.indexOf(preliminaryCode[i + 7], 25);
      const pieceDefId = Math.floor((value - 25) / 2);
      if (usedEdgeDefs.has(pieceDefId))
        return { success: false, error: `Error: Edge element e${pieceDefId} is used twice.` };
      usedEdgeDefs.add(pieceDefId);
      edges.push({ pieceDefId, orientation: (value - 25) % 2, physicalSlotId: i });
    }
    return { success: true, corners, edges };
  }
  _deduceAndCompleteCorner(physicalSlotID) {
    let colorChanged = false;
    let assignmentChanged = false;
    const cornerStickerData = this._getCornerSlotStickerData(physicalSlotID);
    const coloredStickers = cornerStickerData.filter((s) => s.color !== DEFAULT_COLOR);
    if (coloredStickers.length === 2) {
      const twoKnownColorsInfo = coloredStickers.map((s) => ({
        color: s.color,
        faceIndexOfSlot: s.faceIndexOfSlot
      }));
      const assignedCornerDefID = this._getAssignedCornerDefID_fromTwoColors(physicalSlotID, twoKnownColorsInfo);
      if (assignedCornerDefID !== null) {
        const winningDef = this.pieceDefs.corners[assignedCornerDefID];
        const winningDefKey = `corner_${winningDef.id}`;
        this.definitionAssignments[winningDefKey] = physicalSlotID;
        assignmentChanged = true;
        const uncoloredSticker = cornerStickerData.find((s) => s.color === DEFAULT_COLOR);
        if (uncoloredSticker) {
          const knownColorsArr = coloredStickers.map((s) => s.color);
          const winningDefCanonColors = winningDef.faces.map((fn) => this.faceColors[fn]);
          const thirdDeducedColor = winningDefCanonColors.find((c) => !knownColorsArr.includes(c));
          if (thirdDeducedColor) {
            let countForThirdColor = 0;
            for (let i = 0;i < this.stickersColor.length; i++) {
              if (this.stickersColor[i] === thirdDeducedColor)
                countForThirdColor++;
            }
            this.setStickerColor(uncoloredSticker.stickerIndex, thirdDeducedColor);
            colorChanged = true;
          }
        }
      }
    }
    return { colorChanged, assignmentChanged };
  }
  deduceAndSetSolvedStateFromUL() {
    const faceUpIsCorrect = this._checkFaceFullyAndCorrectlyColored("U");
    if (faceUpIsCorrect) {
      const faceLeftIsCorrect = this._checkFaceFullyAndCorrectlyColored("L");
      if (faceLeftIsCorrect) {
        this._setAllStickersToSolvedState();
        return true;
      }
    }
    return false;
  }
  _determineMissingPieces(knownCorners, knownEdges) {
    const assignedCornerDefs = new Set(knownCorners.map((c) => c.pieceDefId));
    let c0_defId = -1;
    for (let i = 0;i < 8; i++) {
      if (!assignedCornerDefs.has(i)) {
        c0_defId = i;
        break;
      }
    }
    const assignedEdgeDefs = new Set(knownEdges.map((e) => e.pieceDefId));
    let e11_defId = -1;
    for (let i = 0;i < 12; i++) {
      if (!assignedEdgeDefs.has(i)) {
        e11_defId = i;
        break;
      }
    }
    const sumCornerOri = knownCorners.reduce((sum, c) => sum + c.orientation, 0);
    const c0_ori = (3 - sumCornerOri % 3) % 3;
    const sumEdgeOri = knownEdges.reduce((sum, e) => sum + e.orientation, 0);
    const e11_ori = (2 - sumEdgeOri % 2) % 2;
    if (c0_defId === -1 || e11_defId === -1)
      return null;
    return {
      c0_data: { pieceDefId: c0_defId, orientation: c0_ori, physicalSlotId: 0 },
      e11_data: { pieceDefId: e11_defId, orientation: e11_ori, physicalSlotId: 11 }
    };
  }
  _generateCatch24CodeFromState() {
    const preliminaryCodeChars = new Array(18).fill("-");
    for (let slotId = 1;slotId < 8; slotId++) {
      const pieceId = this.cornerPermutation[slotId];
      const ori = this.cornerOrientation[slotId];
      const value = pieceId * 3 + ori;
      preliminaryCodeChars[slotId - 1] = BASE24_CHARS[value];
    }
    for (let slotId = 0;slotId < 11; slotId++) {
      const pieceId = this.edgePermutation[slotId];
      const ori = this.edgeOrientation[slotId];
      const value = 25 + pieceId * 2 + ori;
      preliminaryCodeChars[slotId + 7] = BASE24_CHARS[value];
    }
    const preliminaryCode = preliminaryCodeChars.join("");
    let finalCode = "";
    for (let i = 0;i < 18; i++) {
      finalCode += CATCH24_MULT_TABLE.get(preliminaryCode[i])[INVERSE[i]];
    }
    return finalCode;
  }
  generateCodeCatch24() {
    const PLACEHOLDER_CHAR = "-";
    const FINAL_LENGTH = 18;
    const cornerPermMap = new Array(8).fill(-1);
    const edgePermMap = new Array(12).fill(-1);
    for (const defKey in this.definitionAssignments) {
      const assignedSlotId = this.definitionAssignments[defKey];
      const defId = Number.parseInt(defKey.split("_")[1], 10);
      if (defKey.startsWith("corner_")) {
        cornerPermMap[assignedSlotId] = defId;
      } else if (defKey.startsWith("edge_")) {
        edgePermMap[assignedSlotId] = defId;
      }
    }
    const resultCodeChars = new Array(FINAL_LENGTH).fill(PLACEHOLDER_CHAR);
    let codeIndex = 0;
    for (let slotId = 1;slotId < 8; slotId++) {
      const pieceId = cornerPermMap[slotId];
      if (pieceId !== -1) {
        const ori = this._calculateCornerOrientation(slotId);
        const value = pieceId * 3 + ori;
        resultCodeChars[codeIndex] = BASE24_CHARS[value];
      }
      codeIndex++;
    }
    for (let slotId = 0;slotId < 11; slotId++) {
      const pieceId = edgePermMap[slotId];
      if (pieceId !== -1) {
        const ori = this._calculateEdgeOrientation(slotId);
        const value = pieceId * 2 + ori + 25;
        resultCodeChars[codeIndex] = BASE24_CHARS[value];
      }
      codeIndex++;
    }
    const preliminaryCode = resultCodeChars.join("");
    if (preliminaryCode.includes(PLACEHOLDER_CHAR) || preliminaryCode.includes("?")) {
      return preliminaryCode;
    }
    let finalCatch24Code = "";
    for (let i = 0;i < 18; i++) {
      finalCatch24Code += CATCH24_MULT_TABLE.get(preliminaryCode[i])[INVERSE[i]];
    }
    return finalCatch24Code;
  }
  _handleEdgeIdentificationOnUserMove(currentStickerIndex) {
    const pieceInfo = this._getPieceInfoByStickerIndex(currentStickerIndex);
    const physicalSlotID = pieceInfo.id;
    const slotDef = this.pieceDefs.edges[physicalSlotID];
    const stickerIndex1_onSlot = slotDef.refInd[0];
    const stickerIndex2_onSlot = slotDef.refInd[1];
    const color1_onSlot = this.stickersColor[stickerIndex1_onSlot];
    const color2_onSlot = this.stickersColor[stickerIndex2_onSlot];
    if (color1_onSlot === DEFAULT_COLOR || color2_onSlot === DEFAULT_COLOR)
      return false;
    let assignedEdgeDef = null;
    for (const candDef of this.pieceDefs.edges) {
      const candDefCanonicalColors = candDef.faces.map((faceName) => this.faceColors[faceName]);
      if (candDefCanonicalColors.includes(color1_onSlot) && candDefCanonicalColors.includes(color2_onSlot)) {
        const candDefKey = `edge_${candDef.id}`;
        let isCandDefAvailable = true;
        if (Object.prototype.hasOwnProperty.call(this.definitionAssignments, candDefKey) && this.definitionAssignments[candDefKey] !== physicalSlotID) {
          isCandDefAvailable = false;
        }
        if (isCandDefAvailable) {
          assignedEdgeDef = candDef;
          break;
        }
      }
    }
    if (assignedEdgeDef) {
      const assignedEdgeDefKey = `edge_${assignedEdgeDef.id}`;
      this.definitionAssignments[assignedEdgeDefKey] = physicalSlotID;
      return true;
    }
  }
  _identifyAndAssignEdge(physicalSlotID) {
    const slotDef = this.pieceDefs.edges[physicalSlotID];
    const stickerIndex1_onSlot = slotDef.refInd[0];
    const stickerIndex2_onSlot = slotDef.refInd[1];
    const color1_onSlot = this.stickersColor[stickerIndex1_onSlot];
    const color2_onSlot = this.stickersColor[stickerIndex2_onSlot];
    if (color1_onSlot === DEFAULT_COLOR || color2_onSlot === DEFAULT_COLOR) {
      return false;
    }
    if (color1_onSlot === color2_onSlot) {
      return false;
    }
    let assignedEdgeDef = null;
    for (const candDef of this.pieceDefs.edges) {
      const candDefCanonicalColors = candDef.faces.map((faceName) => this.faceColors[faceName]);
      if (candDefCanonicalColors.includes(color1_onSlot) && candDefCanonicalColors.includes(color2_onSlot)) {
        const candDefKey = `edge_${candDef.id}`;
        let isCandDefAvailable = true;
        if (Object.prototype.hasOwnProperty.call(this.definitionAssignments, candDefKey) && this.definitionAssignments[candDefKey] !== physicalSlotID) {
          isCandDefAvailable = false;
        }
        if (isCandDefAvailable) {
          assignedEdgeDef = candDef;
          break;
        }
      }
    }
    if (assignedEdgeDef) {
      const assignedEdgeDefKey = `edge_${assignedEdgeDef.id}`;
      let assignmentActuallyChanged = false;
      for (const keyInAssignments in this.definitionAssignments) {
        if (this.definitionAssignments[keyInAssignments] === physicalSlotID && keyInAssignments.startsWith("edge_") && keyInAssignments !== assignedEdgeDefKey) {
          delete this.definitionAssignments[keyInAssignments];
          assignmentActuallyChanged = true;
        }
      }
      if (this.definitionAssignments[assignedEdgeDefKey] !== undefined && this.definitionAssignments[assignedEdgeDefKey] !== physicalSlotID) {
        delete this.definitionAssignments[assignedEdgeDefKey];
        assignmentActuallyChanged = true;
      }
      if (this.definitionAssignments[assignedEdgeDefKey] !== physicalSlotID) {
        this.definitionAssignments[assignedEdgeDefKey] = physicalSlotID;
        assignmentActuallyChanged = true;
      }
      if (assignmentActuallyChanged) {
        return true;
      }
    }
    return false;
  }
  _paintSlotFromData(physicalSlotId, pieceType, pieceDefId, orientation) {
    const pieceDefsArray = pieceType === "corner" ? this.pieceDefs.corners : this.pieceDefs.edges;
    const pieceToPlace = pieceDefsArray.find((p) => p.id === pieceDefId);
    const targetSlot = pieceDefsArray.find((p) => p.id === physicalSlotId);
    if (!pieceToPlace || !targetSlot)
      return;
    const canonicalColors = pieceToPlace.faces.map((f) => this.faceColors[f]);
    const numStickers = canonicalColors.length;
    for (let i = 0;i < numStickers; i++) {
      const colorToApply = canonicalColors[i];
      const targetStickerSlotIndex = (i + orientation) % numStickers;
      const physicalStickerIndex = targetSlot.refInd[targetStickerSlotIndex];
      this.stickersColor[physicalStickerIndex] = colorToApply;
    }
  }
  _paintStickersFromAssignments() {
    let colorChangedOverall = false;
    for (const defKey in this.definitionAssignments) {
      const physicalSlotID = this.definitionAssignments[defKey];
      const [pieceTypePrefix, defIdStr] = defKey.split("_");
      const defId = Number.parseInt(defIdStr);
      let pieceDef;
      let expectedStickers;
      let pieceTypeStr;
      if (pieceTypePrefix === "corner") {
        pieceDef = this.pieceDefs.corners.find((p) => p.id === defId);
        expectedStickers = 3;
        pieceTypeStr = "corner";
      } else if (pieceTypePrefix === "edge") {
        pieceDef = this.pieceDefs.edges.find((p) => p.id === defId);
        expectedStickers = 2;
        pieceTypeStr = "edge";
      } else
        continue;
      if (!pieceDef)
        continue;
      const slotStickerData = pieceTypeStr === "corner" ? this._getCornerSlotStickerData(physicalSlotID) : this._getEdgeSlotStickerData(physicalSlotID);
      if (!slotStickerData || slotStickerData.length !== expectedStickers)
        continue;
      const coloredStickersOnSlot = slotStickerData.filter((s) => s.color !== DEFAULT_COLOR);
      if (coloredStickersOnSlot.length === expectedStickers)
        continue;
      const canonicalColorsOfAssignedDef = pieceDef.faces.map((f) => this.faceColors[f]);
      const currentColorsOnPhysicalSlot = coloredStickersOnSlot.map((s) => s.color);
      for (const sData of slotStickerData) {
        if (sData.color === DEFAULT_COLOR) {
          let deducedColor = null;
          if (expectedStickers - coloredStickersOnSlot.length === 1) {
            deducedColor = canonicalColorsOfAssignedDef.find((c) => !currentColorsOnPhysicalSlot.includes(c));
          }
          if (deducedColor) {
            let countForDeducedColor = 0;
            for (let i = 0;i < this.stickersColor.length; i++) {
              if (this.stickersColor[i] === deducedColor)
                countForDeducedColor++;
            }
            if (countForDeducedColor < 8) {
              this.setStickerColor(sData.stickerIndex, deducedColor);
              colorChangedOverall = true;
            }
          }
        }
      }
    }
    return colorChangedOverall;
  }
  runFullDeductionCycle() {
    let overallChangeMade = false;
    let stateChangedInOuterLoop;
    let outerLoopPassCount = 0;
    const MAX_OUTER_PASSES = 5;
    do {
      outerLoopPassCount++;
      stateChangedInOuterLoop = false;
      if (this.stickerIndex === 15) {
        const UL = this.deduceAndSetSolvedStateFromUL();
        if (UL) {
          stateChangedInOuterLoop = true;
          return;
        }
      }
      stateChangedInOuterLoop = this._applyIterativeDeductionRules();
      if (stateChangedInOuterLoop) {
        overallChangeMade = true;
      }
    } while (stateChangedInOuterLoop && outerLoopPassCount < MAX_OUTER_PASSES);
    return overallChangeMade;
  }
  runSmartLogic(changedStickerIndex) {
    if (changedStickerIndex < 8 || this.stickersColor[changedStickerIndex] === DEFAULT_COLOR)
      return;
    let anyAutomaticChangeMade = false;
    if (changedStickerIndex % 2 === 0) {
      const pieceInfo = this._getPieceInfoByStickerIndex(changedStickerIndex);
      const physicalSlotID_corner = pieceInfo.id;
      const cornerStickerData = this._getCornerSlotStickerData(physicalSlotID_corner);
      const coloredCornerStickers = cornerStickerData.filter((s) => s.color !== DEFAULT_COLOR);
      if (coloredCornerStickers.length === 2) {
        const twoKnownColorsInfo = coloredCornerStickers.map((s) => ({
          color: s.color,
          faceIndexOfSlot: s.faceIndexOfSlot
        }));
        const assignedCornerDefID = this._getAssignedCornerDefID_fromTwoColors(physicalSlotID_corner, twoKnownColorsInfo);
        if (assignedCornerDefID !== null) {
          const winningDef = this.pieceDefs.corners[assignedCornerDefID];
          const winningDefKey = `corner_${winningDef.id}`;
          let currentAssignmentChanged = false;
          for (const key in this.definitionAssignments) {
            if (this.definitionAssignments[key] === physicalSlotID_corner && key.startsWith("corner_") && key !== winningDefKey) {
              delete this.definitionAssignments[key];
              currentAssignmentChanged = true;
            }
          }
          if (this.definitionAssignments[winningDefKey] !== undefined && this.definitionAssignments[winningDefKey] !== physicalSlotID_corner) {
            delete this.definitionAssignments[winningDefKey];
            currentAssignmentChanged = true;
          }
          if (this.definitionAssignments[winningDefKey] !== physicalSlotID_corner) {
            this.definitionAssignments[winningDefKey] = physicalSlotID_corner;
            currentAssignmentChanged = true;
          }
          if (currentAssignmentChanged)
            anyAutomaticChangeMade = true;
          const uncoloredStickerData = cornerStickerData.find((s) => s.color === DEFAULT_COLOR);
          if (uncoloredStickerData) {
            const knownColors = coloredCornerStickers.map((s) => s.color);
            const winningDefCanonicalColors = winningDef.faces.map((faceName) => this.faceColors[faceName]);
            const thirdColor = winningDefCanonicalColors.find((c) => !knownColors.includes(c));
            if (thirdColor && this.getStickerColor(uncoloredStickerData.stickerIndex) === DEFAULT_COLOR) {
              this.setStickerColor(uncoloredStickerData.stickerIndex, thirdColor);
              anyAutomaticChangeMade = true;
            }
          }
        }
      }
    } else {
      if (this._handleEdgeIdentificationOnUserMove(changedStickerIndex)) {
        anyAutomaticChangeMade = true;
      }
    }
    this.runFullDeductionCycle();
    return anyAutomaticChangeMade;
  }
  _updateOrientation(array, affected, changes, mod) {
    for (let i = 0;i < affected.length; i++) {
      array[affected[i]] = (array[affected[i]] + changes[i]) % mod;
    }
  }
}

// Layout.js
var FACE_LAYOUT_COORDINATES = FACE_LAYOUT;
var STICKER_MARGIN = 1;
var NON_CENTER_CELL = NON_CENTER_FACE;
var canvas;
var ctx;
var m;
var squareSize;
var smallRadius;
var middleRadius;
var largeRadius;
var dimensionsInitialized = false;
function getStickerGeometry(stickerIndex) {
  if (!dimensionsInitialized) {
    console.error("Layout.js: getStickerGeometry called before dimensions were initialized.");
    return null;
  }
  const faceOrderIndex = Math.floor(stickerIndex / 8);
  const localOrderOnFace = stickerIndex % 8;
  const localCoords = NON_CENTER_CELL[localOrderOnFace];
  const localRow = localCoords.row;
  const localCol = localCoords.col;
  const baseFaceCanvasX = FACE_LAYOUT_COORDINATES[faceOrderIndex][0] * m;
  const baseFaceCanvasY = FACE_LAYOUT_COORDINATES[faceOrderIndex][1] * m;
  const stickerCanvasX = baseFaceCanvasX + localCol * squareSize;
  const stickerCanvasY = baseFaceCanvasY + localRow * squareSize;
  const initRow = localRow === 0;
  const finalRow = localRow === 2;
  const initCol = localCol === 0;
  const finalCol = localCol === 2;
  const calculatedRadii = [
    finalRow && finalCol ? middleRadius : initRow || initCol ? smallRadius : largeRadius,
    finalRow && initCol ? middleRadius : initRow || finalCol ? smallRadius : largeRadius,
    initRow && initCol ? middleRadius : finalRow || finalCol ? smallRadius : largeRadius,
    initRow && finalCol ? middleRadius : finalRow || initCol ? smallRadius : largeRadius
  ];
  return {
    x: stickerCanvasX,
    y: stickerCanvasY,
    radii: calculatedRadii
  };
}
function getCenterGeometry(faceName) {
  if (!dimensionsInitialized) {
    console.error("Layout.js: getCenterGeometry called before dimensions were initialized.");
    return null;
  }
  const faceOrderIdx = SIDES.indexOf(faceName);
  if (faceOrderIdx === -1) {
    console.error(`Layout.js: Unknown faceName ${faceName} for getCenterGeometry.`);
    return null;
  }
  const baseFaceCanvasX = FACE_LAYOUT_COORDINATES[faceOrderIdx][0] * m;
  const baseFaceCanvasY = FACE_LAYOUT_COORDINATES[faceOrderIdx][1] * m;
  const centerCanvasX = baseFaceCanvasX + squareSize;
  const centerCanvasY = baseFaceCanvasY + squareSize;
  const calculatedRadii = [largeRadius, largeRadius, largeRadius, largeRadius];
  return {
    x: centerCanvasX,
    y: centerCanvasY,
    radii: calculatedRadii
  };
}
function drawRect(x, y, w, h, calculatedRadii, fillColor, _borderColorUnused, _lineWidthUnused, isActive = false) {
  if (!ctx)
    return;
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(x, y, w, h, calculatedRadii);
  } else {
    ctx.moveTo(x + calculatedRadii[3], y);
    ctx.lineTo(x + w - calculatedRadii[0], y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + calculatedRadii[0]);
    ctx.lineTo(x + w, y + h - calculatedRadii[1]);
    ctx.quadraticCurveTo(x + w, y + h, x + w - calculatedRadii[1], y + h);
    ctx.lineTo(x + calculatedRadii[2], y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - calculatedRadii[2]);
    ctx.lineTo(x, y + calculatedRadii[3]);
    ctx.quadraticCurveTo(x, y, x + calculatedRadii[3], y);
    ctx.closePath();
  }
  ctx.fillStyle = fillColor;
  ctx.fill();
  ctx.strokeStyle = isActive ? "yellow" : "#000000";
  ctx.lineWidth = isActive ? 3 : 1;
  ctx.stroke();
}
function setupLayoutEnvironment(selector, canvasWidthArgument) {
  if (dimensionsInitialized) {
    return;
  }
  const el = document.querySelector(selector);
  if (!el) {
    console.error("Layout.js: Target element for canvas not found:", selector);
    return;
  }
  canvas = document.createElement("canvas");
  el.innerHTML = "";
  el.appendChild(canvas);
  ctx = canvas.getContext("2d");
  if (!ctx) {
    console.error("Layout.js: Failed to get 2D context");
    return;
  }
  const currentCanvasWidth = canvasWidthArgument || 720;
  const m_forHeightCalc = currentCanvasWidth / 4;
  canvas.width = currentCanvasWidth;
  canvas.height = m_forHeightCalc * 3;
  m = Math.min(canvas.width / 4, canvas.height / 3);
  squareSize = Math.floor(m / 3);
  smallRadius = squareSize / 12;
  middleRadius = smallRadius * 1.25;
  largeRadius = smallRadius * 3;
  dimensionsInitialized = true;
}
function drawLayout(cubeState, args) {
  const { activeStickerIndex, drawCatch24Text } = args;
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (const faceName of SIDES) {
    const centerColor = FACE_COLORS[faceName];
    const geometry = getCenterGeometry(faceName);
    if (geometry) {
      drawRect(geometry.x, geometry.y, squareSize - STICKER_MARGIN, squareSize - STICKER_MARGIN, geometry.radii, centerColor, "#000000", 1, false);
    }
  }
  for (let stickerIdx = 0;stickerIdx < 48; stickerIdx++) {
    const geometry = getStickerGeometry(stickerIdx);
    if (!geometry)
      continue;
    const color = cubeState.getStickerColor(stickerIdx);
    const isActive = activeStickerIndex === stickerIdx;
    drawRect(geometry.x, geometry.y, squareSize - STICKER_MARGIN, squareSize - STICKER_MARGIN, geometry.radii, color, "#000000", isActive ? 3 : 1, isActive);
  }
  if (drawCatch24Text) {
    const padding = 20;
    const fontSize = 72;
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#DDDDDD";
    ctx.textAlign = "left";
    const textParts = [
      { text: "Catch-", font: `${fontSize}pt "Brush Script MT", cursive` },
      { text: "2", font: `${fontSize}pt "Academy Engraved LET", serif` },
      { text: "4", font: `${fontSize}pt "Bodoni 72 Oldstyle", serif` }
    ];
    let totalWidth = 0;
    const partWidths = [];
    for (const part of textParts) {
      ctx.font = part.font;
      const metrics = ctx.measureText(part.text);
      partWidths.push(metrics.width);
      totalWidth += metrics.width;
    }
    let currentX = canvas.width - padding - totalWidth;
    const yPos = m * 2 + m / 2.2 + fontSize / 2;
    textParts.forEach((part, index) => {
      ctx.font = part.font;
      ctx.fillText(part.text, currentX, yPos);
      currentX += partWidths[index];
    });
  }
}

// Impasto.js
var CANVAS_WIDTH_CONFIG = 720;
var CUBE_DIMENSION_CONFIG = 3;
var M_FOR_CLICK_DETECTION = CANVAS_WIDTH_CONFIG / 4;
var SQUARE_SIZE_FOR_CLICK_DETECTION = Math.floor(M_FOR_CLICK_DETECTION / CUBE_DIMENSION_CONFIG);
var cubeState = new CubeState;
var currentActiveStickerIndex = 0;
var allStickersAreNonDefault = false;
var shouldDrawCatch24Text = false;
var copyTimeoutId = null;
setupLayoutEnvironment("#cube-container", CANVAS_WIDTH_CONFIG);
var canvasEl = document.querySelector("#cube-container canvas");
var paletteContainer = document.getElementById("color-palette");
var resetButton = document.getElementById("reset-button");
var applyCopyButton = document.getElementById("catch24-button");
var applyInputButton = document.getElementById("apply-input-button");
var codeCatch24output = document.getElementById("position-code");
var positionCodeInput = document.getElementById("catch24-input");
var diagnosticMessage = document.getElementById("diagnostic-message");
var titleHeader = document.getElementById("app-title");
var readmeContainer = document.getElementById("readme-container");
function initializeOrResetCubeState() {
  positionCodeInput.style.color = "";
  positionCodeInput.value = "";
  positionCodeInput.style.fontFamily = '"Times New Roman", ""Times", serif';
  positionCodeInput.style.fontSize = "1em";
  applyInputButton.style.background = "linear-gradient(to right, #8A2BE2 25px, dodgerblue 40px)";
  clearDiagnosticMessage();
  shouldDrawCatch24Text = false;
  cubeState = new CubeState;
  currentActiveStickerIndex = 0;
  updateAndRedrawAll();
}
function handleApplyCode(isSolution) {
  clearDiagnosticMessage();
  const userInput = positionCodeInput.value.trim();
  if (userInput === "")
    return;
  const cleanUserInput = userInput.replace(/\s*↩\s*$/, "");
  const isPotentiallyMoves = /[FBUDLRw'23`>1]/.test(cleanUserInput);
  const isPotentiallyCatch24 = /^[a-x\s-]{18,}$/.test(userInput);
  if (isPotentiallyMoves && !isPotentiallyCatch24) {
    const rotationRegex = /[xyz]/i;
    if (rotationRegex.test(userInput)) {
      setDiagnosticMessage("Error: Rotations of the entire cube (x, y, z) are not supported.");
      return;
    }
    const normalizedSequence = normalizeAndFormatMoveSequence(cleanUserInput);
    if (normalizedSequence === null || normalizedSequence.trim() === "") {
      setDiagnosticMessage("Error: Unable to recognize the move sequence.");
      return;
    }
    const result = cubeState.applyMoveSequence(normalizedSequence, isSolution);
    if (result.success) {
      positionCodeInput.value = normalizedSequence;
      positionCodeInput.style.fontFamily = '"Times New Roman", "Times", serif';
      positionCodeInput.style.color = "lime";
      if (isSolution) {
        positionCodeInput.value = `${normalizedSequence} ↩`;
        applyInputButton.style.background = "#8A2BE2";
        positionCodeInput.focus();
        const len = positionCodeInput.value.length;
        positionCodeInput.selectionStart = positionCodeInput.selectionEnd = len;
      } else {
        applyInputButton.style.background = "linear-gradient(to right, #8A2BE2 25px, dodgerblue 40px)";
      }
      updateAndRedrawAll();
    } else {
      setDiagnosticMessage(result.error);
    }
  } else if (isPotentiallyCatch24) {
    const codeInput = userInput.replace(/\s+/g, "").toLowerCase();
    if (codeInput.length === 18 && /^[a-x]{18}$/.test(codeInput)) {
      const result = cubeState.applyCatch24Code(codeInput);
      if (result.success) {
        applyInputButton.style.background = "dodgerblue";
        positionCodeInput.value = codeInput.split("").join(" ");
        positionCodeInput.style.fontFamily = '"Menlo", "Consolas", monospace';
        positionCodeInput.style.fontSize = "1.1em";
        positionCodeInput.style.color = "lime";
        updateAndRedrawAll();
      } else {
        setDiagnosticMessage(result.error);
      }
    } else {
      setDiagnosticMessage("Error: Catch-24 code must be 18 characters long a-x.");
    }
  } else {
    setDiagnosticMessage("Error: Input not recognized.");
  }
}
function handleCatch24Copy() {
  const codeToCopy = codeCatch24output.value.replace(/\s+/g, "");
  if (codeToCopy) {
    navigator.clipboard.writeText(codeToCopy).then(() => {
      positionCodeInput.value = codeToCopy;
      positionCodeInput.style.fontFamily = '"Menlo", "Consolas", monospace';
      positionCodeInput.style.fontSize = "1.1em";
      positionCodeInput.style.color = "dodgerblue";
      applyInputButton.style.background = "linear-gradient(to right, #8A2BE2 25px, dodgerblue 40px)";
      const originalText = "Copy";
      applyCopyButton.textContent = "Copied";
      applyCopyButton.classList.add("copied");
      if (copyTimeoutId)
        clearTimeout(copyTimeoutId);
      copyTimeoutId = setTimeout(() => {
        applyCopyButton.textContent = originalText;
        applyCopyButton.classList.remove("copied");
      }, 1000);
    }).catch((err) => {
      setDiagnosticMessage("Copy error.");
    });
  }
}
function normalizeAndFormatMoveSequence(input) {
  let cleaned = input.replace(/\s+/g, "");
  cleaned = cleaned.replace(/`/g, "'").replace(/’/g, "'").replace(/3/g, "'").replace(/1/g, "");
  const moveRegex = /[FBUDLR]w?['2]?/g;
  const moves = cleaned.match(moveRegex);
  if (!moves || moves.length === 0)
    return "";
  const moveValues = { "'": -1, 2: 2 };
  const simplifiedMoves = [];
  for (const rawMove of moves) {
    const modifier = rawMove.slice(-1);
    const face = modifier === "'" || modifier === "2" ? rawMove.slice(0, -1) : rawMove;
    const value = moveValues[modifier] || 1;
    const lastMove = simplifiedMoves.length > 0 ? simplifiedMoves[simplifiedMoves.length - 1] : null;
    if (lastMove && lastMove.face === face) {
      lastMove.value += value;
    } else {
      simplifiedMoves.push({ face, value });
    }
  }
  const finalMoves = [];
  for (const move of simplifiedMoves) {
    const netTurns = (move.value % 4 + 4) % 4;
    if (netTurns === 1)
      finalMoves.push(move.face);
    else if (netTurns === 2)
      finalMoves.push(`${move.face}2`);
    else if (netTurns === 3)
      finalMoves.push(`${move.face}'`);
  }
  return finalMoves.join(" ");
}
function updateAndRedrawAll() {
  checkAndUpdateAllStickersNonDefault();
  updateControlsVisibility();
  updatePaletteAndPotentiallyAutoApply();
  updateCatch24Display();
  drawLayout(cubeState, getLayoutArgs());
}
function checkAndUpdateAllStickersNonDefault() {
  allStickersAreNonDefault = cubeState.stickersColor.every((color) => color !== DEFAULT_COLOR);
  return allStickersAreNonDefault;
}
function getLayoutArgs() {
  return {
    activeStickerIndex: allStickersAreNonDefault ? -1 : currentActiveStickerIndex,
    drawCatch24Text: shouldDrawCatch24Text
  };
}
function updateControlsVisibility() {
  const controlsShouldBeVisible = !allStickersAreNonDefault;
  paletteContainer.style.display = controlsShouldBeVisible ? "grid" : "none";
  if (eraserButton) {
    eraserButton.style.display = controlsShouldBeVisible && currentActiveStickerIndex !== 0 ? "inline-block" : "none";
  }
}
function getStickerIndexFromCoords(clickX, clickY, targetCanvasElement) {
  if (!targetCanvasElement || SQUARE_SIZE_FOR_CLICK_DETECTION <= 0)
    return null;
  const rect = targetCanvasElement.getBoundingClientRect();
  const scaleX = targetCanvasElement.width / rect.width;
  const scaleY = targetCanvasElement.height / rect.height;
  const canvasClickX = (clickX - rect.left) * scaleX;
  const canvasClickY = (clickY - rect.top) * scaleY;
  const faceLayoutCoords = FACE_LAYOUT;
  for (let faceOrderIndex = 0;faceOrderIndex < faceLayoutCoords.length; faceOrderIndex++) {
    const [faceGridX, faceGridY] = faceLayoutCoords[faceOrderIndex];
    const faceCanvasX = faceGridX * M_FOR_CLICK_DETECTION;
    const faceCanvasY = faceGridY * M_FOR_CLICK_DETECTION;
    if (canvasClickX >= faceCanvasX && canvasClickX < faceCanvasX + M_FOR_CLICK_DETECTION && canvasClickY >= faceCanvasY && canvasClickY < faceCanvasY + M_FOR_CLICK_DETECTION) {
      const relativeX = canvasClickX - faceCanvasX;
      const relativeY = canvasClickY - faceCanvasY;
      const col = Math.floor(relativeX / SQUARE_SIZE_FOR_CLICK_DETECTION);
      const row = Math.floor(relativeY / SQUARE_SIZE_FOR_CLICK_DETECTION);
      if (row === 1 && col === 1)
        return null;
      const localOrderOnFace = NON_CENTER_FACE.findIndex((p) => p.row === row && p.col === col);
      if (localOrderOnFace !== -1)
        return faceOrderIndex * 8 + localOrderOnFace;
      return null;
    }
  }
  return null;
}
function handleCanvasClick(event) {
  const clickedStickerIndex = getStickerIndexFromCoords(event.clientX, event.clientY, canvasEl);
  if (clickedStickerIndex === null)
    return;
  const canProceedToModify = allStickersAreNonDefault && clickedStickerIndex < 16 || !allStickersAreNonDefault && clickedStickerIndex < currentActiveStickerIndex;
  if (!canProceedToModify)
    return;
  const wasSolved = allStickersAreNonDefault;
  if (!wasSolved && cubeState.getStickerColor(clickedStickerIndex) === DEFAULT_COLOR) {
    currentActiveStickerIndex = clickedStickerIndex;
    updateAndRedrawAll();
  } else {
    currentActiveStickerIndex = clickedStickerIndex;
    allStickersAreNonDefault = false;
    clearDiagnosticMessage();
    for (let i = currentActiveStickerIndex;i < TOTAL_STIKERS; i++) {
      if (cubeState.getStickerColor(i) !== DEFAULT_COLOR) {
        cubeState.setStickerColor(i, DEFAULT_COLOR);
      }
    }
    updateAndRedrawAll();
  }
}
function handleBackspaceButtonClick() {
  if (currentActiveStickerIndex > 0) {
    clearDiagnosticMessage();
    currentActiveStickerIndex--;
    allStickersAreNonDefault = false;
    for (let i = currentActiveStickerIndex;i < TOTAL_STIKERS; i++) {
      if (cubeState.getStickerColor(i) !== DEFAULT_COLOR) {
        cubeState.setStickerColor(i, DEFAULT_COLOR);
      }
    }
    updateAndRedrawAll();
  }
}
function applyColorToSticker(colorToApply) {
  if (!colorToApply || currentActiveStickerIndex >= TOTAL_STIKERS)
    return;
  const stickerToProcess = currentActiveStickerIndex;
  cubeState.setStickerColor(stickerToProcess, colorToApply);
  const deductionsMade = cubeState.runSmartLogic(stickerToProcess);
  checkAndUpdateAllStickersNonDefault();
  if (!allStickersAreNonDefault || deductionsMade) {
    let nextIdx = stickerToProcess;
    if (cubeState.getStickerColor(nextIdx) !== DEFAULT_COLOR) {
      nextIdx = stickerToProcess + 1;
    }
    if (nextIdx < TOTAL_STIKERS) {
      const initialSearchIdx = nextIdx;
      while (cubeState.getStickerColor(nextIdx) !== DEFAULT_COLOR) {
        nextIdx = nextIdx + 1;
        if (nextIdx >= TOTAL_STIKERS || nextIdx === initialSearchIdx) {
          checkAndUpdateAllStickersNonDefault();
          break;
        }
      }
    }
    currentActiveStickerIndex = nextIdx >= TOTAL_STIKERS ? -1 : nextIdx;
  }
  updateAndRedrawAll();
}
function updatePaletteAndPotentiallyAutoApply() {
  if (allStickersAreNonDefault)
    return;
  const validColors = cubeState.getValidColorsForSticker(currentActiveStickerIndex);
  const allPaletteButtons = paletteContainer.querySelectorAll("button.color-button");
  for (const button of allPaletteButtons) {
    const color = button.dataset.color;
    const isVisible = validColors.includes(color);
    button.style.visibility = isVisible ? "visible" : "hidden";
    button.disabled = !isVisible;
  }
  if (validColors.length === 0 && currentActiveStickerIndex < 48) {
    setDiagnosticMessage("Error: Invalid cube position!");
  }
  if (validColors.length === 1 && !cubeState.justErased) {
    applyColorToSticker(validColors[0]);
  }
}
function handleColorClick(event) {
  const clickedButton = event.target.closest(".color-button");
  if (!clickedButton || clickedButton.disabled)
    return;
  const selectedColor = clickedButton.dataset.color;
  if (cubeState)
    cubeState.justErased = false;
  applyColorToSticker(selectedColor);
}
function updateCatch24Display() {
  const code = cubeState.generateCodeCatch24();
  const isComplete = code && !code.includes("-");
  codeCatch24output.value = code.split("").join(" ");
  applyCopyButton.disabled = !isComplete;
  if (isComplete) {
    codeCatch24output.style.color = "dodgerblue";
    shouldDrawCatch24Text = true;
  } else {
    codeCatch24output.style.color = "";
    shouldDrawCatch24Text = false;
  }
}
function setDiagnosticMessage(message) {
  if (diagnosticMessage)
    diagnosticMessage.textContent = message;
}
function clearDiagnosticMessage() {
  if (diagnosticMessage)
    diagnosticMessage.textContent = "";
}
var eraserButton = document.createElement("button");
eraserButton.id = "backspace-button";
eraserButton.textContent = " ⌫ ";
eraserButton.title = "Backspace";
document.getElementById("left-controls").appendChild(eraserButton);
paletteContainer.innerHTML = "";
var paletteButtonSize = Math.floor(M_FOR_CLICK_DETECTION / CUBE_DIMENSION_CONFIG);
paletteContainer.style.gridTemplateColumns = `repeat(${CUBE_DIMENSION_CONFIG}, ${paletteButtonSize}px)`;
for (const colorValue of Object.values(FACE_COLORS)) {
  if (colorValue === DEFAULT_COLOR)
    continue;
  const btn = document.createElement("button");
  btn.style.backgroundColor = colorValue;
  btn.dataset.color = colorValue;
  btn.classList.add("color-button");
  btn.style.width = `${paletteButtonSize}px`;
  btn.style.height = `${paletteButtonSize}px`;
  btn.style.borderRadius = `${Math.max(1, Math.floor(paletteButtonSize / 6))}px`;
  btn.addEventListener("click", handleColorClick);
  paletteContainer.appendChild(btn);
}
resetButton.addEventListener("click", initializeOrResetCubeState);
canvasEl.addEventListener("click", handleCanvasClick);
eraserButton.addEventListener("click", handleBackspaceButtonClick);
applyCopyButton.addEventListener("click", handleCatch24Copy);
applyInputButton.addEventListener("click", (event) => {
  if (event.target.closest(".hotzone-icon")) {
    handleApplyCode(true);
  } else {
    handleApplyCode(false);
  }
});
positionCodeInput.addEventListener("paste", (event) => {
  positionCodeInput.style.color = "";
  clearDiagnosticMessage();
  event.preventDefault();
  const pastedText = (event.clipboardData || window.Clipboard).getData("text/plain");
  const input = event.target;
  input.value = input.value.substring(0, input.selectionStart) + pastedText + input.value.substring(input.selectionEnd);
});
titleHeader.addEventListener("click", async () => {
  if (readmeContainer.style.display === "block") {
    readmeContainer.style.display = "none";
    return;
  }
  if (readmeContainer.innerHTML.trim() !== "") {
    readmeContainer.style.display = "block";
    return;
  }
  try {
    const response = await fetch("./readme.html");
    if (!response.ok) {
      throw new Error("Failed to load readme.html");
    }
    const htmlContent = await response.text();
    readmeContainer.innerHTML = htmlContent;
    readmeContainer.style.display = "block";
  } catch (error) {
    console.error("Error:", error);
    readmeContainer.innerHTML = "Failed to load file content.";
    readmeContainer.style.display = "block";
  }
});
initializeOrResetCubeState();

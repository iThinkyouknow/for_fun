let ticBoxes = [...ticTacToeGrid.children];
const COUNT_PER_ROW = 3;
const O = 'O';
const X = 'X';
const TIE = 'TIE';

const isFilled = (text) => text === O || text === X;

const getIndex = (x, y) => {
    return x + y * COUNT_PER_ROW;
};

const instructionTexts = {
    [O]: 'Give me 1 sec, LITERALLY',
    [X]: 'It\'s your turn~ Hurry up already!' 
};

const victoryTexts = {
    [O]: 'I WIN, LOSER! to think you went first...',
    [X]: 'Yea yea, big deal, you win, get over yourself',
    [TIE]: 'It\'s a tie but since you went first, and you are so bad, it is MY WIN, LOSER!'
}

const setInstructionText = (victoryPlayer, player) => {
    if (victoryPlayer !== '') {
        instructionText.innerText = victoryTexts[victoryPlayer];
    
    } else if (player) {
        instructionText.innerText = instructionTexts[player];
    }
    
};

const getDiagonalVictoryPatterns = (rowCount) => {
    let downRight = [];
    let downLeft = [];

    for (let i = 0; i < rowCount; i++) {
        downRight.push([i, i]);
        downLeft.push([rowCount - 1 - i, i]);
    }

    return [downRight, downLeft];
};

const diagonalVictoryPatterns = getDiagonalVictoryPatterns(COUNT_PER_ROW);


const victory = (board) => {
    // x victory
    // horizontal
    
    for (let y = 0; y < COUNT_PER_ROW; y++) {
        const index = getIndex(0, y);
        let firstValue = board[index].innerText;
        if (firstValue === '') {
            continue;
        }
        let victory = true;
        for (let x = 1; x < COUNT_PER_ROW; x++) {
            const index = getIndex(x, y);
            const value = board[index].innerText;
            if (value !== firstValue) {
                victory = false;
                break;
            }
        }
        if (victory === true) {
            return firstValue;
        }
    }

    // vertical
    for (let x = 0; x < COUNT_PER_ROW; x++) {
        const index = getIndex(x, 0);
        let firstValue = board[index].innerText;
        if (firstValue === '') {
            continue;
        }
        let victory = true;
        for (let y = 1; y < COUNT_PER_ROW; y++) {
            const index = getIndex(x, y);
            const value = board[index].innerText;
            if (value !== firstValue) {
                victory = false;
                break;
            }
        }
        if (victory === true) {
            return firstValue;
        }
    }
    
    // diagonal
    let diagValue = '';
    const result = diagonalVictoryPatterns.some((combi) => {
        let firstCombi = combi[0];
        let firstIndex = getIndex(firstCombi[0], firstCombi[1]);
        let firstValue = board[firstIndex].innerText;
        if (firstValue === '') return false;
        diagValue = firstValue;
        return combi.every((indices) => {
            let index = getIndex(indices[0], indices[1]);
            let value = board[index].innerText;
            return value === firstValue;
        });
    });

    if (result === true) {
        return diagValue || '';
    }

    if (board.every((ticBox) => {
        return isFilled(ticBox.innerText)
    })) {
        return TIE
    }

    return '';
};

const scores = {
    [O]: 10,
    [X]: -10,
    [TIE]: 0
}
// let count = 1;
const minimax = (board, depth, alpha, beta, isMaximizing = true) => {
    // console.log(++count);
    const victor = victory(board);
    if (victor !== '') {
        return [scores[victor], NaN];
    }
    
    let bestScore = isMaximizing === true
        ? -Infinity 
        : Infinity;

    let currPlayer = isMaximizing === true
        ? O
        : X;

    let bestMoveIndex = NaN;
    for (let y = 0; y < COUNT_PER_ROW; y++) {
        for (let x = 0; x < COUNT_PER_ROW; x++) {

            let index = getIndex(x, y);
            if (board[index].innerText !== '') continue;

            board[index].innerText = currPlayer;
            let [score] = minimax(board, depth + 1, alpha, beta, !isMaximizing);
            
            board[index].innerText = '';
            
            if (isMaximizing === true && score > bestScore ||
                isMaximizing === false && score < bestScore) {
                bestScore = score;
                bestMoveIndex = index;
            }

            // alpha-beta pruning
            if (isMaximizing === true) {
                alpha = Math.max(alpha, score);
            } else if (isMaximizing !== true) {
                beta = Math.min(beta, score);
            }

            if (beta <= alpha) {
                break;
            }
        }

        if (beta <= alpha) {
            break;
        }
    }

    return [bestScore, bestMoveIndex];
    
};

const oTurn = () => {
    // count = 1;
    let board = ticBoxes.map((ticBox) => ({ innerText: ticBox.innerText || ''}));
    let [_, bestMoveIndex] = minimax(board, 0, -Infinity, Infinity, true);
    // console.log(count)
    let current = ticBoxes[bestMoveIndex];
    current.innerText = O;
    current.classList.add('o');
    current.classList.add('rotate');
    current.classList.add('rotate-backwards');
    let victor = victory(ticBoxes);
    if (!victor) {
        setInstructionText('', X);
        xTurn();
    } else {
        setInstructionText(victor, '')
    }
    
};

const onMouseUpX = (e) => {
    e.target.innerText = X;
    e.target.classList.add('x');
    e.target.classList.add('rotate');
    ticBoxes.forEach((ticBox) => {
        ticBox.removeEventListener('mouseup', onMouseUpX);
    });
    let victor = victory(ticBoxes);
    if (!victor) {
        setInstructionText('', O);
        setTimeout(oTurn, 800);
        // oTurn();
    } else {
        setInstructionText(victor, '')
    }
    
};

const xTurn = () => {
    ticBoxes.forEach((ticBox, i) => {
        if (isFilled(ticBox.innerText) === true) return;
        ticBox.addEventListener('mouseup', onMouseUpX);
    });
};

xTurn();

resetBtn.addEventListener('mouseup', () => {
    ticBoxes.forEach(ticBox => {
        ticBox.innerText = '';
        ticBox.classList.remove('x');
        ticBox.classList.remove('o');
        ticBox.classList.remove('rotate');
        ticBox.classList.remove('rotate-backwards');
    });
    setInstructionText('', X);
    xTurn();
});

// todo: alpha beta pruning



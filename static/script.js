document.addEventListener('DOMContentLoaded', () => {
  const trueCandidateNameInput = document.getElementById('trueCandidate');
  const falseCandidateNameInput = document.getElementById('falseCandidate');
  const candidateInputsCollection =
    document.querySelectorAll('.candidateInput');
  const boxes = document.querySelectorAll('.marker-box');
  const trueElem = document.getElementById('true');
  const falseElem = document.getElementById('false');
  const undecidedElem = document.getElementById('undecided');
  const clearSelectionsBtn = document.getElementById('clear-selections-btn');
  let tallyData = [0, 0, 13];
  const debounceTime = 25;
  let isPainting = false;

  const selectionDataArr = [
    {
      textColor: '#007AFF',
      color: '#ffffff',
      idx: 0,
      for: 2,
      name: 'Undecided',
    },
    {
      textColor: '#ffffff',
      color: '#1565C0',
      idx: 1,
      for: 0,
      name: 'Certainly True',
      candidateName: getCandidate(true),
    },
    {
      textColor: '#02121C',
      color: '#42A5F5',
      idx: 2,
      for: undefined,
      name: 'Likely True',
    },
    {
      textColor: '#044268',
      color: '#BBDEFB',
      idx: 3,
      for: undefined,
      name: 'Leans True',
    },
    {
      textColor: '#ffffff',
      color: '#D32F2F',
      idx: 4,
      for: 1,
      name: 'Certainly False',
      candidateName: getCandidate(false),
    },
    {
      textColor: '#000000',
      color: '#EF5350',
      idx: 5,
      for: undefined,
      name: 'Likely False',
    },
    {
      textColor: '#682A23',
      color: '#FFCDD2',
      idx: 6,
      for: undefined,
      name: 'Leans False',
    },
  ];

  boxes.forEach((elem) => {
    elem.addEventListener('click', handleClickAndTallyOfAllKeys);
  });

  function handleClickAndTallyOfAllKeys(evt) {
    let newDataObj = getDataObject(
      evt.target.getAttribute('data-shade'),
      selectionDataArr
    );

    adjustTallyData(newDataObj);
    debouncePaint(this, newDataObj);

    if (clearSelectionsBtn.disabled === true) {
      clearSelectionsBtn.disabled = false;
    }
  }

  candidateInputsCollection.forEach((elem) => {
    elem.addEventListener('keyup', handleKeyUpForCandidateInputs);
  });

  function handleKeyUpForCandidateInputs(evt) {
    if (evt.target.value === '') {
      document.querySelector('.outcome').innerText = evt.target.id + ' Wins';
    } else {
      document.querySelector('.outcome').innerText = evt.target.value + ' Wins';
    }
  }

  function adjustTallyData(newDataObj) {
    switch (newDataObj.for) {
      case 0:
        tallyData[newDataObj.for] += 1;
        tallyData[2]--;
        break;
      case 1:
        tallyData[newDataObj.for] += 1;
        tallyData[0]--;
        break;
      case 2:
        tallyData[newDataObj.for] += 1;
        tallyData[1]--;
        break;
      default:
        break;
    }

    return tallyData;
  }

  function debouncePaint(elem, newDataObj) {
    if (isPainting) {
      return;
    } else {
      isPainting = true;
      let timeoutID = setTimeout(() => {
        paintAndTallyTotals(elem, newDataObj);
        isPainting = false;
        clearTimeout(timeoutID);
      }, debounceTime);
    }
  }

  function addCount(forSide) {
    const total = tallyData.reduce((total, amt) => {
      total += amt;
      return total;
    }, 1);

    if (forSide > 2 || total > 13) {
      console.error('error in adding count for: ', forSide);
    } else {
      tallyData[forSide]++;
    }
  }

  function paintAndTallyTotals(elem, newDataObj) {
    elem.setAttribute('data-shade', newDataObj.idx);
    elem.style.backgroundColor = newDataObj.color;
    elem.style.color = newDataObj.textColor;
    elem.innerText = newDataObj.name;

    for (let i = 0; i < tallyData.length; i++) {
      if (i === 0) trueElem.innerText = tallyData[i];
      if (i === 1) falseElem.innerText = tallyData[i];
      if (i === 2) {
        undecidedElem.innerText = tallyData[i];
      }
    }

    if (tallyData[2] < 8) {
      declareWinner();
    } else if (tallyData[0] >= 8 && tallyData[1] < 6) {
      declareWinner(true);
    } else if (tallyData[1] >= 6 && tallyData[0] < 8) {
      declareWinner(false);
    }
  }

  function getDataObject(currentValue, selectionDataArr) {
    let newShadeVal = Number(currentValue) + 1;
    if (newShadeVal >= selectionDataArr.length) newShadeVal = 0;
    return selectionDataArr[newShadeVal];
  }

  clearSelectionsBtn.addEventListener('click', () => {
    clearSelectionsBtn.disabled = true;

    boxes.forEach((elem) => {
      tallyData = [0, 0, 13];
      let resetDataObj = selectionDataArr[0];
      paintAndTallyTotals(elem, resetDataObj);
    });

    declareWinner();
  });

  function getCurrWinnerDataObj(currTallyDataArr) {
    for (let i = 0; i < currTallyDataArr.length; i++) {
      if (i === 0 && currTallyDataArr[i] >= 8) {
        return selectionDataArr[1];
      } else if (i === 1 && currTallyDataArr[i] >= 4) {
        return selectionDataArr[4];
      } else {
        return selectionDataArr[0];
      }
    }
  }

  function declareWinner(candidateTrue = undefined) {
    let trueCandidateElem = document.getElementById('trueCandidate');
    let falseCandidateElem = document.getElementById('falseCandidate');

    if (candidateTrue === undefined) {
      trueCandidateElem.classList.remove('.loser');
      trueCandidateElem.classList.remove('.winner');

      falseCandidateElem.classList.remove('winner', 'loser');
    }

    if (candidateTrue) {
      trueCandidateElem.classList.remove('loser');
      trueCandidateElem.classList.add('winner');
      trueCandidateElem.value = getCandidate(true);

      falseCandidateElem.classList.remove('winner');
      falseCandidateElem.classList.add('loser');
      falseCandidateElem.value = getCandidate(false);
    } else {
      trueCandidateElem.classList.remove('loser');
      trueCandidateElem.classList.add('winner');
      trueCandidateElem.value = getCandidate(true);

      falseCandidateElem.classList.remove('winner');
      falseCandidateElem.classList.add('loser');
      falseCandidateElem.value = getCandidate(false);
    }
  }

  function getCandidate(candidate) {
    if (candidate) {
      return trueCandidateNameInput.value;
    } else {
      return falseCandidateNameInput.value;
    }
  }
});

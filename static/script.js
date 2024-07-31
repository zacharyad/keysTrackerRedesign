document.addEventListener('DOMContentLoaded', () => {
  const trueCandidateNameInput = document.getElementById('trueCandidate');
  const falseCandidateNameInput = document.getElementById('falseCandidate');
  const candidateInputsCollection =
    document.querySelectorAll('.candidateInput');
  const boxes = document.querySelectorAll('.marker-box');
  const trueElem = document.getElementById('true');
  const falseElem = document.getElementById('false');
  const undecidedElem = document.getElementById('undecided');
  const declaredWinner = document.getElementById('declared-winner');
  const clearSelectionsBtn = document.getElementById('clear-selections-btn');
  const repairSelectionsBtn = document.getElementById('repair-selections-btn');

  let tallyData = [0, 0, 0]; // [true, false, undecided]
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

  //

  const dialog = document.querySelector('dialog');
  const showButton = document.querySelector('.dialogBtn');

  // "Show the dialog" button opens the dialog modally
  showButton.addEventListener('click', () => {
    dialog.showModal();
  });

  dialog.addEventListener('click', () => {
    dialog.close();
  });

  boxes.forEach((elem) => {
    let shadeData = Number(elem.getAttribute('data-shade'));

    if (shadeData === 0) {
      tallyData[2]++;
    } else if (shadeData >= 1 && shadeData <= 3) {
      tallyData[0]++;
    } else if (shadeData > 3) {
      tallyData[1]++;
    } else {
      console.log('somthing is wrong');
    }

    paintAndTallyTotals(elem, selectionDataArr[shadeData]);
    elem.addEventListener('click', handleClickAndTallyOfAllKeys);
  });

  function handleClickAndTallyOfAllKeys(evt) {
    let newDataObj = getAndAdvDataObjectShadeVal(
      evt.target.getAttribute('data-shade'),
      selectionDataArr
    );

    adjustTallyData(newDataObj);
    debouncePaint(this, newDataObj);

    // selections starting again, allow the board to be cleared again
    if (clearSelectionsBtn && clearSelectionsBtn.disabled == true) {
      console.log('clicked ');
      clearSelectionsBtn.disabled = false;
    }

    if (repairSelectionsBtn) {
      console.log('clicked ');
      repairSelectionsBtn.disabled = false;
    }
  }

  candidateInputsCollection.forEach((elem) => {
    elem.addEventListener('keyup', handleKeyUpForCandidateInputs);
  });

  function handleKeyUpForCandidateInputs(evt) {
    console.log(evt);
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

    return undefined;
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

    if (tallyData[0] >= 8 && tallyData[1] < 6) {
      declareWinner(true);
    } else if (tallyData[1] >= 6 && tallyData[0] < 8) {
      declareWinner(false);
    } else {
      declareWinner();
    }
  }

  function getAndAdvDataObjectShadeVal(currentValue, selectionDataArr) {
    let newShadeVal = Number(currentValue) + 1;
    if (newShadeVal >= selectionDataArr.length) newShadeVal = 0;
    return selectionDataArr[newShadeVal];
  }

  if (clearSelectionsBtn) {
    clearSelectionsBtn.addEventListener('click', () => {
      clearSelectionsBtn.disabled = true;

      boxes.forEach((elem) => {
        tallyData = [0, 0, 13];
        let resetDataObj = selectionDataArr[0];
        paintAndTallyTotals(elem, resetDataObj);
      });

      declareWinner();
    });
  }

  if (repairSelectionsBtn) {
    repairSelectionsBtn.addEventListener('click', () => {
      document.location.reload();
    });
  }

  function declareWinner(candidateTrue = undefined) {
    let trueCandidateElem = document.getElementById('trueCandidate');
    let falseCandidateElem = document.getElementById('falseCandidate');

    if (candidateTrue === undefined) {
      resetWinnerLoserElems(trueCandidateElem, falseCandidateElem);
      return;
    } else if (candidateTrue) {
      winnerLoserToggleElemStyles(trueCandidateElem, falseCandidateElem);
    } else {
      winnerLoserToggleElemStyles(falseCandidateElem, trueCandidateElem);
    }
  }

  function resetWinnerLoserElems(trueCandidateElem, falseCandidateElem) {
    trueCandidateElem.classList.remove('loser', 'winner');
    falseCandidateElem.classList.remove('loser', 'winner');
    declaredWinner.innerText = '';
  }

  function winnerLoserToggleElemStyles(wElem, lElem) {
    wElem.classList.add('winner');
    wElem.classList.remove('loser');
    declaredWinner.innerText =
      getCandidate(wElem.id === 'trueCandidate') + ' Wins!';

    lElem.classList.add('loser');
    lElem.classList.remove('winner');
  }

  function getCandidate(candidate) {
    if (candidate) {
      return trueCandidateNameInput.value;
    } else {
      return falseCandidateNameInput.value;
    }
  }
});

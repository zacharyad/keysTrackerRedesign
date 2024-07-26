document.addEventListener('DOMContentLoaded', () => {
  let boxes = document.querySelectorAll('.marker-box');
  let trueElem = document.getElementById('true');
  let falseElem = document.getElementById('false');
  let tallyData = [0, 0, 13];
  const debounceTime = 25;
  let isPainting = false;

  let selectionDataArr = [
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
    elem.addEventListener('click', (e) => {
      let newDataObj = getDataObject(
        e.target.getAttribute('data-shade'),
        selectionDataArr
      );

      adjustTallyData(newDataObj);

      debouncePaint(elem, newDataObj);
    });
  });

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
        paintTally(elem, newDataObj);
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

  function paintTally(elem, newDataObj) {
    elem.setAttribute('data-shade', newDataObj.idx);
    elem.style.backgroundColor = newDataObj.color;
    elem.style.color = newDataObj.textColor;
    elem.innerText = newDataObj.name;

    for (let i = 0; i < tallyData.length; i++) {
      if (i === 0) trueElem.innerText = tallyData[i];
      if (i === 1) falseElem.innerText = tallyData[i];
    }
  }

  function getDataObject(currentValue, selectionDataArr) {
    let newShadeVal = Number(currentValue) + 1;
    if (newShadeVal >= selectionDataArr.length) newShadeVal = 0;
    return selectionDataArr[newShadeVal];
  }
});

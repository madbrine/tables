//Степанов Павел

//JSON c null частями
const fakeData = [
    {
        "id": 6,
        "title": "abla",
        "image": "sad.de/asd.jpg",
        "dist": "AAA"
    },
    {
        "id": null,
        "title": "bbla",
        "dist": "AAA"
    },
    {
        "id": null,
        "title": "cbla",
        "cost": 241,
        "dist": "AAA"
    },
    {
        "id": 4,
        "title": "dbla",
        "cost": 242,
        "dist": "AAA"
    },
    {
        "id": 7,
        "image": "example.com/dasd",
        "title": "ebla",
        "dist": "AAA"
    },
    {
        "id": 5,
        "title": "fbla",
        "cost": 243,
        "dist": "AAA"
    },
    {
        "id": 3,
        "title": "gbla",
        "cost": 244,
        "dist": "AAA",
        "saga": "vinland"
    },
    {
        "id": 8,
        "title": "bla",
        "dist": "AAA"
    },
    {
        "id": null,
        "title": "bla",
        "cost": 245,
        "image": "example.com/dasd"
    },
    {
        "id": 1,
        "title": "bla",
        "cost": 246,
    },
]

const d = document;
//JSON'ы для примера
const JSON_1 = 'https://dummyjson.com/products'
const JSON_2 = 'https://fakestoreapi.com/products'
const JSON_3 = 'http://jsonplaceholder.typicode.com/posts'

//получение с API
const getTable = () => {
    console.log('work')
    fetch(JSON_2)
        .then((response) => response.json())
        .then((data) => buildArray(data));
}

//функция проверки колонки
const existCheck = (array, value) => {
    for(let i = 0; i < array.length; i++) {
        if(value == array[i]) {
            return true;
        }
    }
    return false;
}

let column = [];
let tables = [];
let changingTables;

let firstSortShow;
//форматирование json в двумерный массив
const buildArray = (data) => {
    for (let i = 0; i < data.length; i++) {
      const object = data[i];
      const objectKeys = Object.keys(object);
      for (let y = 0; y < objectKeys.length; y++) {
        const key = objectKeys[y]
        // построение колонок
        if (!existCheck(column, key)) {
          column.push(key);
          tables.push(Array(data.length).fill(null));
        }
      }
    }
    // построение данных в таблицу
    for (let i = 0; i < data.length; i++) {
      const obj = data[i];
      for (let y = 0; y < column.length; y++) {
        const key = column[y];
        if (obj.hasOwnProperty(key)) {
          tables[y][i] = obj[key];
        }
      }
    }
    
    //console.log(column);
    //console.log(tables);

    //рендеринг таблицы
    renderTable(column, tables);
}

//рендеринг табоицы
const renderTable = (column, tables) => {
  changingTables = tables;
  const tableBody = d.getElementById("table-body");
  tableBody.innerHTML = '';
  const columns = d.createElement("div");
  columns.classList.add("line-key-style");
  tableBody.appendChild(columns);
  //верхняя колонка
  for (let i = 0; i < column.length; i++) {
    const line = d.createElement("div");
    line.setAttribute("id", `line-${i}`)
    const columnCell = d.createElement("p");
    columnCell.classList.add("cell-key-style");
    const columnCellData = d.createTextNode(column[i]);
    columnCell.appendChild(columnCellData);
    line.appendChild(columnCell);
    columns.appendChild(line);
  }
  //таблица с данными
  for (let i = 0; i < tables.length; i++) {
    for (let y = 0; y < tables[i].length; y++) {
      const tableCell = d.createElement("p");
      tableCell.classList.add("cell-key-style");
      const tableCellData = d.createTextNode(tables[i][y]);
      tableCell.appendChild(tableCellData);
      const currentColumn = d.getElementById(`line-${i}`);
      currentColumn.appendChild(tableCell);
    }
  }
  if(!firstSortShow) {
    //рендер инпутов сортировки и фильтра
    renderSort() 
    renderFilter()
  }
  firstSortShow = true;
}

//рендеринг инпутов для сортировки
const renderSort = () => {
  const sortBody = d.getElementById("sort-body");

  //селект колонок
  const dropSort = d.createElement("select");
  dropSort.setAttribute("id", "drop-sort");
  dropSort.setAttribute("required","required");
  
  const firstOption = d.createElement("option");
  firstOption.setAttribute("value", "");
  firstOption.appendChild(d.createTextNode("Выберите колонку"));
  dropSort.appendChild(firstOption);
  for(let i = 0; i < column.length; i++) {
    const option = d.createElement("option");
    option.setAttribute("value", `${i}`);
    const optionText = d.createTextNode(column[i]);
    option.appendChild(optionText);
    dropSort.appendChild(option);
  }
  sortBody.appendChild(dropSort);

  const defaultTables = tables;

  //селект параметров
  const sortParams = d.createElement("select");
  sortParams.setAttribute("id", "sort-params");

  const optionDefault = d.createElement("option");
  optionDefault.setAttribute("value", "0");
  optionDefault.appendChild(d.createTextNode("Default"));
  sortParams.appendChild(optionDefault);

  //параметр возрастания
  const optionAsc = d.createElement("option");
  optionAsc.setAttribute("value", "1");
  optionAsc.appendChild(d.createTextNode("Asc"));
  sortParams.appendChild(optionAsc);

  //параметр убывания
  const optionDesc = d.createElement("option");
  optionDesc.setAttribute("value", "2");
  optionDesc.appendChild(d.createTextNode("Desc"));
  sortParams.appendChild(optionDesc);


  sortBody.appendChild(sortParams);
  sortListener()
}



let currentSortColumn = false;
let currentSortParams;
//реагирование на изменения
const sortListener = () => {
  const sortColumnEvent = d.getElementById("drop-sort");
  sortColumnEvent.addEventListener("change", (event) => {
    currentSortColumn = event.target.value;
    //console.log(`column is ${event.target.value}`)
    buildSort(currentSortColumn, currentSortParams);
  });
  const sortParamsEvent = d.getElementById("sort-params");
  sortParamsEvent.addEventListener("change", (event) => {
    currentSortParams = event.target.value;
    //console.log(`PARAM IS = ${event.target.value}`)
    buildSort(currentSortColumn, currentSortParams);
  });
}
//сортировк
const buildSort = (col, par) => {
  //трансформация позиций для удобной сортировка
  const transposed = changingTables[0].map((_, index) => changingTables.map(row => row[index]));
  //console.log(`PARAM IS = ${par}`)
  if(col && par > 0){
    var sorted = transposed.sort(function(a,b){ 
      //console.log(`a = ${a[col]}; b = ${b[col]}; result = ${a[col] > b[col] ? 1 : -1}`)
      if(par == 1) {
        if(a[col] === null && b[col]) return 1
        if(a[col] && b[col] === null) return -1
        return a[col] > b[col] ? 1 : -1; 
      }
      if(par == 2) {
        if(a[col] === null && b[col]) return 1
        if(a[col] && b[col] === null) return -1
        return a[col] < b[col] ? 1 : -1; 
      }

    });
    //обратная трансформация
    const newTables = sorted[0].map((_, index) => sorted.map(row => row[index]));
    //console.log('NEW')
    console.log(newTables)
    renderTable(column, newTables)
  } else {
    renderTable(column, tables)
  }
}
//рендер инрутов фильтра
const renderFilter = () => {
  const filterBody = d.getElementById('filter-body')

  //селект инпута
  const dropFilter = d.createElement("select");
  dropFilter.setAttribute("id", "drop-filter");
  dropFilter.setAttribute("required", "required");

  const firstOption = d.createElement("option");
  firstOption.setAttribute("value", "");
  firstOption.appendChild(d.createTextNode("Выберите колонку"));
  dropFilter.appendChild(firstOption);
  for(let i = 0; i < column.length; i++) {
    const option = d.createElement("option");
    option.setAttribute("value", `${i}`);
    const optionText = d.createTextNode(column[i]);
    option.appendChild(optionText);
    dropFilter.appendChild(option);
  }
  filterBody.appendChild(dropFilter);


  //селект инпута
  const filterParams = d.createElement("select");
  filterParams.setAttribute("id", "filter-params");

  const optionDefault = d.createElement("option");
  optionDefault.setAttribute("value", "0");
  optionDefault.appendChild(d.createTextNode("Default"));
  filterParams.appendChild(optionDefault);

  const optionStringFilter = d.createElement("option");
  optionStringFilter.setAttribute("value", "1");
  optionStringFilter.appendChild(d.createTextNode("By String"));
  filterParams.appendChild(optionStringFilter);

  const optionNumberRange = d.createElement("option");
  optionNumberRange.setAttribute("value", "2");
  optionNumberRange.appendChild(d.createTextNode("Number range"));
  filterParams.appendChild(optionNumberRange);


  filterBody.appendChild(filterParams);

  const inputBody = d.createElement("div");
  inputBody.setAttribute("id", "input-filter");
  inputBody.classList.add("input-container");
  filterBody.appendChild(inputBody);

  const stringFilterBody = d.createElement("div");
  stringFilterBody.setAttribute("id", "string-filter");
  stringFilterBody.classList.add("string-filter-container");
  filterBody.appendChild(stringFilterBody);

  filterListener();
}

///это уже прослушиватель инпутов фильтрации
let currentFilterColumn = false;
let currentFilterParams;
const filterListener = () => {
  const filterColumnEvent = d.getElementById("drop-filter");
  filterColumnEvent.addEventListener("change", (event) => {
    currentFilterColumn = event.target.value;
    console.log(`FILTER COLUMN = ${event.target.value}`);
    buildFilter(currentFilterColumn, currentFilterParams);
  });
  const filterParamsEvent = d.getElementById("filter-params");
  filterParamsEvent.addEventListener("change", (event) => {
    currentFilterParams = event.target.value;
    console.log(`FILTER PARAMS = ${event.target.value}`);
    buildFilter(currentFilterColumn, currentFilterParams);
  });
}

//фильтрация по параметрам
const buildFilter = (col, par) => {
  if(col){
    if(par == 0) {
      //вернуть как было
      removeNumberRangeFilter();
      renderTable(column, changingTables)
    }
    if(par == 1) {
      //фильтрация по символам
      removeNumberRangeFilter();
      //const transposed = changingTables[0].map((_, index) => changingTables.map(row => row[index]));
      buildFilterString(col)
    }
    if(par == 2) {
      //фильтрация по диапозону чисел
      //прослушиватель инпутов диапозона чисел
      renderNumberRangeFilter();
      let currentInputA = null;
      let currentInputB = null;
      const inputAEvent = d.getElementById("input-a");
      inputAEvent.addEventListener("change", (event) => {
        console.log(event.target.value);
        currentInputA = event.target.value;
        numberRangeFilter(col, currentInputA, currentInputB)
      });
      const inputBEvent = d.getElementById("input-b");
      inputBEvent.addEventListener("change", (event) => {
        console.log(event.target.value);
        console.log('second worl')
        currentInputB = event.target.value;
        numberRangeFilter(col, currentInputA, currentInputB)
      });
    }
  }
}

//рендер инпутор фильтрации диапозонов чисел
const renderNumberRangeFilter = () => {
  const filterBody = d.getElementById("filter-body");
  const inputBody = d.getElementById("input-filter");
  inputBody.innerHTML = '';
  const textFrom = d.createElement("p");
  textFrom.appendChild(d.createTextNode("From"));
  inputBody.appendChild(textFrom);

  const inputRangeA = d.createElement("input");
  inputRangeA.setAttribute("id", "input-a");
  inputRangeA.classList.add("input-range");
  inputBody.appendChild(inputRangeA);

  const textTo = d.createElement("p");
  textTo.appendChild(d.createTextNode("To"))
  inputBody.appendChild(textTo);

  const inputRangeB = d.createElement("input");
  inputRangeB.setAttribute("id", "input-b");
  inputRangeB.classList.add("input-range");
  inputBody.appendChild(inputRangeB);

  filterBody.appendChild(inputBody);
}

//удаление при смены параметров
const removeNumberRangeFilter = () => {
  const inputBody = d.getElementById("input-filter");
  inputBody.innerHTML = '';
  const stringInput = d.getElementById("string-filter");
  stringInput.innerHTML = '';
}

//фильтрация по диапозону чисел
const numberRangeFilter = (col, a, b) => {
  if (a !== null && b !== null) { 
    const transposed = changingTables[0].map((_, index) => changingTables.map(row => row[index]));

    
    for (let i = transposed.length - 1; i >= 0; i--) {
      const number = transposed[i][col];
      if (number < Math.min(a, b) || number > Math.max(a, b)) {
        transposed.splice(i, 1);
      }
    }
    const newTables = transposed[0].map((_, index) => transposed.map(row => row[index]))
    console.log(newTables);
    renderTable(column, newTables);
  }
}

//рендер и прослушивание инпута фильтрации по символам
const buildFilterString = (col) => {
  const stringFilterBody = d.getElementById("string-filter");
  stringFilterBody.innerHTML = '';
  
  const inputString = d.createElement("input");
  inputString.setAttribute("id", "input-dtring");
  stringFilterBody.appendChild(inputString);

  let currentString = null;

  inputString.addEventListener("change", (event) => {
    console.log(event.target.value);
    currentString = event.target.value;
    stringFilter(col, currentString);
  });
}

//фильтрация по символам
const stringFilter = (col, str) => {
  console.log('wak waka');
  const transposed = tables[0].map((_, index) => tables.map(row => row[index]));
  const filteredArr = transposed.filter(row => row[col].toString().includes(str));
  const newTables = filteredArr[0].map((_, index) => filteredArr.map(row => row[index]))
  
  renderTable(column, newTables)
}
console.log(tables)


// 月ごとに表示し、今日へジャンプできる日課アプリ

const defaultHabits = [
  "ごはん",
  "お風呂",
  "さんぽ",
  "買い物"
];

const weekdays = [
  "日", "月", "火", "水", "木", "金", "土"
];

const habitsKey = "daily-habits-list";
const recordsKey = "daily-habits-records";

let habits = JSON.parse(
  localStorage.getItem(habitsKey)
);

if (!habits) {
  habits = defaultHabits.map((name, index) => ({
    id: `habit-${index + 1}`,
    name: name
  }));

  saveHabits();
}

if (
  habits.length > 0 &&
  typeof habits[0] === "string"
) {
  habits = habits.map((name, index) => ({
    id: `habit-${index + 1}`,
    name: name
  }));

  saveHabits();
}

let records = JSON.parse(
  localStorage.getItem(recordsKey) || "{}"
);


// 今表示している月
const now = new Date();

let displayedYear = now.getFullYear();
let displayedMonth = now.getMonth();


// HTML要素
const monthTitle =
  document.getElementById("monthTitle");

const tableHeader =
  document.getElementById("habitHeader");

const tableBody =
  document.getElementById("habitTableBody");

const previousMonthButton =
  document.getElementById("previousMonthButton");

const nextMonthButton =
  document.getElementById("nextMonthButton");

const todayButton =
  document.getElementById("todayButton");

const editScreen =
  document.getElementById("editScreen");

const habitEditList =
  document.getElementById("habitEditList");

const editHabitsButton =
  document.getElementById("editHabitsButton");

const addHabitButton =
  document.getElementById("addHabitButton");

const closeEditButton =
  document.getElementById("closeEditButton");

const inputModal =
  document.getElementById("inputModal");

const inputModalTitle =
  document.getElementById("inputModalTitle");

const habitNameInput =
  document.getElementById("habitNameInput");

const cancelInputButton =
  document.getElementById("cancelInputButton");

const saveInputButton =
  document.getElementById("saveInputButton");

const confirmModal =
  document.getElementById("confirmModal");

const confirmMessage =
  document.getElementById("confirmMessage");

const cancelDeleteButton =
  document.getElementById("cancelDeleteButton");

const confirmDeleteButton =
  document.getElementById("confirmDeleteButton");

let editingHabitIndex = null;
let deletingHabitIndex = null;


// 日課を保存
function saveHabits() {
  localStorage.setItem(
    habitsKey,
    JSON.stringify(habits)
  );
}


// 記録を保存
function saveRecords() {
  localStorage.setItem(
    recordsKey,
    JSON.stringify(records)
  );
}


// 日付を「2026-09-18」にする
function dateKey(date) {
  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
}


// 表示中の月を変更
function changeMonth(amount) {

  displayedMonth += amount;

  if (displayedMonth < 0) {
    displayedMonth = 11;
    displayedYear--;
  }

  if (displayedMonth > 11) {
    displayedMonth = 0;
    displayedYear++;
  }

  createTable(false);
}


// 今日の月へ戻る
function goToToday() {

  const today = new Date();

  displayedYear =
    today.getFullYear();

  displayedMonth =
    today.getMonth();

  createTable(true);
}


// 日課表を作る
function createTable(
  scrollToToday = false
) {

  const today = new Date();

  today.setHours(
    12, 0, 0, 0
  );

  const todayKey =
    dateKey(today);


  // 月のタイトル
  monthTitle.textContent =
    `${displayedYear}年${displayedMonth + 1}月`;


  // 日課の見出し
  tableHeader.innerHTML =
    '<th class="date-column">日付</th>';


  habits.forEach(
    (habit) => {

      const th =
        document.createElement("th");

      th.textContent =
        habit.name;

      tableHeader.appendChild(th);
    }
  );


  tableBody.innerHTML = "";


  // 表示月の最終日
  const daysInMonth =
    new Date(
      displayedYear,
      displayedMonth + 1,
      0
    ).getDate();


  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {

    const date =
      new Date(
        displayedYear,
        displayedMonth,
        day,
        12
      );

    const key =
      dateKey(date);


    const row =
      document.createElement("tr");


    // 今日の行
    if (key === todayKey) {

      row.classList.add(
        "today-row"
      );

      row.id =
        "todayRow";
    }


    // 日付＋曜日
    const dateCell =
      document.createElement("td");

    dateCell.className =
      "date-label";


    const dateText =
      document.createElement("span");

    dateText.textContent =
      `${displayedMonth + 1}/${day}`;


    const weekday =
      document.createElement("span");

    weekday.className =
      "weekday";

    weekday.textContent =
      weekdays[date.getDay()];


    dateCell.append(
      dateText,
      weekday
    );


    row.appendChild(
      dateCell
    );


    // 各日課
    habits.forEach(
      (habit, index) => {

        const cell =
          document.createElement("td");

        cell.className =
          `habit-cell habit-${index}`;


        const circle =
          document.createElement("div");

        circle.className =
          "circle";


        const recordId =
          `${key}-${habit.id}`;


        if (records[recordId]) {

          circle.classList.add(
            "done"
          );
        }


        cell.appendChild(
          circle
        );


        cell.addEventListener(
          "click",
          () => {

            if (
              records[recordId]
            ) {

              delete records[
                recordId
              ];

              circle.classList.remove(
                "done"
              );

            } else {

              records[
                recordId
              ] = true;

              circle.classList.add(
                "done"
              );
            }


            saveRecords();
          }
        );


        row.appendChild(
          cell
        );
      }
    );


    tableBody.appendChild(
      row
    );
  }


  // 今日の月を表示したときは今日へ移動
  if (scrollToToday) {

    setTimeout(() => {

      const todayRow =
        document.getElementById(
          "todayRow"
        );


      if (todayRow) {

        todayRow.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }

    }, 100);
  }
}


// 日課編集画面
function createHabitEditList() {

  habitEditList.innerHTML = "";


  habits.forEach(
    (habit, index) => {

      const item =
        document.createElement(
          "div"
        );

      item.className =
        "habit-edit-item";


      const name =
        document.createElement(
          "span"
        );

      name.className =
        "habit-name";

      name.textContent =
        habit.name;


      const renameButton =
        document.createElement(
          "button"
        );

      renameButton.type =
        "button";

      renameButton.textContent =
        "名前変更";


      renameButton.addEventListener(
        "click",
        () => {

          openInputModal(
            "日課の名前を変更",
            habit.name,
            index
          );
        }
      );


      const deleteButton =
        document.createElement(
          "button"
        );

      deleteButton.type =
        "button";

      deleteButton.textContent =
        "削除";

      deleteButton.className =
        "delete-button";


      deleteButton.addEventListener(
        "click",
        () => {

          openDeleteModal(
            index
          );
        }
      );


      item.append(
        name,
        renameButton,
        deleteButton
      );


      habitEditList.appendChild(
        item
      );
    }
  );
}


function openEditScreen() {

  createHabitEditList();

  editScreen.classList.add(
    "is-open"
  );
}


function closeEditScreen() {

  editScreen.classList.remove(
    "is-open"
  );
}


function openInputModal(
  title,
  currentName = "",
  index = null
) {

  editingHabitIndex =
    index;

  inputModalTitle.textContent =
    title;

  habitNameInput.value =
    currentName;


  inputModal.classList.add(
    "is-open"
  );


  setTimeout(() => {

    habitNameInput.focus();

  }, 100);
}


function closeInputModal() {

  inputModal.classList.remove(
    "is-open"
  );

  editingHabitIndex =
    null;

  habitNameInput.value =
    "";
}


function saveHabitName() {

  const name =
    habitNameInput.value.trim();


  if (!name) {

    habitNameInput.focus();

    return;
  }


  // 新しい日課
  if (
    editingHabitIndex === null
  ) {

    habits.push({
      id: `habit-${Date.now()}`,
      name: name
    });


    saveHabits();

    closeInputModal();

    createTable();

    createHabitEditList();

    return;
  }


  // 名前変更
  habits[
    editingHabitIndex
  ].name = name;


  saveHabits();

  createTable();


  const editItems =
    document.querySelectorAll(
      ".habit-edit-item"
    );


  const currentItem =
    editItems[
      editingHabitIndex
    ];


  if (currentItem) {

    const nameElement =
      currentItem.querySelector(
        ".habit-name"
      );


    if (nameElement) {

      nameElement.textContent =
        name;
    }
  }


  closeInputModal();
}


function openDeleteModal(index) {

  deletingHabitIndex =
    index;


  confirmMessage.textContent =
    `「${habits[index].name}」を削除しますか？`;


  confirmModal.classList.add(
    "is-open"
  );
}


function closeDeleteModal() {

  confirmModal.classList.remove(
    "is-open"
  );

  deletingHabitIndex =
    null;
}


function deleteHabit() {

  if (
    deletingHabitIndex === null
  ) {

    return;
  }


  habits.splice(
    deletingHabitIndex,
    1
  );


  saveHabits();

  createTable();

  createHabitEditList();

  closeDeleteModal();
}


// 月移動
previousMonthButton.addEventListener(
  "click",
  () => {
    changeMonth(-1);
  }
);

nextMonthButton.addEventListener(
  "click",
  () => {
    changeMonth(1);
  }
);


// 今日へ戻る
todayButton.addEventListener(
  "click",
  goToToday
);


// 日課編集
editHabitsButton.addEventListener(
  "click",
  openEditScreen
);


addHabitButton.addEventListener(
  "click",
  () => {

    openInputModal(
      "日課を追加"
    );
  }
);


closeEditButton.addEventListener(
  "click",
  closeEditScreen
);


cancelInputButton.addEventListener(
  "click",
  closeInputModal
);


saveInputButton.addEventListener(
  "click",
  saveHabitName
);


cancelDeleteButton.addEventListener(
  "click",
  closeDeleteModal
);


confirmDeleteButton.addEventListener(
  "click",
  deleteHabit
);


habitNameInput.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Enter"
    ) {

      saveHabitName();
    }
  }
);


// 起動時は今月を表示し、今日へ移動
createTable(true);

'use strict';

// Get the number of days in a month
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

// Get the first day of the month
function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

// Generate a calendar for the specified year and months
function generateCalendar(year, month, numberOfMonths, pastMonths = false) {
  const app = document.getElementById('app');

  for (let i = 0; i < numberOfMonths; i++) {
    const calendarContainer = document.createElement('div');
    calendarContainer.className = 'calendar-container';
    // add role="region" to the calendar container
    calendarContainer.setAttribute('role', 'region');
    let currentMonth, currentYear;
    if (pastMonths) {
      console.log(pastMonths);
      currentMonth = (month - i) % 12;
      currentYear = year - Math.floor((month - i) / 12);
    } else {
      console.log(pastMonths);
      currentMonth = (month + i) % 12;
      currentYear = year + Math.floor((month + i) / 12);
    }

    // const currentMonth = (month + i) % 12;
    // const currentYear = year + Math.floor((month + i) / 12);

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

    // Add month and year header
    const monthYearHeader = document.createElement('h2');
    monthYearHeader.textContent = `${new Date(
      currentYear,
      currentMonth
    ).toLocaleString('default', { month: 'long' })} ${currentYear}`;
    monthYearHeader.className = 'month-year-header';
    calendarContainer.appendChild(monthYearHeader);

    // build calendar
    const calendar = document.createElement('ol');
    calendar.className = 'calendar';
    calendar.setAttribute('role', 'grid');

    // Add day names row
    const dayNames = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    dayNames.forEach((day) => {
      const li = document.createElement('li');
      li.textContent = day;
      // add role="columnheader" to the day names
      li.setAttribute('role', 'columnheader');
      calendar.appendChild(li);
    });

    // Add empty list items for days before the first day of the month
    for (let j = 0; j < firstDay; j++) {
      const emptyLi = document.createElement('li');
      emptyLi.className = 'empty';
      // add role="gridcell" aria-hidden="true" to the empty list items
      emptyLi.setAttribute('role', 'gridcell');
      emptyLi.setAttribute('aria-hidden', 'true');
      calendar.appendChild(emptyLi);
    }

    // Get the current date
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonthToday = today.getMonth();
    const currentYearToday = today.getFullYear();

    // Add list items for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const li = document.createElement('li');
      const dateBtn = document.createElement('button');
      dateBtn.textContent = day;
      li.appendChild(dateBtn);

      // Highlight the current day
      // Highlight the current day
      if (
        day === currentDay &&
        currentMonth === currentMonthToday &&
        currentYear === currentYearToday
      ) {
        li.className = 'current-day';
      }

      // add role="gridcell" to the list items
      li.setAttribute('role', 'gridcell');

      calendar.appendChild(li);
    }

    calendarContainer.appendChild(calendar);
    app.appendChild(calendarContainer);
  }
  return app;
}

document.addEventListener('DOMContentLoaded', () => {
  const year = new Date().getFullYear();
  const month = new Date().getMonth();
  const numberOfMonths = 8; // Change this value to display more or fewer months
  const calendar = generateCalendar(year, month, numberOfMonths);
  // add true for past months like:
  // generateCalendar(year, month, numberOfMonths, true);
});

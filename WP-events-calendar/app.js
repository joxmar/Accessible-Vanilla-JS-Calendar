'use strict';

// Get the number of days in a month
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

// Get the first day of the month
function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

// Fetch events from the WordPress REST API
async function fetchEvents() {
  const response = await fetch(
    // live api from server
    'https://ll-sandbox.mystagingwebsite.com/events/wp-json/wp/v2/events?per_page=100'

    // If no server or no event s aviailable, use backup json file
    // 'wp-events-backup.json'
  );
  const events = await response.json();
  return events.map((event) => ({
    title: event.title.rendered,
    startDate: event.acf.start_date,
    endDate: event.acf.end_date || event.acf.start_date, // Use start_date if end_date is not provided
  }));
}

// Convert a date string (YYYYMMDD) to a JavaScript Date object
function parseDate(dateString) {
  const year = parseInt(dateString.slice(0, 4), 10);
  const month = parseInt(dateString.slice(4, 6), 10) - 1; // Months are zero-indexed
  const day = parseInt(dateString.slice(6, 8), 10);
  return new Date(year, month, day);
}

// Check if a date falls within an event's range
function isDateInRange(date, startDate, endDate) {
  return date >= startDate && date <= endDate;
}

// Generate a calendar for the specified year and months
async function generateCalendar(
  year,
  month,
  numberOfMonths,
  pastMonths = false
) {
  const app = document.getElementById('app');
  const events = await fetchEvents();

  for (let i = 0; i < numberOfMonths; i++) {
    const calendarContainer = document.createElement('div');
    calendarContainer.className = 'calendar-container';
    calendarContainer.setAttribute('role', 'region');

    let currentMonth, currentYear;
    // check if we want to display past months instead
    if (pastMonths) {
      // if true show past months
      console.log(pastMonths);
      currentMonth = (month - i) % 12;
      currentYear = year + Math.floor((month - i) / 12);
    } else {
      // show upcoming months
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
      li.setAttribute('role', 'columnheader');
      calendar.appendChild(li);
    });

    // Add empty list items for days before the first day of the month
    for (let j = 0; j < firstDay; j++) {
      const emptyLi = document.createElement('li');
      emptyLi.className = 'empty';
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
      li.setAttribute('role', 'gridcell');
      const date = new Date(currentYear, currentMonth, day);

      // Add a button for the date
      const dateBtn = document.createElement('button');
      dateBtn.textContent = day;
      li.appendChild(dateBtn);

      // Highlight the current day
      if (
        day === currentDay &&
        currentMonth === currentMonthToday &&
        currentYear === currentYearToday
      ) {
        li.className = 'current-day';
      }

      // Add events for the current date
      const dayEvents = events.filter((event) => {
        const startDate = parseDate(event.startDate);
        const endDate = parseDate(event.endDate);
        return isDateInRange(date, startDate, endDate);
      });

      dayEvents.forEach((event) => {
        const eventDiv = document.createElement('div');
        eventDiv.className = 'event';
        eventDiv.textContent = event.title;
        li.appendChild(eventDiv);
      });

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
  const numberOfMonths = 13; // Change this value to display more or fewer months
  generateCalendar(year, month, numberOfMonths, true);
  // add true for past months like:
  // generateCalendar(year, month, numberOfMonths, true);
});

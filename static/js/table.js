$(document).ready(function() {
    const options = {
      slidesToScroll: 1,
      slidesToShow: 1,
      loop: true,
      infinite: true,
      autoplay: false,
      autoplaySpeed: 3000,
    }
    // Initialize all div with carousel class
    const carousels = bulmaCarousel.attach('.carousel', options);
  
  })
  
  document.addEventListener('DOMContentLoaded', function() {
    loadTableData();
    setupEventListeners();
    window.addEventListener('resize', adjustNameColumnWidth);
  });
  
  function loadTableData() {
        console.log('Starting to load table data...');
        fetch('./static/leaderboard_data.json')
          .then(response => {
            console.log('Response status:', response.status);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            console.log('Data loaded successfully:', data);
            const tbody = document.querySelector('#veu-table tbody');
  
            // Prepare data for styling
            const recogScores = prepareScoresForStyling(data.leaderboardData, 'recog');
            const rnjScores = prepareScoresForStyling(data.leaderboardData, 'rnj');
            const allScores = prepareScoresForStyling(data.leaderboardData, 'all');
  
            data.leaderboardData.forEach((row, index) => {
              const tr = document.createElement('tr');
              tr.classList.add(row.info.type);
              const nameCell = row.info.link && row.info.link.trim() !== '' ?
                `<a href="${row.info.link}" target="_blank"><b>${row.info.name}</b></a>` :
                `<b>${row.info.name}</b>`;
              const safeGet = (obj, path, defaultValue = '-') => {
                return path.split('.').reduce((acc, part) => acc && acc[part], obj) || defaultValue;
              };
  
              // Helper function to format the overall value
              const formatOverallValue = (value, source) => {
                // Adjust space in front of asterisk to align values
                const adjustedValue = source === 'author' ? `&nbsp;${value || '-'}*` : `${value || '-'}`;
                return adjustedValue;
              };
  
              const recogOverall = formatOverallValue(applyStyle(safeGet(row, 'recog.overall'), recogScores.overall[index]), safeGet(row, 'recog.overall'));
              const rnjOverall = formatOverallValue(applyStyle(safeGet(row, 'rnj.overall'), rnjScores.overall[index]), safeGet(row, 'rnj.overall'));
              const allOverall = formatOverallValue(applyStyle(safeGet(row, 'all.overall'), allScores.overall[index]), safeGet(row, 'all.overall'));

              tr.innerHTML = `
                <td>${nameCell}</td>
                <td>${row.info.size}</td>
                <td>${row.info.frameNumbers}</td>
                <td class="recog-overall">${recogOverall}</td>
                <td class="hidden recog-details">${applyStyle(safeGet(row, 'recog.shotSubject'), recogScores.shotSubject[index])}</td>
                <td class="hidden recog-details">${applyStyle(safeGet(row, 'recog.shotColor'), recogScores.shotColor[index])}</td>
                <td class="hidden recog-details">${applyStyle(safeGet(row, 'recog.shotSize'), recogScores.shotSize[index])}</td>
                <td class="hidden recog-details">${applyStyle(safeGet(row, 'recog.shotAngle'), recogScores.shotAngle[index])}</td>
                <td class="hidden recog-details">${applyStyle(safeGet(row, 'recog.shotLocation'), recogScores.shotLocation[index])}</td>
                <td class="hidden recog-details">${applyStyle(safeGet(row, 'recog.shotType'), recogScores.shotType[index])}</td>
                <td class="hidden recog-details">${applyStyle(safeGet(row, 'recog.shotMotion'), recogScores.shotMotion[index])}</td>
                <td class="hidden recog-details">${applyStyle(safeGet(row, 'recog.shotSpeed'), recogScores.shotSpeed[index])}</td>
                <td class="hidden recog-details">${applyStyle(safeGet(row, 'recog.transition'), recogScores.transition[index])}</td>
                <td class="hidden recog-details">${applyStyle(safeGet(row, 'recog.cutType'), recogScores.cutType[index])}</td>
                <td class="rnj-overall">${rnjOverall}</td>
                <td class="hidden rnj-details">${applyStyle(safeGet(row, 'rnj.shotSize'), rnjScores.shotSize[index])}</td>
                <td class="hidden rnj-details">${applyStyle(safeGet(row, 'rnj.shotAngle'), rnjScores.shotAngle[index])}</td>
                <td class="hidden rnj-details">${applyStyle(safeGet(row, 'rnj.shotLocation'), rnjScores.shotLocation[index])}</td>
                <td class="hidden rnj-details">${applyStyle(safeGet(row, 'rnj.shotType'), rnjScores.shotType[index])}</td>
                <td class="hidden rnj-details">${applyStyle(safeGet(row, 'rnj.shotMotion'), rnjScores.shotMotion[index])}</td>
                <td class="hidden rnj-details">${applyStyle(safeGet(row, 'rnj.transition'), rnjScores.transition[index])}</td>
                <td class="hidden rnj-details">${applyStyle(safeGet(row, 'rnj.cutType'), rnjScores.cutType[index])}</td>
                <td class="all-overall">${allOverall}</td>
                `;
              tbody.appendChild(tr);
            });
            setTimeout(adjustNameColumnWidth, 0);
            initializeSorting();
          })
          .catch(error => {
            console.error('Error loading table data:', error);
            document.querySelector('#veu-table tbody').innerHTML = `
              <tr>
                  <td colspan="21"> Error loading data: ${error.message}<br> Please ensure you're accessing this page through a web server (http://localhost:8000) and not directly from the file system. </td>
              </tr>
            `;
          });
    }
  
  function setupEventListeners() {
    document.querySelector('.reset-cell').addEventListener('click', function() {
      resetTable();
    });
  
    document.querySelector('.recog-details-cell').addEventListener('click', function() {
      toggleDetails('recog');
    });
    document.querySelector('.rnj-details-cell').addEventListener('click', function() {
      toggleDetails('rnj');
    });
    document.querySelector('.all-details-cell').addEventListener('click', function() {
      toggleDetails('all');
    });
  
    var headers = document.querySelectorAll('#veu-table thead tr:last-child th.sortable');
    headers.forEach(function(header) {
      header.addEventListener('click', function() {
        sortTable(this);
      });
    });
  }
  
  function toggleDetails(section) {
    var sections = ['recog', 'rnj', 'all'];
    sections.forEach(function(sec) {
      var detailCells = document.querySelectorAll('.' + sec + '-details');
      var overallCells = document.querySelectorAll('.' + sec + '-overall');
      var headerCell = document.querySelector('.' + sec + '-details-cell');
      if (sec === section) {
        detailCells.forEach(cell => cell.classList.toggle('hidden'));
        // corresponding to each category's column number
        headerCell.setAttribute('colspan', headerCell.getAttribute('colspan') === '1' ? (sec === 'recog' ? '11' : '8') : '1');
      } else {
        detailCells.forEach(cell => cell.classList.add('hidden'));
        overallCells.forEach(cell => cell.classList.remove('hidden'));
        headerCell.setAttribute('colspan', '1');
      }
    });
  
    setTimeout(adjustNameColumnWidth, 0);
  }
  
  function resetTable() {
    document.querySelectorAll('.recog-details, .rnj-details, .all-details').forEach(function(cell) {
      cell.classList.add('hidden');
    });
  
    document.querySelectorAll('.recog-overall, .rnj-overall, .all-overall').forEach(function(cell) {
      cell.classList.remove('hidden');
    });
  
    document.querySelector('.recog-details-cell').setAttribute('colspan', '1');
    document.querySelector('.rnj-details-cell').setAttribute('colspan', '1');
    document.querySelector('.all-details-cell').setAttribute('colspan', '1');
  
    var rnjOverallHeader = document.querySelector('#veu-table thead tr:last-child th.rnj-overall');
    sortTable(rnjOverallHeader, true);
  
    setTimeout(adjustNameColumnWidth, 0);
  }
  
  function sortTable(header, forceDescending = false, maintainOrder = false) {
    var table = document.getElementById('veu-table');
    var tbody = table.querySelector('tbody');
    var rows = Array.from(tbody.querySelectorAll('tr'));
    var headers = Array.from(header.parentNode.children);
    var columnIndex = headers.indexOf(header);
    var sortType = header.dataset.sort;
  
    var isDescending = forceDescending || (!header.classList.contains('asc') && !header.classList.contains('desc')) || header.classList.contains('asc');
  
    if (!maintainOrder) {
      rows.sort(function(a, b) {
        var aValue = getCellValue(a, columnIndex);
        var bValue = getCellValue(b, columnIndex);
  
        if (aValue === '-' && bValue !== '-') return isDescending ? 1 : -1;
        if (bValue === '-' && aValue !== '-') return isDescending ? -1 : 1;
  
        if (sortType === 'number') {
          return isDescending ? parseFloat(bValue) - parseFloat(aValue) : parseFloat(aValue) - parseFloat(bValue);
        } else if (sortType === 'date') {
          return isDescending ? new Date(bValue) - new Date(aValue) : new Date(aValue) - new Date(bValue);
        } else {
          return isDescending ? bValue.localeCompare(aValue) : aValue.localeCompare(bValue);
        }
      });
    }
  
    headers.forEach(function(th) {
      th.classList.remove('asc', 'desc');
    });
  
    header.classList.add(isDescending ? 'desc' : 'asc');
  
    rows.forEach(function(row) {
      tbody.appendChild(row);
    });
  
    setTimeout(adjustNameColumnWidth, 0);
  }
  
  function getCellValue(row, index) {
    var cells = Array.from(row.children);
    var cell = cells[index];
  
    if (cell.classList.contains('hidden')) {
      if (cell.classList.contains('recog-details') || cell.classList.contains('recog-overall')) {
        cell = cells.find(c => (c.classList.contains('recog-overall') || c.classList.contains('recog-details')) && !c.classList.contains('hidden'));
      } else if (cell.classList.contains('rnj-details') || cell.classList.contains('rnj-overall')) {
        cell = cells.find(c => (c.classList.contains('rnj-overall') || c.classList.contains('rnj-details')) && !c.classList.contains('hidden'));
      } else if (cell.classList.contains('all-details') || cell.classList.contains('all-overall')) {
        cell = cells.find(c => (c.classList.contains('all-overall') || c.classList.contains('all-details')) && !c.classList.contains('hidden'));
      }
    }
    return cell ? cell.textContent.trim() : '';
  }
  
  function initializeSorting() {
    var rnjOverallHeader = document.querySelector('#veu-table thead tr:last-child th.rnj-overall');
    sortTable(rnjOverallHeader, true);
  }
  
  function adjustNameColumnWidth() {
    const nameColumn = document.querySelectorAll('#veu-table td:first-child, #veu-table th:first-child');
    let maxWidth = 0;
  
    const span = document.createElement('span');
    span.style.visibility = 'hidden';
    span.style.position = 'absolute';
    span.style.whiteSpace = 'nowrap';
    document.body.appendChild(span);
  
    nameColumn.forEach(cell => {
      span.textContent = cell.textContent;
      const width = span.offsetWidth;
      if (width > maxWidth) {
        maxWidth = width;
      }
    });
  
    document.body.removeChild(span);
  
    maxWidth += 20; // Increased padding
  
    nameColumn.forEach(cell => {
      cell.style.width = `${maxWidth}px`;
      cell.style.minWidth = `${maxWidth}px`; // Added minWidth
      cell.style.maxWidth = `${maxWidth}px`;
    });
  }
  
  function prepareScoresForStyling(data, section) {
    const scores = {};
    const fields = [
      'overall',
      'shotSubject',
      'shotColor',
      'shotSize',
      'shotAngle',
      'shotLocation',
      'shotType',
      'shotMotion',
      'shotSpeed',
      'transition',
      'cutType'
    ];
  
    fields.forEach(field => {
      const values = data.map(row => row[section] && row[section][field])
        .filter(value => value !== '-' && value !== undefined && value !== null)
        .map(parseFloat);
  
      if (values.length > 0) {
        const sortedValues = [...new Set(values)].sort((a, b) => b - a);
        scores[field] = data.map(row => {
          const value = row[section] && row[section][field];
          if (value === '-' || value === undefined || value === null) {
            return -1;
          }
          return sortedValues.indexOf(parseFloat(value));
        });
      } else {
        scores[field] = data.map(() => -1);
      }
    });
  
    return scores;
  }
  
  function applyStyle(value, rank) {
        if (value === undefined || value === null || value === '-') return '-';
        if (rank === 0) return `<b>${value}</b>`;
        if (rank === 1) return `<span style="text-decoration: underline;">${value}</span>`;
        return value;
  }
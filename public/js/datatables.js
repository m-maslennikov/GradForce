/* eslint-disable no-alert */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable prefer-template */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable no-undef */
$(document).ready(() => {
  $('#datatable').DataTable({
    pagingType: 'full_numbers',
    lengthMenu: [
      [10, 25, 50, -1],
      [10, 25, 50, 'All'],
    ],
    responsive: true,
    language: {
      search: '_INPUT_',
      searchPlaceholder: 'Search',
    },
    aoColumnDefs: [
      { bSortable: false, aTargets: [2, 4] },
    ],
  });

  var table = $('#datatable').DataTable();

  // Edit record
  table.on('click', '.edit', function () {
    $tr = $(this).closest('tr');
    var data = table.row($tr).data();
    alert('You press on Row: ' + data[0] + ' ' + data[1] + ' ' + data[2] + '\'s row.');
  });

  // Delete a record
  table.on('click', '.remove', function (e) {
    $tr = $(this).closest('tr');
    table.row($tr).remove().draw();
    e.preventDefault();
  });

  // Like record
  table.on('click', '.like', function () {
    alert('You clicked on Like button');
  });
});


$(document).ready(() => {
  $('#skillsTable').DataTable({
    pagingType: 'full_numbers',
    lengthMenu: [
      [10, 25, 50, -1],
      [10, 25, 50, 'All'],
    ],
    responsive: true,
    language: {
      search: '_INPUT_',
      searchPlaceholder: 'Search',
    },
    aoColumnDefs: [
      { bSortable: false, aTargets: [2] },
    ],
  });
});


$(document).ready(() => {
  $('#skillsView').DataTable({
    pagingType: 'full_numbers',
    lengthMenu: [
      [10, 25, 50, -1],
      [10, 25, 50, 'All'],
    ],
    responsive: true,
    language: {
      search: '_INPUT_',
      searchPlaceholder: 'Search',
    },
    aoColumnDefs: [
      { bSortable: false, aTargets: [1, 2, 3] },
    ],
  });
});

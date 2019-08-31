/* eslint-disable no-alert */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable prefer-template */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable no-undef */
$(document).ready(() => {
  $('#allStudentsTable').DataTable({
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
      { bSortable: false, aTargets: [2, 3, 4] },
    ],
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

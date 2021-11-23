/// <reference path="./jquery-3.6.0.js" />

function updateUserList() {
  $.getJSON("/admin/api/userList")
    .done(data => {
      $('#user-list').jsonViewer(data);    
    });
}

function updateGroupList() {
  $.getJSON("/admin/api/groupList")
    .done(data => {
      $('#group-list').jsonViewer(data);    
    });
}

function updateInvitationList() {
  $.getJSON("/admin/api/invitationList")
    .done(data => {
      $('#invitation-list').jsonViewer(data);    
    });
}

function updateGoalList() {
  $.getJSON("/admin/api/goalList")
    .done(data => {
      $('#goal-list').jsonViewer(data);    
    });
}

function updateBookList() {
  $.getJSON("/admin/api/bookList")
    .done(data => {
      $('#book-list').jsonViewer(data);    
    });
}

$(() => {
  $('#user-list-refresh').on('click', updateUserList);
  $('#group-list-refresh').on('click', updateGroupList);
  $('#invitation-list-refresh').on('click', updateInvitationList);
  $('#goal-list-refresh').on('click', updateGoalList);
  $('#book-list-refresh').on('click', updateBookList);

  updateUserList();
  updateGroupList();
  updateInvitationList();
  updateGoalList();
  updateBookList();
});
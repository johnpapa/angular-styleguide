define(['angular'], function(angular) {
    "use strict";

  // StudentLearningGoalApi factory
  angular.module('courseTakingApp.announcement.announcementApi')
    .factory('Announcement', AnnouncementApi);

  AnnouncementApi.$inject = ['$http'];

  function AnnouncementApi($http) {

    return {
      getAnnouncements: getAnnouncements,
      createAnnouncement: createAnnouncement
    };

    function getAnnouncements() {
      return $http.get('/api/announcements')
        .then(getAnnouncementsComplete)
        .catch(getFailed);
    }

    function getAnnouncementsComplete(response) {
      return response.data.results;
    }

    function createAnnouncement(data) {
        return $http.post('/api/announcements',data)
          .then(createAnnouncementsComplete)
          .catch(getFailed);
    }

    function createAnnouncementsComplete(response) {
        return response.data.result;
    }

    function getFailed(error) {
    }
  }
});

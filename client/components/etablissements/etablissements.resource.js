'use strict';

angular.module('boursesApp').factory('Etablissement', function ($resource) {
  return $resource('/api/etablissements/:id/:controller', {
    id: '@human_id'
  }, {
    update: {
      method:'PUT'
    },
    queryDemandes: {
      method: 'GET',
      controller: 'demandes',
      isArray: true
    }
  });
});

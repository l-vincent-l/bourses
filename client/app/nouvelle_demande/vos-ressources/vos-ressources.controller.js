'use strict';

angular.module('boursesApp')
  .controller('VosRessourcesCtrl', function($scope, $http, $window, $state, $location, $anchorScroll, $timeout, $modal, store) {
    $scope.dataDemandeur = store.get('svair_demandeur') || store.get('fc_demandeur');
    var storedFoyer = store.get('foyer');
    if (storedFoyer) {
      $scope.foyer = storedFoyer;
    } else {
      $scope.foyer = {concubinage: 'non'};
      var simulation = store.get('simulation');
      if (simulation) {
        $scope.foyer.nombreEnfantsACharge = simulation.enfants;
        $scope.foyer.nombreEnfantsAdultes = simulation.adultes;
      }
    }

    $scope.identiteEnfant = store.get('identite-enfant');

    $scope.next = function(form) {
      if (!form.nombreEnfantsACharge.$valid || !form.nombreEnfantsAdultes.$valid) {
        $location.hash('foyer');
        $anchorScroll();
        return;
      }

      if (!isDataValid()) {
        $modal.open({
          animation: true,
          templateUrl: 'app/nouvelle_demande/vos-ressources/error.html',
          controller: function($scope, $modalInstance) {
            $scope.ok = function() {
              $modalInstance.dismiss();
            };
          }
        });

        return;
      }

      var steps = store.get('steps');
      steps.connexion = true;
      store.set('steps', steps);
      saveFoyer();
      $state.go('layout.nouvelle_demande.vos-renseignements');
    };

    function saveFoyer() {
      store.set('foyer', $scope.foyer);
      $scope.dataDemandeur = store.get('svair_demandeur') || store.get('fc_demandeur');
      computeShowOtherParent();
    }

    function isDataValid() {
      var statusDemandeur = store.get('status_demandeur');
      var statusConjoint = store.get('status_conjoint');

      if (statusDemandeur !== 'success') {
        return false;
      }

      if (showOtherParentConnection() && statusConjoint !== 'success') {
        return false;
      }

      return true;
    }

    function showOtherParentConnection() {
      return isGardeAlternee() || isConcubinage();
    }

    function computeShowOtherParent() {
      $scope.showOtherParent = isGardeAlternee() || isCelibataire();
    }

    function isConcubinage() {
      return $scope.foyer.concubinage === 'oui';
    }

    function isCelibataire() {
      return $scope.dataDemandeur &&
        ($scope.dataDemandeur.situationFamille === 'Célibataire' || $scope.dataDemandeur.sitFam === 'C');
    }

    function isGardeAlternee() {
      return $scope.identiteEnfant.garde === 'oui';
    }

    $scope.showOtherParentConnection = showOtherParentConnection;
    $scope.isCelibataire = isCelibataire;
    $scope.saveFoyer = saveFoyer;

    computeShowOtherParent();
  });

'use strict';

angular.module('boursesApp')
  .controller('VosRessourcesCtrl', function($scope, $http, $window, $state, $timeout, $modal, store) {
    $scope.dataDemandeur = store.get('svair_demandeur') || store.get('fc_demandeur');
    $scope.foyer = store.get('foyer') || {garde: 'non', concubinage: 'non'};
    $scope.statusDemandeur = null;
    $scope.statusConjoint = null;

    $scope.next = function(form) {
      if (!form.$valid) {
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
    }

    function isDataValid() {
      if ($scope.statusDemandeur !== 'success') {
        return false;
      }

      if (showOtherParentConnection() && $scope.statusConjoint !== 'success') {
        return false;
      }

      return true;
    }

    function showOtherParentConnection() {
      return isGardeAlternee() || isConcubinage();
    }

    function showOtherParent() {
      return isGardeAlternee() || isCelibataire();
    }

    function isConcubinage() {
      return $scope.foyer.concubinage === 'oui';
    }

    function isCelibataire() {
      return $scope.dataDemandeur &&
        // SVAIR || FC
        ($scope.dataDemandeur.situationFamille === 'Célibataire' || $scope.dataDemandeur.sitFam === 'C');
    }

    function isGardeAlternee() {
      return  $scope.foyer.garde === 'oui';
    }

    $scope.showOtherParentConnection = showOtherParentConnection;
    $scope.isCelibataire = isCelibataire;
    $scope.showOtherParent = showOtherParent;
    $scope.saveFoyer = saveFoyer;
  });

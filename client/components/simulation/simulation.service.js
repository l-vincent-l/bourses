'use strict';

angular.module('boursesApp').factory('simulation', function(definitions) {
  function calcPlafond(definitionTaux, nbEnfants) {
    return Math.ceil(definitionTaux.plafond + ((nbEnfants - 1) * definitionTaux.step));
  }

  function calcMontant(eligibleTaux1, eligibleTaux2, eligibleTaux3) {
    return eligibleTaux3 * definitions.taux3.montant +
    eligibleTaux2 * definitions.taux2.montant +
    eligibleTaux1 * definitions.taux1.montant;
  }

  return function(rfr, nbEnfants) {
    var plafondTaux1 = calcPlafond(definitions.taux1, nbEnfants);
    var plafondTaux2 = calcPlafond(definitions.taux2, nbEnfants);
    var plafondTaux3 = calcPlafond(definitions.taux3, nbEnfants);

    var eligibleTaux3 = rfr <= plafondTaux3;
    var eligibleTaux2 = !eligibleTaux3 && rfr <= plafondTaux2;
    var eligibleTaux1 = !(eligibleTaux2 || eligibleTaux3) && rfr <= plafondTaux1;

    return calcMontant(eligibleTaux1, eligibleTaux2, eligibleTaux3);
  };
});

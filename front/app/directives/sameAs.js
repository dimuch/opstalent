angular.module('SpotTracker').directive('validateEquals', () => {
  let validateEqual;
  return {
    require: 'ngModel',
    link: (scope, element, attrs, ngModelCtrl) => {
      validateEqual = (value) => {
        let valid = (value === scope.$eval(attrs.validateEquals));
        ngModelCtrl.$setValidity('equal', valid);
        return valid ? value : undefined;
      };

      ngModelCtrl.$parsers.push(validateEqual);
      ngModelCtrl.$formatters.push(validateEqual);

      scope.$watch(attrs.validateEquals, () => {
        ngModelCtrl.$setViewValue(ngModelCtrl.viewValue);
      });
    }
  };
});
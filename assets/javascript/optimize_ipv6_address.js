document.addEventListener('DOMContentLoaded', () => {

  const formFieldIpAddress    = document.getElementById('ip-address');
  const btnSimplifyIpAddress  = document.getElementById('btn-simplify-ip-address');
  const solutionWrapper       = document.getElementById('solution-wrapper');

  const stepOneSource         = document.getElementById('step-one-source');
  const stepOneResult         = document.getElementById('step-one-result');

  const stepTwoSource         = document.getElementById('step-two-source');
  const stepTwoResult         = document.getElementById('step-two-result');

  const errorValidation       = document.getElementById('ip-address-invalid');

  const simplifyIpAddress = () => {
    let ipAddress = formFieldIpAddress.value;
    let validation = IpAddressValidator.getInstance(ipAddress);

    if (validation.isValid()) {
      formFieldIpAddress.classList.add('is-valid');
      formFieldIpAddress.classList.remove('is-invalid');

      solutionWrapper.classList.remove('d-none');

      let ipAddressOptimized = IpAddressOptimizer.getInstance(ipAddress);

      stepOneSource.innerHTML = ipAddress;
      stepOneResult.innerHTML = ipAddressOptimized.ipWithTrailingZerosRemovedMarked();

      stepTwoSource.innerHTML = ipAddressOptimized.withTrailingZerosRemoved();
      stepTwoResult.innerHTML = ipAddressOptimized.ipWithBlockCombinedMarked();
    } else {
      formFieldIpAddress.classList.add('is-invalid');
      formFieldIpAddress.classList.remove('is-valid');

      errorValidation.innerHTML = `Die eingegebene IPv6-Adresse ist nicht gültig: <span class="fw-bold">${validation.reasonForInvalidity()}</span>`;
    }
  }

  btnSimplifyIpAddress.addEventListener('click', simplifyIpAddress);

});
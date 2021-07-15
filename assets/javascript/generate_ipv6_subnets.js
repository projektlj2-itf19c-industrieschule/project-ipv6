document.addEventListener('DOMContentLoaded', () => {

  const formFieldIpAddress      = document.getElementById('ip-address');
  const formFieldSubnet         = document.getElementById('ip-address-subnet');
  const formFieldAmountSubnets  = document.getElementById('amount-subnets');
  const btnGenerateSubnets      = document.getElementById('btn-generate-subnets');

  const generateSubnets = () => {
    let ipAdress = formFieldIpAddress.value;
    let amountSubnets = formFieldAmountSubnets.value;
    let subnet = parseInt(formFieldSubnet.value);
    
    let ipAddressValidation = ipv6AdressValid(ipAdress);
    let amountSubnetsValidation = numberValid(amountSubnets);

    if (ipAddressValidation.valid) {
      formFieldIpAddress.classList.add('is-valid');
      formFieldIpAddress.classList.remove('is-invalid');

      if (amountSubnetsValidation.valid) {
        amountSubnets = amountSubnetsValidation.number;
        formFieldAmountSubnets.classList.add('is-valid');
        formFieldAmountSubnets.classList.remove('is-invalid');

        let exponent = Math.ceil(Math.log(amountSubnets) / Math.log(2));
        let newSubnet = subnet + exponent;

        let idx = 3; // The index of the block
        let idx2 = 0; // The index of the character in the block
        let x = []; // All subnets
        let copy = ipAddressValidation.ipAddressBinary; // Create a copy of the binary ipv4 address

        for (let i = 0; i < amountSubnets; i++) {
          if (copy[idx][idx2] == '1111') {
            if (idx2 == 3) {
              idx++;
              idx2 = 0;
            } else {
              idx2++;
            }
          }

          let dualNumber = copy[idx][idx2];
          let decimalNumber = dualToDecimal(dualNumber);
          let incrementedDecimalNumber = decimalNumber + 1;
          let incrementedDualNumber = decimalToDual(incrementedDecimalNumber);

          copy[idx][idx2] = incrementedDualNumber.padStart(4, '0');

          console.log(`${dualNumber} ${copy[idx][idx2]} | ${idx} | ${idx2}`);
        }

        /*
          1. Wv subnetze -> 16
          2. Exponent finden, um mit 2^n auf mindestens anzahl subnetze zu kommen --> 4
          3. Exponent auf Quellsubnetz draufrechnen --> /52
          4. 16 Subnetze zu je /52
          5. ip
        */

      } else {
        formFieldAmountSubnets.classList.add('is-invalid');
        formFieldAmountSubnets.classList.remove('is-valid');  
      }
    } else {
      formFieldIpAddress.classList.add('is-invalid');
      formFieldIpAddress.classList.remove('is-valid');
    }
  }

  btnGenerateSubnets.addEventListener('click', generateSubnets);

});
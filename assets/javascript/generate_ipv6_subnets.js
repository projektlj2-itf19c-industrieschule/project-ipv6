document.addEventListener('DOMContentLoaded', () => {

  const formFieldIpAddress      = document.getElementById('ip-address');
  const formFieldSubnet         = document.getElementById('ip-address-subnet');
  const formFieldAmountSubnets  = document.getElementById('amount-subnets');
  const btnGenerateSubnets      = document.getElementById('btn-generate-subnets');

  const generateSubnets = variant => {
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

        // Calculating the necessary bits by calculating the logarithm of amountSubnets to the base of 2
        let necessaryBits = Math.ceil(Math.log(amountSubnets) / Math.log(2));
        
        // All subnets in binary and hexadecimal format
        let generatedSubnets = { binary: [], hexadecimal: [] };
        
        // Create a copy of the binary ipv4 address
        let copy = ipAddressValidation.ipAddressBinary;  
        
        // The start index of the part of the necessary bits of the binary ipv6 address
        let startIndex = parseInt(variant);

        // The end index of the part of the necessary bits of the binary ipv6 address
        let endIndex = startIndex + necessaryBits;

        // The last known (last in the loop updated) sequence of necessary bits
        let lastKnownSubnet = copy.substring(startIndex, endIndex);
        
        for (let i = 0; i < amountSubnets; i++) {
          let generatedSubnet = copy.substring(0, startIndex) + lastKnownSubnet + copy.substring(endIndex);
          generatedSubnets.binary.push(generatedSubnet);

          lastKnownSubnet = decimalToDual(dualToDecimal(lastKnownSubnet) + 1).padStart(necessaryBits, '0');
        }

        for (let i = 0; i < amountSubnets; i++) {
          let temp = generatedSubnets.binary[i].match(/.{1,16}/g);
          let ipv6Address = '';
          temp.forEach((block, _) => ipv6Address += `${dualToHex(block).padStart(4, '0')}:`);
          
          generatedSubnets.hexadecimal.push(
            ipv6Address.substring(0, ipv6Address.length - 1) + `/${subnet + necessaryBits}`
          );
        }

        generateResults(generatedSubnets.hexadecimal);

      } else {
        formFieldAmountSubnets.classList.add('is-invalid');
        formFieldAmountSubnets.classList.remove('is-valid');  
      }
    } else {
      formFieldIpAddress.classList.add('is-invalid');
      formFieldIpAddress.classList.remove('is-valid');
    }
  }

  /**
   * Generates a Table with the calculated IPv6 Addresses
   * @param {Array<String>} ipAddresses The IP Addreses
   */
  const generateResults = ipAddresses => {
    let table = document.createElement('table');
    let tableHead = document.createElement('thead');
    let tableBody = document.createElement('tbody');
    let tableHeadRow = document.createElement('tr');

    let tableHeadIdColumn = document.createElement('th');
    let tableHeadAddressColumn = document.createElement('th');
    let tableHeadOptimizedAddressColumn = document.createElement('th');

    tableHeadIdColumn.innerHTML = 'Nr.';
    tableHeadAddressColumn.innerHTML = 'Vollständig IPv6-Adresse';
    tableHeadOptimizedAddressColumn.innerHTML = 'Optimierte IPv6-Adresse';

    tableHeadRow.appendChild(tableHeadIdColumn);
    tableHeadRow.appendChild(tableHeadAddressColumn);
    tableHeadRow.appendChild(tableHeadOptimizedAddressColumn);

    tableHead.appendChild(tableHeadRow);
    table.appendChild(tableHead);
    table.appendChild(tableBody);

    ipAddresses.forEach((ipAddress, index) => {
      let tableRow = document.createElement('tr');
      let idColumn = document.createElement('td');
      let addressColumn = document.createElement('td');
      let optimizedAddressColumn = document.createElement('td');

      idColumn.innerHTML = index + 1;
      addressColumn.innerHTML = ipAddress;
      optimizedAddressColumn.innerHTML = ipAddress;

      tableRow.append(idColumn);
      tableRow.append(addressColumn);
      tableRow.append(optimizedAddressColumn);

      tableBody.appendChild(tableRow);
    })

    table.classList.add('table', 'table-striped', 'table-hover', 'border');

    let containerResults = document.getElementById('container-results');
    
    containerResults.innerHTML = '';
    containerResults.appendChild(table);
  }

  btnGenerateSubnets.addEventListener('click', () => generateSubnets(formFieldSubnet.value));

});
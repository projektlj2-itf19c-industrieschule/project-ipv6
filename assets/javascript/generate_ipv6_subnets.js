document.addEventListener('DOMContentLoaded', () => {

  const formFieldIpAddress      = document.getElementById('ip-address');
  const formFieldSubnet         = document.getElementById('ip-address-subnet');
  const formFieldAmountSubnets  = document.getElementById('amount-subnets');
  const btnGenerateSubnets      = document.getElementById('btn-generate-subnets');

  const accordionButtonSolution = document.getElementById('accordion-button-solution');
  const accordionButtonDetailedSolution = document.getElementById('accordion-button-detailed-solution');

  const wrapperDetailedSolution = document.getElementById('wrapper-detailed-solution');

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
        accordionButtonSolution.disabled = false;
        accordionButtonDetailedSolution.disabled = false;

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
        
        // The Data for the detailed solution
        let detailedSolution = []

        for (let i = 0; i < amountSubnets - 1; i++) {
          detailedSolution.push({
            relevantBitsPreviousSubnetBinary: undefined,
            relevantBitsPreviousSubnetHexadecimal: undefined,
            relevantBitsCurrentSubnetBinary: undefined,
            relevantBitsCurrentSubnetHexadecimal: undefined,
            fullIpv6AddressBinary: undefined,
            fullIpv6AddressHexadecimal: undefined
          })
        }

        for (let i = 0; i < amountSubnets - 1; i++) {
          detailedSolution[i].relevantBitsPreviousSubnetBinary = lastKnownSubnet;
          detailedSolution[i].relevantBitsPreviousSubnetHexadecimal = dualToHex(lastKnownSubnet);

          lastKnownSubnet = decimalToDual(dualToDecimal(lastKnownSubnet) + 1).padStart(necessaryBits, '0');

          endIndex = startIndex + lastKnownSubnet.length;

          let generatedSubnet = copy.substring(0, startIndex) + lastKnownSubnet + copy.substring(endIndex);
          generatedSubnets.binary.push(generatedSubnet);

          detailedSolution[i].relevantBitsCurrentSubnetBinary       = lastKnownSubnet;
          detailedSolution[i].relevantBitsCurrentSubnetHexadecimal  = dualToHex(lastKnownSubnet); // Überarbeiten
          detailedSolution[i].fullIpv6AddressBinary                 = formatBinaryIpAddress(copy.substring(0, startIndex) + `<span class="hint-decent">${lastKnownSubnet}</span>` + copy.substring(endIndex));
        }

        for (let i = 0; i < amountSubnets - 1; i++) {
          let temp = generatedSubnets.binary[i].match(/.{1,16}/g);
          let ipv6Address = '';
          temp.forEach((block, _) => ipv6Address += `${dualToHex(block).padStart(4, '0')}:`);
          
          let fullIpAddress = ipv6Address.substring(0, ipv6Address.length - 1) + `/${subnet + necessaryBits}`;
          generatedSubnets.hexadecimal.push(fullIpAddress);
          detailedSolution[i].fullIpv6AddressHexadecimal = fullIpAddress;
        }

        detailedSolution.unshift({
          relevantBitsPreviousSubnetBinary: ipAddressValidation.ipAddressBinary.substring(startIndex, endIndex),
          relevantBitsPreviousSubnetHexadecimal: dualToHex(ipAddressValidation.ipAddressBinary.substring(startIndex, endIndex)),
          relevantBitsCurrentSubnetBinary: ipAddressValidation.ipAddressBinary.substring(startIndex, endIndex),
          relevantBitsCurrentSubnetHexadecimal: dualToHex(ipAddressValidation.ipAddressBinary.substring(startIndex, endIndex)),
          fullIpv6AddressBinary: formatBinaryIpAddress(ipAddressValidation.ipAddressBinary),
          fullIpv6AddressHexadecimal: `${ipAddressValidation.ipAddressHex}/${subnet + necessaryBits}`
        })

        detailedSolution.forEach((elem, index) => {
          if (index != 0) {
            wrapperDetailedSolution.innerHTML += generateDetailedResultTableForSubnet(
              ++index,
              elem.relevantBitsPreviousSubnetBinary,
              elem.relevantBitsPreviousSubnetHexadecimal,
              elem.relevantBitsCurrentSubnetBinary,
              elem.relevantBitsCurrentSubnetHexadecimal,
              elem.fullIpv6AddressBinary,
              elem.fullIpv6AddressHexadecimal
            );
          } else {
            wrapperDetailedSolution.innerHTML += generateFirstSubnetResult(detailedSolution[0].fullIpv6AddressHexadecimal)
          }
        });

        generateResultsTableForSubnet(detailedSolution.map((elem, _) => elem.fullIpv6AddressHexadecimal));
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
  const generateResultsTableForSubnet = ipAddresses => {
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
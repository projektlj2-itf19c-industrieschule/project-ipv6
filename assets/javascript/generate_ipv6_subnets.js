document.addEventListener('DOMContentLoaded', () => {

  // UI Elements
  const formFieldIpAddress                      = document.getElementById('ip-address');
  const formFieldSubnet                         = document.getElementById('ip-address-subnet');
  const formFieldAmountSubnets                  = document.getElementById('amount-subnets');
  const btnGenerateSubnets                      = document.getElementById('btn-generate-subnets');

  const accordionButtonSolution                 = document.getElementById('accordion-button-solution');
  const accordionButtonDetailedSolution         = document.getElementById('accordion-button-detailed-solution');

  const wrapperDetailedSolution                 = document.getElementById('wrapper-detailed-solution');

  const startPrefix                             = document.getElementById('start-prefix');
  const startSubnetMask                         = document.getElementById('start-subnet-mask');
  const startAmountSubnets                      = document.getElementById('start-amount-subnets');
  
  const calcBitsAmountSubnetsSource             = document.getElementById('calc-bits-amount-subnets-source');
  const calcBitsAmountSubnetsLog                = document.getElementById('calc-bits-amount-subnets-log');
  const calcBitsPotence                         = document.getElementById('calc-bits-potence');

  const calcSubnetMaskStartSubnetMask           = document.getElementById('calc-subnet-mask-start-subnet-mask');
  const calcSubnetMaskStartSubnetMaskAmountBits = document.getElementById('calc-subnet-mask-amount-bits');
  const calcSubnetMaskStartResult               = document.getElementById('calc-subnet-mask-result');

  /**
   * This functions generates the subnets for a specific variant (48 of 56)
   * @param {Number} variant The variant (either 48 or 56)
   */
  const generateSubnets = variant => {
    let prefixValidator         = new PrefixValidator(formFieldIpAddress.value, formFieldSubnet.value);
    let subnetValidator         = new NumberValidator(formFieldSubnet.value);
    let amountSubnetsValidator  = new NumberValidator(formFieldAmountSubnets.value);
    
    if (prefixValidator.isValid()) {
      formFieldIpAddress.classList.add('is-valid');
      formFieldIpAddress.classList.remove('is-invalid');

      if (subnetValidator.isValid()) {
        formFieldIpAddress.classList.add('is-valid');
        formFieldIpAddress.classList.remove('is-invalid');

        if (amountSubnetsValidator.isValid()) {
          formFieldAmountSubnets.classList.add('is-valid');
          formFieldAmountSubnets.classList.remove('is-invalid');

          accordionButtonSolution.disabled = false;
          accordionButtonDetailedSolution.disabled = false;

          let subnetGenerator = new SubnetGenerator(prefixValidator.ipBinary(), prefixValidator.ipHex(), subnetValidator.getNumber(), amountSubnetsValidator.getNumber());

          startPrefix.innerHTML                             = prefixValidator.getPrefix();
          startSubnetMask.innerHTML                         = subnetValidator.getNumber().toString();
          startAmountSubnets.innerHTML                      = amountSubnetsValidator.getNumber().toString();

          calcBitsAmountSubnetsSource.innerHTML             = amountSubnetsValidator.getNumber().toString();
          calcBitsAmountSubnetsLog.innerHTML                = amountSubnetsValidator.getNumber().toString();
          calcBitsPotence.innerHTML                         = subnetGenerator.necessaryBits().toString();

          calcSubnetMaskStartSubnetMask.innerHTML           = subnetValidator.getNumber().toString();
          calcSubnetMaskStartSubnetMaskAmountBits.innerHTML = subnetGenerator.necessaryBits().toString();
          calcSubnetMaskStartResult.innerHTML               = subnetGenerator.newSubnet().toString();

          wrapperDetailedSolution.innerHTML = '';
          
          let detailedSolutions = subnetGenerator.detailedSolutions();

          generateDetailedResults(detailedSolutions);
          generateResultsTableForSubnet(detailedSolutions.map((elem, _) => elem.fullIpv6AddressHexadecimal));

        } else {
          formFieldAmountSubnets.classList.add('is-invalid');
          formFieldAmountSubnets.classList.remove('is-valid');
        }

      } else {
        formFieldAmountSubnets.classList.add('is-invalid');
        formFieldAmountSubnets.classList.remove('is-valid');  
      }
    } else {
      formFieldIpAddress.classList.add('is-invalid');
      formFieldIpAddress.classList.remove('is-valid');
    }

  }

  const generateDetailedResults = detailedResults => {
    detailedResults.forEach((elem, index) => {
      if (index != 0) {
        wrapperDetailedSolution.innerHTML += generateDetailedResultForSubnet(
          ++index,
          elem.relevantBitsPreviousSubnetBinary,
          elem.relevantBitsPreviousSubnetHexadecimal,
          elem.relevantBitsCurrentSubnetBinary,
          elem.relevantBitsCurrentSubnetHexadecimal,
          elem.fullIpv6AddressBinary,
          elem.fullIpv6AddressHexadecimal
        );
      } else {
        wrapperDetailedSolution.innerHTML += generateFirstSubnetResult(detailedResults[0].fullIpv6AddressHexadecimal)
      }
    });
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

      let ipAddressOptimizer = IpAddressOptimizer.getInstance(ipAddress.substring(0, ipAddress.length - 3));
      let subnet = ipAddress.substring(ipAddress.length - 2, ipAddress.length);

      idColumn.innerHTML = index + 1;
      addressColumn.innerHTML = ipAddress;
      optimizedAddressColumn.innerHTML = `${ipAddressOptimizer.optimizedAddress()}/${subnet}`;

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

  btnGenerateSubnets.addEventListener('click', () => generateSubnets(parseInt(formFieldSubnet.value)));

});
/**
 * Generates HTML Nodes from an HTML-String
 * @param {String} s The HTML-String 
 * @returns A HTML Nodelist
 */
const generateHtmlFromString = s => {
  let template = document.createElement('div');
  template.innerHTML = s.trim();
  return template.firstChild;
}

/**
   * Inserts the hexadecimal number FFFE in the middle of the MAC-Address
   * @param {String} macAddress The Source MAC-Address 
   * @returns {String} The MAC-Address with the hexadecimal number FFFE in the middle
   */
 const insertFFFEInTheMiddleOfMacAddress = macAddress => {
  let macAddressArray = macAddress.split(':');
  let macAddressWithFFFE = '';
  let FEFE = 'FF:FE:';

  for (let i = 0; i < 3; i++)
  macAddressWithFFFE += `${macAddressArray[i]}:`;

  macAddressWithFFFE += FEFE;

  for (let i = 3; i < 6; i++)
  macAddressWithFFFE += `${macAddressArray[i]}:`;

  macAddressWithFFEE = macAddressWithFFFE.substring(0, macAddressWithFFFE.length - 1);

  return {
    html: {
      macAddress: macAddress,
      macAddressWithFFEE: macAddressWithFFEE.replace(FEFE, getHint(FEFE))
    },
    macAddressWithFFEE: macAddressWithFFEE
  }
}

/**
 * Inverts the 2nd Bit of the MAC-Address
 * @param {String} macAddress 
 * @returns {String} The MAC-Address with the 2nd Bit inverted
 */
const invert2ndBitOfMacAddress = macAddress => {
  let macAddressArray = macAddress.split(':');
  
  let firstByteDecimal = macAddressArray[0];
  let firstByteDual = hexToBinary(macAddressArray[0], 8);
  let firstByteInvertedDual = firstByteDual.substring(0, 6);
  let firstByteInvertedDecimal = null;

  firstByteInvertedDual += firstByteDual.charAt(6) == '0' ? '1' : '0';
  firstByteInvertedDual += firstByteDual.substring(7, 8);
  firstByteInvertedDecimal = dualToHex(firstByteInvertedDual);

  firstByteInvertedDecimal = firstByteInvertedDecimal < 10 ? `0${firstByteInvertedDecimal}` : firstByteInvertedDecimal;

  let macAddressWith2ndBitInverted = `${firstByteInvertedDecimal}:`;

  for (let i = 1; i < macAddressArray.length; i++)
    macAddressWith2ndBitInverted += `${macAddressArray[i]}:`;

  macAddressWith2ndBitInverted = macAddressWith2ndBitInverted.substring(0, macAddressWith2ndBitInverted.length - 1);

  let macAddressWithFffeHtml            = getHint(macAddress.substring(0, 2)) + macAddress.substring(2, macAddress.length);
  let firstByteDecimalHTML              = firstByteDecimal;
  let firstByteDualHTML                 = firstByteDual.substring(0, 6) + getHint(firstByteDual.substring(6, 7)) + firstByteDual.substring(7, 8);
  let firstByteInvertedDualHTML         = firstByteInvertedDual.substring(0, 6) + getHint(firstByteInvertedDual.substring(6, 7)) + firstByteInvertedDual.substring(7, 8);
  let firstByteInvertedDecimalHTML      = firstByteInvertedDecimal;
  let macAddressWith2ndBitInvertedHTML  = getHint(macAddressWith2ndBitInverted.substring(0, 2)) + macAddressWith2ndBitInverted.substring(2, macAddressWith2ndBitInverted.length);
  
  return {
    html: {
      macAddressWithFFEE: macAddressWithFffeHtml,
      firstByteDecimal: firstByteDecimalHTML,
      firstByteDual: firstByteDualHTML,
      firstByteInvertedDual: firstByteInvertedDualHTML,
      firstByteInvertedDecimal: firstByteInvertedDecimalHTML,
      macAddressWith2ndBitInverted: macAddressWith2ndBitInvertedHTML
    },
    macAddressWith2ndBitInverted: macAddressWith2ndBitInverted
  }
}

/**
 * 
 * @param {*} macAddress 
 * @returns 
 */
const assemblePrefixAndEUI64Identifier = macAddress => {
  let EUI64Identifier = 'FE80:0000:0000:0000';
  
  let macAddressWithoutSeparators = macAddress.replaceAll(':', '');
  let ipv6Prefix = '';

  let count = 0;
  for (let i = 0; i < macAddressWithoutSeparators.length; i++) {
    ipv6Prefix += macAddressWithoutSeparators[i];
    if (count == 3) {
      ipv6Prefix += ':';
      count = -1;
    }
    count++;
  }

  ipv6Prefix = ipv6Prefix.substring(0, ipv6Prefix.length - 1);

  return {
    html: {
      macAddressWith2ndBitInverted: macAddress.replaceAll(':', getHint(':')),
      ipv6: `${getHint(EUI64Identifier)}:${ipv6Prefix}`
    },
    ipv6: `${EUI64Identifier}:${ipv6Prefix}`
  };
}

/**
 * Generates the markup for an Text hint
 * @param {String} html The content of the hint
 * @returns {String} The HTML Markup
 */
const getHint = html => {
  return `<span class="badge rounded-pill bg-success mx-2">${html}</span>`;
}

/**
 * Checks if a MAC-Address is valid
 * @param {String} macAddress The Source MAC-Address
 * @returns {Boolean} true if the MAC-Address is valid, false otherwise
 */
const macAddressValid = macAddress => {
  let valid = true;
  
  if (macAddress.length < 12 || macAddress.length > 17)
    valid = false;

  if (!macAddress.match(/^[0-9a-fA-F]{1,2}([\.:-])(?:[0-9a-fA-F]{1,2}\1){4}[0-9a-fA-F]{1,2}$/))
    valid = false;

  return valid;
}

/**
 * Checks if a IPv6-Address is valid
 * @param {String} ipv6Adress The Source IPv6-Address
 * @returns {Object}
 */
const ipv6AdressValid = ipAddress => {
  let valid = true;
  let formattedIpAddress = ipAddress.trim().replaceAll(' ', '').replaceAll('.', ':').replaceAll('-', ':');
  let ipAddressSplitted = formattedIpAddress.split(':');
  let ipAddressHex = '';

  // Validating length
  if (formattedIpAddress.length < 12 || formattedIpAddress.length > 14)
    valid = false;

  // Validating format
  if (!formattedIpAddress.match(/^([0-9a-fA-F]{4}:){2}([0-9a-fA-F]{4})$/))
    valid = false;

  // Fill to complete ipv6 address
  if (ipAddressSplitted.length < 8) {
    for (let i = ipAddressSplitted.length; i < 8; i++)
      ipAddressSplitted.push('0000');
  }
  
  // Fill blocks with leading zeros if necessary
  ipAddressSplitted.forEach((block, index) => ipAddressSplitted[index] = block.padStart(4, '0'));

  let ipAddressBinary = '';
  ipAddressSplitted.forEach((block, _) => ipAddressBinary += hexToBinary(block, 16));
  ipAddressSplitted.forEach((block, _) => ipAddressHex += `${block}:`);

  return {
    valid: valid,
    ipAddressBinary: ipAddressBinary,
    ipAddressHex: ipAddressHex.substring(0, ipAddressHex.length - 1)
  };
}

/**
 * Checks if a number is valid
 * @param {String} number The value to check
 * @return {Boolean} True if the number is a Number, false otherwise
 */
const numberValid = number => {
  let parsed = parseInt(number);

  return {
    valid: !isNaN(parsed),
    number: parsed
  };
}

/**
 * Converts a hexadecimal number to a dual number
 * @param {String} hexNumber The hexadecimal number to convert
 * @param {Number} padStart The wished length of the Number
 * @returns {String} The dual number 
 */
const hexToBinary = (hexNumber, padStart) => {
  return (parseInt(hexNumber, 16).toString(2)).padStart(padStart, '0');
}

/**
 * Converts a dual number to a hexadecimal number
 * @param {String} dualNumber The dual number to convert
 * @returns {String} The hexadecimal number 
 */
const dualToHex = dualNumber => {
  return parseInt(dualNumber, 2).toString(16).toUpperCase();
}

const dualToDecimal = dual => {
  return parseInt(dual, 2);
}

const decimalToDual = decimal => {
  return (parseInt(decimal) >>> 0).toString(2);
}

const binaryIpArrayToHexIp = (binaryIpArray, subnetMask) => {
  let hexIp = '';
  binaryIpArray.forEach((block, _) => {
    let temp = '';
    block.forEach((hexAsBinary, _) => temp += hexAsBinary);
    hexIp += `${dualToHex(temp)}:`;
  });

  return `${hexIp.substring(0, hexIp.length - 1)}/${subnetMask}`;
}

const binaryIpArrayToBinaryIp = (binaryIpArray, subnetMask) => {
  let binaryIp = '';
  binaryIpArray.forEach((block, _) => {
    let temp = '';
    block.forEach((hexAsBinary, _) => temp += hexAsBinary);
    binaryIp += `${temp}:`;
  });

  return `${binaryIp.substring(0, binaryIp.length - 1)}/${subnetMask}`;
}

const binaryIpArrayToBinary = binaryIpArray => {
  let binaryIp = '';
  binaryIpArray.forEach((block, _) => {
    let temp = '';
    block.forEach((hexAsBinary, _) => temp += hexAsBinary);
    binaryIp += temp;
  });

  return binaryIp;
}

/**
 * This function generates the result table of a subnet
 * 
 * @param {String} relevantBitsPreviousSubnetBinary The relevant bits of the previous subnet in binary format
 * @param {String} relevantBitsPreviousSubnetHexadecimal The relevant bits of the previous subnet in hexadecimal format
 * @param {String} relevantBitsCurrentSubnetBinary The relevant bits of the current subnet in binary format
 * @param {String} relevantBitsCurrentSubnetHexadecimal The relevant bits of the current subnet in hexadecimal format
 * @param {String} fullIpv6AddressBinary The full generated IPv6 Address in binary format
 * @param {String} fullIpv6AddressHexadecimal  The full generated IPv6 Address in hexadecimal format
 */
const generateDetailedResultTableForSubnet = (
  nthItem,
  relevantBitsPreviousSubnetBinary,
  relevantBitsPreviousSubnetHexadecimal,
  relevantBitsCurrentSubnetBinary,
  relevantBitsCurrentSubnetHexadecimal,
  fullIpv6AddressBinary,
  fullIpv6AddressHexadecimal,
  ) => {
  return `
  <div class="accordion-item">
    <h2 class="accordion-header" id="heading-detailed-solution-${nthItem}">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#detailed-solution-${nthItem}" aria-expanded="false" aria-controls="detailed-sulution-${nthItem}">
        Subnetz ${nthItem}
      </button>
    </h2>
    <div id="detailed-solution-${nthItem}" class="accordion-collapse collapse" aria-labelledby="heading-detailed-solution-${nthItem}" data-bs-parent="#wrapper-detailed-solution">
      <div class="accordion-body">
        <div class="table-fluid">
          <table class="table mt-4">
            <tr>
              <td class="fw-bold">Relevante Bits des vorherigen Subnetzes:</td>
              <td>
                <div class="d-flex align-items-center justify-content-between">
                  <span>[${relevantBitsPreviousSubnetBinary}]<sub>2</sub></span>
                  <i class="fas fa-arrow-right"></i>
                  <span>[${relevantBitsPreviousSubnetHexadecimal}]<sub>16</sub></span>
                </div>
              </td>
            </tr>
            <tr>
              <td class="fw-bold">Relevante Bits des aktuellen Subnetzes (hochgezählt):</td>
              <td>
                <div class="d-flex align-items-center justify-content-between">
                  <span>[${relevantBitsCurrentSubnetBinary}]<sub>2</sub></span>
                  <i class="fas fa-arrow-right"></i>
                  <span>[${relevantBitsCurrentSubnetHexadecimal}]<sub>16</sub></span>
                </div>
              </td>
            </tr>
            <tr>
              <td class="fw-bold">Zusammengesetzte IPv6-Adresse (Binär)</td>
              <td>${fullIpv6AddressBinary}</td>
            </tr>
            <tr>
              <td class="fw-bold">Zusammengesetzte IPv6-Adresse (Hexadezimal)</td>
              <td>
                ${fullIpv6AddressHexadecimal}
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
  `
}

/**
 * This function generates the result table of a subnet
 * 
 * @param {String} prefix 
 */
 const generateFirstSubnetResult = ipAddress => {
  return `
  <div class="accordion-item">
    <h2 class="accordion-header" id="heading-detailed-solution-1">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#detailed-solution-1" aria-expanded="false" aria-controls="detailed-sulution-1">
        Subnetz 1
      </button>
    </h2>
    <div id="detailed-solution-1" class="accordion-collapse collapse" aria-labelledby="heading-detailed-solution-1}" data-bs-parent="#wrapper-detailed-solution">
      <div class="accordion-body">
        <div class="bs-callout bs-callout-info">
          Um das erste Subnetz zu bilden, muss das Ausgangsprefix lediglich mit Nullen aufgefüllt werden
        </div>
        <table class="table">
          <tr>
            <td class="fw-bold">IPv6-Adresse</td>
            <td>${ipAddress}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
  `
}

const formatBinaryIpAddress = ipAddress => {
  let countBlock = 0;
  let countChar = 0;
  let formatted = '';

  ipAddress.split('').forEach((elem, _) => {
    if (elem == '0' || elem == '1') {
      countBlock++;
      countChar++;
    }

    formatted += elem;

    if (countChar == 4) {
      formatted += ' ';
      countChar = 0;
    }

    if (countBlock == 16) {
      formatted += ' <span class="fw-bold">:</span><br> '
      countBlock = 0;
    }

  });

  return formatted;
}

const fillIPv6Addess = rawIPv6Address => {
  fillIPv6Addess
}
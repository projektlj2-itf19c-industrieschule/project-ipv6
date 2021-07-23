/**
 * Generates the markup for an Text hint
 * @param {String} html The content of the hint
 * @returns {String} The HTML Markup
 */
const getHint = html => {
  return `<span class="badge rounded-pill bg-marked mx-2">${html}</span>`;
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

/**
 * Converts a dual number to a decimal number
 * @param {String} dual 
 * @returns
 */
const dualToDecimal = dual => {
  return parseInt(dual, 2);
}

/**
 * Converts a decimal number to a dual number
 * @param {Number} decimal 
 * @returns 
 */
const decimalToDual = decimal => {
  return (parseInt(decimal) >>> 0).toString(2);
}

/**
 * This function generates the result table of a subnet
 * @param {String} relevantBitsPreviousSubnetBinary The relevant bits of the previous subnet in binary format
 * @param {String} relevantBitsPreviousSubnetHexadecimal The relevant bits of the previous subnet in hexadecimal format
 * @param {String} relevantBitsCurrentSubnetBinary The relevant bits of the current subnet in binary format
 * @param {String} relevantBitsCurrentSubnetHexadecimal The relevant bits of the current subnet in hexadecimal format
 * @param {String} fullIpv6AddressBinary The full generated IPv6 Address in binary format
 * @param {String} fullIpv6AddressHexadecimal  The full generated IPv6 Address in hexadecimal format
 */
const generateDetailedResultForSubnet = (
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
                  <span class="monospaced">[${relevantBitsPreviousSubnetBinary}]<sub>2</sub></span>
                  <i class="fas fa-arrow-right"></i>
                  <span class="monospaced">[${relevantBitsPreviousSubnetHexadecimal}]<sub>16</sub></span>
                </div>
              </td>
            </tr>
            <tr>
              <td class="fw-bold">Relevante Bits des aktuellen Subnetzes (hochgezählt):</td>
              <td>
                <div class="d-flex align-items-center justify-content-between">
                  <span class="monospaced">[${relevantBitsCurrentSubnetBinary}]<sub>2</sub></span>
                  <i class="fas fa-arrow-right"></i>
                  <span class="monospaced">[${relevantBitsCurrentSubnetHexadecimal}]<sub>16</sub></span>
                </div>
              </td>
            </tr>
            <tr>
              <td class="fw-bold">Zusammengesetzte IPv6-Adresse (Binär)</td>
              <td class="monospaced">${fullIpv6AddressBinary}</td>
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

/**
 * Formats a binary IP Address
 * @param {String} ipAddress 
 * @returns {String} The formatted IP-Address in binary format
 */
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

String.prototype.splitInChunksOfLength = function(chunkLength) {
  let s = this.valueOf();
  let splitted = [];

  let substring = '';
  s.split('').forEach((char, index) => {
    substring += char;

    if (substring.length === chunkLength) {
      splitted.push(substring);
      substring = '';
    }
  });

  if (substring.length !== 0) {
    splitted.push(substring);
  }

  return splitted;
}

String.prototype.removeLast = function (amount = 1) {
  let s = this.valueOf();

  return s.substring(0, s.length - amount);
}
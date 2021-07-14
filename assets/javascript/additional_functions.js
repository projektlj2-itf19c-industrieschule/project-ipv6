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
  let FEFE = 'FE:FE:';

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
  let firstByteDual = hexToDual(macAddressArray[0]);
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

const addEUI64Identifier = macAddress => {
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

  console.log(ipv6Prefix);

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
  return `<span class="hint">${html}</span>`;
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

  return valid;
}

/**
 * Converts a hexadecimal number to a dual number
 * @param {String} hexNumber The hexadecimal number to convert
 * @returns {String} The dual number 
 */
const hexToDual = hexNumber => {
  return (parseInt(hexNumber, 16).toString(2)).padStart(8, '0');
}

/**
 * Converts a dual number to a hexadecimal number
 * @param {String} dualNumber The dual number to convert
 * @returns {String} The hexadecimal number 
 */
const dualToHex = dualNumber => {
  return parseInt(dualNumber, 2).toString(16).toUpperCase();
}
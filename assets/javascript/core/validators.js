/**
 * This class is used to Validate an IPv6 Address
 */
class IpAddressValidator {

  /**
   * Creates a new Instance of the IPAddressValidator
   * @param {String} ipAddress The IP-Address to check
   */
  constructor(ipAddress) {
    this._ipAddress = ipAddress;

    this._valid = true;
    this._reasonForInvalidity = undefined;
    this._hexSymbols = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'a', 'b', 'c', 'd', 'e', 'f'];
  
    this._checkIpV6();
  }

  /**
   * Check if an IPv6-Address is valid
   * @param {String} this._ipAddress The IP-Address to check for validity
   */
  _checkIpV6() {
    let lastDigitWasColon   = false;
    let doubleColonAppeared = false;
    let colonCount          = 0;
    let hexSymbolCount      = 0;
  
    let ipAddress = this._ipAddress.trim().replaceAll(' ', '').replaceAll('-', ':').replaceAll('.', ':');
  
    // An IPv6 Address has to be at least 2 characters long
    if (ipAddress.length < 2) {
      this._valid = false;
      this._reasonForInvalidity = 'IPv6 Präfix ist zu kurz';
    }

    // An IPv6 Address has to be at most 39 characters long
    if (ipAddress.length > 39) {
      this._valid = false;
      this._reasonForInvalidity = 'IPv6 Präfix ist zu lang';
    }
  
    console.log(this._valid);

    if (!this._valid)
      return;

    ipAddress.split('').forEach(letter => {
      if (!this._valid)
        return;

      if (letter == ':') {
        if (lastDigitWasColon) {
          // Double-double-colons are only allowed one time (A::B::C is invalid)
          if (doubleColonAppeared) {
            this._valid = false;
            this._reasonForInvalidity = 'Doppel-Doppelpunkt kommt mehr als ein Mal vor';
          }
          
          doubleColonAppeared = true;
        }
  
        colonCount++;
        hexSymbolCount = 0;
      } else {
        // Each letter must be a valid hexadecimal character
        if (this._hexSymbols.includes(letter)) {
          hexSymbolCount++;
  
          // Blocks can't be greater than 16 Bits (4 hexadecimal characters)
          if (hexSymbolCount > 4) {
            this._valid = false;
            this._reasonForInvalidity = 'IPv6 Präfix enthält eine Hexadezimalzahl, die größer als 16 Bit ist'
          } 
        } else {
          this._valid = false;
          this._reasonForInvalidity = 'IPv6 Präfix enthält ungültige Zeichen'; 
        }
      }
      lastDigitWasColon = letter === ':';
    });

    // A valid IPv6 Adress has at least two colons
    if (this._valid && colonCount < 2) {
      this._valid = false;
      this._reasonForInvalidity = 'IPv6 Präfix enthält zu wenige Doppelpunkte';
    }

    // A valid IPv6 Adress has at most seven colons
    if (this._valid && colonCount > 7) {
      this._valid = false;
      this._reasonForInvalidity = 'IPv6 Präfix enthält zu viele Doppelpunkte';
    }
  }

  /**
   * Returns the validation value
   * @returns {Boolean} true if the IP Address is valid, false otherwise
   */
  isValid() {
    return this._valid;
  }

  /**
   * Returns the reasoy why the validation failed
   * @returns {String|undefined} The reason why the validation failed if it failed, undefined otherwise
   */
  reasonForInvalidity() {
    return this._reasonForInvalidity;
  }

  /**
   * Creates a new Instance of IpAddressValidator
   * @param {String} ipAddress The IP Address for the IpAddressValidator
   * @returns {IpAddressValidator} The IpAddressValidator
   */
  static getInstance(ipAddress) {
    return new IpAddressValidator(ipAddress);
  }

}

/**
 * This class is used to Validate an IPv6 Address Prefix
 */
class PrefixValidator {
  
  static MODE = {
    SUBNET_48: 48,
    SUBNET_56: 56
  }

  /**
   * The Constructor of this class
   * @param {String} prefix The IPv6 Prefix which should be validated
   * @param {Number} mode The mode (48 oder 56) to validate the prefix for
   */
  constructor(prefix, mode) {
    this._prefix    = prefix;
    this._mode      = parseInt(mode);
    this._valid     = true;

    this._ipBinary  = undefined;
    this._ipHex     = undefined;

    this._validate();
  }

  /**
   * Validates an prefix
   */
  _validate() {
    let formattedPrefix = this._prefix.trim().replaceAll(' ', '').replaceAll('.', ':').replaceAll('-', ':');
    let prefixSplitted = formattedPrefix.split(':');
    let ipHex = '';

    // Validating lenght and format
    if (this._mode == PrefixValidator.MODE.SUBNET_48) {
      if (formattedPrefix.length < 12 || formattedPrefix.length > 14)
        this._valid = false;

      if (!formattedPrefix.match(/^([0-9a-fA-F]{4}:){2}([0-9a-fA-F]{4})$/))
        this._valid = false;
    } else {
      if (formattedPrefix.length < 12 || formattedPrefix.length > 17)
        this._valid = false;

      if (!formattedPrefix.match(/^([0-9a-fA-F]{4}:){3}([0-9a-fA-F]{2})$/))
        this._valid = false;
    }

    // Fill to complete ipv6 address
    if (prefixSplitted.length < 8) {
      for (let i = prefixSplitted.length; i < 8; i++)
        prefixSplitted.push('0000');
    }
    
    // Fill blocks with leading zeros if necessary
    prefixSplitted.forEach((block, index) => prefixSplitted[index] = (this._mode == PrefixValidator.MODE.SUBNET_48 ? block.padStart(4, '0') : block.padEnd(4, '0')));

    let ipBinary = '';
    prefixSplitted.forEach((block, _) => ipBinary += hexToBinary(block, 16));
    prefixSplitted.forEach((block, _) => ipHex += `${block}:`);

    this._ipBinary = ipBinary;
    this._ipHex = ipHex.substring(0, ipHex.length - 1);
  }

  /**
   * Returns the result of the validation
   * @returns {Boolean} true if the validation succeeded, false otherwise
   */
  isValid() {
    return this._valid;
  }

  /**
   * Returns the Prefix
   * @returns {String} The raw prefix
   */
  getPrefix() {
    return this._prefix;
  }

  /**
   * Returns the IP Address (Prefix filled up with zeros until a length of 128 Bit is reached) 
   * @returns {String} The IP Address in binary format
   */
  ipBinary() {
    return this._ipBinary;
  }

  /**
   * Returns the IP Address (Prefix filled up with zeros until a length of 128 Bit is reached) 
   * @returns {String} The IP Address in hexadecimal format
   */
  ipHex() {
    return this._ipHex;
  }

  /**
   * Creates a new Instance of PrefixValidator
   * @param {String} prefix The Prefix to create the PrefixValidator for
   * @param {Number} mode The Mode to create the PrefixValidator for
   * @returns {PrefixValidator} The PrefixValidator
   */
  static getInstance(prefix, mode) {
    return new PrefixValidator(prefix, mode);
  }

}

/**
 * This class is used to validate a number
 */
class NumberValidator {

  /**
   * The Constructor of this Class
   * @param {*} number 
   */
  constructor(number) {
    this._number = number;
    this._valid = true;

    this._parsed = undefined;

    this._validate();
  }

  /**
   * Validates a number
   */
  _validate() {
    let parsed = parseInt(this._number);

    if (!isNaN(parsed)) {
      this._parsed = parsed;
    } else {
      this._valid = false;
    }
  }

  /**
   * Returns the validation result
   * @returns true if the validation suceeded, false otherwise
   */
  isValid() {
    return this._valid;
  }

  /**
   * Returns the validated number
   * @returns {Number} The validated number
   */
  getNumber() {
    return this._parsed;
  }

  /**
   * Creates a new Instance of the NumberValidator
   * @param {*} number The number which should be validated
   * @returns {NumberValidator} The NumberValidator
   */
  static getInstance(number) {
    return new NumberValidator(number);
  }

}
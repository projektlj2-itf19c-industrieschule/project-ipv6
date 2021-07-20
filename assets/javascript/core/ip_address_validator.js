class IpAddressValidator {

  _hexSymbols = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'a', 'b', 'c', 'd', 'e', 'f'];
  
  _valid = true;
  _reasonForInvalidity = undefined;

  /**
   * Creates a new Instance of the IPAddressValidator
   * @param {String} ipAddress The IP-Address to check
   */
  constructor(ipAddress) {
    this._ipAddress = ipAddress;

    this._checkIpV6();
  }

  /**
   * Check if an IPv6-Address is valid
   * @param {String} this._ipAddress The IP-Address to check for validity
   */
  _checkIpV6() {
    let lastDigitWasColon = false;
    let doubleColonAppeared = false;
    let colonCount = 0;
    let hexSymbolCount = 0;
  
    let ipAddress = this._ipAddress.trim().replaceAll(' ', '').replaceAll('-', ':').replaceAll('.', ':');
  
    // An IPv6 Address has to be at least 2 characters long
    if (ipAddress.length < 2) {
      this._valid = false;
      this._reasonForInvalidity = 'IP Address is too short';
    }

    // An IPv6 Address has to be at most 39 characters long
    if (ipAddress.length > 39) {
      this._valid = false;
      this._reasonForInvalidity = 'IP Address is too long';
    }
  
    if (!this.valid)
      return;
  
    ipAddress.split('').forEach((letter, _) => {
      if (!this.valid)
        return;
  
      if (letter == ':') {
        if (lastDigitWasColon) {
          // Double-double-colons are only allowed one time (A::B::C is invalid)
          if (doubleColonAppeared) {
            this._valid = false;
            this._reasonForInvalidity = 'Double colon appears multiple times';
          }
          
          doubleColonAppeared = true;
        }
  
        colonCount++;
        hexSymbolCount = 0;
      } else {
        // Each letter must be a valid hexadecimal character
        if (hexSymbols.includes(letter)) {
          hexSymbolCount++;
  
          // Blocks can't be greater than 16 Bits (4 hexadecimal characters)
          if (hexSymbolCount > 4) {
            this._valid = false;
            this._reasonForInvalidity = 'IP Address contains a decimal number which is longer than 4 characters'
          } 
        } else {
          this._valid = false;
          this._reasonForInvalidity = 'IP Address contains invalid characters'; 
        }
      }
      lastDigitWasColon = letter === ':';
    });

    // A valid IPv6 Adress has at least two colons
    if (valid && colonCount < 2) {
      this._valid = false;
      this._reasonForInvalidity = 'IP Address contains too less colons';
    }

    // A valid IPv6 Adress has at most seven colons
    if (valid && colonCount > 7) {
      this._valid = false;
      this._reasonForInvalidity = 'IP Address contains too many colons';
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
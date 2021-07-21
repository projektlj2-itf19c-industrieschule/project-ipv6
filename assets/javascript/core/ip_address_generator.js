/**
 * This class is used to generate an IPv6 Address using SLAAC
 */
class IpAddressGenerator {

  /**
   * The Constructor of this Class
   * @param {String} macAddress The MAC-Address to generate the IPv6 Address from
   */
  constructor(macAddress) {
    this._macAddress                                  = macAddress;

    this._withFffeInserted                            = undefined;
    this._withFffeInsertedAsHTML                      = undefined;

    this._withFffeAsHTML                              = undefined;
    this._withSecondBitInverted                       = undefined;
    this._withSecondBitInvertedAsHTML                 = undefined;
    this._firstByteHexAsHTML                          = undefined;
    this._firstByteBinaryAsHTML                       = undefined;
    this._firstByteInvertedHexAsHTML                  = undefined;
    this._firstByteInvertedBinaryAsHTML               = undefined;

    this._ipv6PrefixWithEUI64IdentifierCombined       = undefined;
    this._ipv6PrefixWithEUI64IdentifierCombinedAsHTML = undefined;
    this._withSecondBitInvertedAndColonsMarkedAsHTML  = undefined;
  }

  /**
   * Inserts the hexadecimal number FFFE in the middle of the MAC-Address
   */
  _insertFffe() {
    let splittedMacAddress = this._macAddress.split(':');
    let macAddressWithFFFE = '';
    let FEFE = 'FF:FE:';
  
    for (let i = 0; i < 3; i++)
      macAddressWithFFFE += `${splittedMacAddress[i]}:`;
  
    macAddressWithFFFE += FEFE;
  
    for (let i = 3; i < 6; i++)
      macAddressWithFFFE += `${splittedMacAddress[i]}:`;
  
    macAddressWithFFFE = macAddressWithFFFE.substring(0, macAddressWithFFFE.length - 1);
  
    this._withFffeInserted = macAddressWithFFFE;
    this._withFffeInsertedAsHTML = macAddressWithFFFE.replace(FEFE, getHint(FEFE));
  }

  /**
   * Inverts the second bit of the MAC-Address
   */
   _invertSecondBit() {
    let splittedMacAddress = this._withFffeInserted.split(':');
    

    let firstByteHex = splittedMacAddress[0];
    let firstByteDual = hexToBinary(splittedMacAddress[0], 8);
    let firstByteInvertedDual = firstByteDual.substring(0, 6);
    let firstByteInvertedHex = null;
  
    firstByteInvertedDual += firstByteDual.charAt(6) == '0' ? '1' : '0';
    firstByteInvertedDual += firstByteDual.substring(7, 8);
    firstByteInvertedHex = dualToHex(firstByteInvertedDual);
  
    firstByteInvertedHex = firstByteInvertedHex < 10 ? `0${firstByteInvertedHex}` : firstByteInvertedHex;
  
    let macAddressWith2ndBitInverted = `${firstByteInvertedHex}:`;
  
    for (let i = 1; i < splittedMacAddress.length; i++)
      macAddressWith2ndBitInverted += `${splittedMacAddress[i]}:`;
  
    macAddressWith2ndBitInverted = macAddressWith2ndBitInverted.substring(0, macAddressWith2ndBitInverted.length - 1);
  
    let firstByteHexHTML                  = firstByteHex;
    let firstByteDualHTML                 = firstByteDual.substring(0, 6) + getHint(firstByteDual.substring(6, 7)) + firstByteDual.substring(7, 8);
    let firstByteInvertedDualHTML         = firstByteInvertedDual.substring(0, 6) + getHint(firstByteInvertedDual.substring(6, 7)) + firstByteInvertedDual.substring(7, 8);
    let firstByteInvertedHexHTML          = firstByteInvertedHex;
    let macAddressWith2ndBitInvertedHTML  = getHint(macAddressWith2ndBitInverted.substring(0, 2)) + macAddressWith2ndBitInverted.substring(2, macAddressWith2ndBitInverted.length);
    
    this._withSecondBitInverted           = macAddressWith2ndBitInverted;
    this._withSecondBitInvertedAsHTML     = macAddressWith2ndBitInvertedHTML;
    this._withFffeAsHTML                  = getHint(this._withFffeInserted.substring(0, 2)) + this._withFffeInserted.substring(2, this._withFffeInserted.length);

    this._firstByteHexAsHTML              = firstByteHexHTML;
    this._firstByteBinaryAsHTML           = firstByteDualHTML;
    this._firstByteInvertedBinaryAsHTML   = firstByteInvertedDualHTML;
    this._firstByteInvertedHexAsHTML      = firstByteInvertedHexHTML;
  }

  /**
   * Combines the IPv6 Prefix (FE80:0000:0000:0000) with the generated EUI64 Identifier
   */
   _combineIpv6PrefixWithEUI64Identifier() {
    let ipv6Prefix = 'FE80:0000:0000:0000';
  
    let macAddressWithoutSeparators = this._withSecondBitInverted.replaceAll(':', '');
    let eui64Identifier = '';
  
    let count = 0;
    for (let i = 0; i < macAddressWithoutSeparators.length; i++) {
      eui64Identifier += macAddressWithoutSeparators[i];
      if (count == 3) {
        eui64Identifier += ':';
        count = -1;
      }
      count++;
    }
  
    eui64Identifier = eui64Identifier.substring(0, eui64Identifier.length - 1);
  
    this._withSecondBitInvertedAndColonsMarkedAsHTML = this._withSecondBitInverted.replaceAll(':', getHint(':'));
    this._ipv6PrefixWithEUI64IdentifierCombined = `${ipv6Prefix}:${eui64Identifier}`;
    this._ipv6PrefixWithEUI64IdentifierCombinedAsHTML = `${getHint(ipv6Prefix)}:${eui64Identifier}`;
  }

  /**
   * Returns the MAC Address with the second bit inverted
   * @returns {String} The MAC Address with the second bit inverted
   */
  withSecondBitInverted() {
    if (this._withSecondBitInverted === undefined)
      this._invertSecondBit();

    return this._withSecondBitInverted;
  }

  /**
   * Returns the MAC Address with the second bit inverted as an HTML String
   * @returns {String} The MAC Address with the second bit inverted as an HTML String
   */
  withSecondBitInvertedAsHTML() {
    if (this._withSecondBitInvertedAsHTML === undefined)
      this._invertSecondBit();

    return this._withSecondBitInvertedAsHTML;
  }

  /**
   * Returns the MAC Address with the FFFE Number
   * @returns {String} The MAC Address with the FFFE Number
   */
  withFffeInserted() {
    if (this._withFffeInserted === undefined)
      this._insertFffe();

    return this._withFffeInserted;
  }

  /**
   * Returns the MAC Address with the FFFE Number as an formatted HTML String
   * @returns {String} The MAC Address with the FFFE Number as an formatted HTML String
   */
  withFffeInsertedAsHtml() {
    if (this._withFffeInsertedAsHTML === undefined)
      this._insertFffe();

    return this._withFffeInsertedAsHTML;
  }

  /**
   * Returns the MAC Address with the FFFE Number as an formatted HTML String for the second step
   * @returns {String} The MAC Address with the FFFE Number as an formatted HTML String for the second step
   */
  withFffeAsHTML() {
    if (this._withFffeAsHTML === undefined)
      this._invertSecondBit();

    return this._withFffeAsHTML;
  }

  /**
   * Returns the first Byte in the hexadecimal representation
   * @returns The first Byte in the hexadecimal representation
   */
  firstByteHexAsHTML() {
    if (this._firstByteHexAsHTML === undefined)
      this._invertSecondBit();

    return this._firstByteHexAsHTML;
  }

  /**
   * Returns the first Byte in the binary representation
   * @returns The first Byte in the binary representation
   */
   firstByteBinaryAsHTML() {
    if (this._firstByteBinaryAsHTML === undefined)
      this._invertSecondBit();

    return this._firstByteBinaryAsHTML;
  }

  /**
   * Returns the first Byte with the second bit inverted in the hexadecimal representation
   * @returns The first Byte with the second bit inverted in the hexadecimal representation
   */
   firstByteInvertedHexAsHTML() {
    if (this._firstByteInvertedHexAsHTML === undefined)
      this._invertSecondBit();

    return this._firstByteInvertedHexAsHTML;
  }

  /**
   * Returns the first Byte with the second bit inverted in the binary representation
   * @returns The first Byte with the second bit inverted in the binary representation
   */
   firstByteInvertedBinaryAsHTML() {
    if (this._firstByteInvertedBinaryAsHTML === undefined)
      this._invertSecondBit();

    return this._firstByteInvertedBinaryAsHTML;
  }

  withSecondBitInvertedAndColonsMarkedAsHTML() {
    if (this._withSecondBitInvertedAndColonsMarkedAsHTML === undefined)
      this._combineIpv6PrefixWithEUI64Identifier();

    return this._withSecondBitInvertedAndColonsMarkedAsHTML;
  }

  /**
   * Returns the IPv6 Prefix combined with the calculated EUI64 Identifier
   * @returns {String} The IPv6 Prefix combined with the calculated EUI64 Identifier
   */
  ipv6PrefixWithEUI64IdentifiertCombined() {
    if (this._ipv6PrefixWithEUI64IdentifierCombined === undefined)
      this._combineIpv6PrefixWithEUI64Identifier();

    return this._ipv6PrefixWithEUI64IdentifierCombined;
  }

  /**
   * Returns the IPv6 Prefix combined with the calculated EUI64 Identifier as an HTML String
   * @returns {String} The IPv6 Prefix combined with the calculated EUI64 Identifier as an HTML String
   */
  ipv6PrefixWithEUI64IdentifiertCombinedAsHTML() {
    if (this._ipv6PrefixWithEUI64IdentifierCombinedAsHTML === undefined)
      this._combineIpv6PrefixWithEUI64Identifier();

    return this._ipv6PrefixWithEUI64IdentifierCombinedAsHTML;
  }

  /**
   * Returns the generated IP Address
   * @returns The generated IP Address
   */
  getIP() {
    return this._ipv6PrefixWithEUI64IdentifierCombined;
  }

  /**
   * Creates a new Instance of an IpAddressGenerator
   * @param {String} macAddress The MAC Address for the IpAddressGenerator
   * @returns {IpAddressGenerator} The IpAddressGenerator
   */
  static getInstance(macAddress) {
    return new IpAddressGenerator(macAddress);
  }

}
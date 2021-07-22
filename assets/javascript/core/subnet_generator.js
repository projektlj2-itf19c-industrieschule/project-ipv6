/**
 * This class is used to generate subnets for IPv6 Addresses
 */
class SubnetGenerator {
  
  /**
   * The constructor of this class
   * @param {String} ipBinary The IP in binary format to generate the subnets for
   * @param {String} ipHex  The IP in hexadecimal format to generate the subnets for
   * @param {String} subnet  The source subnet mask of the source IP Address
   * @param {String} amountSubnets The amount of subnets to generate
   */
  constructor(ipBinary, ipHex, subnet, amountSubnets) {
    this._ipBinary      = ipBinary;
    this._ipHex         = ipHex;
    this._subnet        = subnet;
    this._amountSubnets = amountSubnets;

    this._necessaryBits           = undefined;
    this._newSubnet               = undefined;
    this._generatedSubnetsBinary  = [];
    this._generatedSubnetsHex     = [];
    this._detailedSolutions       = [];

    this._calculateNecessaryBits();
    this._calculateNewSubnet();
    this._calculateIpAddressRange();
    this._calculateSubnets();
  }

  /**
   * Calculates the amount of necesarry bits
   */
  _calculateNecessaryBits() {
    this._necessaryBits = Math.ceil(Math.log(this._amountSubnets) / Math.log(2));
  }

  /**
   * Calculates the new subnet mask
   */
  _calculateNewSubnet() {
    this._newSubnet = this._subnet + this._necessaryBits;
  }

  /**
   * Calculates the range of the ip address with the releavant bits
   */
  _calculateIpAddressRange() {
    this._startRange = this._subnet;
    this._endRange = this._startRange + this._amountSubnets;
  }

  /**
   * Calculates the subnets
   */
  _calculateSubnets() {
    for (let i = 0; i < this._amountSubnets - 1; i++)
      this._detailedSolutions.push(getEmptyDetailedSolution());

    let copy = this._ipBinary;

    let lastKnownSubnet = copy.substring(this._startRange, this._endRange);

    for (let i = 0; i < this._amountSubnets - 1; i++) {
      this._detailedSolutions[i].relevantBitsPreviousSubnetBinary = lastKnownSubnet;
      this._detailedSolutions[i].relevantBitsPreviousSubnetHexadecimal = dualToHex(lastKnownSubnet);

      lastKnownSubnet = decimalToDual(dualToDecimal(lastKnownSubnet) + 1).padStart(this._necessaryBits, '0');

      this._endRange = this._startRange + lastKnownSubnet.length;

      let generatedSubnet = copy.substring(0, this._startRange) + lastKnownSubnet + copy.substring(this._endRange);
      this._generatedSubnetsBinary.push(generatedSubnet);

      this._detailedSolutions[i].relevantBitsCurrentSubnetBinary       = lastKnownSubnet;
      this._detailedSolutions[i].relevantBitsCurrentSubnetHexadecimal  = dualToHex(lastKnownSubnet); // Überarbeiten
      this._detailedSolutions[i].fullIpv6AddressBinary                 = formatBinaryIpAddress(copy.substring(0, this._startRange) + `<span class="hint-decent monospaced">${lastKnownSubnet}</span>` + copy.substring(this._endRange));
    }

    for (let i = 0; i < this._amountSubnets - 1; i++) {
      let temp = this._generatedSubnetsBinary[i].match(/.{1,16}/g);
      let ipv6Address = '';
      temp.forEach((block, _) => ipv6Address += `${dualToHex(block).padStart(4, '0')}:`);
      
      let fullIpAddress = ipv6Address.substring(0, ipv6Address.length - 1) + `/${this._newSubnet}`;
      this._generatedSubnetsHex.push(fullIpAddress);
      this._detailedSolutions[i].fullIpv6AddressHexadecimal = fullIpAddress;
    }

    this._detailedSolutions.unshift({
      relevantBitsPreviousSubnetBinary: this._ipBinary.substring(this._startRange, this._endRange),
      relevantBitsPreviousSubnetHexadecimal: dualToHex(this._ipBinary.substring(this._startRange, this._endRange)),
      relevantBitsCurrentSubnetBinary: this._ipBinary.substring(this._startRange, this._endRange),
      relevantBitsCurrentSubnetHexadecimal: dualToHex(this._ipBinary.substring(this._startRange, this._endRange)),
      fullIpv6AddressBinary: formatBinaryIpAddress(this._ipBinary),
      fullIpv6AddressHexadecimal: `${this._ipHex}/${this._newSubnet}`
    });
  }

  /**
   * Returns the necessary bits
   * @returns {Number} The necesarry bits
   */
  necessaryBits() {
    return this._necessaryBits;
  }

  /**
   * Returns the new subnet
   * @returns {Number} The new subnet
   */
  newSubnet() {
    return this._newSubnet;
  }

  /**
   * Returns the detailed solutions
   * @returns {Array[Object]} The detailed Solutions
   */
  detailedSolutions() {
    return this._detailedSolutions;
  }

}

const getEmptyDetailedSolution = () => {
  return {
    relevantBitsPreviousSubnetBinary:       undefined,
    relevantBitsPreviousSubnetHexadecimal:  undefined,
    relevantBitsCurrentSubnetBinary:        undefined,
    relevantBitsCurrentSubnetHexadecimal:   undefined,
    fullIpv6AddressBinary:                  undefined,
    fullIpv6AddressHexadecimal:             undefined
  }
}
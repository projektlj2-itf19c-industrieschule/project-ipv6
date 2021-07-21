/**
 * This class is used to optimize IPv6 Addresses according to RFC4291
 */
class IpAddressOptimizer {
  
  /**
   * The Constructor of this Class
   * @param {String} ipAddress The IP Address to simplify
   */
  constructor(ipAddress) {
    this._splittedIp = ipAddress.replaceAll(' ', '').replaceAll('-', ':').replaceAll('.', ':').split(':');

    this._ipWithTrailingZerosRemoved = undefined;
    this._ipWithBlockCombined = undefined;
  }

  /**
   * Removes the trailing zeros of the IP Address
   */
  _removeTrailingZeros() {
    this._ipWithTrailingZerosRemoved = '';
    let zeroCount = 0;
    let removalAllowed = false;
    let ipWithTrailingZerosRemoved = '';

    this._splittedIp.forEach(block => {
      zeroCount = 0;
      removalAllowed = false;

      block.split('').forEach((hexNumber, index) => {
        if (hexNumber == '0') {
          if (index == 0)
            removalAllowed = true;

          zeroCount++;
        }
      });

      if (removalAllowed) {
        let newBlock = block.substr(zeroCount, block.length).replace(' ', '');
        ipWithTrailingZerosRemoved += `${newBlock.length == 0 ? '0' : newBlock}:`;
      } else {
        ipWithTrailingZerosRemoved += `${block}:`;
      }
    });

    this._ipWithTrailingZerosRemoved = ipWithTrailingZerosRemoved.substr(0, ipWithTrailingZerosRemoved.length - 1);
  }

  _combineBlocks() {
    this._ipWithBlockCombined = this._ipWithTrailingZerosRemoved.replace(/\b(?:0+:){2,}/, ':');
  }

  /**
   * Returns the IP Address with trailing zeros removes
   * @returns {String} The IP Address with trailing zeros removes
   */
  withTrailingZerosRemoved() {
    if (this._ipWithTrailingZerosRemoved === undefined)
      this._removeTrailingZeros();

    return this._ipWithTrailingZerosRemoved;
  }

  /**
   * Returns the IP Address with the longest following sequence of blocks consisting of zeros replaced by "::"
   * @returns {String} The IP Address with the longest following sequence of blocks consisting of zeros replaced by "::"
   */
  withBlocksCombined() {
    if (this._ipWithBlockCombined === undefined)
      this._combineBlocks();

    return this._ipWithBlockCombined;
  }

  /**
   * Returns the full optimized IPv6 Address
   * @returns The full optimized IPv6 Address
   */
  optimizedAddress() {
    if (this._ipWithTrailingZerosRemoved === undefined)
      this._removeTrailingZeros();

    if (this._ipWithBlockCombined === undefined)
      this._combineBlocks();

    return this._ipWithBlockCombined;
  }

  /**
   * Creates a new Instance of the IpAddressOptimizer
   * @param {String} ipAddress The IP Address of the IpAddressOptimizer
   * @returns {IpAddressOptimizer} The IpAddressOptimizer
   */
  static getInstance(ipAddress) {
    return new IpAddressOptimizer(ipAddress);
  }

}
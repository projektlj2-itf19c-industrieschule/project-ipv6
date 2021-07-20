class IpAddressSimplifier {
  
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

  /**
   * Replaces the longest following sequence of blocks consisting of zeros with "::"
   */
  _combineBlocks() {
    this._ipWithBlockCombined = '';

    let temp = this._ipWithTrailingZerosRemoved.replaceAll('0:', ':');

    let colonCounts = [];
    let tempCountColonCount = 0;
    let previousWasColon = false;

    temp.split('').forEach(hexNumber => {
      if (hexNumber === ':') {
        tempCountColonCount++;
        previousWasColon = true;
      } else {
        if (previousWasColon && tempCountColonCount > 1)
        colonCounts.push(tempCountColonCount);
        tempCountColonCount = 0;
      }
    });

    let replaceString = '';
    for (let i = 0; i < (Math.max(...colonCounts)); i++)
      replaceString += '0:';

    this._ipWithBlockCombined = this._ipWithTrailingZerosRemoved.replace(replaceString, '::');
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
   * Creates a new Instance of the IpAddressSimplifier
   * @param {String} ipAddress The IP Address of the IpAddressSimplifier
   * @returns {IpAddressSimplifier} The IpAddressSimplifier
   */
  static getInstance(ipAddress) {
    return new IpAddressSimplifier(ipAddress);
  }

}
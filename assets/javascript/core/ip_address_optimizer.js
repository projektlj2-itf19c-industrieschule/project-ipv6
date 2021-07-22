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

    this._ipAddress = ipAddress;
    this._ipWithTrailingZerosRemoved = undefined;
    this._ipWithBlockCombined = undefined;
    this._ipWithTrailingZerosRemovedMarked = undefined;
    this._ipWithBlockCombinedMarked = undefined;

    this._removeTrailingZeros();
    this._combineBlocks();
  }

  /**
   * Removes the trailing zeros of the IP Address
   */
  _removeTrailingZeros() {
    let regexReplaceZeroBlock = /[0]{4}/g;
    let regexRemoveTrailingZeros = /[0]{2,3}/g;

    this._ipWithTrailingZerosRemoved = this._ipAddress.replace(regexReplaceZeroBlock, '0');
    this._ipWithTrailingZerosRemoved = this._ipAddress.replace(regexRemoveTrailingZeros, '');

    this._ipWithTrailingZerosRemovedMarked = this._ipAddress.replace(regexReplaceZeroBlock, '<span class="badge rounded-pill bg-marked mx-2">0</span>');
  }

  _combineBlocks() {
    let regex = /(:[0])+/g;
    let matches = this._ipWithTrailingZerosRemoved.match(regex);
    let finalMatch = matches[0];

    matches.forEach(match => {
      if (match.length > finalMatch.length)
        finalMatch = match;
    });

    this._ipWithBlockCombined = this._ipWithTrailingZerosRemoved.replace(finalMatch, ':');
    this._ipWithBlockCombinedMarked = this._ipWithTrailingZerosRemoved.replace(finalMatch, '<span class="badge rounded-pill bg-marked mx-2">:</span>');
  }

  /**
   * Returns the IP Address with trailing zeros removes
   * @returns {String} The IP Address with trailing zeros removes
   */
  withTrailingZerosRemoved() {
    return this._ipWithTrailingZerosRemoved;
  }

  /**
   * Returns the IP Address with the longest following sequence of blocks consisting of zeros replaced by "::"
   * @returns {String} The IP Address with the longest following sequence of blocks consisting of zeros replaced by "::"
   */
  withBlocksCombined() {
    return this._ipWithBlockCombined;
  }

  /**
   * Returns the full optimized IPv6 Address
   * @returns The full optimized IPv6 Address
   */
  optimizedAddress() {
    return this._ipWithBlockCombined;
  }

  ipWithTrailingZerosRemovedMarked() {
    return this._ipWithTrailingZerosRemovedMarked;
  }

  ipWithBlockCombinedMarked() {
    return this._ipWithBlockCombinedMarked;
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
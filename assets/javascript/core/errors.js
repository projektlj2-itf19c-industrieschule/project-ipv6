class InvalidIpv6Address extends Error {
  /**
   * This Error represents the Error which occures, when an IPv6 Address should be used, but the format ist invalid
   * @param {String} reason The reason why the IPv6 Address is invalid
   */
  constructor(reason) {
    super(`This IPv6 Address is invalid: ${reason}`);
  }
}
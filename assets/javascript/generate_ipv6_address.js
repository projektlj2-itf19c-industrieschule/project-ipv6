document.addEventListener('DOMContentLoaded', () => {
  // UI-Elements for the first step of solving
  const stepOneMacAddress                     = document.getElementById('step-one-mac-address');
  const stepOneMacAddressWithFFEE             = document.getElementById('step-one-mac-address-with-ffee');

  // UI-Elements for the second step of solving
  const stepTwoMacAddressWithFFEE             = document.getElementById('step-two-mac-address-with-ffee');
  const stepTwoFirstByteHex                   = document.getElementById('step-two-first-byte-hex');
  const stepTwoFirstByteDual                  = document.getElementById('step-two-first-byte-binary');
  const stepTwoFirstByteDualInverted          = document.getElementById('step-two-first-byte-binary-inverted');
  const stepTwoFirstByteHexInverted           = document.getElementById('step-two-first-byte-hex-inverted');
  const stepTwoMacAddressWith2ndBitInverted   = document.getElementById('step-two-mac-address-with-2nd-bit-inverted');

  // UI-Elements for the third step of solving
  const stepThreeMacAddressWith2ndBitInverted = document.getElementById('step-three-mac-address-with-2nd-bit-inverted');
  const stepThreeIpv6Address                  = document.getElementById('step-three-ipv6-address');

  // Other UI-Elements
  const btnGenerateMacAddress                 = document.getElementById('btn-generate-mac-address');
  const textFieldMacAddress                   = document.getElementById('mac-address');
  const wrapperSolution                       = document.getElementById('wrapper-solution');
  const hiddenFieldIPv6Address                = document.getElementById('hidden-field-ipv6-address');

  const generateLinkLocalIpv6Address = () => {
    let macAddress          = textFieldMacAddress.value.trim().replaceAll(' ', '').replaceAll('.', ':').replaceAll('-', ':');
    let ipAddressGenerator  = IpAddressGenerator.getInstance(macAddress);
    
    if (macAddressValid(macAddress)) {
      textFieldMacAddress.classList.add('is-valid');
      textFieldMacAddress.classList.remove('is-invalid');
      textFieldMacAddress.value = macAddress;

      wrapperSolution.classList.remove('d-none');

      stepOneMacAddress.innerHTML                     = macAddress;
      stepOneMacAddressWithFFEE.innerHTML             = ipAddressGenerator.withFffeInsertedAsHtml();

      stepTwoMacAddressWithFFEE.innerHTML             = ipAddressGenerator.withFffeAsHTML();
      stepTwoFirstByteHex.innerHTML               = ipAddressGenerator.firstByteHexAsHTML();
      stepTwoFirstByteDual.innerHTML                  = ipAddressGenerator.firstByteBinaryAsHTML();
      stepTwoFirstByteHexInverted.innerHTML       = ipAddressGenerator.firstByteInvertedHexAsHTML();
      stepTwoFirstByteDualInverted.innerHTML          = ipAddressGenerator.firstByteInvertedBinaryAsHTML();
      stepTwoMacAddressWith2ndBitInverted.innerHTML   = ipAddressGenerator.withSecondBitInvertedAsHTML();
    
      stepThreeMacAddressWith2ndBitInverted.innerHTML = ipAddressGenerator.withSecondBitInvertedAndColonsMarkedAsHTML();
      stepThreeIpv6Address.innerHTML                  = ipAddressGenerator.ipv6PrefixWithEUI64IdentifiertCombinedAsHTML();
      hiddenFieldIPv6Address.value                    = ipAddressGenerator.getIP();
    } else {
      textFieldMacAddress.classList.add('is-invalid');
      textFieldMacAddress.classList.remove('is-valid');
      wrapperSolution.classList.add('d-none');
    }
  }

  btnGenerateMacAddress.addEventListener('click', generateLinkLocalIpv6Address);
});
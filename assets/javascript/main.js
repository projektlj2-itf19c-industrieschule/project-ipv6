document.addEventListener('DOMContentLoaded', () => {
  const btnGenerateMacAddress = document.getElementById('btn-generate-mac-address');

  // UI-Elements for the first step of solving
  const stepOneMacAddress                     = document.getElementById('step-one-mac-address');
  const stepOneMacAddressWithFFEE             = document.getElementById('step-one-mac-address-with-ffee');

  // UI-Elements for the second step of solving
  const stepTwoMacAddressWithFFEE             = document.getElementById('step-two-mac-address-with-ffee');
  const stepTwoFirstByteDecimal               = document.getElementById('step-two-first-byte-decimal');
  const stepTwoFirstByteDual                  = document.getElementById('step-two-first-byte-dual');
  const stepTwoFirstByteDualInverted          = document.getElementById('step-two-first-byte-dual-inverted');
  const stepTwoFirstByteDecimalInverted       = document.getElementById('step-two-first-byte-decimal-inverted');
  const stepTwoMacAddressWith2ndBitInverted   = document.getElementById('step-two-mac-address-with-2nd-bit-inverted');

  // UI-Elements for the third step of solving
  const stepThreeMacAddressWith2ndBitInverted = document.getElementById('step-three-mac-address-with-2nd-bit-inverted');
  const stepThreeIpv6Address                  = document.getElementById('step-three-ipv6-address');

  // Other UI-Elements
  const textFieldMacAddress                   = document.getElementById('mac-address');
  const wrapperSolution                       = document.getElementById('wrapper-solution');
  const hiddenFieldIPv6Address                = document.getElementById('hidden-field-ipv6-address');

  const generateLinkLocalIpv6Address = () => {
    let macAddress                              = textFieldMacAddress.value.trim().replaceAll(' ', '').replaceAll('.', ':').replaceAll('-', ':');
    let macAddressWithFFFEResult                = insertFFFEInTheMiddleOfMacAddress(macAddress);
    let macAddressWith2ndBitInvertedHtmlResult  = invert2ndBitOfMacAddress(macAddressWithFFFEResult.macAddressWithFFEE); 
    let ipv6AddressResult                       = addEUI64Identifier(macAddressWith2ndBitInvertedHtmlResult.macAddressWith2ndBitInverted);
    
    if (macAddressValid(macAddress)) {
      textFieldMacAddress.classList.add('is-valid');
      textFieldMacAddress.classList.remove('is-invalid');
      textFieldMacAddress.value = macAddress;

      wrapperSolution.classList.remove('d-none');

      stepOneMacAddress.innerHTML                     = macAddressWithFFFEResult.html.macAddress;
      stepOneMacAddressWithFFEE.innerHTML             = macAddressWithFFFEResult.html.macAddressWithFFEE;

      stepTwoMacAddressWithFFEE.innerHTML             = macAddressWith2ndBitInvertedHtmlResult.html.macAddressWithFFEE;
      stepTwoFirstByteDecimal.innerHTML               = macAddressWith2ndBitInvertedHtmlResult.html.firstByteDecimal;
      stepTwoFirstByteDual.innerHTML                  = macAddressWith2ndBitInvertedHtmlResult.html.firstByteDual;
      stepTwoFirstByteDualInverted.innerHTML          = macAddressWith2ndBitInvertedHtmlResult.html.firstByteInvertedDual;
      stepTwoFirstByteDecimalInverted.innerHTML       = macAddressWith2ndBitInvertedHtmlResult.html.firstByteInvertedDecimal;
      stepTwoMacAddressWith2ndBitInverted.innerHTML   = macAddressWith2ndBitInvertedHtmlResult.html.macAddressWith2ndBitInverted;
    
      stepThreeMacAddressWith2ndBitInverted.innerHTML = ipv6AddressResult.html.macAddressWith2ndBitInverted;
      stepThreeIpv6Address.innerHTML                  = ipv6AddressResult.html.ipv6;
      hiddenFieldIPv6Address.value                    = ipv6AddressResult.ipv6;
    } else {
      textFieldMacAddress.classList.add('is-invalid');
      textFieldMacAddress.classList.remove('is-valid');
    }
  }

  btnGenerateMacAddress.addEventListener('click', generateLinkLocalIpv6Address);
});
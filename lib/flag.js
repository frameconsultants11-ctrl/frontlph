export function getFlagEmoji(countryCode) {
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(
        127397 + char.charCodeAt(0)
      )
    );
}

export function validateMobile(mobile) {
  if (!mobile) {
    return "Mobile number is required";
  }

  if (!/^\d+$/.test(mobile)) {
    return "Only numbers are allowed";
  }

  if (mobile.length !== 10) {
    return "Mobile number must be exactly 10 digits";
  }

  return "";
}

export function validatePassword(password) {
  if (!password) {
    return "Password is required";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }

  if (!/[A-Z]/.test(password)) {
    return "Add at least one uppercase letter";
  }

  if (!/[a-z]/.test(password)) {
    return "Add at least one lowercase letter";
  }

  if (!/\d/.test(password)) {
    return "Add at least one number";
  }

  if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]~`+=;/']/ .test(password)) {
    return "Add at least one special character";
  }

  /*
   * Prevent consecutive numbers:
   * 123
   * 456
   * 789
   * etc.
   */
  if (
    /012|123|234|345|456|567|678|789/.test(
      password
    )
  ) {
    return "Password cannot contain consecutive numbers";
  }

  return "";
}


export function getPasswordRequirements(password) {
  return [
    {
      label: "8+ characters",
      valid: password.length >= 8,
    },
    {
      label: "One uppercase letter",
      valid: /[A-Z]/.test(password),
    },
    {
      label: "One lowercase letter",
      valid: /[a-z]/.test(password),
    },
    {
      label: "One number",
      valid: /\d/.test(password),
    },
    {
      label: "One special character",
      valid:
        /[!@#$%^&*(),.?":{}|<>_\-\\[\]~`+=;/']/ .test(
          password
        ),
    },
    {
      label: "No consecutive numbers",
      valid:
        !/012|123|234|345|456|567|678|789/.test(
          password
        ),
    },
  ];
}
